import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { party } from "@/lib/content";
import { SUBMISSION_STATUS_LABELS, SUBMISSION_STATUS_STYLES } from "@/lib/submissions";

export const metadata: Metadata = {
  title: `Présidence — Propositions — ${party.sigle}`,
};

export default async function PresidentPropositionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = status && ["NOUVEAU", "LU", "TRAITE"].includes(status) ? status : undefined;

  const [submissions, counts] = await Promise.all([
    prisma.submission.findMany({
      where: { targetRole: "PRESIDENT", ...(filter ? { status: filter } : {}) },
      orderBy: { createdAt: "desc" },
    }),
    prisma.submission.groupBy({ by: ["status"], where: { targetRole: "PRESIDENT" }, _count: true }),
  ]);

  const countFor = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground">Propositions de projet & partenariat</h2>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <FilterTab href="/president" active={!filter} label={`Tous (${counts.reduce((s, c) => s + c._count, 0)})`} />
        <FilterTab href="/president?status=NOUVEAU" active={filter === "NOUVEAU"} label={`Nouveaux (${countFor("NOUVEAU")})`} />
        <FilterTab href="/president?status=LU" active={filter === "LU"} label={`Lus (${countFor("LU")})`} />
        <FilterTab href="/president?status=TRAITE" active={filter === "TRAITE"} label={`Traités (${countFor("TRAITE")})`} />
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/[0.02] text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-4 py-3">Sujet</th>
              <th className="px-4 py-3">Organisation / Nom</th>
              <th className="px-4 py-3">Reçu le</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
                <td className="px-4 py-3">
                  <Link
                    href={`/president/${s.id}`}
                    className="font-medium text-abg-blue hover:underline"
                  >
                    {s.sujet}
                  </Link>
                </td>
                <td className="px-4 py-3 text-foreground/70">{s.organisation ?? s.nom ?? "—"}</td>
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
                <td colSpan={4} className="px-4 py-8 text-center text-foreground/50">
                  Aucune proposition pour ce filtre.
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
