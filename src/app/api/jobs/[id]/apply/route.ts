import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({ coverLetter: z.string().max(2000).optional() });

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  if (session.role !== "JOBSEEKER") {
    return NextResponse.json({ error: "Only jobseekers can apply to jobs" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const job = await prisma.job.findUnique({ where: { id: params.id } });
  if (!job || !job.isActive) {
    return NextResponse.json({ error: "This job is no longer accepting applications" }, { status: 404 });
  }

  const existing = await prisma.application.findUnique({
    where: { jobId_userId: { jobId: job.id, userId: session.userId } },
  });
  if (existing) {
    return NextResponse.json({ error: "You have already applied to this job" }, { status: 409 });
  }

  await prisma.application.create({
    data: { jobId: job.id, userId: session.userId, coverLetter: parsed.data.coverLetter },
  });

  return NextResponse.json({ applied: true });
}
