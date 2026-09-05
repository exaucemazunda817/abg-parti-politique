"use client";

import { useState } from "react";

type Category = "MESSAGE" | "DOLEANCE" | "PROPOSITION";

const CATEGORIES: { value: Category; label: string; description: string }[] = [
  {
    value: "MESSAGE",
    label: "Message général",
    description: "Une question ou une information pour le Secrétariat Général.",
  },
  {
    value: "DOLEANCE",
    label: "Doléance ou suggestion",
    description: "Un signalement ou une proposition d'amélioration, adressé au Secrétariat Général.",
  },
  {
    value: "PROPOSITION",
    label: "Proposition de projet ou de partenariat",
    description: "Une proposition adressée directement au Président National.",
  },
];

export default function ContactCategoryForm() {
  const [category, setCategory] = useState<Category>("MESSAGE");
  const [sousType, setSousType] = useState<"Doléance" | "Suggestion">("Doléance");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      type: category,
      sousType: category === "DOLEANCE" ? sousType : undefined,
      nom: formData.get("nom"),
      email: formData.get("email"),
      telephone: formData.get("telephone"),
      organisation: formData.get("organisation"),
      sujet: formData.get("sujet"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setSubmitting(false);
        return;
      }
      setSuccess(true);
    } catch {
      setError("Impossible d'envoyer votre message — vérifiez votre connexion.");
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-abg-green/30 bg-green-50 p-6 text-center">
        <p className="font-semibold text-abg-green-dark">Message envoyé.</p>
        <p className="mt-1 text-sm text-foreground/70">
          {category === "PROPOSITION"
            ? "Votre proposition a bien été transmise au Président National."
            : "Votre message a bien été transmis au Secrétariat Général."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <span className="mb-2 block text-sm font-semibold text-foreground/80">
          Que souhaitez-vous faire ?
        </span>
        <div className="grid gap-2 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={`rounded-xl border p-3 text-left text-sm transition-colors ${
                category === c.value
                  ? "border-abg-blue-dark bg-abg-blue-dark/5"
                  : "border-black/10 bg-white hover:border-abg-blue-dark/40"
              }`}
            >
              <span className="block font-semibold text-foreground">{c.label}</span>
              <span className="mt-1 block text-xs text-foreground/60">{c.description}</span>
            </button>
          ))}
        </div>
      </div>

      {category === "DOLEANCE" && (
        <div className="flex gap-2">
          {(["Doléance", "Suggestion"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setSousType(v)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                sousType === v
                  ? "bg-abg-blue-dark text-white"
                  : "bg-black/5 text-foreground/70 hover:bg-black/10"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={category === "PROPOSITION" ? "Nom du contact" : "Nom"} name="nom" />
        {category === "PROPOSITION" && <Field label="Organisation" name="organisation" />}
        <Field label="Téléphone" name="telephone" type="tel" />
        <Field label="E-mail" name="email" type="email" />
      </div>

      <Field label="Sujet" name="sujet" required />

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-foreground/80">
          Message <span className="text-abg-red">*</span>
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 focus:border-abg-blue focus:outline-none focus:ring-1 focus:ring-abg-blue"
        />
      </label>

      {error && <p className="text-sm text-abg-red">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-abg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-abg-red-dark disabled:opacity-60"
      >
        {submitting ? "Envoi en cours…" : "Envoyer"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-foreground/80">
        {label}
        {required && <span className="text-abg-red"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 focus:border-abg-blue focus:outline-none focus:ring-1 focus:ring-abg-blue"
      />
    </label>
  );
}
