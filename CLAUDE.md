@AGENTS.md

# CLAUDE.md — Site ABG (Alliance pour la Bonne Gouvernance)

Contexte projet, lu automatiquement par Claude Code à chaque session dans ce dossier.
Mazunda est prestataire externe pour ce site (comme pour ses clients de rédaction de TFC) —
il pilote sans coder lui-même.

## Le projet
Site vitrine pour l'ABG, parti politique congolais enregistré par l'Arrêté ministériel
n° 005/2017 du 16 juin 2017 — pages Accueil, Le Parti, Direction, Programme, Actualités,
Contact — **plus un module d'adhésion en ligne et 9 espaces d'autorité** (Secrétariat,
Présidence, et un par Secrétaire National — voir ci-dessous).

## Stack
- Next.js (App Router) + TypeScript + Tailwind v4
- Police Manrope (cohérent avec la charte typographique des autres projets de Mazunda)
- Prisma 7 + SQLite en local (`dev.db`) — pas encore de choix de base de données de
  production (à faire au moment du déploiement, voir Nutrimix/e-classe-rdc pour le pattern
  habituel : SQLite en dev, Postgres/Neon en prod)
- `pdf-lib` + `qrcode` pour générer la carte provisoire d'adhésion

## Espaces d'autorité : Secrétariat, Présidence, 7 Secrétaires Nationaux
Chaque rôle a son propre mot de passe (`.env` — jamais affichés dans le chat, voir mémoire
`no-credentials-in-chat-even-dev`) et son propre espace protégé :
- **`/secretariat`** (login : `/secretariat/login`, mot de passe `SECRETARIAT_PASSWORD`) —
  gère les dossiers d'adhésion (`/secretariat`, valider/rejeter) et les Messages &
  Doléances qui lui sont adressés (`/secretariat/messages`).
- **`/president`** (login : `/president/login`, mot de passe `PRESIDENT_PASSWORD`) — reçoit
  uniquement les Propositions de projet/partenariat.
- **`/secretaires/[role]`** (ajouté le 05/09/2026, sur demande de Mazunda) — un espace par
  Secrétaire National, mot de passe `SECRETARY_PASSWORD_<n>` où `<n>` est la position (1 à
  7) dans le tableau `secretairesNationaux` de `lib/content.ts`. Route **dynamique unique**
  (pas 7 dossiers dupliqués) : `[role]` correspond au champ `role` de chaque secrétaire
  (ex. `sec-enseignement-superieur`). Chaque secrétaire ne voit QUE les messages qui lui
  sont adressés nommément — jamais ceux des autres secrétaires ni ceux du Secrétariat
  Général.

Le type `Role` et la table `ROLES` (`lib/session.ts`) sont **générés dynamiquement** à
partir de `secretairesNationaux` — ajouter un futur rôle qui n'est pas un Secrétaire
National (ex. un Trésorier) demanderait d'étendre ce fichier, mais l'ajout d'un
Secrétaire National de plus dans `lib/content.ts` suffirait à lui créer son espace,
sans toucher au reste.

**Auth** : un seul mot de passe partagé par rôle (pas de compte nominatif pour l'instant —
Mazunda a choisi cette option pour démarrer). Session = cookie HttpOnly unique
(`abg_session`) signé HMAC-SHA256, portant le rôle dans son payload signé — **une seule
session à la fois par navigateur** (se connecter dans un espace écrase la session active
d'un autre). `proxy.ts` vérifie le rôle attendu à la fois pour les pages (`/secretariat/*`,
`/president/*`, `/secretaires/[role]/*`) et pour **les routes API mutantes**
(`/api/secretariat/*`, `/api/president/*`, `/api/secretaires/[role]/*`) — point de sécurité
important : la toute première version de l'espace admin (avant le système multi-rôles) ne
protégeait QUE les pages, pas les routes API de validation/rejet, qui étaient donc
appelables sans authentification. Corrigé, à ne jamais régresser. **Piège rencontré en
ajoutant les 7 espaces secrétaires** : `app/api/session/login/route.ts` avait sa propre
vérification de rôle codée en dur (`role !== "SECRETARIAT" && role !== "PRESIDENT"`),
oubliée lors du passage à un type `Role` dynamique — elle rejetait tout nouveau rôle avec
"Rôle invalide." Corrigé en la faisant utiliser `isValidRole()`. **Si un futur rôle est
ajouté et que la connexion échoue avec ce message, vérifier en premier que ce fichier
utilise bien `isValidRole()` et pas une comparaison figée.**

