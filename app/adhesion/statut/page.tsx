import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { party } from "@/lib/content";
import StatutForm from "./StatutForm";

export const metadata: Metadata = {
  title: `Statut de mon adhésion — ${party.sigle}`,
};

export default function StatutPage() {
  return (
    <div>
      <PageHero
        eyebrow="Suivi de dossier"
        title="Statut de mon adhésion"
        subtitle="Entrez le numéro de dossier reçu lors de votre inscription et votre numéro de téléphone pour connaître l'état de votre demande."
        color="blue"
      />

      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <StatutForm />
      </div>
    </div>
  );
}
