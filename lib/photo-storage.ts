import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

// Les photos des fiches d'adhésion sont stockées HORS de `public/` : ce sont des
// données personnelles, elles ne doivent jamais être accessibles par une simple URL
// devinable. Seul le Secrétariat authentifié peut les relire (voir
// app/secretariat/(protected)/[id]/page.tsx qui les lit directement depuis le disque
// côté serveur).
const STORAGE_DIR = path.join(process.cwd(), "storage", "photos");

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function isAllowedPhotoType(mimeType: string): boolean {
  return mimeType in ALLOWED_TYPES;
}

export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo

export async function savePhoto(memberId: string, file: File): Promise<string> {
  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    throw new Error("Type de fichier non autorisé pour la photo.");
  }
  await mkdir(STORAGE_DIR, { recursive: true });
  const filename = `${memberId}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(STORAGE_DIR, filename), buffer);
  return filename;
}

export async function readPhoto(filename: string): Promise<Buffer> {
  return readFile(path.join(STORAGE_DIR, filename));
}

export function photoMimeType(filename: string): string {
  const ext = filename.split(".").pop();
  return ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
}
