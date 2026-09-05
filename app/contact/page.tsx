import type { Metadata } from "next";
import { party } from "@/lib/content";
import ContactCategoryForm from "./ContactCategoryForm";

export const metadata: Metadata = {
  title: `Contact — ${party.sigle}`,
};

export default function ContactPage() {
  const telHref = `tel:${party.telephone.replace(/\s+/g, "")}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-abg-green-dark sm:text-4xl">
        Contact
      </h1>
      <p className="mt-2 text-foreground/70">
        Pour toute question ou demande d&apos;adhésion, contactez le Secrétariat Général de{" "}
        {party.sigle}.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-abg-blue-dark">Siège social</h2>
          <p className="mt-2 text-sm text-foreground/80">{party.siege}</p>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-abg-blue-dark">{party.telephoneLabel}</h2>
          <a
            href={telHref}
            className="mt-2 inline-block text-sm font-medium text-abg-red hover:underline"
          >
            {party.telephone}
          </a>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm sm:col-span-2">
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
  );
}
