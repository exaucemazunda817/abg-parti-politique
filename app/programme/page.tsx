import type { Metadata } from "next";
import PlaceholderNote from "@/components/PlaceholderNote";
import { party, programmePlaceholder } from "@/lib/content";

export const metadata: Metadata = {
  title: `Programme — ${party.sigle}`,
};

export default function ProgrammePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-abg-green-dark sm:text-4xl">
        Programme
      </h1>
      <p className="mt-2 text-foreground/70">
        Les grands axes de la vision politique de {party.sigle}.
      </p>

      <div className="mt-6">
        <PlaceholderNote>
          Le programme officiel du parti (priorités, mesures, calendrier) doit encore être
          fourni par la Direction Nationale. La structure ci-dessous est prête à recevoir ce
          contenu.
        </PlaceholderNote>
      </div>

      <section className="mt-8 space-y-4">
        {programmePlaceholder.map((axe) => (
          <div
            key={axe.titre}
            className="rounded-lg border border-black/10 bg-white p-5 shadow-sm"
          >
            <h2 className="font-bold text-abg-blue-dark">{axe.titre}</h2>
            <p className="mt-2 text-sm text-foreground/70">{axe.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
