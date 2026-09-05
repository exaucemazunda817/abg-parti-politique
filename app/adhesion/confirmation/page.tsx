import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { party } from "@/lib/content";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; token?: string }>;
}) {
  const { id, token } = await searchParams;
  if (!id || !token) notFound();

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member || member.accessToken !== token) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-abg-green text-3xl text-white">
        ✓
      </div>
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-abg-green-dark sm:text-3xl">
        Demande d&apos;adhésion enregistrée
      </h1>
      <p className="mt-3 text-foreground/70">
        Merci {member.prenom} {member.nom}, votre dossier a bien été reçu par le Secrétariat
        Général de {party.sigle}. Voici votre carte provisoire — elle atteste votre
        enregistrement en ligne, en attendant la validation de votre dossier.
      </p>

      <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <p className="text-sm text-foreground/60">Numéro de dossier</p>
        <p className="font-mono text-lg font-bold text-abg-blue-dark">{member.id}</p>
        <a
          href={`/api/carte/${member.id}?token=${member.accessToken}`}
          className="mt-4 inline-block rounded-full bg-abg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-abg-red-dark"
        >
          Télécharger ma carte provisoire (PDF)
        </a>
      </div>

      <div className="mt-8 rounded-xl border border-abg-gold/40 bg-[#fbf3df] p-5 text-left text-sm text-[#6b5417]">
        <p className="font-semibold">Prochaine étape</p>
        <p className="mt-1">
          Le Secrétariat Général va vérifier votre dossier. Une fois validé, présentez-vous
          au siège du parti ({party.siege}) avec une pièce d&apos;identité pour récupérer
          votre carte officielle de membre.
        </p>
      </div>

      <p className="mt-6 text-sm text-foreground/50">
        Conservez ce numéro de dossier :{" "}
        <Link href="/adhesion/statut" className="text-abg-blue underline underline-offset-2">
          vérifiez le statut de votre dossier à tout moment
        </Link>
        .
      </p>
    </div>
  );
}
