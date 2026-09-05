import { party } from "@/lib/content";
import RoleLogoutButton from "@/components/RoleLogoutButton";
import { ROLES } from "@/lib/session";

export default function PresidentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-abg-blue">
            {party.sigle} — {ROLES.PRESIDENT.label}
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-abg-green-dark">
            Espace Présidence
          </h1>
        </div>
        <RoleLogoutButton loginPath={ROLES.PRESIDENT.loginPath} />
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}
