// Contenu du site ABG.
// Les champs marqués [À COMPLÉTER] sont des textes provisoires — à remplacer par le
// contenu officiel validé par le parti avant toute mise en ligne publique.

export const party = {
  nomComplet: "Alliance pour la Bonne Gouvernance",
  sigle: "ABG",
  devise: "Unité — Travail — Progrès",
  enregistrement:
    "Parti politique enregistré par l'Arrêté ministériel n° 005/2017 du 16 juin 2017, conformément à la loi n° 04/002 du 15 mars 2004 portant organisation et fonctionnement des partis politiques en République Démocratique du Congo.",
  siege: "136, Avenue de l'Enseignement, Quartier Salongo, Kinshasa / Kasa-Vubu",
  telephone: "+243 81 99 43 361",
  telephoneLabel: "Secrétariat Général",
  email: "contact@abg-rdc.cd",
  emailIsPlaceholder: true,
};

export const presidentNational = {
  nom: "Honorable Jonathan Bialosuka Wata",
  fonction: "Président National",
};

// Le champ `role` identifie l'espace protégé de chaque secrétaire (URL, session,
// mot de passe .env `SECRETARY_PASSWORD_<n>` selon la position dans ce tableau).
// Cinq des sept portent le même intitulé de fonction (tel que dans la Décision
// officielle) — c'est le nom, pas la fonction, qui les distingue dans les choix
// proposés à l'utilisateur.
export const secretairesNationaux = [
  {
    role: "sec-enseignement-superieur",
    nom: "Péguy Raoul Ngebas Kipoy",
    fonction: "Secrétaire National chargé de l'Enseignement Supérieur, Universitaire et de la Recherche Scientifique",
  },
  {
    role: "sec-implantation-1",
    nom: "Guillaume Nyoka Tukondukila",
    fonction: "Secrétaire National chargé de l'Implantation, de la Mobilisation et de la Propagande",
  },
  {
    role: "sec-implantation-2",
    nom: "Abraham Kasekele Lubilu",
    fonction: "Secrétaire National chargé de l'Implantation, de la Mobilisation et de la Propagande",
  },
  {
    role: "sec-implantation-3",
    nom: "Alice Lingende Isembeka",
    fonction: "Secrétaire National chargé de l'Implantation, de la Mobilisation et de la Propagande",
  },
  {
    role: "sec-implantation-4",
    nom: "Hugo Mambote Mandidi",
    fonction: "Secrétaire National chargé de l'Implantation, de la Mobilisation et de la Propagande",
  },
  {
    role: "sec-implantation-5",
    nom: "Aubin Tsela Mapasi",
    fonction: "Secrétaire National chargé de l'Implantation, de la Mobilisation et de la Propagande",
  },
  {
    role: "sec-droits-humains",
    nom: "Augustin Kabaka Kwetukwenda",
    fonction: "Secrétaire National chargé des Questions Politiques et des Droits Humains",
  },
] as const;

export type SecretaryRole = (typeof secretairesNationaux)[number]["role"];

export const SECRETARY_ROLE_KEYS: SecretaryRole[] = secretairesNationaux.map((s) => s.role);

export function findSecretary(role: string) {
  return secretairesNationaux.find((s) => s.role === role);
}

export const missionPlaceholder =
  "[À COMPLÉTER] L'Alliance pour la Bonne Gouvernance œuvre pour une gouvernance transparente, responsable et au service du peuple congolais, fondée sur l'État de droit, la justice sociale et le développement durable de la République Démocratique du Congo.";

export const histoirePlaceholder =
  "[À COMPLÉTER] L'histoire complète du parti (contexte de création, étapes marquantes, ancrage territorial) sera ajoutée ici une fois le contenu validé par la Direction Nationale.";

export const valeursPlaceholder = [
  "[À COMPLÉTER] Valeur 1 — par ex. Transparence",
  "[À COMPLÉTER] Valeur 2 — par ex. Redevabilité",
  "[À COMPLÉTER] Valeur 3 — par ex. Justice sociale",
  "[À COMPLÉTER] Valeur 4 — par ex. Unité nationale",
];

export const programmePlaceholder = [
  {
    titre: "[À COMPLÉTER] Axe prioritaire 1",
    description: "[À COMPLÉTER] Description de la priorité du programme.",
  },
  {
    titre: "[À COMPLÉTER] Axe prioritaire 2",
    description: "[À COMPLÉTER] Description de la priorité du programme.",
  },
  {
    titre: "[À COMPLÉTER] Axe prioritaire 3",
    description: "[À COMPLÉTER] Description de la priorité du programme.",
  },
];

export const actualitesPlaceholder =
  "[À COMPLÉTER] Aucune actualité publiée pour le moment. Cette page accueillera les communiqués, déclarations et activités du parti.";
