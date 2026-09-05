import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { party } from "@/lib/content";
import { adhesionRejectedEmail, sendEmail } from "@/lib/email";

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

  const rejectedReason = typeof reason === "string" && reason.trim() ? reason.trim() : null;

  await prisma.member.update({
    where: { id },
    data: {
      status: "REJECTED",
      rejectedAt: new Date(),
      rejectedReason,
      membershipNo: null,
      validatedAt: null,
    },
  });

  if (member.email) {
    const { subject, html } = adhesionRejectedEmail({
      prenom: member.prenom,
      reason: rejectedReason,
      telephone: party.telephone,
    });
    await sendEmail({ to: member.email, subject, html });
  }

  return NextResponse.json({ ok: true });
}
