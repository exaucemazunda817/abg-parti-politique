import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { party } from "@/lib/content";
import {
  SUBMISSION_STATUS_LABELS,
  SUBMISSION_STATUS_STYLES,
  SUBMISSION_TYPE_LABELS,
} from "@/lib/submissions";

export const metadata: Metadata = {
  title: `Secrétariat — Messages & Doléances — ${party.sigle}`,
};

export default async function SecretariatMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = status && ["NOUVEAU", "LU", "TRAITE"].includes(status) ? status : undefined;

  const [submissions, counts] = await Promise.all([
    prisma.submission.findMany({
      where: { targetRole: "SECRETARIAT", ...(filter ? { status: filter } : {}) },
      orderBy: { createdAt: "desc" },
    }),
    prisma.submission.groupBy({ by: ["status"], where: { targetRole: "SECRETARIAT" }, _count: true }),
  ]);

  const countFor = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground">Messages & Doléances</h2>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <FilterTab href="/secretariat/messages" active={!filter} label={`Tous (${counts.reduce((s, c) => s + c._count, 0)})`} />
        <FilterTab href="/secretariat/messages?status=NOUVEAU" active={filter === "NOUVEAU"} label={`Nouveaux (${countFor("NOUVEAU")})`} />
        <FilterTab href="/secretariat/messages?status=LU" active={filter === "LU"} label={`Lus (${countFor("LU")})`} />
        <FilterTab href="/secretariat/messages?status=TRAITE" active={filter === "TRAITE"} label={`Traités (${countFor("TRAITE")})`} />
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/[0.02] text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-4 py-3">Sujet</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">De</th>
              <th className="px-4 py-3">Reçu le</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
                <td className="px-4 py-3">
                  <Link
                    href={`/secretariat/messages/${s.id}`}
                    className="font-medium text-abg-blue hover:underline"
                  >
                    {s.sujet}
                  </Link>
                </td>
                <td className="px-4 py-3 text-foreground/70">
                  {SUBMISSION_TYPE_LABELS[s.type]}
                  {s.sousType ? ` — ${s.sousType}` : ""}
                </td>
                <td className="px-4 py-3 text-foreground/70">{s.nom ?? "Anonyme"}</td>
                <td className="px-4 py-3 text-foreground/70">{s.createdAt.toLocaleDateString("fr-FR")}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${SUBMISSION_STATUS_STYLES[s.status]}`}
                  >
                    {SUBMISSION_STATUS_LABELS[s.status]}
                  </span>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-foreground/50">
                  Aucun message pour ce filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterTab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 font-medium transition-colors ${
        active ? "bg-abg-blue-dark text-white" : "bg-black/5 text-foreground/70 hover:bg-black/10"
      }`}
    >
      {label}
    </Link>
  );
}
