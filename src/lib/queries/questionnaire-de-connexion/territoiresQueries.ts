import {
  CollectivitesSearchbar,
  CollectivitesSearchbarWithType
} from '../../postgres/models';
import { prisma as PrismaPostgres } from '../db';

// Chaque séparateur saisi devient `_` (joker LIKE d'un caractère) : c'est le seul
// moyen d'atteindre les libellés qui mélangent espaces et tirets (Le Verdon-sur-Mer),
// que les remplacements uniformes espace→tiret ou espace→virgule ne couvrent pas.
const neutraliserSeparateurs = (valeur: string) =>
  valeur.replace(/[\s,-]+/g, '_');

export const PNR = async (variableCollectivite: string) => {
  const searchPattern = variableCollectivite + '%';
  const searchPatternSpace = '% ' + variableCollectivite + '%';
  const searchPatternDash = '%-' + variableCollectivite + '%';
  const searchPatternApostrophe = "%'" + variableCollectivite + '%';
  const searchPatternSpaceReplace =
    '% ' + variableCollectivite.replace(' ', '-') + '%';
  const searchPatternDashReplace =
    '%-' + variableCollectivite.replace(' ', '-') + '%';
  const searchPatternSpaceComma =
    '% ' + variableCollectivite.replace(' ', ', ') + '%';
  const searchPatternDashComma =
    '%-' + variableCollectivite.replace(' ', ', ') + '%';
  const searchPatternSeparateurs = neutraliserSeparateurs(variableCollectivite) + '%';
  const searchPatternSpaceSeparateurs =
    '% ' + neutraliserSeparateurs(variableCollectivite) + '%';
  const searchPatternDashSeparateurs =
    '%-' + neutraliserSeparateurs(variableCollectivite) + '%';

  const value = await PrismaPostgres.$queryRaw<CollectivitesSearchbar[]>`
    SELECT 
    search_code,
    search_libelle,
    epci, 
    libelle_epci,
    libelle_geographique,
    code_geographique,
    departement,
    libelle_departement,
    region,
    ept,
    libelle_petr,
    libelle_pnr,
    code_pnr
    FROM databases_v2."collectivites_searchbar" WHERE (code_geographique IS NULL AND libelle_pnr IS NOT NULL) AND 
      (
        unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPattern})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpace})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDash})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternApostrophe})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpaceReplace})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDashReplace})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpaceComma})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDashComma})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSeparateurs})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpaceSeparateurs})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDashSeparateurs})
        OR unaccent('unaccent', search_code) ILIKE unaccent('unaccent', ${searchPattern})
        OR unaccent('unaccent', search_code) ILIKE unaccent('unaccent', ${searchPatternSpace})
        OR unaccent('unaccent', search_code) ILIKE unaccent('unaccent', ${searchPatternDash})
      )
      LIMIT 20;
    `;
  return value;
};

export const PETR = async (variableCollectivite: string) => {
  const searchPattern = variableCollectivite + '%';
  const searchPatternSpace = '% ' + variableCollectivite + '%';
  const searchPatternDash = '%-' + variableCollectivite + '%';
  const searchPatternApostrophe = "%'" + variableCollectivite + '%';
  const searchPatternSpaceReplace =
    '% ' + variableCollectivite.replace(' ', '-') + '%';
  const searchPatternDashReplace =
    '%-' + variableCollectivite.replace(' ', '-') + '%';
  const searchPatternSpaceComma =
    '% ' + variableCollectivite.replace(' ', ', ') + '%';
  const searchPatternDashComma =
    '%-' + variableCollectivite.replace(' ', ', ') + '%';
  const searchPatternSeparateurs = neutraliserSeparateurs(variableCollectivite) + '%';
  const searchPatternSpaceSeparateurs =
    '% ' + neutraliserSeparateurs(variableCollectivite) + '%';
  const searchPatternDashSeparateurs =
    '%-' + neutraliserSeparateurs(variableCollectivite) + '%';

  const value = await PrismaPostgres.$queryRaw<CollectivitesSearchbar[]>`
    SELECT 
    search_code,
    search_libelle,
    epci, 
    libelle_epci,
    libelle_geographique,
    code_geographique,
    departement,
    libelle_departement,
    region,
    ept,
    libelle_petr,
    libelle_pnr,
    code_pnr
    FROM databases_v2."collectivites_searchbar" WHERE (code_geographique IS NULL AND libelle_petr IS NOT NULL) AND 
      (
        unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPattern})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpace})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDash})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternApostrophe})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpaceReplace})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDashReplace})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpaceComma})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDashComma})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSeparateurs})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpaceSeparateurs})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDashSeparateurs})
      )
      LIMIT 20;
    `;
  return value;
};

