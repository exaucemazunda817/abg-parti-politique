import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { party } from "@/lib/content";
import LogoutButton from "./LogoutButton";

export const metadata: Metadata = {
  title: `Secrétariat — Adhésions — ${party.sigle}`,
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  VALIDATED: "Validé",
  REJECTED: "Rejeté",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-[#fbf3df] text-[#6b5417]",
  VALIDATED: "bg-green-50 text-abg-green-dark",
  REJECTED: "bg-red-50 text-abg-red-dark",
};

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = status && ["PENDING", "VALIDATED", "REJECTED"].includes(status) ? status : undefined;

  const [members, counts] = await Promise.all([
    prisma.member.findMany({
      where: filter ? { status: filter } : undefined,
      orderBy: { createdAt: "desc" },
    }),
    prisma.member.groupBy({ by: ["status"], _count: true }),
  ]);

  const countFor = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-abg-green-dark">
          Dossiers d&apos;adhésion
        </h1>
        <LogoutButton />
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <FilterTab href="/admin" active={!filter} label={`Tous (${counts.reduce((s, c) => s + c._count, 0)})`} />
        <FilterTab href="/admin?status=PENDING" active={filter === "PENDING"} label={`En attente (${countFor("PENDING")})`} />
        <FilterTab href="/admin?status=VALIDATED" active={filter === "VALIDATED"} label={`Validés (${countFor("VALIDATED")})`} />
        <FilterTab href="/admin?status=REJECTED" active={filter === "REJECTED"} label={`Rejetés (${countFor("REJECTED")})`} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/[0.02] text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Province</th>
              <th className="px-4 py-3">Soumis le</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
                <td className="px-4 py-3">
                  <Link href={`/admin/${m.id}`} className="font-medium text-abg-blue hover:underline">
                    {m.prenom} {m.postNom} {m.nom}
                  </Link>
                </td>
                <td className="px-4 py-3 text-foreground/70">{m.telephone}</td>
                <td className="px-4 py-3 text-foreground/70">{m.province}</td>
                <td className="px-4 py-3 text-foreground/70">
                  {m.createdAt.toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[m.status]}`}
                  >
                    {STATUS_LABELS[m.status]}
                  </span>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-foreground/50">
                  Aucun dossier pour ce filtre.
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
