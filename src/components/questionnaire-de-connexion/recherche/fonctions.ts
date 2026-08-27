'use client';

import { TypeTerritoireRecherchable } from '@/lib/questionnaire-de-connexion/types';

/** Libellé affiché dans le champ de recherche quand le territoire est déclaré absent. */
export const LIBELLE_TERRITOIRE_ABSENT = 'Mon territoire n’apparaît pas';

export type OptionTerritoire = {
  codeCommune: string;
  codeEpci: string;
  searchCode: string;
  searchLibelle: string;
  ept: string;
  libellePetr: string;
  libellePnr: string;
  codePnr: string;
  territoireType: TypeTerritoireRecherchable;
};

export const ReplaceDisplayEpci = (libelleEpci: string) => {
  return libelleEpci
    .replace("Communauté d'agglomération", 'CA')
    .replace('Communauté de communes', 'CC')
    .replace('Communauté urbaine', 'CU');
};

export const ReplaceSearchEpci = (libelleEpci: string) => {
  return libelleEpci
    .replace('CA ', "Communauté d'agglomération ")
    .replace('CC ', 'Communauté de communes ')
    .replace('CU ', 'Communauté urbaine ');
};

export const getLibelleTerritoireAvecCode = (option: {
  territoireType: TypeTerritoireRecherchable;
  searchLibelle: string;
  searchCode: string;
}) => {
  return option.territoireType === 'commune' && option.searchCode.length !== 0
    ? `${ReplaceDisplayEpci(option.searchLibelle)} (${option.searchCode})`
    : ReplaceDisplayEpci(option.searchLibelle);
};

const ordreTypeTerritoire: Record<TypeTerritoireRecherchable, number> = {
  commune: 0,
  epci: 1,
  pnr: 2,
  petr: 3,
  departement: 4,
  region: 5
};

/** Dédoublonne puis trie : correspondance exacte, puis type, puis alphabétique. */
export const preparerOptionsTerritoires = (
  options: OptionTerritoire[],
  inputValue: string
): OptionTerritoire[] => {
  const sansDoublon = options.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.searchLibelle === value.searchLibelle &&
          t.searchCode === value.searchCode
      )
  );
  const inputNormalise = inputValue.trim().toLowerCase();

  return sansDoublon.toSorted((a, b) => {
    const aExact = a.searchLibelle.toLowerCase() === inputNormalise;
    const bExact = b.searchLibelle.toLowerCase() === inputNormalise;
    if (aExact !== bExact) return aExact ? -1 : 1;
    const ordreType =
      ordreTypeTerritoire[a.territoireType] -
      ordreTypeTerritoire[b.territoireType];
    if (ordreType !== 0) return ordreType;
    return a.searchLibelle.localeCompare(b.searchLibelle);
  });
};
