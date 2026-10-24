import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { APPLICATION_STATUSES } from "@/lib/constants";

const schema = z.object({ status: z.enum(APPLICATION_STATUSES) });

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Only employers can update applications" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: { job: true },
  });
  if (!application || application.job.companyId !== user.companyId) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  await prisma.application.update({
    where: { id: application.id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ status: parsed.data.status });
}
