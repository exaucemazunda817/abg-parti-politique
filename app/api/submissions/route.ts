import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SECRETARY_ROLE_KEYS } from "@/lib/content";

// La correspondance type -> destinataire est décidée ICI, côté serveur — jamais
// à partir d'un champ envoyé par le client, pour qu'on ne puisse pas faire
// atterrir un message dans le mauvais espace (ou pire, dans un rôle arbitraire).
//
// Exception contrôlée : pour "MESSAGE", l'expéditeur choisit le destinataire
// (Secrétariat Général ou l'un des 7 Secrétaires Nationaux) dans une liste
// fermée — validée ci-dessous contre VALID_MESSAGE_RECIPIENTS, jamais acceptée
// telle quelle.
const TARGET_ROLE_FOR_TYPE: Record<string, string> = {
  DOLEANCE: "SECRETARIAT",
  PROPOSITION: "PRESIDENT",
};

const VALID_MESSAGE_RECIPIENTS = new Set(["SECRETARIAT", ...SECRETARY_ROLE_KEYS]);

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const type = str(body.type);
  let targetRole: string | undefined;

  if (type === "MESSAGE") {
    const destinataire = str(body.destinataire);
    if (!VALID_MESSAGE_RECIPIENTS.has(destinataire)) {
      return NextResponse.json({ error: "Destinataire invalide." }, { status: 400 });
    }
    targetRole = destinataire;
  } else {
    targetRole = TARGET_ROLE_FOR_TYPE[type];
  }

  if (!targetRole) {
    return NextResponse.json({ error: "Type de demande invalide." }, { status: 400 });
  }

  const sujet = str(body.sujet);
  const message = str(body.message);
  if (!sujet || !message) {
    return NextResponse.json({ error: "Le sujet et le message sont obligatoires." }, { status: 400 });
  }

  if (type === "PROPOSITION" && !str(body.organisation) && !str(body.nom)) {
    return NextResponse.json(
      { error: "Indiquez votre nom ou celui de votre organisation." },
      { status: 400 }
    );
  }

  const sousType = type === "DOLEANCE" ? str(body.sousType) || null : null;

  const submission = await prisma.submission.create({
    data: {
      type,
      targetRole,
      sousType,
      nom: str(body.nom) || null,
      email: str(body.email) || null,
      telephone: str(body.telephone) || null,
      organisation: str(body.organisation) || null,
      sujet,
      message,
    },
  });

  return NextResponse.json({ id: submission.id });
}
