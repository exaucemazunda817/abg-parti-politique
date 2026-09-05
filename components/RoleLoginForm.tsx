"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Role } from "@/lib/session";

export default function RoleLoginForm({ role, spacePath }: { role: Role; spacePath: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/session/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erreur de connexion.");
        setLoading(false);
        return;
      }
      router.push(spacePath);
      router.refresh();
    } catch {
      setError("Impossible de se connecter — vérifiez votre connexion.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-foreground/80">Mot de passe</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 focus:border-abg-blue focus:outline-none focus:ring-1 focus:ring-abg-blue"
        />
      </label>
      {error && <p className="text-sm text-abg-red">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-abg-blue-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
