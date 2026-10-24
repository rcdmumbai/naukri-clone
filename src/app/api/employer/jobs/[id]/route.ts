import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({ isActive: z.boolean() });

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Only employers can manage jobs" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const job = await prisma.job.findUnique({ where: { id: params.id } });
  if (!job || job.companyId !== user.companyId) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  await prisma.job.update({ where: { id: job.id }, data: { isActive: parsed.data.isActive } });

  return NextResponse.json({ isActive: parsed.data.isActive });
}
