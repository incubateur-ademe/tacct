'use server';

import { CollectivitesSearchbar } from '../postgres/models';
import { Commune, Departement, EPCI, PETR, PNR } from './territoiresQueries';

export const GetCollectivite = async (
  typeTerritoire: string | undefined,
  collectivite: string
): Promise<CollectivitesSearchbar[]> => {
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 1000)
  );
  const dbQuery = (async () => {
    try {
      if (typeTerritoire === 'pnr') {
        const value = await PNR(collectivite);
        return value;
      } else if (typeTerritoire === 'petr') {
        const value = await PETR(collectivite);
        return value;
      } else if (typeTerritoire === 'epci') {
        const value = await EPCI(collectivite);
        return value;
      } else if (typeTerritoire === 'commune') {
        const value = await Commune(collectivite);
        return value;
      } else if (typeTerritoire === 'departement') {
        const value = await Departement(collectivite);
        return value;
      } else {
        return [
          {
            code_geographique: '',
            search_code: '',
            search_libelle: '',
            epci: '',
            libelle_geographique: '',
            libelle_epci: '',
            departement: '',
            region: '',
            libelle_departement: '',
            ept: '',
            code_pnr: '',
            libelle_pnr: '',
            libelle_petr: '',
            coordinates: ''
          }
        ];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};
