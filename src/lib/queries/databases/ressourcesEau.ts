'use server';

import {
  PrelevementsEauModel,
  QualiteSitesBaignadeModel
} from '@/lib/postgres/models';
import { ColumnLibelleCheck, FiltreTerritoire } from '../columns';
import { prisma } from '../db';

export const GetPrelevementsEau = async (
  code: string,
  libelle: string,
  type: string
): Promise<PrelevementsEauModel[]> => {
  //race Promise pour éviter un crash de la requête lorsqu'elle est trop longue
  const timeoutPromise = new Promise<PrelevementsEauModel[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 6000)
  );
  const dbQuery = (async () => {
    try {
      // Fast existence check
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const exists = await prisma.prelevements_eau.findFirst({
        where: FiltreTerritoire(type, code, libelle),
        select: { departement: true }
      });
      if (!exists) return [];
      else {
        if (type === 'commune') {
          console.time('Query Execution Time PRELEVEMENT EAUX');
          const value = await prisma.$queryRaw`
          SELECT *
          FROM databases_v2.prelevements_eau
          WHERE departement = (
            SELECT departement
            FROM databases_v2.prelevements_eau
            WHERE code_geographique = ${code}
          )
        `;
          console.timeEnd('Query Execution Time PRELEVEMENT EAUX');
          return value as PrelevementsEauModel[];
        } else if (type === 'epci') {
          console.time('Query Execution Time PRELEVEMENT EAUX');
          const value = await prisma.$queryRaw`
          SELECT *
          FROM databases_v2.prelevements_eau
          WHERE departement IN (
            SELECT departement
            FROM databases_v2.prelevements_eau
            WHERE epci = ${code}
          )
        `;
          console.timeEnd('Query Execution Time PRELEVEMENT EAUX');
          return value as PrelevementsEauModel[];
        } else if (type === 'petr') {
          console.time('Query Execution Time PRELEVEMENT EAUX');
          // await prisma.$executeRaw`SET statement_timeout = 1000;`;
          const value = await prisma.$queryRaw`
          SELECT *
          FROM databases_v2.prelevements_eau
          WHERE departement IN (
            SELECT departement
            FROM databases_v2.prelevements_eau
            WHERE libelle_petr = ${libelle}
          )
        `;
          console.timeEnd('Query Execution Time PRELEVEMENT EAUX');
          return value as PrelevementsEauModel[];
        } else if (type === 'ept') {
          console.time('Query Execution Time PRELEVEMENT EAUX');
          const value = await prisma.$queryRaw`
          SELECT *
          FROM databases_v2.prelevements_eau
          WHERE departement IN (
            SELECT departement
            FROM databases_v2.prelevements_eau
            WHERE ept = ${libelle}
          )
        `;
          console.timeEnd('Query Execution Time PRELEVEMENT EAUX');
          return value as PrelevementsEauModel[];
        } else if (type === 'polem') {
          console.time('Query Execution Time PRELEVEMENT EAUX');
          const value = await prisma.$queryRaw`
          SELECT *
          FROM databases_v2.prelevements_eau
          WHERE departement IN (
            SELECT departement
            FROM databases_v2.prelevements_eau
            WHERE code_polem @> ARRAY[${code}]::text[]
          )
        `;
          console.timeEnd('Query Execution Time PRELEVEMENT EAUX');
          return value as PrelevementsEauModel[];
        } else if (type === 'departement') {
          console.time('Query Execution Time RESSOURCES EAUX');
          const value = await prisma.prelevements_eau.findMany({
            where: {
              departement: code
            }
          });
          console.timeEnd('Query Execution Time RESSOURCES EAUX');
          return value as PrelevementsEauModel[];
        } else if (type === 'pnr') {
          const value = await prisma.prelevements_eau.findMany({
            where: {
              code_pnr: {
                contains: code,
                mode: 'insensitive'
              }
            }
          });
          return value as PrelevementsEauModel[];
        } else return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};

export const GetQualiteEauxBaignade = async (
  code: string,
  libelle: string,
  type: string
): Promise<QualiteSitesBaignadeModel[]> => {
  const column = ColumnLibelleCheck(type);
  try {
    // Fast existence check
    if (!libelle || !type || (!code && type !== 'petr')) return [];
    const exists = await prisma.databases_v2_collectivites_searchbar.findFirst({
      where:
        type === 'polem'
          ? FiltreTerritoire(type, code, libelle)
          : { [column]: libelle }
    });
    if (!exists) return [];
    else {
      console.time('Query Execution Time QUALITE EAUX BAIGNADE');
      const departement =
        await prisma.databases_v2_collectivites_searchbar.findMany({
          where: {
            AND: [
              {
                departement: { not: null }
              },
              type === 'polem'
                ? FiltreTerritoire(type, code, libelle)
                : {
                    [column]: {
                      contains: libelle,
                      mode: 'insensitive'
                    }
                  }
            ]
          },
          distinct: ['departement']
        });
      const value = await prisma.databases_v2_qualite_sites_baignade.findMany({
        where: {
          departement: {
            in: departement
              .map((d) => d.departement)
              .filter((d): d is string => d !== null)
          }
        }
      });
      console.timeEnd('Query Execution Time QUALITE EAUX BAIGNADE');
      return value;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};
