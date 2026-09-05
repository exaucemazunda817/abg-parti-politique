@AGENTS.md

# CLAUDE.md — Site ABG (Alliance pour la Bonne Gouvernance)

Contexte projet, lu automatiquement par Claude Code à chaque session dans ce dossier.
Mazunda est prestataire externe pour ce site (comme pour ses clients de rédaction de TFC) —
il pilote sans coder lui-même.

## Le projet
Site vitrine pour l'ABG, parti politique congolais enregistré par l'Arrêté ministériel
n° 005/2017 du 16 juin 2017 — pages Accueil, Le Parti, Direction, Programme, Actualités,
Contact — **plus un module d'adhésion en ligne** avec base de données (voir ci-dessous).

## Stack
- Next.js (App Router) + TypeScript + Tailwind v4
- Police Manrope (cohérent avec la charte typographique des autres projets de Mazunda)
- Prisma 7 + SQLite en local (`dev.db`) pour le module d'adhésion — pas encore de choix de
  base de données de production (à faire au moment du déploiement, voir Nutrimix/e-classe-rdc
  pour le pattern habituel : SQLite en dev, Postgres/Neon en prod)
- `pdf-lib` + `qrcode` pour générer la carte provisoire d'adhésion
- Contact (page `/contact`) reste simple via `tel:`/`mailto:`, sans formulaire serveur

## Module d'adhésion en ligne (ajouté le 05/09/2026)
Un visiteur peut remplir une fiche d'adhésion (`/adhesion`, avec upload photo obligatoire)
et reçoit **immédiatement** une carte provisoire PDF (statut « en attente de validation »,
QR code de vérification). C'est une carte de preuve d'enregistrement, **pas** la carte
officielle du parti. Décision explicite de Mazunda : deux cartes distinctes — la
provisoire (immédiate, générée par le site) et l'officielle (physique, remise en main
propre au secrétariat après validation manuelle du dossier — le site ne génère aucun
artefact pour celle-ci).

Workflow : soumission → statut `PENDING` → un membre du secrétariat se connecte sur
`/admin` (mot de passe unique dans `.env`, `ADMIN_PASSWORD` — jamais affiché dans le chat,
voir mémoire `no-credentials-in-chat-even-dev`) → consulte le dossier avec la photo
(`app/admin/[id]/page.tsx`, photo lue directement depuis le disque côté serveur, jamais
exposée par une URL publique) → valide (génère un numéro `ABG-{année}-{séquence}`) ou
rejette (avec motif optionnel). Le demandeur suit son statut sur `/adhesion/statut` avec
son numéro de dossier + téléphone (pas de compte utilisateur).

**Sécurité des données personnelles** : les photos sont stockées dans `storage/photos/`
(hors de `public/`, exclu de Git) et ne sont jamais servies par une route publique — seul
un composant serveur admin authentifié y accède. La session admin est un cookie
HttpOnly signé HMAC-SHA256 (`lib/admin-session.ts`), vérifié par `proxy.ts` (anciennement
`middleware.ts`, renommé pour Next.js 16 — voir plus bas) sur toutes les routes `/admin/*`
sauf `/admin/login`. Le champ pièce d'identité est optionnel (décision explicite de
Mazunda). Point de vigilance signalé à Mazunda et accepté en connaissance de cause :
appartenance politique = donnée sensible, à ne jamais traiter à la légère si ce module
est un jour ouvert au public réel.

## Prisma 7 — pièges rencontrés (05/09/2026)
- **`url` dans `datasource` du `schema.prisma` n'est plus supporté.** L'URL de connexion
  se déclare maintenant dans `prisma.config.ts` (pour `db push`/`migrate`, via
  `defineConfig({ datasource: { url: env("DATABASE_URL") } })`) ET séparément via un
  **adapter** passé au constructeur `PrismaClient` pour l'exécution (voir `lib/db.ts`,
  utilise `@prisma/adapter-better-sqlite3`). Les deux doivent être maintenus en cohérence.
- `prisma.config.ts` ne charge PAS automatiquement `.env` (son `env()` lit `process.env`
  tel quel) — il faut `import "dotenv/config"` en tête du fichier, sinon `DATABASE_URL`
  reste introuvable même si `.env` existe.
- **Toujours aligner la version de `prisma` (CLI) et `@prisma/client`** — `npm install
  prisma @prisma/client` sans version explicite peut résoudre des majeures différentes
  (ex. CLI en 8.0.0-rc.13 vs client en 7.10.0) si le tag `latest` du CLI pointe sur un
  pré-release plus récent. Toujours vérifier après install et repin sur la même version si besoin.

