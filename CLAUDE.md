@AGENTS.md

# CLAUDE.md — Site ABG (Alliance pour la Bonne Gouvernance)

Contexte projet, lu automatiquement par Claude Code à chaque session dans ce dossier.
Mazunda est prestataire externe pour ce site (comme pour ses clients de rédaction de TFC) —
il pilote sans coder lui-même.

## Le projet
Site vitrine pour l'ABG, parti politique congolais enregistré par l'Arrêté ministériel
n° 005/2017 du 16 juin 2017. Pas de base de données ni de compte utilisateur pour cette
première version — site multi-pages statique (Accueil, Le Parti, Direction, Programme,
Actualités, Contact).

## Stack
- Next.js (App Router) + TypeScript + Tailwind v4
- Police Manrope (cohérent avec la charte typographique des autres projets de Mazunda)
- Pas de backend — contact via `tel:`/`mailto:`, pas de formulaire avec envoi serveur

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
- Nom de domaine + déploiement (probablement Vercel, comme les autres projets de Mazunda)
- Décider si une page "Actualités" avec vrai système de publication est nécessaire à terme

## Note technique — Next.js 16
Ce projet utilise Next.js 16 (breaking changes vs versions antérieures). `next dev` régénère
automatiquement le bloc de règles agent entre les marqueurs `<!-- BEGIN:nextjs-agent-rules -->`
dans `AGENTS.md`/`CLAUDE.md` — normal, ne pas s'en inquiéter. Mais la toute première génération
(via `create-next-app`, à la fin de son `npm install`) peut **écraser entièrement** un
`CLAUDE.md` déjà présent si elle s'exécute après coup (c'est arrivé sur ce projet le
04/09/2026, l'installation ayant pris ~35 min) — toujours vérifier le contenu de CLAUDE.md
après un premier `npm install`/`next dev` sur un projet fraîchement scaffoldé avant de
continuer à s'appuyer dessus.
