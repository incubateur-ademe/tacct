'use server';
import { InondationsDebordementTerritoire } from '@/lib/postgres/models';
import { ColumnLibelleCheck } from '../columns';
import { prisma } from '../db';

export const GetInondationsDebordement = async (
  code: string,
  libelle: string,
  type: string
): Promise<InondationsDebordementTerritoire | null> => {
  const timeoutPromise = new Promise<null>((resolve) =>
    setTimeout(() => {
      resolve(null);
    }, 2000)
  );
  const dbQuery = (async () => {
    try {
      if (!libelle || !type || (!code && type !== 'petr')) return null;
      const communes = await prisma.databases_v2_table_commune.findMany({
        select: { epci: true, departement: true },
        where:
          type === 'commune'
            ? { code_geographique: code }
            : { [ColumnLibelleCheck(type)]: libelle }
      });
      if (!communes.length) return null;
      // Un territoire peut couvrir plusieurs EPCI : on affiche celui qui y compte le plus de communes
      const nombreCommunesParEpci = communes.reduce<Record<string, number>>(
        (acc, commune) => {
          acc[commune.epci] = (acc[commune.epci] ?? 0) + 1;
          return acc;
        },
        {}
      );
      const codesEpci = Object.keys(nombreCommunesParEpci);
      const epciAffiche = codesEpci.reduce((a, b) =>
        nombreCommunesParEpci[b] > nombreCommunesParEpci[a] ? b : a
      );
      const donnees = await prisma.inondations_par_debordement.findMany({
        where: { epci: { in: codesEpci } }
      });
      return {
        epciAffiche,
        departementEpciAffiche:
          communes.find((commune) => commune.epci === epciAffiche)
            ?.departement ?? '',
        nombreEpci: codesEpci.length,
        donnees
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  })();
  return Promise.race([dbQuery, timeoutPromise]);
};
