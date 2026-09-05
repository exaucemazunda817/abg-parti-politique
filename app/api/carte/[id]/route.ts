import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readPhoto } from "@/lib/photo-storage";
import { generateProvisionalCardPdf } from "@/lib/membership-card";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get("token");

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member || !token || member.accessToken !== token) {
    return NextResponse.json({ error: "Carte introuvable." }, { status: 404 });
  }

  const photoBytes = await readPhoto(member.photoPath);
  const verifyUrl = new URL(`/verifier/${member.id}`, request.nextUrl.origin).toString();
  const pdfBytes = await generateProvisionalCardPdf(member, photoBytes, verifyUrl);

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="carte-provisoire-${member.id}.pdf"`,
    },
  });
}