export const EPCI = async (variableCollectivite: string) => {
  const searchPattern = variableCollectivite + '%';
  const searchPatternSpace = '% ' + variableCollectivite + '%';
  const searchPatternDash = '%-' + variableCollectivite + '%';
  const searchPatternApostrophe = "%'" + variableCollectivite + '%';
  const searchPatternSpaceReplace =
    '% ' + variableCollectivite.replace(' ', '-') + '%';
  const searchPatternDashReplace =
    '%-' + variableCollectivite.replace(' ', '-') + '%';
  const searchPatternSpaceComma =
    '% ' + variableCollectivite.replace(' ', ', ') + '%';
  const searchPatternDashComma =
    '%-' + variableCollectivite.replace(' ', ', ') + '%';
  const searchPatternSeparateurs = neutraliserSeparateurs(variableCollectivite) + '%';
  const searchPatternSpaceSeparateurs =
    '% ' + neutraliserSeparateurs(variableCollectivite) + '%';
  const searchPatternDashSeparateurs =
    '%-' + neutraliserSeparateurs(variableCollectivite) + '%';
  const searchPatternGuillemetsFr = '%«' + variableCollectivite + '%';

  const value = await PrismaPostgres.$queryRaw<CollectivitesSearchbar[]>`
    SELECT 
    search_code,
    search_libelle,
    epci, 
    libelle_epci,
    libelle_geographique,
    code_geographique,
    departement,
    libelle_departement,
    region,
    ept,
    libelle_petr,
    libelle_pnr,
    code_pnr
    FROM databases_v2."collectivites_searchbar" WHERE 
      (
        code_geographique IS NULL 
        AND (libelle_epci IS NOT NULL OR ept IS NOT NULL)
      ) 
      AND 
      (
        unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPattern})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpace})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDash})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternApostrophe})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpaceReplace})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDashReplace})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpaceComma})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDashComma})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSeparateurs})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpaceSeparateurs})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDashSeparateurs})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternGuillemetsFr})
        OR unaccent('unaccent', search_code) ILIKE unaccent('unaccent', ${searchPattern})
        OR unaccent('unaccent', search_code) ILIKE unaccent('unaccent', ${searchPatternSpace})
        OR unaccent('unaccent', search_code) ILIKE unaccent('unaccent', ${searchPatternDash})
      )
      ORDER BY libelle_epci ASC
      LIMIT 20;
    `;
  return value;
};

export const Commune = async (variableCollectivite: string) => {
  const exactPattern = variableCollectivite;
  const startPattern = variableCollectivite + '%';
  const startPatternDash = variableCollectivite.replace(/ /g, '-') + '%';
  const startPatternComma = variableCollectivite.replace(/ /g, ', ') + '%';
  const startPatternSeparateurs = neutraliserSeparateurs(variableCollectivite) + '%';
  const value = await PrismaPostgres.$queryRaw<CollectivitesSearchbar[]>`
    SELECT 
    search_code,
    search_libelle,
    epci, 
    libelle_epci,
    libelle_geographique,
    code_geographique,
    departement,
    libelle_departement,
    region,
    ept,
    libelle_petr,
    libelle_pnr,
    code_pnr
    FROM databases_v2."collectivites_searchbar" WHERE (code_geographique IS NOT NULL) AND 
      (
        unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${startPattern})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${startPatternDash})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${startPatternComma})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${startPatternSeparateurs})
        OR unaccent('unaccent', search_code) ILIKE unaccent('unaccent', ${startPattern})
      )
      ORDER BY
        CASE WHEN unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${exactPattern}) THEN 0 ELSE 1 END,
        search_libelle ASC,
        search_code ASC
      LIMIT 40;
    `;
  return value;
};

export const Departement = async (variableCollectivite: string) => {
  const searchPattern = variableCollectivite + '%';
  const searchPatternSpace = '% ' + variableCollectivite + '%';
  const searchPatternDash = '%-' + variableCollectivite + '%';
  const searchPatternApostrophe = "%'" + variableCollectivite + '%';
  const searchPatternSpaceReplace =
    '% ' + variableCollectivite.replace(' ', '-') + '%';
  const searchPatternDashReplace =
    '%-' + variableCollectivite.replace(' ', '-') + '%';
  const searchPatternSpaceComma =
    '% ' + variableCollectivite.replace(' ', ', ') + '%';
  const searchPatternDashComma =
    '%-' + variableCollectivite.replace(' ', ', ') + '%';
  const searchPatternSeparateurs = neutraliserSeparateurs(variableCollectivite) + '%';
  const searchPatternSpaceSeparateurs =
    '% ' + neutraliserSeparateurs(variableCollectivite) + '%';
  const searchPatternDashSeparateurs =
    '%-' + neutraliserSeparateurs(variableCollectivite) + '%';

  const value = await PrismaPostgres.$queryRaw<CollectivitesSearchbar[]>`
    SELECT 
    search_code,
    search_libelle,
    epci, 
    libelle_epci,
    libelle_geographique,
    code_geographique,
    departement,
    libelle_departement,
    region,
    ept,
    libelle_petr,
    libelle_pnr,
    code_pnr
    FROM databases_v2."collectivites_searchbar" WHERE (departement IS NOT NULL AND code_geographique IS NULL) AND 
      (
        unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPattern})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpace})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDash})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternApostrophe})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpaceReplace})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDashReplace})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpaceComma})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDashComma})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSeparateurs})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpaceSeparateurs})
        OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDashSeparateurs})
        OR unaccent('unaccent', search_code) ILIKE unaccent('unaccent', ${searchPattern})
        OR unaccent('unaccent', search_code) ILIKE unaccent('unaccent', ${searchPatternSpace})
        OR unaccent('unaccent', search_code) ILIKE unaccent('unaccent', ${searchPatternDash})
      )
      ORDER BY index ASC LIMIT 20;
    `;
  return value;
};

