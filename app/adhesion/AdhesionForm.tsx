"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Field, SelectField } from "@/components/form/Field";
import FormSection from "@/components/form/FormSection";
import { ETATS_CIVILS, PROVINCES_RDC, SEXES, TYPES_PIECE_IDENTITE } from "@/lib/form-options";

export default function AdhesionForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoPreview(null);
      setPhotoName(null);
      return;
    }
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoName(file.name);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-abg-red/30 bg-red-50 px-4 py-3 text-sm text-abg-red-dark">
          {error}
        </div>
      )}

      <FormSection number={1} title="Identité">
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
      </FormSection>

      <FormSection number={2} title="Adresse">
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
      </FormSection>

      <FormSection number={3} title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Téléphone" name="telephone" type="tel" required />
          <Field label="E-mail" name="email" type="email" />
        </div>
      </FormSection>

      <FormSection number={4} title="Pièce d'identité" hint="(optionnel)">
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
      </FormSection>

      <FormSection number={5} title="Section souhaitée">
        <Field
          label="Fédération / section du parti"
          name="section"
          placeholder="Ex. Fédération de Kinshasa/Kasa-Vubu"
        />
      </FormSection>

      <FormSection number={6} title="Photo d'identité">
        <p className="text-sm text-foreground/60">
          Photo récente, visage bien visible — utilisée pour votre carte provisoire et votre
          future carte officielle. Formats acceptés : JPG, PNG, WEBP (5 Mo max).
        </p>
        <input
          ref={fileInputRef}
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp"
          required
          onChange={handlePhotoChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center gap-4 rounded-xl border-2 border-dashed border-abg-blue/40 bg-abg-blue-dark/[0.03] p-4 text-left transition-colors hover:border-abg-blue hover:bg-abg-blue-dark/[0.06]"
        >
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoPreview}
              alt="Aperçu de la photo"
              className="h-16 w-16 shrink-0 rounded-lg border border-black/10 object-cover"
            />
          ) : (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white text-2xl text-abg-blue-dark/40">
              +
            </span>
          )}
          <span>
            <span className="block text-sm font-semibold text-abg-blue-dark">
              {photoName ? "Changer la photo" : "Choisir une photo"}
            </span>
            <span className="block text-xs text-foreground/50">
              {photoName ?? "Aucun fichier sélectionné"}
            </span>
          </span>
        </button>
      </FormSection>

      <div className="rounded-xl border border-black/10 bg-abg-cream p-4 text-sm text-foreground/70">
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
        className="w-full rounded-full bg-abg-red px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-abg-red-dark disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Envoi en cours…" : "Soumettre ma demande d'adhésion"}
      </button>
    </form>
  );
}
