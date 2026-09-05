import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAllowedPhotoType, MAX_PHOTO_SIZE_BYTES, savePhoto } from "@/lib/photo-storage";

const REQUIRED_FIELDS = [
  "nom",
  "postNom",
  "prenom",
  "sexe",
  "dateNaissance",
  "lieuNaissance",
  "province",
  "ville",
  "telephone",
] as const;

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  for (const field of REQUIRED_FIELDS) {
    if (!str(formData, field)) {
      return NextResponse.json(
        { error: `Le champ "${field}" est obligatoire.` },
        { status: 400 }
      );
    }
  }

  if (!["M", "F"].includes(str(formData, "sexe"))) {
    return NextResponse.json({ error: "Sexe invalide." }, { status: 400 });
  }

  const dateNaissance = new Date(str(formData, "dateNaissance"));
  if (Number.isNaN(dateNaissance.getTime())) {
    return NextResponse.json({ error: "Date de naissance invalide." }, { status: 400 });
  }

  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return NextResponse.json({ error: "Une photo est requise." }, { status: 400 });
  }
  if (!isAllowedPhotoType(photo.type)) {
    return NextResponse.json(
      { error: "Format de photo non supporté (JPG, PNG ou WEBP uniquement)." },
      { status: 400 }
    );
  }
  if (photo.size > MAX_PHOTO_SIZE_BYTES) {
    return NextResponse.json({ error: "La photo dépasse la taille maximale de 5 Mo." }, { status: 400 });
  }

  const id = randomUUID();
  const photoPath = await savePhoto(id, photo);

  const member = await prisma.member.create({
    data: {
      id,
      photoPath,
      nom: str(formData, "nom"),
      postNom: str(formData, "postNom"),
      prenom: str(formData, "prenom"),
      sexe: str(formData, "sexe"),
      dateNaissance,
      lieuNaissance: str(formData, "lieuNaissance"),
      etatCivil: str(formData, "etatCivil") || null,
      profession: str(formData, "profession") || null,
      province: str(formData, "province"),
      ville: str(formData, "ville"),
      commune: str(formData, "commune") || null,
      avenue: str(formData, "avenue") || null,
      telephone: str(formData, "telephone"),
      email: str(formData, "email") || null,
      pieceIdentiteType: str(formData, "pieceIdentiteType") || null,
      pieceIdentiteNumero: str(formData, "pieceIdentiteNumero") || null,
      section: str(formData, "section") || null,
    },
  });

  return NextResponse.json({ id: member.id, accessToken: member.accessToken });
}
