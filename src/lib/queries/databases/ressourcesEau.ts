'use server';

import {
  PrelevementsEau,
  PrelevementsEauModel,
  QualiteSitesBaignadeModel
} from '@/lib/postgres/models';
import { ColumnCodeCheck, ColumnLibelleCheck } from '../columns';
import { prisma } from '../db';

export const GetPrelevementsEau = async (
  code: string,
  libelle: string,
  type: string
): Promise<PrelevementsEau[]> => {
  const column = ColumnCodeCheck(type);
  //race Promise pour éviter un crash de la requête lorsqu'elle est trop longue
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 9000)
  );
  const dbQuery = (async () => {
    try {
      // Fast existence check
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const exists = await prisma.databases_v2_prelevements_eau.findFirst({
        where: { [column]: type === 'petr' || type === 'ept' ? libelle : code },
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
          return value as PrelevementsEau[];
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
          return value as PrelevementsEau[];
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
          return value as PrelevementsEau[];
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
          return value as PrelevementsEau[];
        } else if (type === 'departement') {
          console.time('Query Execution Time RESSOURCES EAUX');
          const value = await prisma.databases_v2_prelevements_eau.findMany({
            where: {
              departement: code
            }
          });
          console.timeEnd('Query Execution Time RESSOURCES EAUX');
          return value;
        } else if (type === 'pnr') {
          const value = await prisma.databases_v2_prelevements_eau.findMany({
            where: {
              libelle_pnr: {
                contains: libelle,
                mode: 'insensitive'
              }
            }
          });
          return value;
        } else return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};

export const GetPrelevementsEauNew = async (
  code: string,
  libelle: string,
  type: string
): Promise<PrelevementsEauModel[]> => {
  const column = ColumnCodeCheck(type);
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
      const exists = await prisma.prelevements_eau_new.findFirst({
        where: { [column]: type === 'petr' || type === 'ept' ? libelle : code },
        select: { departement: true }
      });
      if (!exists) return [];
      else {
        if (type === 'commune') {
          console.time('Query Execution Time PRELEVEMENT EAUX');
          const value = await prisma.$queryRaw`
          SELECT *
          FROM databases_v2.prelevements_eau_new
          WHERE departement = (
            SELECT departement
            FROM databases_v2.prelevements_eau_new
            WHERE code_geographique = ${code}
          )
        `;
          console.timeEnd('Query Execution Time PRELEVEMENT EAUX');
          return value as PrelevementsEauModel[];
        } else if (type === 'epci') {
          console.time('Query Execution Time PRELEVEMENT EAUX');
          const value = await prisma.$queryRaw`
          SELECT *
          FROM databases_v2.prelevements_eau_new
          WHERE departement IN (
            SELECT departement
            FROM databases_v2.prelevements_eau_new
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
          FROM databases_v2.prelevements_eau_new
          WHERE departement IN (
            SELECT departement
            FROM databases_v2.prelevements_eau_new
            WHERE libelle_petr = ${libelle}
          )
        `;
          console.timeEnd('Query Execution Time PRELEVEMENT EAUX');
          return value as PrelevementsEauModel[];
        } else if (type === 'ept') {
          console.time('Query Execution Time PRELEVEMENT EAUX');
          const value = await prisma.$queryRaw`
          SELECT *
          FROM databases_v2.prelevements_eau_new
          WHERE departement IN (
            SELECT departement
            FROM databases_v2.prelevements_eau_new
            WHERE ept = ${libelle}
          )
        `;
          console.timeEnd('Query Execution Time PRELEVEMENT EAUX');
          return value as PrelevementsEauModel[];
        } else if (type === 'departement') {
          console.time('Query Execution Time RESSOURCES EAUX');
          const value = await prisma.prelevements_eau_new.findMany({
            where: {
              departement: code
            }
          });
          console.timeEnd('Query Execution Time RESSOURCES EAUX');
          return value as PrelevementsEauModel[];
        } else if (type === 'pnr') {
          const value = await prisma.prelevements_eau_new.findMany({
            where: {
              libelle_pnr: {
                contains: libelle,
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

// export const GetQualiteEauxBaignade = async (
//   code: string,
//   libelle: string,
//   type: string
// ): Promise<QualiteSitesBaignade[]> => {
//   const column = ColumnLibelleCheck(type);
//   try {
//     // Fast existence check
//     if (!libelle || !type || (!code && type !== 'petr')) return [];
//     const exists = await prisma.databases_v2_collectivites_searchbar.findFirst({
//       where: { [column]: libelle }
//     });
//     if (!exists) return [];
//     else {
//       if (code === 'ZZZZZZZZZ') {
//         console.time('Query Execution Time QUALITE EAUX BAIGNADE');
//         const value = await prisma.databases_v2_qualite_sites_baignade.findMany(
//           {
//             where: {
//               OR: [
//                 { COMMUNE: "ile-d'yeu (l')" },
//                 { COMMUNE: 'ile-de-brehat' },
//                 { COMMUNE: 'ouessant' },
//                 { COMMUNE: 'ile-de-sein' }
//               ]
//             }
//           }
//         );
//         console.timeEnd('Query Execution Time QUALITE EAUX BAIGNADE');
//         return value;
//       } else {
//         console.time('Query Execution Time QUALITE EAUX BAIGNADE');
//         const departement =
//           await prisma.databases_v2_collectivites_searchbar.findMany({
//             where: {
//               AND: [
//                 {
//                   departement: { not: null }
//                 },
//                 {
//                   [column]: {
//                     contains: libelle,
//                     mode: 'insensitive'
//                   }
//                 }
//               ]
//             },
//             distinct: ['departement']
//           });
//         const value = await prisma.databases_v2_qualite_sites_baignade.findMany(
//           {
//             where: {
//               DEP_NUM: {
//                 in: departement
//                   .map((d) => d.departement)
//                   .filter((d): d is string => d !== null)
//               }
//             }
//           }
//         );
//         console.timeEnd('Query Execution Time QUALITE EAUX BAIGNADE');
//         return value;
//       }
//     }
//   } catch (error) {
//     console.error(error);
//     // prisma.$disconnect();
//     return [];
//   }
// };

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
      where: { [column]: libelle }
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
