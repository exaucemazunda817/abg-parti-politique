import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { findSecretary, party } from "@/lib/content";
import { ROLES, type Role } from "@/lib/session";
import RoleLoginForm from "@/components/RoleLoginForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}): Promise<Metadata> {
  const { role } = await params;
  const secretary = findSecretary(role);
  return { title: `${secretary?.nom ?? "Secrétaire National"} — ${party.sigle}` };
}

export default async function SecretaryLoginPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const secretary = findSecretary(role);
  if (!secretary) notFound();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <Image
          src="/logo-abg.png"
          alt={`Logo du parti ${party.sigle}`}
          width={72}
          height={72}
          className="abg-logo-shadow h-16 w-16 object-contain"
        />
        <h1 className="mt-4 text-xl font-extrabold text-abg-green-dark">{secretary.nom}</h1>
        <p className="mt-1 text-sm text-foreground/60">{secretary.fonction}</p>
      </div>
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <RoleLoginForm role={secretary.role as Role} spacePath={ROLES[secretary.role as Role].spacePath} />
      </div>
    </div>
  );
}
