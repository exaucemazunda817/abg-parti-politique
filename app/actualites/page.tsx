import type { Metadata } from "next";
import PlaceholderNote from "@/components/PlaceholderNote";
import { actualitesPlaceholder, party } from "@/lib/content";

export const metadata: Metadata = {
  title: `Actualités — ${party.sigle}`,
};

export default function ActualitesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-abg-green-dark sm:text-4xl">
        Actualités
      </h1>
      <p className="mt-2 text-foreground/70">
        Communiqués, déclarations et activités de {party.sigle}.
      </p>

      <div className="mt-8 rounded-lg border border-black/10 bg-white p-8 text-center text-foreground/70 shadow-sm">
        {actualitesPlaceholder}
      </div>

      <div className="mt-6">
        <PlaceholderNote>
          Cette page pourra évoluer vers un vrai système de publication (articles avec date,
          image, texte) quand le parti sera prêt à publier ses premières actualités.
        </PlaceholderNote>
      </div>
    </div>
  );
}
