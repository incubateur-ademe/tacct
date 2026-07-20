"use client";
import { eptRegex } from '@/lib/utils/regex';
import { useRouter } from 'next/navigation';

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

export const libellesTypeTerritoire: Record<TerritoireType, string> = {
  epci: 'Intercommunalité',
  commune: 'Commune',
  petr: 'PETR',
  pnr: 'PNR',
  departement: 'Département'
};

export const getLibelleTypeTerritoire = (option: {
  territoireType: TerritoireType;
  searchLibelle: string;
}) => {
  if (option.territoireType === 'epci' && eptRegex.test(option.searchLibelle)) {
    return 'EPT';
  }
  return libellesTypeTerritoire[option.territoireType];
};

export const getLibelleTerritoireAvecCode = (option: {
  territoireType: TerritoireType;
  searchLibelle: string;
  searchCode: string;
}) => {
  return option.territoireType === 'commune' && option.searchCode.length !== 0
    ? `${ReplaceDisplayEpci(option.searchLibelle)} (${option.searchCode})`
    : ReplaceDisplayEpci(option.searchLibelle);
};

export const handleRechercheRedirection = ({
  searchCode,
  searchLibelle,
  typeTerritoire,
  router,
  page
}: {
  searchCode: string;
  searchLibelle: string;
  typeTerritoire: 'epci' | 'commune' | 'petr' | 'pnr' | 'departement';
  router: ReturnType<typeof useRouter>;
  page: string;
}) => {
  // Stocker le territoire sélectionné dans le sessionStorage
  if (typeof window !== 'undefined') {
    const territoryData = {
      code: searchCode,
      libelle: searchLibelle,
      type: typeTerritoire
    };
    sessionStorage.setItem(
      'dernierTerritoireRecherché',
      JSON.stringify(territoryData)
    );
  }

  if (typeTerritoire === 'epci' && eptRegex.test(searchLibelle)) {
    router.replace(`/${page}?code=200054781&libelle=${searchLibelle}&type=ept`);
  } else if (searchCode.length !== 0) {
    router.replace(
      `/${page}?code=${searchCode}&libelle=${searchLibelle}&type=${typeTerritoire}`
    );
  } else if (searchLibelle.length !== 0) {
    router.replace(`/${page}?libelle=${searchLibelle}&type=${typeTerritoire}`);
  }
};

export const handleChangementTerritoireRedirection = ({
  searchCode,
  searchLibelle,
  typeTerritoire,
  router,
  page,
  thematique
}: {
  searchCode: string;
  searchLibelle: string;
  typeTerritoire: 'epci' | 'commune' | 'petr' | 'pnr' | 'departement';
  router: ReturnType<typeof useRouter>;
  page: string;
  thematique?: string;
}) => {
  // Stocker le territoire sélectionné dans le sessionStorage
  if (typeof window !== 'undefined') {
    const territoryData = {
      code: searchCode,
      libelle: searchLibelle,
      type:
        typeTerritoire === 'epci' && eptRegex.test(searchLibelle)
          ? 'ept'
          : typeTerritoire,
      thematique: thematique
    };
    sessionStorage.setItem(
      'dernierTerritoireRecherché',
      JSON.stringify(territoryData)
    );
  }

  // if (typeTerritoire === 'epci' && eptRegex.test(searchLibelle)) {
  //   const url = `/${page}?code=200054781&libelle=${searchLibelle}&type=ept${thematique ? `&thematique=${thematique}` : ''}`;
  //   window.location.assign(url);
  // } else if (searchCode.length !== 0) {
  //   const url = `/${page}?code=${searchCode}&libelle=${searchLibelle}&type=${typeTerritoire}${thematique ? `&thematique=${thematique}` : ''}`;
  //   window.location.assign(url);
  // } else if (searchLibelle.length !== 0) {
  //   const url = `/${page}?libelle=${searchLibelle}&type=${typeTerritoire}${thematique ? `&thematique=${thematique}` : ''}`;
  //   window.location.assign(url);
  // }
  if (typeTerritoire === 'epci' && eptRegex.test(searchLibelle)) {
    router.replace(
      `/${page}?code=200054781&libelle=${searchLibelle}&type=ept${thematique ? `&thematique=${thematique}` : ''}`
    );
  } else if (searchCode.length !== 0) {
    router.replace(
      `/${page}?code=${searchCode}&libelle=${searchLibelle}&type=${typeTerritoire}${thematique ? `&thematique=${thematique}` : ''}`
    );
  } else if (searchLibelle.length !== 0) {
    router.replace(
      `/${page}?libelle=${searchLibelle}&type=${typeTerritoire}${thematique ? `&thematique=${thematique}` : ''}`
    );
  }
};

export const getLastTerritory = (): {
  code: string;
  libelle: string;
  type: string;
  thematique?: string;
} | null => {
  if (typeof window === 'undefined') return null;

  const stored = sessionStorage.getItem('dernierTerritoireRecherché');
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const saveThematique = (thematique: string) => {
  if (typeof window === 'undefined') return;

  const stored = sessionStorage.getItem('dernierTerritoireRecherché');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      data.thematique = thematique;
      sessionStorage.setItem(
        'dernierTerritoireRecherché',
        JSON.stringify(data)
      );
    } catch {
      // Si erreur de parsing, on ne fait rien
    }
  }
};
