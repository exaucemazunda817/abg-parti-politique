import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { findSecretary } from "@/lib/content";
import { SUBMISSION_STATUS_LABELS, SUBMISSION_STATUS_STYLES } from "@/lib/submissions";

export default async function SecretaryMessagesPage({
  params,
  searchParams,
}: {
  params: Promise<{ role: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { role } = await params;
  const secretary = findSecretary(role);
  if (!secretary) notFound();

  const { status } = await searchParams;
  const filter = status && ["NOUVEAU", "LU", "TRAITE"].includes(status) ? status : undefined;

  const [submissions, counts] = await Promise.all([
    prisma.submission.findMany({
      where: { targetRole: role, ...(filter ? { status: filter } : {}) },
      orderBy: { createdAt: "desc" },
    }),
    prisma.submission.groupBy({ by: ["status"], where: { targetRole: role }, _count: true }),
  ]);

  const countFor = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;
  const base = `/secretaires/${role}`;

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground">Messages reçus</h2>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <FilterTab href={base} active={!filter} label={`Tous (${counts.reduce((s, c) => s + c._count, 0)})`} />
        <FilterTab href={`${base}?status=NOUVEAU`} active={filter === "NOUVEAU"} label={`Nouveaux (${countFor("NOUVEAU")})`} />
        <FilterTab href={`${base}?status=LU`} active={filter === "LU"} label={`Lus (${countFor("LU")})`} />
        <FilterTab href={`${base}?status=TRAITE`} active={filter === "TRAITE"} label={`Traités (${countFor("TRAITE")})`} />
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/[0.02] text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-4 py-3">Sujet</th>
              <th className="px-4 py-3">De</th>
              <th className="px-4 py-3">Reçu le</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
                <td className="px-4 py-3">
                  <Link href={`${base}/${s.id}`} className="font-medium text-abg-blue hover:underline">
                    {s.sujet}
                  </Link>
                </td>
                <td className="px-4 py-3 text-foreground/70">{s.nom ?? "—"}</td>
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