// Recherche tous types de territoires confondus, sur search_libelle uniquement.
// Communes : uniquement en début du libellé complet (comme Commune()).
// Autres types : en début de mot, comme avant (espace/tiret/apostrophe).
export const AllTerritoires = async (variableCollectivite: string) => {
  const exactPattern = variableCollectivite;

  const communeStartPattern = variableCollectivite + '%';
  const communeStartPatternDash = variableCollectivite.replace(/ /g, '-') + '%';
  const communeStartPatternComma = variableCollectivite.replace(/ /g, ', ') + '%';
  const communeStartPatternSeparateurs =
    neutraliserSeparateurs(variableCollectivite) + '%';

  const searchPattern = variableCollectivite + '%';
  const searchPatternSpace = '% ' + variableCollectivite + '%';
  const searchPatternDash = '%-' + variableCollectivite + '%';
  const searchPatternApostrophe = "%'" + variableCollectivite + '%';
  const searchPatternSpaceReplace =
    '% ' + variableCollectivite.replace(' ', '-') + '%';
  const searchPatternDashReplace =
    '%-' + variableCollectivite.replace(' ', '-') + '%';
  const searchPatternSpaceComma =
    '% ' + variableCollectivite.replace(' ', ', ') + '%';
  const searchPatternDashComma =
    '%-' + variableCollectivite.replace(' ', ', ') + '%';
  const searchPatternSeparateurs = neutraliserSeparateurs(variableCollectivite) + '%';
  const searchPatternSpaceSeparateurs =
    '% ' + neutraliserSeparateurs(variableCollectivite) + '%';
  const searchPatternDashSeparateurs =
    '%-' + neutraliserSeparateurs(variableCollectivite) + '%';

  const value = await PrismaPostgres.$queryRaw<CollectivitesSearchbarWithType[]>`
    SELECT
    search_code,
    search_libelle,
    epci,
    libelle_epci,
    libelle_geographique,
    code_geographique,
    departement,
    libelle_departement,
    region,
    ept,
    libelle_petr,
    libelle_pnr,
    code_pnr,
    CASE
      WHEN code_geographique IS NOT NULL THEN 'commune'
      WHEN libelle_pnr IS NOT NULL THEN 'pnr'
      WHEN libelle_petr IS NOT NULL THEN 'petr'
      WHEN libelle_epci IS NOT NULL OR ept IS NOT NULL THEN 'epci'
      ELSE 'departement'
    END AS territoire_type
    FROM databases_v2."collectivites_searchbar" WHERE
      (
        (
          code_geographique IS NOT NULL
          AND (
            unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${communeStartPattern})
            OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${communeStartPatternDash})
            OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${communeStartPatternComma})
            OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${communeStartPatternSeparateurs})
            OR unaccent('unaccent', search_code) ILIKE unaccent('unaccent', ${communeStartPattern})
          )
        )
        OR
        (
          code_geographique IS NULL
          AND (
            libelle_pnr IS NOT NULL
            OR libelle_petr IS NOT NULL
            OR libelle_epci IS NOT NULL
            OR ept IS NOT NULL
            OR departement IS NOT NULL
          )
          AND (
            unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPattern})
            OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpace})
            OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDash})
            OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternApostrophe})
            OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpaceReplace})
            OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDashReplace})
            OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpaceComma})
            OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDashComma})
            OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSeparateurs})
            OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternSpaceSeparateurs})
            OR unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPatternDashSeparateurs})
          )
        )
      )
      ORDER BY
        CASE
          WHEN unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${exactPattern}) THEN 0
          WHEN unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${searchPattern}) THEN 1
          ELSE 2
        END,
        search_libelle ASC
      LIMIT 40;
    `;
  return value;
};
