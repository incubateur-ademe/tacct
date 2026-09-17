'use server';

import {
  ArreteCatNat,
  IncendiesForet,
  RGAdb,
  SecheressesPasseesModel
} from '@/lib/postgres/models';
import { ColumnCodeCheck } from '../columns';
import { prisma } from '../db';

export const GetArretesCatnat = async (
  code: string,
  libelle: string,
  type: string
): Promise<ArreteCatNat[]> => {
  const column = ColumnCodeCheck(type);
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 7000)
  );
  const dbQuery = (async () => {
    try {
      // Fast existence check
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const exists = await prisma.databases_v2_arretes_catnat.findFirst({
        where: { [column]: type === 'petr' || type === 'ept' ? libelle : code }
      });
      if (!exists) return [];
      else {
        const value = await prisma.databases_v2_arretes_catnat.findMany({
          where: {
            [column]:
              type === 'petr' || type === 'ept'
                ? libelle
                : {
                    contains: code,
                    mode: 'insensitive'
                  }
          }
        });
        return value;
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};

export const GetIncendiesForet = async (
  code: string,
  libelle: string,
  type: string
): Promise<IncendiesForet[]> => {
  const column = ColumnCodeCheck(type);
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 2000)
  );
  const dbQuery = (async () => {
    try {
      // Fast existence check
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const exists = await prisma.databases_v2_feux_foret.findFirst({
        where: { [column]: type === 'petr' || type === 'ept' ? libelle : code }
      });
      if (!exists) return [];
      else {
        if (type === 'petr' || type === 'ept') {
          const value = await prisma.databases_v2_feux_foret.findMany({
            where: {
              [column]: libelle
            }
          });
          return value;
        } else {
          const value = await prisma.databases_v2_feux_foret.findMany({
            where: {
              [column]: {
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
      // prisma.$disconnect();
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};

export const GetRga = async (
  code: string,
  libelle: string,
  type: string
): Promise<RGAdb[]> => {
  const column = type ? ColumnCodeCheck(type) : '';
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 12000)
  );
  const dbQuery = (async () => {
    try {
      // Fast existence check
      const exists = await prisma.databases_v2_rga.findFirst({
        where: { [column]: type === 'petr' || type === 'ept' ? libelle : code }
      });
      if (
        !libelle ||
        !type ||
        (!code && type !== 'petr') ||
        libelle === 'null' ||
        (code === 'null' && type !== 'petr')
      )
        return [];
      else if (!exists) return [];
      else if (type === 'commune') {
        const value = await prisma.$queryRaw`
          SELECT *
          FROM "databases_v2"."rga"
          WHERE epci = (
            SELECT epci
            FROM "databases_v2"."rga"
            WHERE code_geographique = ${code}
            LIMIT 1
          )
        `;
        return value as RGAdb[];
      } else if (type === 'epci') {
        const value = await prisma.$queryRaw`
          SELECT *
          FROM "databases_v2"."rga"
          WHERE departement IN (
            SELECT departement
            FROM "databases_v2"."rga"
            WHERE epci = ${code}
          )
        `;
        return value as RGAdb[];
      } else {
        const value = await prisma.databases_v2_rga.findMany({
          where: {
            [column]:
              type === 'petr' || type === 'ept'
                ? libelle
                : {
                    contains: code,
                    mode: 'insensitive'
                  }
          }
        });
        return value;
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};

export const GetSecheressesPassees = async (
  code: string,
  libelle: string,
  type: string
): Promise<SecheressesPasseesModel[]> => {
  const column = ColumnCodeCheck(type);
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 2000)
  );
  const dbQuery = (async () => {
    try {
      // Fast existence check
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const exists = await prisma.secheresses.findFirst({
        where: { [column]: type === 'petr' || type === 'ept' ? libelle : code }
      });
      if (!exists) return [];
      else {
        if (type === 'petr' || type === 'ept') {
          const value = await prisma.secheresses.findMany({
            where: {
              [column]: libelle
            }
          });
          return value;
        } else {
          const value = await prisma.secheresses.findMany({
            where: {
              [column]: {
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
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};
