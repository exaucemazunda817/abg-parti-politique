import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import NumberBadge from "@/components/NumberBadge";
import { party, programme } from "@/lib/content";

export const metadata: Metadata = {
  title: `Programme — ${party.sigle}`,
};

export default function ProgrammePage() {
  return (
    <div>
      <PageHero
        eyebrow="Notre vision"
        title="Programme"
        subtitle={`Les grands axes de la vision politique de ${party.sigle}.`}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <section className="space-y-4">
          {programme.map((axe, i) => (
            <div
              key={axe.titre}
              className="flex items-start gap-4 rounded-xl border border-black/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <NumberBadge n={i + 1} />
              <div>
                <h2 className="font-bold text-abg-green-dark">{axe.titre}</h2>
                <p className="mt-2 text-sm text-foreground/70">{axe.description}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
