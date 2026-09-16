export const PROFILS = [
  { value: 'cdm', label: 'Chargé·e de mission en collectivité' },
  { value: 'elu', label: 'Élu·e d’une collectivité' },
  { value: 'responsable', label: 'Responsable en collectivité' },
  { value: 'be', label: 'Bureau d’études' },
  { value: 'entreprise', label: 'Entreprise' },
  { value: 'admin', label: 'Administration centrale' },
  { value: 'etat', label: 'DDT/DDTM/DREAL' },
  { value: 'autre', label: 'Autre' }
] as const;

export type Profil = (typeof PROFILS)[number]['value'];

export type TypeTerritoireRecherchable =
  | 'epci'
  | 'commune'
  | 'petr'
  | 'pnr'
  | 'departement'
  | 'region';

export const TYPES_TERRITOIRE = [
  { value: 'epci', label: 'EPCI/EPT', recherche: 'epci' },
  { value: 'commune', label: 'Commune', recherche: 'commune' },
  { value: 'departement', label: 'Département', recherche: 'departement' },
  { value: 'pole', label: 'Pôle métropolitain', recherche: null },
  { value: 'region', label: 'Région', recherche: 'region', sautDeLigne: true },
  { value: 'pnr', label: 'PNR', recherche: 'pnr' },
  { value: 'parcnational', label: 'Parc national', recherche: null },
  { value: 'petr', label: 'PETR', recherche: 'petr' },
  { value: 'pays', label: 'Pays', recherche: null },
  { value: 'scot', label: 'SCoT', recherche: null, sautDeLigne: true },
  { value: 'autre', label: 'Autre', recherche: null }
] as const satisfies readonly {
  value: string;
  label: string;
  recherche: TypeTerritoireRecherchable | null;
  sautDeLigne?: boolean;
}[];

export type TypeTerritoire = (typeof TYPES_TERRITOIRE)[number]['value'];

export type OptionTypeTerritoire = (typeof TYPES_TERRITOIRE)[number];

export const BESOINS = [
  { value: 'data', label: 'Accéder à des données fiables sur mon territoire' },
  { value: 'mobiliser', label: 'Mobiliser les acteurs de mon territoire' },
  { value: 'diagnostic', label: 'Réviser le diagnostic de vulnérabilité' },
  { value: 'method', label: 'Structurer ma démarche d’adaptation' },
  { value: 'inspire', label: 'M’inspirer de retours d’expérience' },
  {
    value: 'competences',
    label: 'Monter en compétences sur l’adaptation au changement climatique'
  },
  {
    value: 'ressources',
    label: 'Trouver des ressources pour mener mes entretiens ou ateliers'
  },
  { value: 'autre', label: 'Autre' }
] as const;

export type Besoin = (typeof BESOINS)[number]['value'];

export const NOMBRE_BESOINS = 3;

export type EtapeQuestionnaire = 'profil' | 'territoire' | 'besoins' | 'beta';

export interface EtatQuestionnaire {
  profil: Profil | null;
  profilAutre: string;
  typeTerritoire: TypeTerritoire | null;
  territoireCode: string;
  territoireLibelle: string;
  territoireAutre: string;
  besoins: Besoin[];
  besoinAutre: string;
  optInBeta: boolean;
  emailRecontact: string;
}

export const ETAT_INITIAL: EtatQuestionnaire = {
  profil: null,
  profilAutre: '',
  typeTerritoire: null,
  territoireCode: '',
  territoireLibelle: '',
  territoireAutre: '',
  besoins: [],
  besoinAutre: '',
  optInBeta: false,
  emailRecontact: ''
};

const PROFILS_AVEC_TERRITOIRE: readonly Profil[] = [
  'cdm',
  'elu',
  'responsable',
  'etat'
];
const PROFILS_AVEC_BETA: readonly Profil[] = ['cdm', 'responsable', 'be'];

const TYPES_TERRITOIRE_ETAT: readonly TypeTerritoire[] = [
  'departement',
  'region'
];

export const estProfil = (valeur: string): valeur is Profil =>
  PROFILS.some((profil) => profil.value === valeur);

export const estTypeTerritoire = (valeur: string): valeur is TypeTerritoire =>
  TYPES_TERRITOIRE.some((type) => type.value === valeur);

export const estBesoin = (valeur: string): valeur is Besoin =>
  BESOINS.some((besoin) => besoin.value === valeur);

export const rechercheDuType = (
  type: TypeTerritoire | null
): TypeTerritoireRecherchable | null =>
  TYPES_TERRITOIRE.find((option) => option.value === type)?.recherche ?? null;

export const typesTerritoirePourProfil = (
  profil: Profil | null
): readonly OptionTypeTerritoire[] =>
  profil === 'etat'
    ? TYPES_TERRITOIRE.filter((option) =>
        TYPES_TERRITOIRE_ETAT.includes(option.value)
      )
    : TYPES_TERRITOIRE;

export const typeTerritoireAutorise = (
  profil: Profil | null,
  type: TypeTerritoire
): boolean =>
  typesTerritoirePourProfil(profil).some((option) => option.value === type);

export const sequenceQuestions = (
  profil: Profil | null
): EtapeQuestionnaire[] => {
  const etapes: EtapeQuestionnaire[] = ['profil'];
  if (profil && PROFILS_AVEC_TERRITOIRE.includes(profil)) {
    etapes.push('territoire');
  }
  etapes.push('besoins');
  if (profil && PROFILS_AVEC_BETA.includes(profil)) {
    etapes.push('beta');
  }
  return etapes;
};

export const derniereEtape = (profil: Profil | null): EtapeQuestionnaire => {
  const sequence = sequenceQuestions(profil);
  return sequence[sequence.length - 1];
};

export const profilComplet = (etat: EtatQuestionnaire): boolean => {
  if (!etat.profil) return false;
  return etat.profil !== 'autre' || etat.profilAutre.trim().length > 0;
};

export const territoireComplet = (etat: EtatQuestionnaire): boolean => {
  if (!etat.typeTerritoire) return false;
  if (rechercheDuType(etat.typeTerritoire)) {
    return (
      etat.territoireLibelle.length > 0 ||
      etat.territoireAutre.trim().length > 0
    );
  }
  return etat.territoireAutre.trim().length > 0;
};

export const besoinsComplets = (etat: EtatQuestionnaire): boolean => {
  if (etat.besoins.length !== NOMBRE_BESOINS) return false;
  return !etat.besoins.includes('autre') || etat.besoinAutre.trim().length > 0;
};

/**
 * La Q4 est facultative : « répondu non » et « pas encore vue » ne se distinguent
 * pas en base. C'est `questionnaire_validated` qui tranche, donc une séquence dont
 * tout le reste est rempli reprend forcément sur sa dernière étape.
 */
export const etapeDeReprise = (etat: EtatQuestionnaire): EtapeQuestionnaire => {
  if (!profilComplet(etat)) return 'profil';
  const sequence = sequenceQuestions(etat.profil);
  if (sequence.includes('territoire') && !territoireComplet(etat)) {
    return 'territoire';
  }
  if (!besoinsComplets(etat)) return 'besoins';
  return sequence[sequence.length - 1];
};

export const reponsesObligatoiresCompletes = (
  etat: EtatQuestionnaire
): boolean => {
  if (!profilComplet(etat)) return false;
  const sequence = sequenceQuestions(etat.profil);
  if (sequence.includes('territoire') && !territoireComplet(etat)) return false;
  return besoinsComplets(etat);
};
