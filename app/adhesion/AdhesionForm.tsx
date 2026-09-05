"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ETATS_CIVILS, PROVINCES_RDC, SEXES, TYPES_PIECE_IDENTITE } from "@/lib/form-options";

export default function AdhesionForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoPreview(null);
      return;
    }
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/adhesion", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue. Merci de réessayer.");
        setSubmitting(false);
        return;
      }

      router.push(`/adhesion/confirmation?id=${data.id}&token=${data.accessToken}`);
    } catch {
      setError("Impossible d'envoyer le formulaire — vérifiez votre connexion et réessayez.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <div className="rounded-lg border border-abg-red/30 bg-red-50 px-4 py-3 text-sm text-abg-red-dark">
          {error}
        </div>
      )}

      <fieldset className="space-y-4">
        <legend className="text-lg font-bold text-abg-blue-dark">Identité</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Nom" name="nom" required />
          <Field label="Post-nom" name="postNom" required />
          <Field label="Prénom" name="prenom" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField label="Sexe" name="sexe" required>
            <option value="">—</option>
            {SEXES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </SelectField>
          <Field label="Date de naissance" name="dateNaissance" type="date" required />
          <Field label="Lieu de naissance" name="lieuNaissance" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="État civil" name="etatCivil">
            <option value="">—</option>
            {ETATS_CIVILS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </SelectField>
          <Field label="Profession" name="profession" />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-bold text-abg-blue-dark">Adresse</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Province" name="province" required>
            <option value="">—</option>
            {PROVINCES_RDC.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </SelectField>
          <Field label="Ville / Territoire" name="ville" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Commune / Secteur" name="commune" />
          <Field label="Avenue, numéro" name="avenue" />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-bold text-abg-blue-dark">Contact</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Téléphone" name="telephone" type="tel" required />
          <Field label="E-mail" name="email" type="email" />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-bold text-abg-blue-dark">
          Pièce d&apos;identité <span className="text-sm font-normal text-foreground/50">(optionnel)</span>
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Type de pièce" name="pieceIdentiteType">
            <option value="">Aucune</option>
            {TYPES_PIECE_IDENTITE.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </SelectField>
          <Field label="Numéro de la pièce" name="pieceIdentiteNumero" />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-bold text-abg-blue-dark">Section souhaitée</legend>
        <Field
          label="Fédération / section du parti"
          name="section"
          placeholder="Ex. Fédération de Kinshasa/Kasa-Vubu"
        />
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-lg font-bold text-abg-blue-dark">Photo d&apos;identité</legend>
        <p className="text-sm text-foreground/60">
          Photo récente, visage bien visible — utilisée pour votre carte provisoire et votre
          future carte officielle. Formats acceptés : JPG, PNG, WEBP (5 Mo max).
        </p>
        <div className="flex items-center gap-4">
          {photoPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoPreview}
              alt="Aperçu de la photo"
              className="h-20 w-20 rounded-lg border border-black/10 object-cover"
            />
          )}
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp"
            required
            onChange={handlePhotoChange}
            className="text-sm text-foreground/80 file:mr-4 file:rounded-full file:border-0 file:bg-abg-green file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-abg-green-dark"
          />
        </div>
      </fieldset>

      <div className="rounded-lg border border-black/10 bg-white p-4 text-sm text-foreground/70">
        En soumettant ce formulaire, vous acceptez que ces informations soient utilisées par
        l&apos;{" "}
        <span className="font-medium">Alliance pour la Bonne Gouvernance (ABG)</span> pour
        traiter votre demande d&apos;adhésion. Une carte provisoire vous sera délivrée
        immédiatement ; la carte officielle sera à retirer au secrétariat après validation de
        votre dossier.
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-abg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-abg-red-dark disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Envoi en cours…" : "Soumettre ma demande d'adhésion"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
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
        placeholder={placeholder}
        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-foreground focus:border-abg-blue focus:outline-none focus:ring-1 focus:ring-abg-blue"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  required,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-foreground/80">
        {label}
        {required && <span className="text-abg-red"> *</span>}
      </span>
      <select
        name={name}
        required={required}
        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-foreground focus:border-abg-blue focus:outline-none focus:ring-1 focus:ring-abg-blue"
      >
        {children}
      </select>
    </label>
  );
}
