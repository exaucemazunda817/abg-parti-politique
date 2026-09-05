import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { party } from "@/lib/content";
import { adhesionValidatedEmail, sendEmail } from "@/lib/email";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) {
    return NextResponse.json({ error: "Dossier introuvable." }, { status: 404 });
  }
  if (member.status === "VALIDATED") {
    return NextResponse.json({ ok: true, membershipNo: member.membershipNo });
  }

  const validatedCount = await prisma.member.count({ where: { status: "VALIDATED" } });
  const year = new Date().getFullYear();
  const membershipNo = `ABG-${year}-${String(validatedCount + 1).padStart(5, "0")}`;

  const updated = await prisma.member.update({
    where: { id },
    data: {
      status: "VALIDATED",
      membershipNo,
      validatedAt: new Date(),
      rejectedAt: null,
      rejectedReason: null,
    },
  });

  if (updated.email) {
    const { subject, html } = adhesionValidatedEmail({
      prenom: updated.prenom,
      membershipNo: updated.membershipNo!,
      siege: party.siege,
    });
    await sendEmail({ to: updated.email, subject, html });
  }

  return NextResponse.json({ ok: true, membershipNo: updated.membershipNo });
}
