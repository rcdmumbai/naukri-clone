import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z.string().optional(),
  location: z.string().optional(),
  headline: z.string().max(160).optional(),
  experience: z.coerce.number().min(0).max(50).optional(),
  currentSalary: z.coerce.number().min(0).max(1000).optional(),
  skills: z.string().optional(),
  resumeText: z.string().max(5000).optional(),
});

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await prisma.user.update({ where: { id: session.userId }, data: parsed.data });

  return NextResponse.json({ ok: true });
}
