import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { party } from "@/lib/content";

export default async function VerifierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) notFound();

  const statusLabel =
    member.status === "VALIDATED"
      ? "Membre validé"
      : member.status === "REJECTED"
        ? "Dossier non retenu"
        : "En attente de validation";

  const statusColor =
    member.status === "VALIDATED"
      ? "bg-green-50 text-abg-green-dark border-abg-green/30"
      : member.status === "REJECTED"
        ? "bg-red-50 text-abg-red-dark border-abg-red/30"
        : "bg-[#fbf3df] text-[#6b5417] border-abg-gold/40";

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-abg-blue">
        Vérification d&apos;adhésion
      </p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-abg-green-dark sm:text-3xl">
        {party.sigle}
      </h1>

      <div className="mt-8 rounded-2xl border-t-4 border-abg-green-dark bg-white p-6 shadow-sm">
        <p className="text-lg font-bold text-foreground">
          {member.prenom} {member.nom}
        </p>
        <span
          className={`mt-3 inline-block rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${statusColor}`}
        >
          {statusLabel}
        </span>
        {member.status === "VALIDATED" && member.membershipNo && (
          <p className="mt-3 text-sm text-foreground/70">
            Numéro de membre : <span className="font-mono font-semibold">{member.membershipNo}</span>
          </p>
        )}
        {member.section && (
          <p className="mt-1 text-sm text-foreground/50">Section : {member.section}</p>
        )}
      </div>

      <p className="mt-6 text-xs text-foreground/40">
        Cette page confirme uniquement le statut d&apos;adhésion — aucune autre donnée
        personnelle n&apos;est affichée publiquement.
      </p>
    </div>
  );
}
