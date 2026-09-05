import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PlaceholderNote from "@/components/PlaceholderNote";
import { actualitesPlaceholder, party } from "@/lib/content";

export const metadata: Metadata = {
  title: `Actualités — ${party.sigle}`,
};

export default function ActualitesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Vie du parti"
        title="Actualités"
        subtitle={`Communiqués, déclarations et activités de ${party.sigle}.`}
        color="blue"
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-dashed border-black/15 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-abg-blue-dark/10 text-xl text-abg-blue-dark">
            ―
          </div>
          <p className="mt-4 text-foreground/70">{actualitesPlaceholder}</p>
        </div>

        <div className="mt-6">
          <PlaceholderNote>
            Cette page pourra évoluer vers un vrai système de publication (articles avec date,
            image, texte) quand le parti sera prêt à publier ses premières actualités.
          </PlaceholderNote>
        </div>
      </div>
    </div>
  );
}
