import type { Metadata } from "next";
import { party } from "@/lib/content";
import StatutForm from "./StatutForm";

export const metadata: Metadata = {
  title: `Statut de mon adhésion — ${party.sigle}`,
};

export default function StatutPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-abg-green-dark sm:text-4xl">
        Statut de mon adhésion
      </h1>
      <p className="mt-2 text-foreground/70">
        Entrez le numéro de dossier reçu lors de votre inscription et votre numéro de
        téléphone pour connaître l&apos;état de votre demande.
      </p>
      <div className="mt-8">
        <StatutForm />
      </div>
    </div>
  );
}
