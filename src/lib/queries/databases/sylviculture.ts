'use server';
import {
  EmploisSylvicultureModel,
  ForetsCommunalesModel
} from '@/lib/postgres/models';
import { FiltreTerritoire } from '../columns';
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
        where: FiltreTerritoire(type, code, libelle)
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};

export const GetEmploisSylviculture = async (
  code: string,
  libelle: string,
  type: string
): Promise<EmploisSylvicultureModel[]> => {
  const timeoutPromise = new Promise<EmploisSylvicultureModel[]>((resolve) =>
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
        postes_sylviculture: true,
        postes_travail_bois: true,
        postes_total: true
      };
      // Donnée peu fiable à l'échelle communale : pour une commune, on affiche son EPCI
      if (type === 'commune') {
        const commune = await prisma.emplois_sylviculture.findFirst({
          select: { epci: true },
          where: { code_geographique: code }
        });
        if (!commune) return [];
        return await prisma.emplois_sylviculture.findMany({
          select,
          where:
            commune.epci === 'ZZZZZZZZZ'
              ? { code_geographique: code }
              : { epci: commune.epci }
        });
      }
      return await prisma.emplois_sylviculture.findMany({
        select,
        where: FiltreTerritoire(type, code, libelle)
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};
