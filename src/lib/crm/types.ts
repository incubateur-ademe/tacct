export const CRM_REGIONS = [
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Guadeloupe',
  'Guyane',
  'Hauts-de-France',
  'Île-de-France',
  'La Réunion',
  'Martinique',
  'Mayotte',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Nouvelle Calédonie',
  'Occitanie',
  'Pays de la Loire',
  'Polynésie française',
  "Provence-Alpes-Côte d'Azur",
  'Réunion - Mayotte',
  'Saint-Barthélemy',
  'Saint Martin',
  'Saint-Pierre-et-Miquelon',
  'Wallis-et-Futuna'
] as const;

export const CRM_TYPES_ORGANISME = [
  'ADEME',
  'Association',
  'Collectivité',
  'Entreprise',
  'Etat / Etablissement Public',
  'Laboratoire',
  'Media',
  'Organisme européen / international',
  'Particulier'
] as const;

export type CrmRegion = (typeof CRM_REGIONS)[number];
export type CrmTypeOrganisme = (typeof CRM_TYPES_ORGANISME)[number];
export type CrmTitre = 'M.' | 'Mme';

/**
 * Contrat d'écriture. `ExternalID`, `duns`, `federationId` et `ancienMail` sont
 * volontairement absents : la doc CRM impose de ne pas les remplir.
 */
export interface CrmContact {
  email: string;
  source: string;
  siret?: string;
  titre?: CrmTitre;
  nom?: string;
  prenom?: string;
  adressePostale?: string;
  complementAdresse?: string;
  cedexBP?: string;
  codePostal?: string;
  ville?: string;
  region?: CrmRegion;
  telephone?: string;
  telephonePortable?: string;
  fonction?: string;
  acceptationRGPD?: boolean;
  typeOrganisme?: CrmTypeOrganisme;
  dateCreation?: string;
  dateModification?: string;
  dateConnexion?: string;
  abonnementNewsletter?: boolean;
  dateNewsletter?: string;
  dateFinNewsletter?: string;
  actif?: boolean;
  rubriques?: string[];
}

export type CrmContactInput = Omit<CrmContact, 'source' | 'rubriques'> & {
  rubriques?: string[];
};

/** Réponse POST/PUT : confirme la mise en file, pas le traitement CRM. */
export interface CrmQueueResponse {
  correlationId: string;
  success: boolean;
  timestamp: string;
  message: string;
  mail: string;
}

/** Modèle de lecture : `source` est multivalué et les SIRET sont sous `entreprises`. */
export interface CrmContactRead {
  email: string;
  federationId?: string;
  titre?: string;
  nom?: string;
  prenom?: string;
  abonnementNewsletter?: string;
  codePostal?: string;
  ville?: string;
  region?: string;
  pays?: string;
  source?: string[];
  entreprises?: { siret: string }[];
}

export interface CrmErrorResponse {
  success: false;
  apiName: string;
  version: string;
  correlationId: string;
  timestamp: string;
  errorDetails: {
    code: number;
    error: string;
    message: string;
  };
}

export interface CrmGetResponse {
  correlationId: string;
  success: boolean;
  timestamp: string;
  message: string;
  email: string;
  contact: CrmContactRead;
}
