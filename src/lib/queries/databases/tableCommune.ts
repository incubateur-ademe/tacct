'use server';

import { TableCommuneModel } from '@/lib/postgres/models';
import { ColumnCodeCheck } from '../columns';
import { prisma } from '../db';

export const GetTablecommune = async (
  code: string,
  libelle: string,
  type: string
): Promise<TableCommuneModel[]> => {
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
      const exists = await prisma.databases_v2_table_commune.findFirst({
        where: { [column]: type === 'petr' || type === 'ept' ? libelle : code }
      });
      if (!exists) return [];
      else if (type === 'commune') {
        const value = await prisma.$queryRaw`
          SELECT a.*
          FROM databases_v2.table_commune a
          WHERE a.epci = (
            SELECT c.epci
            FROM databases_v2.collectivites_searchbar c
            WHERE c.code_geographique = ${code}
            LIMIT 1
          )
        `;
        return value as TableCommuneModel[];
      } else {
        const value = await prisma.databases_v2_table_commune.findMany({
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
        return value as TableCommuneModel[];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};
