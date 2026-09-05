import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { party, presidentNational, secretairesNationaux } from "@/lib/content";
import { ROLES } from "@/lib/session";

export const metadata: Metadata = {
  title: `Espace dirigeants — ${party.sigle}`,
};

export default function ConnexionPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-12 text-center sm:px-6">
      <Image
        src="/logo-abg.png"
        alt={`Logo du parti ${party.sigle}`}
        width={80}
        height={80}
        className="abg-logo-shadow h-20 w-20 object-contain"
      />
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-abg-green-dark sm:text-3xl">
        Espace dirigeants
      </h1>
      <p className="mt-2 max-w-md text-foreground/70">
        Choisissez votre espace pour vous connecter.
      </p>

      <div className="mt-10 grid w-full gap-5 sm:grid-cols-2">
        <RoleCard
          href={ROLES.SECRETARIAT.loginPath}
          title="Secrétariat Général"
          description="Adhésions, messages, doléances et suggestions"
        />
        <RoleCard
          href={ROLES.PRESIDENT.loginPath}
          title="Présidence"
          description={`Propositions de projet et de partenariat — ${presidentNational.nom}`}
        />
      </div>

      <div className="mt-12 w-full text-left">
        <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-foreground/50">
          Secrétaires Nationaux
        </p>
        <div className="divide-y divide-black/10 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
          {secretairesNationaux.map((s) => (
            <Link
              key={s.role}
              href={ROLES[s.role].loginPath}
              className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-abg-blue-dark/5"
            >
              <span>
                <span className="block font-semibold text-abg-blue-dark">{s.nom}</span>
                <span className="block text-xs text-foreground/60">{s.fonction}</span>
              </span>
              <span aria-hidden className="shrink-0 text-abg-blue-dark">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2 rounded-2xl border-2 border-black/10 bg-white p-8 text-center shadow-sm transition-colors hover:border-abg-blue-dark"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-abg-blue-dark/10 text-2xl text-abg-blue-dark transition-colors group-hover:bg-abg-blue-dark group-hover:text-white">
        →
      </span>
      <span className="mt-2 text-lg font-bold text-abg-blue-dark">{title}</span>
      <span className="text-sm text-foreground/60">{description}</span>
    </Link>
  );
}
