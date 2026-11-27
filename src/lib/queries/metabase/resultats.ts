import { TABLEAUX_DE_BORD } from '@/app/(main)/metabase/configuration';
import type { Bloc, BlocCarte } from '@/app/(main)/metabase/types';
import { prisma } from '@/lib/queries/db';
import { cleCarte, parametresParDefaut } from './cle';
import { executerCarte } from './executer';
import { ecrirePeriode, lirePeriode } from './periode';
import type { ParametresRequete, ResultatCarte } from './types';

type CarteParDefaut = { cle: string; carte: number; parametres: ParametresRequete };

export type BilanPrecalcul = { calculees: number; dejaAJour: number; echecs: number[] };

const cleDe = (carte: number, parametres: ParametresRequete): string =>
  cleCarte(carte, {
    periode: ecrirePeriode(parametres.periode),
    periodeEtape2: ecrirePeriode(parametres.periodeEtape2),
    granularite: parametres.granularite
  });

const estCarte = (bloc: Bloc): bloc is BlocCarte => bloc.type === 'carte';

const cartesDe = (blocs: Bloc[]): CarteParDefaut[] =>
  blocs.filter(estCarte).flatMap((bloc) => {
    const defauts = parametresParDefaut(bloc);
    const periode = lirePeriode(defauts.periode ?? null);
    const periodeEtape2 = lirePeriode(defauts.periodeEtape2 ?? null);
    if (!periode || !periodeEtape2) return [];
    const parametres = { periode, periodeEtape2, granularite: defauts.granularite };
    return [{ cle: cleDe(bloc.carte, parametres), carte: bloc.carte, parametres }];
  });

const CARTES_PAR_DEFAUT = new Map(
  TABLEAUX_DE_BORD.flatMap((tableau) => cartesDe(tableau.blocs)).map((carte) => [carte.cle, carte])
);

const estResultatCarte = (valeur: unknown): valeur is ResultatCarte =>
  typeof valeur === 'object' &&
  valeur !== null &&
  'colonnes' in valeur &&
  Array.isArray(valeur.colonnes) &&
  'lignes' in valeur &&
  Array.isArray(valeur.lignes);

// Change au passage de l'ETL et au changement de jour : un résultat enregistré
// avec un autre marqueur est périmé.
const lireMarqueur = async (): Promise<string> => {
  const [ligne] = await prisma.$queryRaw<{ marqueur: string }[]>`
    SELECT COALESCE(MAX(event_timestamp)::text, '')
           || '|' || (now() AT TIME ZONE 'Europe/Paris')::date::text AS marqueur
    FROM analytics.all_pageview_raw
  `;
  return ligne.marqueur;
};

const enregistrer = (cle: string, resultat: ResultatCarte, marqueur: string) =>
  prisma.metabase_resultats.upsert({
    where: { cle },
    create: { cle, resultat, marqueur },
    update: { resultat, marqueur, calcule_le: new Date() }
  });

export const obtenirCarte = async (id: number, parametres: ParametresRequete): Promise<ResultatCarte> => {
  const cle = cleDe(id, parametres);
  const marqueur = await lireMarqueur();
  const parDefaut = CARTES_PAR_DEFAUT.has(cle);
  if (parDefaut) {
    const ligne = await prisma.metabase_resultats.findUnique({ where: { cle } });
    if (ligne?.marqueur === marqueur && estResultatCarte(ligne.resultat)) return ligne.resultat;
  }
  const resultat = await executerCarte(id, parametres, marqueur);
  if (parDefaut) await enregistrer(cle, resultat, marqueur);
  return resultat;
};

export const lireTableau = async (id: number): Promise<Record<string, ResultatCarte> | null> => {
  const tableau = TABLEAUX_DE_BORD.find((candidat) => candidat.id === id);
  if (!tableau) return null;
  const marqueur = await lireMarqueur();
  const lignes = await prisma.metabase_resultats.findMany({
    where: { cle: { in: cartesDe(tableau.blocs).map((carte) => carte.cle) }, marqueur }
  });
  const resultats: Record<string, ResultatCarte> = {};
  for (const ligne of lignes) {
    if (estResultatCarte(ligne.resultat)) resultats[ligne.cle] = ligne.resultat;
  }
  return resultats;
};

const lancerPrecalcul = async (): Promise<BilanPrecalcul> => {
  const marqueur = await lireMarqueur();
  const aJour = new Set(
    (await prisma.metabase_resultats.findMany({ where: { marqueur }, select: { cle: true } })).map(
      (ligne) => ligne.cle
    )
  );
  const bilan: BilanPrecalcul = { calculees: 0, dejaAJour: 0, echecs: [] };
  for (const { cle, carte, parametres } of CARTES_PAR_DEFAUT.values()) {
    if (aJour.has(cle)) {
      bilan.dejaAJour++;
      continue;
    }
    try {
      await enregistrer(cle, await executerCarte(carte, parametres, marqueur, true), marqueur);
      bilan.calculees++;
    } catch (erreur) {
      console.error(`[metabase] précalcul de la carte ${carte} :`, erreur);
      bilan.echecs.push(carte);
    }
  }
  await prisma.metabase_resultats.deleteMany({ where: { cle: { notIn: [...CARTES_PAR_DEFAUT.keys()] } } });
  return bilan;
};

let precalculEnCours: Promise<BilanPrecalcul> | null = null;

export const precalculer = (): Promise<BilanPrecalcul> => {
  precalculEnCours ??= lancerPrecalcul().finally(() => {
    precalculEnCours = null;
  });
  return precalculEnCours;
};
