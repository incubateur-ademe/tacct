import { Prisma } from '@/generated/client/client';
import { createHash } from 'crypto';
import { prismaMetabase } from './db';
import { DERIVEES } from './derivees';
import { requetesComptes } from './requetes/comptes';
import { requetesContenus } from './requetes/contenus';
import { requetesNorthStar } from './requetes/northStar';
import { requetesTacctoscope } from './requetes/tacctoscope';
import { requetesTerritoires } from './requetes/territoires';
import { requetesVisiteurs } from './requetes/visiteurs';
import type { LigneBrute, ParametresRequete, Requetes, ResultatCarte, Valeur } from './types';

const REQUETES: Requetes = {
  ...requetesComptes,
  ...requetesContenus,
  ...requetesNorthStar,
  ...requetesTacctoscope,
  ...requetesTerritoires,
  ...requetesVisiteurs
};

const LIMITE_LIGNES = 2000;
const LIMITE_MEMOIRE = 50;
const DELAI_PRECALCUL = 180_000;

const normaliser = (valeur: unknown): Valeur => {
  if (valeur === null || valeur === undefined) return null;
  if (typeof valeur === 'string' || typeof valeur === 'number' || typeof valeur === 'boolean') return valeur;
  if (typeof valeur === 'bigint') return Number(valeur);
  if (valeur instanceof Date) return valeur.toISOString();
  if (Prisma.Decimal.isDecimal(valeur)) return valeur.toNumber();
  if (Array.isArray(valeur)) return valeur.map((element) => String(element)).join(', ');
  return JSON.stringify(valeur);
};

// Résultats gardés en mémoire tant que le marqueur ne change pas : une même requête SQL
// n'est exécutée qu'une fois, y compris quand plusieurs cartes la partagent.
const memoire = new Map<string, { marqueur: string; lignes: Promise<LigneBrute[]> }>();

const lancer = async (sql: Prisma.Sql, precalcul: boolean): Promise<LigneBrute[]> => {
  if (!precalcul) return prismaMetabase.$queryRaw<LigneBrute[]>(sql);
  return prismaMetabase.$transaction(
    async (tx) => {
      await tx.$queryRaw`SELECT set_config('statement_timeout', ${String(DELAI_PRECALCUL)}, true)`;
      return tx.$queryRaw<LigneBrute[]>(sql);
    },
    { maxWait: 120_000, timeout: DELAI_PRECALCUL + 10_000 }
  );
};

const executerSql = (sql: Prisma.Sql, marqueur: string, precalcul: boolean): Promise<LigneBrute[]> => {
  const cle = createHash('sha256').update(sql.text).update(JSON.stringify(sql.values)).digest('hex');
  const existante = memoire.get(cle);
  if (existante?.marqueur === marqueur) return existante.lignes;

  for (const [autre, entree] of memoire) {
    if (entree.marqueur !== marqueur) memoire.delete(autre);
  }
  const plusAncienne = memoire.keys().next().value;
  if (memoire.size >= LIMITE_MEMOIRE && plusAncienne !== undefined) memoire.delete(plusAncienne);

  const lignes = lancer(sql, precalcul);
  memoire.set(cle, { marqueur, lignes });
  lignes.catch(() => {
    if (memoire.get(cle)?.lignes === lignes) memoire.delete(cle);
  });
  return lignes;
};

const lignesBrutes = (
  id: number,
  parametres: ParametresRequete,
  marqueur: string,
  precalcul: boolean
): Promise<LigneBrute[]> => {
  if (Object.hasOwn(DERIVEES, id)) {
    const { source, transformer } = DERIVEES[id];
    return lignesBrutes(source, parametres, marqueur, precalcul).then((lignes) => transformer(lignes, parametres));
  }
  return executerSql(REQUETES[id](parametres), marqueur, precalcul);
};

export const carteExiste = (id: number): boolean => Object.hasOwn(REQUETES, id) || Object.hasOwn(DERIVEES, id);

export const executerCarte = async (
  id: number,
  parametres: ParametresRequete,
  marqueur: string,
  precalcul = false
): Promise<ResultatCarte> => {
  const brutes = await lignesBrutes(id, parametres, marqueur, precalcul);
  return {
    colonnes: brutes.length ? Object.keys(brutes[0]) : [],
    lignes: brutes
      .slice(0, LIMITE_LIGNES)
      .map((ligne) =>
        Object.fromEntries(Object.entries(ligne).map(([colonne, valeur]) => [colonne, normaliser(valeur)]))
      ),
    tronque: brutes.length > LIMITE_LIGNES
  };
};
