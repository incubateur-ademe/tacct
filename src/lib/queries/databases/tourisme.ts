'use server';
import type { Prisma } from '@/generated/client/client';
import { StationSki, StationsSkiModel } from '@/lib/postgres/models';
import { parsePostgresArray } from '@/lib/utils/reusableFunctions/parsePostgresArray';
import { ColumnCodeCheck } from '../columns';
import { prisma } from '../db';

type StationsSkiLigne = {
  code_geographique: string;
  stations_id: string;
  stations_nom: string;
  stations_moment_puissance: string;
  stations_taille: string;
  stations_age_parc: string;
};

const versStations = (ligne: StationsSkiLigne): StationSki[] => {
  const noms = parsePostgresArray(ligne.stations_nom);
  const momentsPuissance = parsePostgresArray(ligne.stations_moment_puissance);
  const tailles = parsePostgresArray(ligne.stations_taille);
  const ages = parsePostgresArray(ligne.stations_age_parc);
  return parsePostgresArray(ligne.stations_id).map((id, i) => ({
    id,
    nom: noms[i],
    momentPuissance: Number(momentsPuissance[i]),
    taille: tailles[i],
    ageParc: Number(ages[i])
  }));
};

export const GetStationsSki = async (
  code: string,
  libelle: string,
  type: string
): Promise<StationsSkiModel[]> => {
  const timeoutPromise = new Promise<StationsSkiModel[]>((resolve) =>
    setTimeout(() => {
      resolve([]);
    }, 2000)
  );
  const dbQuery = (async () => {
    try {
      if (!libelle || !type || (!code && type !== 'petr')) return [];
      let where: Prisma.postgis_v2_communes_dromWhereInput;
      if (type === 'commune') {
        const commune = await prisma.postgis_v2_communes_drom.findFirst({
          select: { epci: true },
          where: { code_geographique: code }
        });
        if (!commune?.epci) return [];
        where = { epci: commune.epci };
      } else if (type === 'pnr') {
        where = { code_pnr: { contains: code } };
      } else {
        where = {
          [ColumnCodeCheck(type)]:
            type === 'petr' || type === 'ept' ? libelle : code
        };
      }
      const communes = await prisma.postgis_v2_communes_drom.findMany({
        select: {
          code_geographique: true,
          libelle_geographique: true,
          epci: true,
          libelle_epci: true
        },
        where
      });
      const codes = communes
        .map((c) => c.code_geographique)
        .filter((c): c is string => c !== null);
      const lignes = await prisma.stations_ski.findMany({
        select: {
          code_geographique: true,
          stations_id: true,
          stations_nom: true,
          stations_moment_puissance: true,
          stations_taille: true,
          stations_age_parc: true
        },
        where: { code_geographique: { in: codes } }
      });
      if (!lignes.length) return [];
      const stationsParCommune = new Map(
        lignes.map((ligne) => [ligne.code_geographique, versStations(ligne)])
      );
      return communes
        .filter((c): c is typeof c & { code_geographique: string } => c.code_geographique !== null)
        .map((c) => ({
          code_geographique: c.code_geographique,
          libelle_geographique: c.libelle_geographique ?? '',
          epci: c.epci ?? '',
          libelle_epci: c.libelle_epci ?? '',
          stations: stationsParCommune.get(c.code_geographique) ?? []
        }));
    } catch (error) {
      console.error(error);
      return [];
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};
