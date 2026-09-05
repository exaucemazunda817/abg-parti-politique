import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import type { Member } from "@prisma/client";
import { photoMimeType } from "./photo-storage";

const GREEN = rgb(0x58 / 255, 0x72 / 255, 0x11 / 255);
const BLUE = rgb(0x01 / 255, 0x3f / 255, 0x7d / 255);
const RED = rgb(0x6a / 255, 0x0d / 255, 0x1b / 255);
const CREAM = rgb(0xf7 / 255, 0xf5 / 255, 0xee / 255);
const GOLD = rgb(0xd9 / 255, 0xa4 / 255, 0x41 / 255);
const DARK = rgb(0.11, 0.11, 0.11);

const CARD_WIDTH = 486; // ~2x format carte bancaire (CR80), en points PDF
const CARD_HEIGHT = 306;

export async function generateProvisionalCardPdf(
  member: Member,
  photoBytes: Buffer,
  verifyUrl: string
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([CARD_WIDTH, CARD_HEIGHT]);

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const font = await doc.embedFont(StandardFonts.Helvetica);

  // Fond
  page.drawRectangle({ x: 0, y: 0, width: CARD_WIDTH, height: CARD_HEIGHT, color: CREAM });

  // Bandeau supérieur
  const headerHeight = 56;
  page.drawRectangle({
    x: 0,
    y: CARD_HEIGHT - headerHeight,
    width: CARD_WIDTH,
    height: headerHeight,
    color: GREEN,
  });
  page.drawText("ALLIANCE POUR LA BONNE GOUVERNANCE", {
    x: 20,
    y: CARD_HEIGHT - 26,
    size: 12,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  page.drawText("CARTE PROVISOIRE D'ADHÉSION — EN LIGNE", {
    x: 20,
    y: CARD_HEIGHT - 42,
    size: 9,
    font,
    color: GOLD,
  });

  // Photo
  const mimeType = photoMimeType(member.photoPath);
  const embeddedPhoto =
    mimeType === "image/png" ? await doc.embedPng(photoBytes) : await doc.embedJpg(photoBytes);
  const photoW = 96;
  const photoH = 120;
  const photoX = 20;
  const photoY = CARD_HEIGHT - headerHeight - photoH - 20;
  page.drawRectangle({
    x: photoX - 2,
    y: photoY - 2,
    width: photoW + 4,
    height: photoH + 4,
    color: rgb(1, 1, 1),
  });
  page.drawImage(embeddedPhoto, { x: photoX, y: photoY, width: photoW, height: photoH });

  // Informations
  const infoX = photoX + photoW + 24;
  let cursorY = CARD_HEIGHT - headerHeight - 28;

  page.drawText(`${member.prenom} ${member.postNom} ${member.nom}`.toUpperCase(), {
    x: infoX,
    y: cursorY,
    size: 13,
    font: fontBold,
    color: DARK,
  });
  cursorY -= 22;

  const infoLines: [string, string][] = [
    ["N° de dossier", member.id],
    ["Province", member.province],
    ["Section", member.section ?? "—"],
    [
      "Date de soumission",
      member.createdAt.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }),
    ],
  ];
  for (const [label, value] of infoLines) {
    page.drawText(`${label} :`, { x: infoX, y: cursorY, size: 8.5, font, color: rgb(0.4, 0.4, 0.4) });
    page.drawText(value, { x: infoX + 90, y: cursorY, size: 8.5, font: fontBold, color: DARK });
    cursorY -= 15;
  }

  // Badge de statut
  const badgeY = cursorY - 8;
  page.drawRectangle({
    x: infoX,
    y: badgeY - 16,
    width: 200,
    height: 20,
    color: rgb(0.98, 0.95, 0.87),
    borderColor: GOLD,
    borderWidth: 1,
  });
  page.drawText("EN ATTENTE DE VALIDATION", {
    x: infoX + 10,
    y: badgeY - 11,
    size: 9,
    font: fontBold,
    color: rgb(0.42, 0.33, 0.09),
  });

  // QR code de vérification
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 0, width: 200 });
  const qrPngBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const embeddedQr = await doc.embedPng(qrPngBytes);
  const qrSize = 62;
  page.drawImage(embeddedQr, {
    x: CARD_WIDTH - qrSize - 20,
    y: 16,
    width: qrSize,
    height: qrSize,
  });

  // Bande inférieure bicolore (clin d'œil au drapé de la carte du logo)
  const footerHeight = 8;
  page.drawRectangle({ x: 0, y: 0, width: CARD_WIDTH / 2, height: footerHeight, color: BLUE });
  page.drawRectangle({
    x: CARD_WIDTH / 2,
    y: 0,
    width: CARD_WIDTH / 2,
    height: footerHeight,
    color: RED,
  });

  page.drawText("Non valable sans validation du Secrétariat Général", {
    x: 20,
    y: footerHeight + 8,
    size: 7,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  return doc.save();
}
