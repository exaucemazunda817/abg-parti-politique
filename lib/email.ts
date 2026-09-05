// Envoi d'e-mail via l'API REST de Resend (pas de SDK — un simple fetch, pour éviter une
// dépendance de plus vu l'instabilité réseau déjà rencontrée sur ce projet, voir CLAUDE.md).
//
// Tant que RESEND_API_KEY / EMAIL_FROM ne sont pas configurés (ABG n'a pas encore de nom
// de domaine vérifiable), l'envoi est silencieusement ignoré (juste un warning en console)
// plutôt que de faire échouer l'action qui déclenche la notification — valider un dossier
// ou traiter un message doit fonctionner même sans e-mail configuré.
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn(`[email] RESEND_API_KEY/EMAIL_FROM manquant — email à ${to} non envoyé ("${subject}").`);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      console.error(`[email] Échec envoi à ${to} (${res.status}) : ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[email] Erreur réseau envoi à ${to}`, err);
    return false;
  }
}

function wrapper(bodyHtml: string): string {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;color:#1c1c1c">
    <p style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#6f7d2c;font-weight:bold">
      Alliance pour la Bonne Gouvernance (ABG)
    </p>
    ${bodyHtml}
    <p style="margin-top:24px;font-size:12px;color:#888">
      Ceci est un message automatique, merci de ne pas y répondre directement.
    </p>
  </div>`;
}

export function adhesionValidatedEmail({
  prenom,
  membershipNo,
  siege,
}: {
  prenom: string;
  membershipNo: string;
  siege: string;
}) {
  return {
    subject: "Votre adhésion à l'ABG a été validée",
    html: wrapper(`
      <h1 style="font-size:18px;color:#4d5720">Dossier validé</h1>
      <p>Bonjour ${prenom},</p>
      <p>Votre dossier d'adhésion à l'ABG a été validé par le Secrétariat Général.</p>
      <p>Numéro de membre : <strong>${membershipNo}</strong></p>
      <p>Présentez-vous au siège du parti (${siege}) avec une pièce d'identité pour récupérer votre carte officielle de membre.</p>
    `),
  };
}

export function adhesionRejectedEmail({
  prenom,
  reason,
  telephone,
}: {
  prenom: string;
  reason: string | null;
  telephone: string;
}) {
  return {
    subject: "Votre dossier d'adhésion à l'ABG",
    html: wrapper(`
      <h1 style="font-size:18px;color:#6a0d1b">Dossier non retenu</h1>
      <p>Bonjour ${prenom},</p>
      <p>Votre dossier d'adhésion n'a pas été retenu par le Secrétariat Général.</p>
      ${reason ? `<p>Motif : ${reason}</p>` : ""}
      <p>Pour plus d'informations, contactez le Secrétariat Général au ${telephone}.</p>
    `),
  };
}

export function submissionTreatedEmail({
  sujet,
  destinataireLabel,
}: {
  sujet: string;
  destinataireLabel: string;
}) {
  return {
    subject: `Votre message "${sujet}" a été traité`,
    html: wrapper(`
      <h1 style="font-size:18px;color:#4d5720">Message traité</h1>
      <p>Votre message « ${sujet} » adressé à ${destinataireLabel} a bien été traité.</p>
    `),
  };
}
