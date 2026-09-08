import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(3, "Job title is required"),
  role: z.string().min(2, "Role is required"),
  department: z.string().min(2, "Department is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  locations: z.string().min(2, "Add at least one location"),
  skills: z.string().min(2, "Add at least one skill"),
  minExperience: z.coerce.number().min(0).max(50),
  maxExperience: z.coerce.number().min(0).max(50),
  minSalary: z.coerce.number().min(0).max(1000),
  maxSalary: z.coerce.number().min(0).max(1000),
  workMode: z.enum(["WORK_FROM_OFFICE", "HYBRID", "REMOTE"]),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"]),
  openings: z.coerce.number().min(1).max(999),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Only employers can post jobs" }, { status: 403 });
  }
  if (!user.companyId) {
    return NextResponse.json({ error: "Your account is not linked to a company" }, { status: 400 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const data = parsed.data;
  if (data.maxExperience < data.minExperience) {
    return NextResponse.json({ error: "Maximum experience must be at least the minimum" }, { status: 400 });
  }
  if (data.maxSalary < data.minSalary) {
    return NextResponse.json({ error: "Maximum salary must be at least the minimum" }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: { ...data, companyId: user.companyId, postedById: user.id },
  });

  return NextResponse.json({ id: job.id });
}
