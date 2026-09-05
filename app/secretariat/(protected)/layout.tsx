import Link from "next/link";
import { party } from "@/lib/content";
import { prisma } from "@/lib/db";
import RoleLogoutButton from "@/components/RoleLogoutButton";
import { ROLES } from "@/lib/session";

export default async function SecretariatLayout({ children }: { children: React.ReactNode }) {
  const [pendingAdhesions, newMessages] = await Promise.all([
    prisma.member.count({ where: { status: "PENDING" } }),
    prisma.submission.count({ where: { targetRole: "SECRETARIAT", status: "NOUVEAU" } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-abg-blue">
            {party.sigle} — {ROLES.SECRETARIAT.label}
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-abg-green-dark">
            Espace Secrétariat
          </h1>
        </div>
        <RoleLogoutButton loginPath={ROLES.SECRETARIAT.loginPath} />
      </div>

      <nav className="mt-6 flex gap-2 border-b border-black/10 pb-px text-sm font-medium">
        <SectionTab href="/secretariat" label={`Adhésions${pendingAdhesions ? ` (${pendingAdhesions})` : ""}`} />
        <SectionTab
          href="/secretariat/messages"
          label={`Messages & Doléances${newMessages ? ` (${newMessages})` : ""}`}
        />
      </nav>

      <div className="mt-6">{children}</div>
    </div>
  );
}

function SectionTab({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-t-lg px-4 py-2.5 text-foreground/70 transition-colors hover:bg-black/5 hover:text-abg-blue-dark"
    >
      {label}
    </Link>
  );
}
