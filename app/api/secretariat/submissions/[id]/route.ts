import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail, submissionTreatedEmail } from "@/lib/email";
import { ROLES } from "@/lib/session";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await request.json();

  if (!["NOUVEAU", "LU", "TRAITE"].includes(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission || submission.targetRole !== "SECRETARIAT") {
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

  if (status === "TRAITE" && submission.status !== "TRAITE" && submission.email) {
    const { subject, html } = submissionTreatedEmail({
      sujet: submission.sujet,
      destinataireLabel: ROLES.SECRETARIAT.label,
    });
    await sendEmail({ to: submission.email, subject, html });
  }

  return NextResponse.json({ ok: true });
}
