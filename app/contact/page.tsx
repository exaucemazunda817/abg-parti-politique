import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { party } from "@/lib/content";
import ContactCategoryForm from "./ContactCategoryForm";

export const metadata: Metadata = {
  title: `Contact — ${party.sigle}`,
};

export default function ContactPage() {
  const telHref = `tel:${party.telephone.replace(/\s+/g, "")}`;

  return (
    <div>
      <PageHero
        eyebrow="Restons en contact"
        title="Contact"
        subtitle={`Pour toute question ou demande d'adhésion, contactez le Secrétariat Général de ${party.sigle}.`}
        color="blue"
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border-t-4 border-abg-blue-dark bg-white p-6 shadow-sm">
            <h2 className="font-bold text-abg-blue-dark">Siège social</h2>
            <p className="mt-2 text-sm text-foreground/80">{party.siege}</p>
          </div>

          <div className="rounded-2xl border-t-4 border-abg-red bg-white p-6 shadow-sm">
            <h2 className="font-bold text-abg-blue-dark">{party.telephoneLabel}</h2>
            <a
              href={telHref}
              className="mt-2 inline-block text-sm font-medium text-abg-red hover:underline"
            >
              {party.telephone}
            </a>
          </div>

          <div className="rounded-2xl border-t-4 border-abg-green bg-white p-6 shadow-sm sm:col-span-2">
            <h2 className="font-bold text-abg-blue-dark">Adresse électronique</h2>
            <a
              href={`mailto:${party.email}`}
              className="mt-2 inline-block text-sm font-medium text-abg-red hover:underline"
            >
              {party.email}
            </a>
            {party.emailIsPlaceholder && (
              <p className="mt-2 text-xs text-foreground/50">
                Adresse indicative — à confirmer avec le Secrétariat Général avant publication.
              </p>
            )}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-abg-green-dark">Nous écrire</h2>
          <p className="mt-1 text-sm text-foreground/60">
            Message général, doléance, suggestion ou proposition de projet/partenariat — choisissez
            la catégorie qui correspond, votre demande sera transmise à la bonne personne.
          </p>
          <div className="mt-6 rounded-2xl border border-black/10 bg-abg-cream/60 p-6 sm:p-8">
            <ContactCategoryForm />
          </div>
        </div>
      </div>
    </div>
  );
}
