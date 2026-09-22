'use server';

import { ConfortThermique } from '@/lib/postgres/models';
import { eptRegex } from '@/lib/utils/regex';
import { ColumnCodeCheck } from '../columns';
import { prisma } from '../db';

export const GetConfortThermique = async (
  code: string,
  libelle: string,
  type: string
): Promise<ConfortThermique[]> => {
  //race Promise pour éviter un crash de la requête lorsqu'elle est trop longue
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 3000)
  );
  const column = ColumnCodeCheck(type);
  const dbQuery = (async () => {
    try {
      // Fast existence check
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const exists = await prisma.databases_v2_confort_thermique.findFirst({
        where: { [column]: type === 'petr' || type === 'ept' ? libelle : code }
      });
      if (!exists) return [];
      else {
        if (type === 'ept' && eptRegex.test(libelle)) {
          const value = await prisma.$queryRaw`
            SELECT *
            FROM databases_v2.confort_thermique
            WHERE epci = '200054781'
          `;
          return value as ConfortThermique[];
        } else if (type === 'commune') {
          const value = await prisma.$queryRaw`
          SELECT *
          FROM databases_v2.confort_thermique
          WHERE epci = (
            SELECT epci
            FROM databases_v2.confort_thermique
            WHERE code_geographique = ${code}
            LIMIT 1
          )
        `;
          return value as ConfortThermique[];
        } else if (type === 'petr') {
          const value = await prisma.$queryRaw`
            SELECT *
            FROM databases_v2.confort_thermique
            WHERE libelle_petr = ${libelle}
          `;
          return value as ConfortThermique[];
        } else if (type === 'pnr') {
          const value = await prisma.$queryRaw`
            SELECT *
            FROM databases_v2.confort_thermique
            WHERE code_pnr LIKE '%' || ${code} || '%' 
          `;
          return value as ConfortThermique[];
        } else if (type === 'departement') {
          const value = await prisma.$queryRaw`
            SELECT *
            FROM databases_v2.confort_thermique
            WHERE departement = ${code}
          `;
          return value as ConfortThermique[];
        } else if (type === 'epci') {
          // Get tous les départements associés à l'epci
          const departements =
            await prisma.databases_v2_confort_thermique.findMany({
              select: {
                departement: true
              },
              where: {
                [column]: code
              },
              distinct: ['departement']
            });
          const value = await prisma.$queryRaw`
            SELECT *
            FROM databases_v2.confort_thermique
            WHERE departement = ANY(${departements.map((d) => d.departement) as string[]})
          `;
          return value as ConfortThermique[];
        } else return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  const result = Promise.race([dbQuery, timeoutPromise]);
  return result;
};

export const GetLczCouverture = async (
  code: string,
  libelle: string,
  type: string
): Promise<boolean> => {
  const column = ColumnCodeCheck(type);
  try {
    if (!libelle || !type || (!code && type !== 'petr')) return false;
    const exists = await prisma.databases_v2_lcz_couverture.findFirst({
      where: { [column]: type === 'petr' || type === 'ept' ? libelle : {
        contains: code,
        mode: 'insensitive'
      } }
    });
    if (exists) return true;
    else return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const GetConfortThermiqueBiodiversite = async (
  code: string,
  libelle: string,
  type: string
): Promise<Partial<ConfortThermique>[]> => {
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 3000)
  );
  const column = ColumnCodeCheck(type);
  const dbQuery = (async () => {
    try {
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const exists = await prisma.databases_v2_confort_thermique.findFirst({
        where: { [column]: type === 'petr' || type === 'ept' ? libelle : code },
        select: { code_geographique: true }
      });
      if (!exists) return [];
      else {
        if (type === 'ept' && eptRegex.test(libelle)) {
          const value = await prisma.$queryRaw`
            SELECT code_geographique, libelle_geographique, epci, libelle_epci, ept, 
                   libelle_petr, libelle_pnr, code_pnr, departement, libelle_departement,
                   clc_1_artificialise, clc_2_agricole, "clc_3_foret_semiNaturel", 
                   clc_4_humide, clc_5_eau, superf_choro
            FROM databases_v2.confort_thermique
            WHERE epci = '200054781'
          `;
          return value as Partial<ConfortThermique>[];
        } else if (type === 'commune') {
          const value = await prisma.$queryRaw`
            SELECT code_geographique, libelle_geographique, epci, libelle_epci, ept, 
                   libelle_petr, libelle_pnr, code_pnr, departement, libelle_departement,
                   clc_1_artificialise, clc_2_agricole, "clc_3_foret_semiNaturel", 
                   clc_4_humide, clc_5_eau, superf_choro
            FROM databases_v2.confort_thermique
            WHERE epci = (
              SELECT epci
              FROM databases_v2.confort_thermique
              WHERE code_geographique = ${code}
              LIMIT 1
            )
          `;
          return value as Partial<ConfortThermique>[];
        } else if (type === 'petr') {
          const value = await prisma.$queryRaw`
            SELECT code_geographique, libelle_geographique, epci, libelle_epci, ept, 
                   libelle_petr, libelle_pnr, code_pnr, departement, libelle_departement,
                   clc_1_artificialise, clc_2_agricole, "clc_3_foret_semiNaturel", 
                   clc_4_humide, clc_5_eau, superf_choro
            FROM databases_v2.confort_thermique
            WHERE libelle_petr = ${libelle}
          `;
          return value as Partial<ConfortThermique>[];
        } else if (type === 'pnr') {
          const value = await prisma.$queryRaw`
            SELECT code_geographique, libelle_geographique, epci, libelle_epci, ept, 
                   libelle_petr, libelle_pnr, code_pnr, departement, libelle_departement,
                   clc_1_artificialise, clc_2_agricole, "clc_3_foret_semiNaturel", 
                   clc_4_humide, clc_5_eau, superf_choro
            FROM databases_v2.confort_thermique
            WHERE code_pnr LIKE '%' || ${code} || '%'
          `;
          return value as Partial<ConfortThermique>[];
        } else if (type === 'departement') {
          const value = await prisma.$queryRaw`
            SELECT code_geographique, libelle_geographique, epci, libelle_epci, ept, 
                   libelle_petr, libelle_pnr, code_pnr, departement, libelle_departement,
                   clc_1_artificialise, clc_2_agricole, "clc_3_foret_semiNaturel", 
                   clc_4_humide, clc_5_eau, superf_choro
            FROM databases_v2.confort_thermique
            WHERE departement = ${code}
          `;
          return value as Partial<ConfortThermique>[];
        } else if (type === 'epci') {
          const departements =
            await prisma.databases_v2_confort_thermique.findMany({
              select: { departement: true },
              where: { [column]: code },
              distinct: ['departement']
            });
          const value = await prisma.$queryRaw`
            SELECT code_geographique, libelle_geographique, epci, libelle_epci, ept, 
                   libelle_petr, libelle_pnr, code_pnr, departement, libelle_departement,
                   clc_1_artificialise, clc_2_agricole, "clc_3_foret_semiNaturel", 
                   clc_4_humide, clc_5_eau, superf_choro
            FROM databases_v2.confort_thermique
            WHERE departement = ANY(${departements.map((d) => d.departement) as string[]})
          `;
          return value as Partial<ConfortThermique>[];
        } else return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};
