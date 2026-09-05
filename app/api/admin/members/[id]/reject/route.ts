import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { reason } = await request.json().catch(() => ({ reason: null }));

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) {
    return NextResponse.json({ error: "Dossier introuvable." }, { status: 404 });
  }

  await prisma.member.update({
    where: { id },
    data: {
      status: "REJECTED",
      rejectedAt: new Date(),
      rejectedReason: typeof reason === "string" && reason.trim() ? reason.trim() : null,
      membershipNo: null,
      validatedAt: null,
    },
  });

  return NextResponse.json({ ok: true });
}
