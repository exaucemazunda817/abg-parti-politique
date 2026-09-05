"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SubmissionStatusActions({
  apiBase,
  submissionId,
  status,
}: {
  apiBase: string;
  submissionId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Échec de la mise à jour — réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-abg-red">{error}</p>}
      <div className="flex flex-wrap gap-3">
        {status !== "TRAITE" && (
          <button
            onClick={() => updateStatus("TRAITE")}
            disabled={loading}
            className="rounded-full bg-abg-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-abg-green-dark disabled:opacity-60"
          >
            Marquer comme traité
          </button>
        )}
        {status === "TRAITE" && (
          <button
            onClick={() => updateStatus("LU")}
            disabled={loading}
            className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-foreground/70 transition-colors hover:bg-black/5 disabled:opacity-60"
          >
            Rouvrir
          </button>
        )}
      </div>
    </div>
  );
}
