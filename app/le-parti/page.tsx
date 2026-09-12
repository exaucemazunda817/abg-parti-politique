import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import {
  histoireText,
  ideologieText,
  missionText,
  party,
  valeurs,
} from "@/lib/content";

export const metadata: Metadata = {
  title: `Le Parti — ${party.sigle}`,
};

const VALUE_ACCENTS = ["border-abg-blue", "border-abg-green", "border-abg-red", "border-abg-gold"];

export default function LePartiPage() {
  return (
    <div>
      <PageHero
        eyebrow="Qui nous sommes"
        title="Le Parti"
        subtitle={`${party.nomComplet} (${party.sigle}) — « ${party.devise} »`}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <section className="rounded-2xl border border-abg-blue/20 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-abg-blue-dark">Enregistrement légal</h2>
          <p className="mt-3 text-foreground/80">{party.enregistrement}</p>
          <p className="mt-2 text-foreground/80">Siège social : {party.siege}</p>
        </section>

        <section className="mt-8 rounded-2xl bg-abg-green-dark/5 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-abg-green-dark">Mission</h2>
          <p className="mt-3 text-foreground/80">{missionText}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-abg-blue-dark">Histoire</h2>
          <p className="mt-3 text-foreground/80">{histoireText}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-abg-blue-dark">Idéologie et projet de société</h2>
          <p className="mt-3 text-foreground/80">{ideologieText}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-abg-green-dark">Nos valeurs</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {valeurs.map((valeur, i) => (
              <li
                key={valeur}
                className={`rounded-xl border-l-4 bg-white p-4 text-sm text-foreground/80 shadow-sm ${VALUE_ACCENTS[i % VALUE_ACCENTS.length]}`}
              >
                {valeur}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
