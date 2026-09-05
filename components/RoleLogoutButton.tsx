"use client";

import { useRouter } from "next/navigation";

export default function RoleLogoutButton({ loginPath }: { loginPath: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/session/logout", { method: "POST" });
    router.push(loginPath);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-foreground/60 underline underline-offset-2 hover:text-abg-red"
    >
      Se déconnecter
    </button>
  );
}
