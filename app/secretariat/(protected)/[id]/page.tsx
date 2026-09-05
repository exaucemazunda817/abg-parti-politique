import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { photoMimeType, readPhoto } from "@/lib/photo-storage";
import ValidateRejectActions from "./ValidateRejectActions";

export default async function AdminMemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) notFound();

  const photoBytes = await readPhoto(member.photoPath);
  const photoDataUrl = `data:${photoMimeType(member.photoPath)};base64,${photoBytes.toString("base64")}`;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/secretariat" className="text-sm text-abg-blue hover:underline">
        ← Retour à la liste
      </Link>

      <div className="mt-4 flex flex-col gap-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:flex-row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoDataUrl}
          alt={`Photo de ${member.prenom} ${member.nom}`}
          className="h-40 w-32 shrink-0 rounded-lg border border-black/10 object-cover"
        />

        <div className="flex-1">
          <h1 className="text-xl font-extrabold text-abg-green-dark">
            {member.prenom} {member.postNom} {member.nom}
          </h1>
          <p className="text-sm text-foreground/50">Dossier n° {member.id}</p>

          <div className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            <Info label="Sexe" value={member.sexe === "M" ? "Masculin" : "Féminin"} />
            <Info
              label="Date de naissance"
              value={member.dateNaissance.toLocaleDateString("fr-FR")}
            />
            <Info label="Lieu de naissance" value={member.lieuNaissance} />
            <Info label="État civil" value={member.etatCivil ?? "—"} />
            <Info label="Profession" value={member.profession ?? "—"} />
            <Info label="Téléphone" value={member.telephone} />
            <Info label="E-mail" value={member.email ?? "—"} />
            <Info
              label="Adresse"
              value={[member.avenue, member.commune, member.ville, member.province]
                .filter(Boolean)
                .join(", ")}
            />
            <Info
              label="Pièce d'identité"
              value={
                member.pieceIdentiteType
                  ? `${member.pieceIdentiteType}${member.pieceIdentiteNumero ? " — " + member.pieceIdentiteNumero : ""}`
                  : "Non fournie"
              }
            />
            <Info label="Section souhaitée" value={member.section ?? "—"} />
            <Info
              label="Soumis le"
              value={member.createdAt.toLocaleString("fr-FR")}
            />
            {member.membershipNo && <Info label="N° de membre" value={member.membershipNo} />}
          </div>

          <div className="mt-6">
            <ValidateRejectActions memberId={member.id} status={member.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-foreground/40">{label}</p>
      <p className="text-foreground/90">{value || "—"}</p>
    </div>
  );
}
