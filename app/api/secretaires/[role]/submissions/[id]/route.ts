import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { findSecretary } from "@/lib/content";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ role: string; id: string }> }
) {
  const { role, id } = await params;
  if (!findSecretary(role)) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  const { status } = await request.json();
  if (!["NOUVEAU", "LU", "TRAITE"].includes(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission || submission.targetRole !== role) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  await prisma.submission.update({
    where: { id },
    data: {
      status,
      readAt: status !== "NOUVEAU" ? (submission.readAt ?? new Date()) : null,
      treatedAt: status === "TRAITE" ? new Date() : null,
    },
  });

  return NextResponse.json({ ok: true });
}
