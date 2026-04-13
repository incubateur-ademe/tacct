'use server';
import { ArboviroseModel, O3 } from '@/lib/postgres/models';
import { ColumnLibelleCheck } from '../columns';
import { prisma } from '../db';

export const GetO3 = async (): Promise<O3[]> => {
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 1500)
  );
  const dbQuery = (async () => {
    try {
      const value = await prisma.o3_seuils.findMany();
      return value;
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};

export const GetArbovirose = async (
  code: string,
  libelle: string,
  type: string
): Promise<ArboviroseModel[]> => {
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 1500)
  );
  const dbQuery = (async () => {
    const column = ColumnLibelleCheck(type);
    try {
      // Fast existence check
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const exists =
        await prisma.databases_v2_collectivites_searchbar.findFirst({
          where: { [column]: libelle }
        });
      if (!exists) return [];
      else {
        console.time('Query Execution Time ARBOVIROSE');
        const departement =
          await prisma.databases_v2_collectivites_searchbar.findMany({
            where: {
              AND: [
                {
                  departement: { not: null }
                },
                {
                  [column]: {
                    contains: libelle,
                    mode: 'insensitive'
                  }
                }
              ]
            },
            distinct: ['departement']
          });
        const value = await prisma.arbovirose.findMany({
          where: {
            departement: {
              in: departement
                .map((d) => d.departement)
                .filter((d): d is string => d !== null)
            }
          }
        });
        console.timeEnd('Query Execution Time ARBOVIROSE');
        return value;
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};

export const GetArboviroseBaseComplete = async (): Promise<
  ArboviroseModel[]
> => {
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 1500)
  );
  const dbQuery = (async () => {
    try {
      console.time('Query Execution Time ARBOVIROSE COMPLET');
      const value = await prisma.arbovirose.findMany();
      console.timeEnd('Query Execution Time ARBOVIROSE COMPLET');
      return value;
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};
