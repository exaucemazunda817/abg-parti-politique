// Session multi-rôles (Secrétariat, Président, 7 Secrétaires Nationaux),
// un mot de passe partagé par poste (pas de compte nominatif pour l'instant).
// Utilise Web Crypto (compatible Node et Edge runtime, donc utilisable depuis proxy.ts).

import { secretairesNationaux, SECRETARY_ROLE_KEYS, type SecretaryRole } from "@/lib/content";

export type Role = "SECRETARIAT" | "PRESIDENT" | SecretaryRole;

export function isValidRole(value: unknown): value is Role {
  return (
    value === "SECRETARIAT" ||
    value === "PRESIDENT" ||
    SECRETARY_ROLE_KEYS.includes(value as SecretaryRole)
  );
}

type RoleInfo = { loginPath: string; spacePath: string; label: string };

const FIXED_ROLES: Record<"SECRETARIAT" | "PRESIDENT", RoleInfo> = {
  SECRETARIAT: {
    loginPath: "/secretariat/login",
    spacePath: "/secretariat",
    label: "Secrétariat Général",
  },
  PRESIDENT: {
    loginPath: "/president/login",
    spacePath: "/president",
    label: "Présidence",
  },
};

const SECRETARY_ROLES: Record<string, RoleInfo> = Object.fromEntries(
  secretairesNationaux.map((s) => [
    s.role,
    {
      loginPath: `/secretaires/${s.role}/login`,
      spacePath: `/secretaires/${s.role}`,
      label: s.nom,
    },
  ])
);

export const ROLES: Record<Role, RoleInfo> = { ...FIXED_ROLES, ...SECRETARY_ROLES } as Record<
  Role,
  RoleInfo
>;

export const SESSION_COOKIE_NAME = "abg_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 jours

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET manquant dans les variables d'environnement.");
  }
  return secret;
}

export function passwordForRole(role: Role): string | undefined {
  if (role === "SECRETARIAT") return process.env.SECRETARIAT_PASSWORD;
  if (role === "PRESIDENT") return process.env.PRESIDENT_PASSWORD;
  const index = SECRETARY_ROLE_KEYS.indexOf(role as SecretaryRole);
  if (index === -1) return undefined;
  return process.env[`SECRETARY_PASSWORD_${index + 1}`];
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    value.length + ((4 - (value.length % 4)) % 4),
    "="
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(role: Role): Promise<string> {
  const payload = JSON.stringify({ role, exp: Date.now() + SESSION_DURATION_MS });
  const payloadBytes = new TextEncoder().encode(payload);
  const key = await hmacKey();
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, payloadBytes));
  return `${toBase64Url(payloadBytes)}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<{ role: Role } | null> {
  if (!token) return null;
  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return null;

  try {
    const payloadBytes = fromBase64Url(payloadPart);
    const signatureBytes = fromBase64Url(signaturePart);
    const key = await hmacKey();
    const valid = await crypto.subtle.verify("HMAC", key, signatureBytes, payloadBytes);
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as {
      role: Role;
      exp: number;
    };
    if (payload.exp <= Date.now()) return null;
    if (!isValidRole(payload.role)) return null;
    return { role: payload.role };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_MS / 1000;
