"use client";

import { useState } from "react";
import { party } from "@/lib/content";

type Result = {
  id: string;
  accessToken: string;
  status: string;
  nom: string;
  prenom: string;
  membershipNo: string | null;
  rejectedReason: string | null;
};

export default function StatutForm() {
  const [id, setId] = useState("");
  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/adhesion/statut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id.trim(), telephone: telephone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setResult(data);
    } catch {
      setError("Impossible de vérifier le statut — vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-foreground/80">Numéro de dossier</span>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 font-mono text-sm focus:border-abg-blue focus:outline-none focus:ring-1 focus:ring-abg-blue"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-foreground/80">
            Téléphone utilisé lors de l&apos;inscription
          </span>
          <input
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
            className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 focus:border-abg-blue focus:outline-none focus:ring-1 focus:ring-abg-blue"
          />
        </label>
        {error && <p className="text-sm text-abg-red">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-abg-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-abg-blue-dark disabled:opacity-60"
        >
          {loading ? "Vérification…" : "Vérifier mon statut"}
        </button>
      </form>

      {result && (
        <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="font-semibold text-foreground">
            {result.prenom} {result.nom}
          </p>

          {result.status === "PENDING" && (
            <div className="mt-3">
              <StatusBadge label="En attente de validation" color="gold" />
              <p className="mt-3 text-sm text-foreground/70">
                Votre dossier est en cours de vérification par le Secrétariat Général.
              </p>
              <a
                href={`/api/carte/${result.id}?token=${result.accessToken}`}
                className="mt-4 inline-block rounded-full bg-abg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-abg-red-dark"
              >
                Télécharger ma carte provisoire
              </a>
            </div>
          )}

          {result.status === "VALIDATED" && (
            <div className="mt-3">
              <StatusBadge label="Dossier validé" color="green" />
              {result.membershipNo && (
                <p className="mt-2 text-sm text-foreground/70">
                  Numéro de membre : <span className="font-mono font-semibold">{result.membershipNo}</span>
                </p>
              )}
              <p className="mt-3 text-sm text-foreground/70">
                Présentez-vous au siège du parti ({party.siege}) avec une pièce
                d&apos;identité pour récupérer votre carte officielle.
              </p>
            </div>
          )}

          {result.status === "REJECTED" && (
            <div className="mt-3">
              <StatusBadge label="Dossier non retenu" color="red" />
              {result.rejectedReason && (
                <p className="mt-2 text-sm text-foreground/70">{result.rejectedReason}</p>
              )}
              <p className="mt-3 text-sm text-foreground/70">
                Pour plus d&apos;informations, contactez le Secrétariat Général au{" "}
                {party.telephone}.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ label, color }: { label: string; color: "gold" | "green" | "red" }) {
  const styles = {
    gold: "bg-[#fbf3df] text-[#6b5417]",
    green: "bg-green-50 text-abg-green-dark",
    red: "bg-red-50 text-abg-red-dark",
  }[color];
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${styles}`}>
      {label}
    </span>
  );
}