Chaque page de login (`app/secretariat/login`, `app/president/login`,
`app/secretaires/[role]/login`) est un **frère**, pas un enfant, du layout protégé
(`.../(protected)/layout.tsx`) — via un route group `(protected)`. Sinon la page de login
hériterait du header/logout/nav pensés pour quelqu'un déjà connecté.

## Messages du site public : Message, Doléance/Suggestion, Proposition (05/09/2026)
Un seul formulaire public, sur `/contact` (`ContactCategoryForm.tsx`), avec un sélecteur de
catégorie à 3 choix. Le routage catégorie → rôle destinataire est décidé **côté serveur**
dans `app/api/submissions/route.ts`, jamais à partir d'un champ envoyé par le client — sinon
n'importe qui pourrait faire atterrir un message dans le mauvais espace :
- `MESSAGE` (message général) → l'expéditeur **choisit lui-même le destinataire** dans un
  menu déroulant (Secrétariat Général ou l'un des 7 Secrétaires Nationaux, par nom). Le
  choix envoyé par le client (`destinataire`) est validé contre `VALID_MESSAGE_RECIPIENTS`
  (liste fermée : `SECRETARIAT` + les 7 clés de `SECRETARY_ROLE_KEYS`) avant d'être utilisé
  comme `targetRole` — le client ne peut pas envoyer un rôle arbitraire, seulement choisir
  parmi les destinataires réels.
- `DOLEANCE` (doléance ou suggestion, sous-type au choix) → toujours Secrétariat Général
  (pas de choix de destinataire — une doléance concerne l'administration du parti).
- `PROPOSITION` (projet ou partenariat, avec champ organisation) → toujours Président.

Un seul modèle Prisma `Submission` (champs `type`/`targetRole`/`sousType` génériques) sert
toutes les catégories — `targetRole` est une simple chaîne, donc router vers un nouveau
rôle (secrétaire compris) ne demande aucune migration. Statut `NOUVEAU`/`LU`/`TRAITE`,
passage automatique à `LU` à l'ouverture du détail côté destinataire.

## Module d'adhésion en ligne (ajouté le 05/09/2026)
Un visiteur peut remplir une fiche d'adhésion (`/adhesion`, avec upload photo obligatoire)
et reçoit **immédiatement** une carte provisoire PDF (statut « en attente de validation »,
QR code de vérification). C'est une carte de preuve d'enregistrement, **pas** la carte
officielle du parti. Décision explicite de Mazunda : deux cartes distinctes — la
provisoire (immédiate, générée par le site) et l'officielle (physique, remise en main
propre au secrétariat après validation manuelle du dossier — le site ne génère aucun
artefact pour celle-ci).

Workflow : soumission → statut `PENDING` → le Secrétariat consulte le dossier avec la
photo (`app/secretariat/(protected)/[id]/page.tsx`, photo lue directement depuis le disque
côté serveur, jamais exposée par une URL publique) → valide (génère un numéro
`ABG-{année}-{séquence}`) ou rejette (avec motif optionnel). Le demandeur suit son statut
sur `/adhesion/statut` avec son numéro de dossier + téléphone (pas de compte utilisateur).

**Sécurité des données personnelles** : les photos sont stockées dans `storage/photos/`
(hors de `public/`, exclu de Git) et ne sont jamais servies par une route publique — seul
le Secrétariat authentifié y accède, via un composant serveur. Le champ pièce d'identité
est optionnel (décision explicite de Mazunda). Point de vigilance signalé à Mazunda et
accepté en connaissance de cause : appartenance politique = donnée sensible, à ne jamais
traiter à la légère si ce module est un jour ouvert au public réel.

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
- **Un onglet de navigateur gardé ouvert longtemps accumule les vieilles erreurs console**
  (HMR, modules non trouvés pendant un edit en cours) qui restent visibles même après
  correction — avant de conclure à un bug réel sur un message d'erreur console, ouvrir un
  onglet neuf et revérifier.

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
`public/logo-abg.png` — détouré (fond transparent) à partir du fichier officiel fourni par
Mazunda (`~/Downloads/logo parti.jpg`, retrouvé après recherche — la première tentative de
récupération directe depuis le chat avait échoué faute d'accès disque à l'image collée).

## Notifications par e-mail (ajouté le 05/09/2026)
`lib/email.ts` — appel direct à l'API REST de Resend (pas de SDK), déclenché quand :
- une adhésion est validée ou rejetée (`app/api/secretariat/members/[id]/validate|reject`) ;
- une soumission (message/doléance/proposition) passe au statut `TRAITE`, sur les 3 routes
  de changement de statut (Secrétariat, Président, chaque Secrétaire National).

Envoyé uniquement si la personne a renseigné son e-mail (champ optionnel sur les deux
formulaires publics — beaucoup ne le rempliront pas, le téléphone étant le contact
principal en RDC). Tant que `RESEND_API_KEY`/`EMAIL_FROM` ne sont pas dans `.env` (ABG n'a
pas encore de nom de domaine à vérifier dans Resend), l'envoi échoue silencieusement
(warning console) sans jamais bloquer l'action admin elle-même. **Canal choisi par Mazunda
en connaissance de cause** : plus simple à activer aujourd'hui que SMS (compte fournisseur
à créer) ou WhatsApp (vérification Meta Business), au prix d'une portée plus faible dans le
public congolais — à revoir plus tard si besoin, `lib/email.ts` n'est pas couplé au reste.

