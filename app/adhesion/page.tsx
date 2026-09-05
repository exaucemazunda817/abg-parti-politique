import type { Metadata } from "next";
import Link from "next/link";
import { party } from "@/lib/content";
import AdhesionForm from "./AdhesionForm";

export const metadata: Metadata = {
  title: `Adhésion — ${party.sigle}`,
};

export default function AdhesionPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-abg-green-dark sm:text-4xl">
        Devenir membre
      </h1>
      <p className="mt-2 text-foreground/70">
        Remplissez la fiche d&apos;adhésion ci-dessous. Vous recevrez immédiatement une carte
        provisoire attestant votre enregistrement en ligne. Après vérification de votre
        dossier par le Secrétariat Général, vous serez invité·e à récupérer votre carte
        officielle de membre au siège du parti.
      </p>
      <p className="mt-2 text-sm text-foreground/50">
        Déjà inscrit·e ?{" "}
        <Link href="/adhesion/statut" className="text-abg-blue underline underline-offset-2">
          Vérifier le statut de mon dossier
        </Link>
      </p>

      <div className="mt-10 rounded-2xl border border-black/10 bg-abg-cream/60 p-6 sm:p-8">
        <AdhesionForm />
      </div>
    </div>
  );
}
