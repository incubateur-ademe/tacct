'use server';
import {
  AgricultureBio,
  AOT40,
  AtlasBiodiversiteModel,
  ConsommationNAF
} from '@/lib/postgres/models';
import { eptRegex } from '@/lib/utils/regex';
import { ColumnCodeCheck, ColumnLibelleCheck } from '../columns';
import { prisma } from '../db';

export const GetAgricultureBio = async (
  libelle: string,
  type: string,
  code: string
): Promise<AgricultureBio[]> => {
  const column = ColumnLibelleCheck(type);
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 2000)
  );
  const dbQuery = (async () => {
    try {
      // Fast existence check
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const exists =
        await prisma.databases_v2_collectivites_searchbar.findFirst({
          where: { [column]: libelle }
        });
      if (!exists) return [];
      else {
        if (type === 'commune') {
          const epci =
            await prisma.databases_v2_collectivites_searchbar.findFirst({
              select: {
                epci: true
              },
              where: {
                code_geographique: code
              }
            });
          const value = await prisma.databases_v2_agriculture_bio.findMany({
            where: {
              epci: epci?.epci as string
            }
          });
          return value as AgricultureBio[];
        } else {
          const territoire =
            await prisma.databases_v2_collectivites_searchbar.findMany({
              select: {
                epci: true
              },
              where: {
                AND: [
                  {
                    epci: { not: null }
                  },
                  {
                    [column]: libelle
                  }
                ]
              },
              distinct: ['epci']
            });
          const value = await prisma.databases_v2_agriculture_bio.findMany({
            where: {
              epci: {
                in: territoire.map((t) => t.epci) as string[]
              }
            }
          });
          return value as AgricultureBio[];
        }
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};

export const GetConsommationNAF = async (
  code: string,
  libelle: string,
  type: string
): Promise<ConsommationNAF[]> => {
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 3000)
  );
  const column = ColumnCodeCheck(type);
  const dbQuery = (async () => {
    try {
      console.time('Query Execution Time NAF');
      // Fast existence check
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const exists =
        await prisma.databases_v2_consommation_espaces_naf.findFirst({
          where: {
            [column]: type === 'petr' || type === 'ept' ? libelle : code
          }
        });
      if (!exists) return [];
      else {
        if (type === 'petr' || eptRegex.test(libelle)) {
          const value =
            await prisma.databases_v2_consommation_espaces_naf.findMany({
              where: {
                [type === 'petr' ? 'libelle_petr' : 'ept']: libelle
              }
            });
          return value;
        } else if (type === 'commune') {
          // Pour diminuer le cache, sous-requête en SQL pour récupérer l'epci
          const value = await prisma.$queryRaw`
          SELECT c.*
          FROM databases_v2.consommation_espaces_naf c
          WHERE c.epci = (
            SELECT cs.epci
            FROM databases_v2.collectivites_searchbar cs
            WHERE cs.code_geographique = ${code}
            LIMIT 1
          )
        `;
          return value as ConsommationNAF[];
        } else {
          const value =
            await prisma.databases_v2_consommation_espaces_naf.findMany({
              where: {
                [type === 'epci'
                  ? 'epci'
                  : type === 'pnr'
                    ? 'code_pnr'
                    : type === 'departement'
                      ? 'departement'
                      : '']: {
                  contains: code,
                  mode: 'insensitive'
                }
              }
            });
          return value;
        }
      }
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      console.timeEnd('Query Execution Time NAF');
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};

export const GetAOT40 = async (): Promise<AOT40[]> => {
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 1500)
  );
  const dbQuery = (async () => {
    try {
      const value = await prisma.databases_v2_aot_40.findMany();
      return value;
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};

export const GetAtlasBiodiversite = async (
  code: string,
  libelle: string,
  type: string
): Promise<AtlasBiodiversiteModel[]> => {
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 2000)
  );
  const column = ColumnCodeCheck(type);
  const dbQuery = (async () => {
    try {
      // Fast existence check
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const exists = await prisma.databases_v2_atlas_biodiversite.findFirst({
        where: { [column]: type === 'petr' || type === 'ept' ? libelle : code }
      });
      if (!exists) return [];
      else {
        const value = await prisma.databases_v2_atlas_biodiversite.findMany({
          where: {
            AND: [
              {
                annee_debut: { not: null }
              },
              {
                [column]:
                  type === 'petr' || type === 'ept'
                    ? libelle
                    : {
                        contains: code,
                        mode: 'insensitive'
                      }
              }
            ]
          }
        });
        return value as AtlasBiodiversiteModel[];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};
