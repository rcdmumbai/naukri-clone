import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["JOBSEEKER", "EMPLOYER"]),
  phone: z.string().optional(),
  location: z.string().optional(),
  experience: z.coerce.number().min(0).max(50).optional(),
  skills: z.string().optional(),
  companyName: z.string().optional(),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  let companyId: string | undefined;
  if (data.role === "EMPLOYER") {
    if (!data.companyName?.trim()) {
      return NextResponse.json({ error: "Company name is required for employers" }, { status: 400 });
    }
    const name = data.companyName.trim();
    const company =
      (await prisma.company.findUnique({ where: { name } })) ??
      (await prisma.company.create({
        data: {
          name,
          slug: slugify(name),
          description: `${name} is hiring on Naukri Clone.`,
          industry: "Other",
          logoText: name.slice(0, 3).toUpperCase(),
          logoColor: "#2557a7",
        },
      }));
    companyId = company.id;
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: await hashPassword(data.password),
      role: data.role,
      phone: data.phone,
      location: data.location,
      experience: data.role === "JOBSEEKER" ? (data.experience ?? 0) : null,
      skills: data.role === "JOBSEEKER" ? data.skills : null,
      companyId,
    },
  });

  await createSession({ userId: user.id, role: user.role as "JOBSEEKER" | "EMPLOYER", name: user.name });

  return NextResponse.json({ redirectTo: user.role === "EMPLOYER" ? "/employer" : "/jobs" });
}
