import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import NumberBadge from "@/components/NumberBadge";
import { party, presidentNational, secretairesNationaux } from "@/lib/content";

export const metadata: Metadata = {
  title: `Direction Nationale — ${party.sigle}`,
};

export default function DirectionPage() {
  return (
    <div>
      <PageHero
        eyebrow="Instances dirigeantes"
        title="Direction Nationale"
        subtitle={`Composition de la direction nationale de ${party.sigle}, telle qu'issue de la Décision n° .../ABG/PN/JBW/2026 du 2 juillet 2026.`}
        color="blue"
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <section className="overflow-hidden rounded-2xl bg-abg-blue-dark text-white shadow-sm">
          <div className="abg-accent-bar" />
          <div className="px-6 py-10 text-center sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              {presidentNational.fonction}
            </p>
            <p className="mt-3 text-2xl font-extrabold sm:text-3xl">{presidentNational.nom}</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-abg-blue-dark">Secrétaires Nationaux</h2>
          <ul className="mt-4 space-y-3">
            {secretairesNationaux.map((secretaire, i) => (
              <li
                key={secretaire.nom}
                className="flex items-start gap-4 rounded-xl border border-black/10 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <NumberBadge n={i + 1} />
                <div>
                  <p className="font-semibold text-foreground">{secretaire.nom}</p>
                  <p className="mt-1 text-sm text-foreground/70">{secretaire.fonction}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
