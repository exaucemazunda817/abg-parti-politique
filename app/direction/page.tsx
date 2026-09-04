import type { Metadata } from "next";
import { party, presidentNational, secretairesNationaux } from "@/lib/content";

export const metadata: Metadata = {
  title: `Direction Nationale — ${party.sigle}`,
};

export default function DirectionPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-abg-green-dark sm:text-4xl">
        Direction Nationale
      </h1>
      <p className="mt-2 text-foreground/70">
        Composition de la direction nationale de {party.sigle}, telle qu&apos;issue de la
        Décision n° .../ABG/PN/JBW/2026 du 2 juillet 2026.
      </p>

      <section className="mt-10 rounded-xl bg-abg-blue-dark px-6 py-8 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
          {presidentNational.fonction}
        </p>
        <p className="mt-2 text-2xl font-bold sm:text-3xl">{presidentNational.nom}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-abg-blue-dark">Secrétaires Nationaux</h2>
        <ul className="mt-4 space-y-3">
          {secretairesNationaux.map((secretaire) => (
            <li
              key={secretaire.nom}
              className="rounded-lg border border-black/10 bg-white p-4 shadow-sm"
            >
              <p className="font-semibold text-foreground">{secretaire.nom}</p>
              <p className="mt-1 text-sm text-foreground/70">{secretaire.fonction}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