## Réseau — pièges rencontrés (05/09/2026)
Le réseau de cet environnement a été très instable pendant cette session (déjà documenté
pour GitHub le 29/08, mais ça touche aussi npm et les CDN de binaires) :
- **Deux `npm install` lancés en parallèle dans le même projet corrompent `node_modules`**
  (binaire `next` ou `prisma` manquant après coup, dossiers fantômes type
  `@alchemy.run/...` jamais demandés) — toujours attendre qu'un install se termine avant
  d'en lancer un autre, et en cas de doute faire un `rm -rf node_modules package-lock.json`
  puis réinstaller proprement plutôt que de superposer les tentatives.
- **`prisma generate`/`db push` télécharge un moteur natif (`schema-engine`) depuis
  `binaries.prisma.sh`** et échoue en boucle (`ECONNRESET`) si le réseau est mauvais —
  contournement qui a fonctionné : télécharger le binaire soi-même avec `curl --http1.1
  -C -` (reprise possible), vérifier son SHA256 contre le fichier `.sha256` publié à côté,
  puis lancer un petit serveur HTTP local (`python3 -m http.server`) servant ce fichier à
  la même arborescence (`/all_commits/<hash>/darwin/...`) et pointer Prisma dessus avec
  la variable d'environnement `PRISMA_ENGINES_MIRROR=http://127.0.0.1:<port>`. Cette
  variable n'a besoin d'être positionnée que pour les commandes `prisma generate`/`db
  push` — pas pour `next dev` une fois le client généré.

## Contenu : réel vs placeholder — important
Tout le contenu du site est centralisé dans `lib/content.ts`. Deux catégories :
- **Réel, source = `DECISION ABG.pdf` fourni par Mazunda le 04/09/2026** (décision de
  nomination des Secrétaires Nationaux, datée du 2 juillet 2026, signée par le Président
  National) : nom complet du parti, sigle, devise, base légale d'enregistrement, siège
  social, téléphone du Secrétariat Général, nom du Président National, liste des 7
  Secrétaires Nationaux avec leurs portefeuilles exacts.
- **Placeholder, marqué `[À COMPLÉTER]`** dans le code et affiché avec un encart visuel
  "À compléter" sur le site : mission/vision en prose, histoire du parti, valeurs,
  programme détaillé, actualités, adresse email (inventée, à confirmer).

**Ne jamais transformer un placeholder en contenu définitif sans confirmation explicite de
Mazunda** — il s'agit d'un vrai parti politique enregistré, pas d'un exercice fictif.

## Contenu : réel vs placeholder — important
Tout le contenu du site est centralisé dans `lib/content.ts`. Deux catégories :
- **Réel, source = `DECISION ABG.pdf` fourni par Mazunda le 04/09/2026** (décision de
  nomination des Secrétaires Nationaux, datée du 2 juillet 2026, signée par le Président
  National) : nom complet du parti, sigle, devise, base légale d'enregistrement, siège
  social, téléphone du Secrétariat Général, nom du Président National, liste des 7
  Secrétaires Nationaux avec leurs portefeuilles exacts.
- **Placeholder, marqué `[À COMPLÉTER]`** dans le code et affiché avec un encart visuel
  "À compléter" sur le site : mission/vision en prose, histoire du parti, valeurs,
  programme détaillé, actualités, adresse email (inventée, à confirmer).

**Ne jamais transformer un placeholder en contenu définitif sans confirmation explicite de
Mazunda** — il s'agit d'un vrai parti politique enregistré, pas d'un exercice fictif.

## Logo
`public/logo-abg.jpg` — fichier officiel fourni par Mazunda (retrouvé dans
`~/Downloads/logo parti.jpg` après recherche, la première tentative de récupération directe
depuis le chat ayant échoué faute d'accès disque à l'image collée).

## Reste à faire
- Contenu définitif de toutes les sections `[À COMPLÉTER]`
- Nom de domaine + déploiement (probablement Vercel, comme les autres projets de Mazunda) —
  **implique de choisir une vraie base de données de production** pour le module
  d'adhésion (SQLite ne convient pas à Vercel/serverless, contrairement au dev local)
- Décider si une page "Actualités" avec vrai système de publication est nécessaire à terme
- Décider d'un canal de notification (SMS/WhatsApp/email) pour prévenir le demandeur quand
  son dossier est validé, plutôt que de compter sur lui pour revérifier `/adhesion/statut`

## Note technique — Next.js 16
Ce projet utilise Next.js 16 (breaking changes vs versions antérieures). `next dev` régénère
automatiquement le bloc de règles agent entre les marqueurs `<!-- BEGIN:nextjs-agent-rules -->`
dans `AGENTS.md`/`CLAUDE.md` — normal, ne pas s'en inquiéter. Mais la toute première génération
(via `create-next-app`, à la fin de son `npm install`) peut **écraser entièrement** un
`CLAUDE.md` déjà présent si elle s'exécute après coup (c'est arrivé sur ce projet le
04/09/2026, l'installation ayant pris ~35 min) — toujours vérifier le contenu de CLAUDE.md
après un premier `npm install`/`next dev` sur un projet fraîchement scaffoldé avant de
continuer à s'appuyer dessus.
