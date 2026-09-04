import Image from "next/image";
import Link from "next/link";
import PlaceholderNote from "@/components/PlaceholderNote";
import {
  missionPlaceholder,
  party,
  presidentNational,
  valeursPlaceholder,
} from "@/lib/content";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-abg-green-dark text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 md:flex-row md:items-center md:gap-12 md:py-24 md:text-left">
          <Image
            src="/logo-abg.png"
            alt={`Logo du parti ${party.sigle}`}
            width={220}
            height={220}
            className="abg-logo-shadow h-32 w-32 shrink-0 object-contain sm:h-40 sm:w-40 md:h-48 md:w-48"
            priority
          />
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              République Démocratique du Congo
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
              {party.nomComplet}
            </h1>
            <p className="mt-3 text-lg font-medium text-abg-gold sm:text-xl">
              « {party.devise} »
            </p>
            <p className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
              {missionPlaceholder}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
              <Link
                href="/le-parti"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-abg-green-dark transition-colors hover:bg-white/90"
              >
                Découvrir le parti
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Nous rejoindre
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="abg-accent-bar" />

      {/* Enregistrement officiel + Président National */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-abg-blue/20 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-abg-blue">
              Parti légalement enregistré
            </p>
            <p className="mt-2 text-foreground/80">{party.enregistrement}</p>
          </div>

          <div className="rounded-xl bg-abg-blue-dark px-6 py-8 text-center text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
              {presidentNational.fonction}
            </p>
            <p className="mt-2 text-2xl font-bold sm:text-3xl">{presidentNational.nom}</p>
            <Link
              href="/direction"
              className="mt-4 inline-block text-sm font-medium text-abg-gold underline underline-offset-4 hover:text-white"
            >
              Voir toute la direction nationale →
            </Link>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold text-abg-green-dark">Nos valeurs</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {valeursPlaceholder.map((valeur) => (
            <div
              key={valeur}
              className="rounded-lg border border-black/10 bg-white p-4 text-sm text-foreground/80 shadow-sm"
            >
              {valeur}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <PlaceholderNote>
            Les valeurs officielles du parti seront listées ici une fois fournies.
          </PlaceholderNote>
        </div>
      </section>
    </div>
  );
}
