import { Prisma } from '@/generated/client/client';
import { prisma } from '@/lib/queries/db';
import { requetesComptes } from './requetes/comptes';
import { requetesContenus } from './requetes/contenus';
import { requetesNorthStar } from './requetes/northStar';
import { requetesTacctoscope } from './requetes/tacctoscope';
import { requetesTerritoires } from './requetes/territoires';
import { requetesVisiteurs } from './requetes/visiteurs';
import type { ParametresRequete, Requetes, ResultatCarte, Valeur } from './types';

const REQUETES: Requetes = {
  ...requetesComptes,
  ...requetesContenus,
  ...requetesNorthStar,
  ...requetesTacctoscope,
  ...requetesTerritoires,
  ...requetesVisiteurs
};

const LIMITE_LIGNES = 2000;

const normaliser = (valeur: unknown): Valeur => {
  if (valeur === null || valeur === undefined) return null;
  if (typeof valeur === 'string' || typeof valeur === 'number' || typeof valeur === 'boolean') return valeur;
  if (typeof valeur === 'bigint') return Number(valeur);
  if (valeur instanceof Date) return valeur.toISOString();
  if (Prisma.Decimal.isDecimal(valeur)) return valeur.toNumber();
  if (Array.isArray(valeur)) return valeur.map((element) => String(element)).join(', ');
  return JSON.stringify(valeur);
};

export const carteExiste = (id: number): boolean => Object.hasOwn(REQUETES, id);

export const executerCarte = async (
  id: number,
  parametres: ParametresRequete
): Promise<ResultatCarte> => {
  const lignesBrutes = await prisma.$queryRaw<Record<string, unknown>[]>(REQUETES[id](parametres));
  return {
    colonnes: lignesBrutes.length ? Object.keys(lignesBrutes[0]) : [],
    lignes: lignesBrutes
      .slice(0, LIMITE_LIGNES)
      .map((ligne) =>
        Object.fromEntries(Object.entries(ligne).map(([colonne, valeur]) => [colonne, normaliser(valeur)]))
      ),
    tronque: lignesBrutes.length > LIMITE_LIGNES
  };
};
