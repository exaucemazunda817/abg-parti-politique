import type { Metadata } from "next";
import { party } from "@/lib/content";

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
    </div>
  );
}
