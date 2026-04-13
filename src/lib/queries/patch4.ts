'use server';

import { Patch4 } from '@/lib/postgres/models';
import { dromRegex } from '../utils/regex';
import { ColumnCodeCheck } from './columns';
import { prisma } from './db';

export const GetPatch4 = async (
  code: string,
  type: string,
  libelle?: string
): Promise<Patch4[]> => {
  const column = ColumnCodeCheck(type);
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 2000)
  );
  console.time('GetPatch4 Execution Time');
  const dbQuery = (async () => {
    try {
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const departement =
        await prisma.databases_v2_collectivites_searchbar.findFirst({
          where: {
            OR: [
              { code_geographique: code },
              { epci: code },
              { code_pnr: code },
              { libelle_petr: libelle },
              { departement: code },
              { ept: libelle }
            ],
            departement: {
              not: null
            }
          }
        });
      if (
        departement &&
        departement.departement
      ) {
        if (type === 'epci' && !dromRegex.test(departement.departement)) {
          const value = await prisma.databases_v2_patch4c.findMany({
            where: {
              code_geographique: code
            }
          });
          return value == null ? [] : (value as Patch4[]);
        } else if (type === 'ept') {
          const value = await prisma.databases_v2_patch4c.findMany({
            where: {
              code_geographique: libelle
            }
          });
          return value == null ? [] : (value as Patch4[]);
        } else {
          const listeCommunes =
            (await prisma.databases_v2_collectivites_searchbar.findMany({
              select: {
                code_geographique: true
              },
              where: {
                [column]: type === 'petr' || type === 'ept' ? libelle : code
              }
            })) as { code_geographique: string }[];

          const codesGeographiques = listeCommunes
            .map((commune) => commune.code_geographique)
            .filter((code) => code != null && code !== '');
          if (codesGeographiques.length === 0) {
            return [];
          }

          const value = await prisma.databases_v2_patch4c.findMany({
            where: {
              code_geographique: {
                in: codesGeographiques
              }
            }
          });
          return value == null ? [] : (value as Patch4[]);
        }
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  const result = (await Promise.race([dbQuery, timeoutPromise])) as Patch4[];
  console.timeEnd('GetPatch4 Execution Time');
  return result;
};
