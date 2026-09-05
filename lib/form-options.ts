export const PROVINCES_RDC = [
  "Bas-Uélé",
  "Équateur",
  "Haut-Katanga",
  "Haut-Lomami",
  "Haut-Uélé",
  "Ituri",
  "Kasaï",
  "Kasaï-Central",
  "Kasaï-Oriental",
  "Kinshasa",
  "Kongo-Central",
  "Kwango",
  "Kwilu",
  "Lomami",
  "Lualaba",
  "Mai-Ndombe",
  "Maniema",
  "Mongala",
  "Nord-Kivu",
  "Nord-Ubangi",
  "Sankuru",
  "Sud-Kivu",
  "Sud-Ubangi",
  "Tanganyika",
  "Tshopo",
  "Tshuapa",
] as const;

export const ETATS_CIVILS = ["Célibataire", "Marié(e)", "Divorcé(e)", "Veuf/Veuve"] as const;

export const TYPES_PIECE_IDENTITE = [
  "Carte d'électeur",
  "Carte nationale d'identité",
  "Passeport",
] as const;

export const SEXES = [
  { value: "M", label: "Masculin" },
  { value: "F", label: "Féminin" },
] as const;
