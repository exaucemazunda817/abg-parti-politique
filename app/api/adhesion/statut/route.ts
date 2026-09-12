import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { id, telephone } = await request.json();

  if (typeof id !== "string" || typeof telephone !== "string" || !id || !telephone) {
    return NextResponse.json({ error: "Numéro de dossier et téléphone requis." }, { status: 400 });
  }

  const member = await prisma.member.findUnique({ where: { id } });

  // Comparaison volontairement peu stricte sur le téléphone (espaces/formats variables),
  // mais on ne révèle jamais si le dossier existe quand le téléphone ne correspond pas.
  const normalize = (v: string) => v.replace(/[\s.-]/g, "");
  if (!member || normalize(member.telephone) !== normalize(telephone)) {
    return NextResponse.json(
      { error: "Aucun dossier ne correspond à ces informations." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: member.id,
    accessToken: member.accessToken,
    status: member.status,
    nom: member.nom,
    prenom: member.prenom,
    membershipNo: member.membershipNo,
    rejectedReason: member.rejectedReason,
    createdAt: member.createdAt,
    validatedAt: member.validatedAt,
    rejectedAt: member.rejectedAt,
  });
}
