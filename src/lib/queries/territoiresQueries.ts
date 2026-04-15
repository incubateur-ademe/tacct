import { CollectivitesSearchbar } from '../postgres/models';
import { prisma as PrismaPostgres } from './db';

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
        OR unaccent('unaccent', search_code) ILIKE unaccent('unaccent', ${startPattern})
      )
      ORDER BY
        CASE WHEN unaccent('unaccent', search_libelle) ILIKE unaccent('unaccent', ${exactPattern}) THEN 0 ELSE 1 END,
        search_libelle ASC,
        search_code ASC
      LIMIT 20;
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
        OR unaccent('unaccent', search_code) ILIKE unaccent('unaccent', ${searchPattern})
        OR unaccent('unaccent', search_code) ILIKE unaccent('unaccent', ${searchPatternSpace})
        OR unaccent('unaccent', search_code) ILIKE unaccent('unaccent', ${searchPatternDash})
      )
      ORDER BY index ASC LIMIT 20;
    `;
  return value;
};
