import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { findSecretary } from "@/lib/content";
import { SUBMISSION_STATUS_LABELS, SUBMISSION_STATUS_STYLES } from "@/lib/submissions";
import SubmissionStatusActions from "@/components/SubmissionStatusActions";

export default async function SecretaryMessageDetailPage({
  params,
}: {
  params: Promise<{ role: string; id: string }>;
}) {
  const { role, id } = await params;
  const secretary = findSecretary(role);
  if (!secretary) notFound();

  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission || submission.targetRole !== role) notFound();

  if (submission.status === "NOUVEAU") {
    await prisma.submission.update({ where: { id }, data: { status: "LU", readAt: new Date() } });
    submission.status = "LU";
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={`/secretaires/${role}`} className="text-sm text-abg-blue hover:underline">
        ← Retour aux messages
      </Link>

      <div className="mt-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-extrabold text-abg-green-dark">{submission.sujet}</h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${SUBMISSION_STATUS_STYLES[submission.status]}`}
          >
            {SUBMISSION_STATUS_LABELS[submission.status]}
          </span>
        </div>
        <p className="mt-1 text-sm text-foreground/50">
          reçu le {submission.createdAt.toLocaleString("fr-FR")}
        </p>

        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <Info label="Nom" value={submission.nom ?? "—"} />
          <Info label="Téléphone" value={submission.telephone ?? "—"} />
          <Info label="E-mail" value={submission.email ?? "—"} />
        </div>

        <div className="mt-4 rounded-lg bg-black/[0.02] p-4 text-sm text-foreground/90 whitespace-pre-wrap">
          {submission.message}
        </div>

        <div className="mt-6">
          <SubmissionStatusActions
            apiBase={`/api/secretaires/${role}/submissions`}
            submissionId={submission.id}
            status={submission.status}
          />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-foreground/40">{label}</p>
      <p className="text-foreground/90">{value}</p>
    </div>
  );
}
