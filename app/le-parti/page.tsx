import type { Metadata } from "next";
import PlaceholderNote from "@/components/PlaceholderNote";
import {
  histoirePlaceholder,
  missionPlaceholder,
  party,
  valeursPlaceholder,
} from "@/lib/content";

export const metadata: Metadata = {
  title: `Le Parti — ${party.sigle}`,
};

export default function LePartiPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-abg-green-dark sm:text-4xl">
        Le Parti
      </h1>
      <p className="mt-2 text-foreground/70">
        {party.nomComplet} ({party.sigle}) — « {party.devise} »
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-abg-blue-dark">Enregistrement légal</h2>
        <p className="mt-3 text-foreground/80">{party.enregistrement}</p>
        <p className="mt-2 text-foreground/80">
          Siège social : {party.siege}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-abg-blue-dark">Mission</h2>
        <p className="mt-3 text-foreground/80">{missionPlaceholder}</p>
        <div className="mt-4">
          <PlaceholderNote />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-abg-blue-dark">Histoire</h2>
        <p className="mt-3 text-foreground/80">{histoirePlaceholder}</p>
        <div className="mt-4">
          <PlaceholderNote />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-abg-blue-dark">Nos valeurs</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {valeursPlaceholder.map((valeur) => (
            <li
              key={valeur}
              className="rounded-lg border border-black/10 bg-white p-4 text-sm text-foreground/80 shadow-sm"
            >
              {valeur}
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <PlaceholderNote />
        </div>
      </section>
    </div>
  );
}
