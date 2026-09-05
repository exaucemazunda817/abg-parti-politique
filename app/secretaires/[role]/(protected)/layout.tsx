import { notFound } from "next/navigation";
import { findSecretary, party } from "@/lib/content";
import RoleLogoutButton from "@/components/RoleLogoutButton";

export default async function SecretaryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const secretary = findSecretary(role);
  if (!secretary) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-abg-blue">
            {party.sigle} — Secrétaire National
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-abg-green-dark">
            {secretary.nom}
          </h1>
          <p className="text-sm text-foreground/60">{secretary.fonction}</p>
        </div>
        <RoleLogoutButton loginPath={`/secretaires/${role}/login`} />
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}
