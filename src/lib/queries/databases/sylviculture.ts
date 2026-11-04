'use server';
import { ForetsCommunalesModel } from '@/lib/postgres/models';
import { ColumnCodeCheck } from '../columns';
import { prisma } from '../db';

export const GetForetsCommunales = async (
  code: string,
  libelle: string,
  type: string
): Promise<ForetsCommunalesModel[]> => {
  const timeoutPromise = new Promise<ForetsCommunalesModel[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 2000)
  );
  const dbQuery = (async () => {
    try {
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      const select = {
        code_geographique: true,
        libelle_geographique: true,
        epci: true,
        libelle_epci: true,
        surface_foret_possedee_ha: true,
        surface_foret_possedee_sur_territoire_ha: true
      };
      // Pour une commune, la carte affiche toutes les communes de son EPCI
      if (type === 'commune') {
        const commune = await prisma.forets_communales.findFirst({
          select: { epci: true },
          where: { code_geographique: code }
        });
        if (!commune) return [];
        return await prisma.forets_communales.findMany({
          select,
          where: { epci: commune.epci }
        });
      }
      return await prisma.forets_communales.findMany({
        select,
        where: {
          [ColumnCodeCheck(type)]:
            type === 'petr' || type === 'ept' ? libelle : code
        }
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};