## Reste à faire
- Contenu définitif de toutes les sections `[À COMPLÉTER]`
- Nom de domaine + déploiement (probablement Vercel, comme les autres projets de Mazunda) —
  **implique de choisir une vraie base de données de production** (SQLite ne convient pas
  à Vercel/serverless, contrairement au dev local)
- Une fois le nom de domaine choisi : le vérifier dans Resend et renseigner
  `RESEND_API_KEY`/`EMAIL_FROM` pour activer réellement les notifications e-mail
  (actuellement branchées mais silencieuses, voir section ci-dessus)
- Décider si une page "Actualités" avec vrai système de publication est nécessaire à terme
- Comptes nominatifs par personne plutôt que mot de passe partagé par poste, si Mazunda le
  demande un jour — la structure de `lib/session.ts` ne s'y oppose pas mais ce n'est pas
  construit.

## Note technique — Next.js 16
Ce projet utilise Next.js 16 (breaking changes vs versions antérieures). `next dev` régénère
automatiquement le bloc de règles agent entre les marqueurs `<!-- BEGIN:nextjs-agent-rules -->`
dans `AGENTS.md`/`CLAUDE.md` — normal, ne pas s'en inquiéter. Mais la toute première génération
(via `create-next-app`, à la fin de son `npm install`) peut **écraser entièrement** un
`CLAUDE.md` déjà présent si elle s'exécute après coup (c'est arrivé sur ce projet le
04/09/2026, l'installation ayant pris ~35 min) — toujours vérifier le contenu de CLAUDE.md
après un premier `npm install`/`next dev` sur un projet fraîchement scaffoldé avant de
continuer à s'appuyer dessus. Autre renommage de convention Next.js 16 : `middleware.ts`
est devenu `proxy.ts` (même usage, fonction exportée renommée `proxy` au lieu de
`middleware`).
