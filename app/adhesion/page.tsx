import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { party } from "@/lib/content";
import AdhesionForm from "./AdhesionForm";

export const metadata: Metadata = {
  title: `Adhésion — ${party.sigle}`,
};

export default function AdhesionPage() {
  return (
    <div>
      <PageHero
        eyebrow="Nous rejoindre"
        title="Devenir membre"
        subtitle="Remplissez la fiche d'adhésion ci-dessous. Vous recevrez immédiatement une carte provisoire attestant votre enregistrement en ligne. Après vérification de votre dossier par le Secrétariat Général, vous serez invité·e à récupérer votre carte officielle de membre au siège du parti."
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-sm text-foreground/50">
          Déjà inscrit·e ?{" "}
          <Link href="/adhesion/statut" className="text-abg-blue underline underline-offset-2">
            Vérifier le statut de mon dossier
          </Link>
        </p>

        <div className="mt-6 rounded-2xl border border-black/10 bg-abg-cream/60 p-6 sm:p-8">
          <AdhesionForm />
        </div>
      </div>
    </div>
  );
}
