import { ExportCoursDeau } from '@/lib/postgres/models';
import { FiltreTerritoire } from '../columns';
import { prisma } from '../db';

export const GetExportCoursDeau = async (
  code: string,
  libelle: string,
  type: string
): Promise<ExportCoursDeau[]> => {
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 2000)
  );
  const dbQuery = (async () => {
    try {
      // Fast existence check
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const exists = await prisma.databases_v2_export_cours_d_eau.findFirst({
        where: FiltreTerritoire(type, code, libelle)
      });
      if (!exists) return [];
      else {
        const value = await prisma.databases_v2_export_cours_d_eau.findMany({
          where: FiltreTerritoire(type, code, libelle)
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
