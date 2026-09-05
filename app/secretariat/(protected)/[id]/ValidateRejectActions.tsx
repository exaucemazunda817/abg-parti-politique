"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ValidateRejectActions({
  memberId,
  status,
}: {
  memberId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleValidate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/secretariat/members/${memberId}/validate`, { method: "POST" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Échec de la validation — réessayez.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/secretariat/members/${memberId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Échec du rejet — réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "VALIDATED") {
    return <p className="text-sm text-abg-green-dark">Dossier validé.</p>;
  }
  if (status === "REJECTED") {
    return <p className="text-sm text-abg-red-dark">Dossier rejeté.</p>;
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-abg-red">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleValidate}
          disabled={loading}
          className="rounded-full bg-abg-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-abg-green-dark disabled:opacity-60"
        >
          Valider le dossier
        </button>
        <button
          onClick={() => setShowRejectForm((v) => !v)}
          disabled={loading}
          className="rounded-full border border-abg-red px-5 py-2.5 text-sm font-semibold text-abg-red transition-colors hover:bg-abg-red hover:text-white disabled:opacity-60"
        >
          Rejeter le dossier
        </button>
      </div>
      {showRejectForm && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Motif du rejet (optionnel)"
            className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm focus:border-abg-blue focus:outline-none"
          />
          <button
            onClick={handleReject}
            disabled={loading}
            className="rounded-full bg-abg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-abg-red-dark disabled:opacity-60"
          >
            Confirmer le rejet
          </button>
        </div>
      )}
    </div>
  );
}
