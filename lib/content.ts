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

// Contenu réel, source = brochure officielle de présentation du parti (photos fournies
// par Mazunda le 12/09/2026 : création, devise, emblème, hymne, idéologie et programme
// en 10 axes). Texte repris fidèlement, avec un allègement éditorial minimal des tournures
// du document imprimé (pas de changement de sens).
export const missionText =
  "L'Alliance pour la Bonne Gouvernance (ABG) est une union des Congolais pour un travail de gestion saine, transparente, rationnelle et équitable des ressources et des potentialités du pays, en vue d'assurer son développement et son progrès.";

export const histoireText =
  "L'Alliance pour la Bonne Gouvernance (ABG) a été créée le 18 mars 2017 et enregistrée par l'Arrêté ministériel n° 005/2017 du 16 juin 2017. Sa devise, « Unité, Travail et Progrès », résume sa conviction fondatrice : c'est par l'unité et le travail que le pays réalisera son progrès. Son emblème reprend la carte de la République Démocratique du Congo, avec en son centre un coq blanc encadré de rouge à gauche et de bleu à droite, le tout entouré de vert. Le coq — qui veille, éveille, réveille et défend — symbolise la vigilance de l'ABG sur la bonne gouvernance du pays ; sa couleur blanche exprime la transparence, la justice et l'équité. Le rouge rappelle le sang des martyrs, le bleu la paix et l'espérance, le vert les richesses naturelles du pays. L'hymne du parti, « La Triade », appelle à l'effort commun pour bâtir le Congo, héritage des aïeux.";

export const ideologieText =
  "L'ABG se définit comme socio-libérale et démocratique : le libéralisme économique et politique en est, à ses yeux, la pierre angulaire du progrès de la République Démocratique du Congo. Sa doctrine repose sur le patriotisme, lien qui rattache chaque citoyen au territoire national et socle de la citoyenneté. Son projet de société s'articule autour de trois axes : le libre épanouissement du Congolais, la répartition équitable du revenu national et la défense de la République, et l'instauration d'une démocratie réelle et effective par la lutte contre la prédation politique et la dictature.";

export const valeurs = ["Transparence", "Justice et équité", "Patriotisme", "Progrès partagé"];

export const programme = [
  {
    titre: "Forme de l'État",
    description:
      "Un État unitaire fortement décentralisé, avec une régionalisation constitutionnelle qui encadre et revalorise les initiatives et programmes prioritaires des communautés locales.",
  },
  {
    titre: "Régime politique",
    description:
      "Un régime semi-présidentiel, avec un Parlement bicaméral (Assemblée nationale et Sénat). Le Président de la République est élu au suffrage universel direct ; le Premier ministre, issu de la majorité parlementaire, forme un Gouvernement composé de personnalités aux compétences éprouvées plutôt que de clientèle politique. Les candidatures à la Présidence et à la Primature sont soumises à des critères clairs de capacités morales, intellectuelles et professionnelles.",
  },
  {
    titre: "Sécurité publique de l'État",
    description:
      "Des services de migration et des unités des forces armées et de police (gardes-frontières) suffisants et efficaces aux frontières du pays, pour un meilleur contrôle des flux migratoires et la protection de l'intégrité territoriale ; une justice indépendante et impartiale, dotée du personnel et des moyens logistiques nécessaires ; une police et une armée nationales mieux formées et équipées, constituées en corps de métier et non en débouché pour des personnes désœuvrées ; et un cadre incitatif pour les investissements, avec un code des investissements et un code des impôts inspirés du droit comparé.",
  },
  {
    titre: "Diplomatie",
    description:
      "Une diplomatie active et efficace, portée par des diplomates avérés et dotée des moyens adéquats, avec pour mission de permettre à la République Démocratique du Congo de jouer pleinement son rôle et d'exercer son influence aux niveaux sous-régional, régional, continental et international.",
  },
  {
    titre: "Monnaie et crédits",
    description:
      "Une réforme monétaire fondée sur la production économique, avec un Franc congolais dont la parité est garantie par un travail permanent respectant les exigences opérationnelles de l'État, afin de préserver durablement son pouvoir d'achat. La mise en place d'un système de crédits favorisant la création d'entreprises par les citoyens, y compris par les familles et les groupements libres, avec des conditions adaptées pour les technocrates et techniciens, sous la surveillance de l'État.",
  },
  {
    titre: "Emploi",
    description:
      "L'incitation des investisseurs, l'appui aux entreprises et initiatives privées, la création d'entreprises publiques et la redynamisation de celles qui existent déjà, pour créer de l'emploi et réduire le chômage. La fixation d'un salaire minimum garantissant le minimum vital du travailleur, et l'application de barèmes spécifiques dans certains secteurs (enseignement, santé, recherche...) en vue de leur revalorisation.",
  },
  {
    titre: "Santé et Éducation",
    description:
      "La réhabilitation et la construction des infrastructures de santé et d'éducation, avec un approvisionnement régulier en équipements et produits adéquats, et la revalorisation des professionnels de ces deux secteurs. La lutte contre les maladies endémiques et le VIH/Sida, avec la création de mutuelles de santé en milieu rural comme urbain. La lutte contre l'analphabétisme par la gratuité de l'enseignement, la promotion de l'éducation continue pour les adultes et de l'enseignement technique et professionnel, ainsi que l'encouragement des établissements d'enseignement supérieur et universitaire privés à travers le pays.",
  },
  {
    titre: "Recherche scientifique",
    description:
      "La promotion de la recherche fondamentale et appliquée dans tous les domaines, au sein des universités, des instituts supérieurs et des centres de recherche ; la création et la réhabilitation de centres de recherche ; et l'amélioration des conditions de travail et de vie des chercheurs par des subventions.",
  },
  {
    titre: "Femme, Jeunesse et Enfant",
    description:
      "Garantir et promouvoir l'égalité et la parité entre hommes et femmes ; préserver les droits de l'enfant consacrés par la Convention relative aux droits de l'enfant ; assurer une scolarité obligatoire et gratuite pour tous les enfants ; mettre en place un cadre économique et social favorisant une participation accrue des jeunes dans la vie du pays ; et encourager les programmes d'éducation et les mouvements d'encadrement de la jeunesse.",
  },
  {
    titre: "Culture, Tourisme, Arts, Sport et Loisirs",
    description:
      "La promotion et la protection de notre culture, de nos arts et de nos artistes ; la réhabilitation et le développement des infrastructures culturelles et artistiques ; la promotion du sport de masse et l'élévation du sport d'élite au niveau professionnel ; et la mise en œuvre d'une politique de promotion touristique par la création et la revalorisation des sites, ainsi que la restauration des infrastructures adéquates.",
  },
];

export const actualitesPlaceholder =
  "[À COMPLÉTER] Aucune actualité publiée pour le moment. Cette page accueillera les communiqués, déclarations et activités du parti.";
