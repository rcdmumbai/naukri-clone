import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Context = { params: { id: string } };

export async function POST(_request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  await prisma.savedJob.upsert({
    where: { jobId_userId: { jobId: params.id, userId: session.userId } },
    create: { jobId: params.id, userId: session.userId },
    update: {},
  });

  return NextResponse.json({ saved: true });
}

export async function DELETE(_request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  await prisma.savedJob.deleteMany({ where: { jobId: params.id, userId: session.userId } });

  return NextResponse.json({ saved: false });
}
