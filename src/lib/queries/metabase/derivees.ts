import type { Granularite } from './periode';
import type { LigneBrute, ParametresRequete } from './types';

type Derivee = {
  source: number;
  transformer: (lignes: LigneBrute[], parametres: ParametresRequete) => LigneBrute[];
};

const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre'
];

const nombre = (valeur: unknown): number => Number(valeur ?? 0);

// Équivalent de DATE_TRUNC sur une date sans heure.
const debutPeriode = (jour: Date, granularite: Granularite): number => {
  const annee = jour.getUTCFullYear();
  const mois = jour.getUTCMonth();
  const quantieme = jour.getUTCDate();
  switch (granularite) {
    case 'day':
      return Date.UTC(annee, mois, quantieme);
    case 'week':
      return Date.UTC(annee, mois, quantieme - ((jour.getUTCDay() + 6) % 7));
    case 'month':
      return Date.UTC(annee, mois, 1);
    case 'quarter':
      return Date.UTC(annee, mois - (mois % 3), 1);
    case 'year':
      return Date.UTC(annee, 0, 1);
  }
};

const northStarParDate: Derivee['transformer'] = (lignes, { granularite }) => {
  const totaux = new Map<number, number>();
  for (const ligne of lignes) {
    const jour = ligne.day instanceof Date ? ligne.day : new Date(String(ligne.day));
    const debut = debutPeriode(jour, granularite);
    totaux.set(debut, (totaux.get(debut) ?? 0) + nombre(ligne.north_star));
  }
  return [...totaux]
    .sort(([a], [b]) => a - b)
    .map(([debut, total]) => {
      const date = new Date(debut);
      return {
        date: `${date.getUTCDate()} ${MOIS[date.getUTCMonth()]} ${date.getUTCFullYear()}`,
        north_star: total
      };
    });
};

const exportsParIndicateur: Derivee['transformer'] = (lignes) => {
  const totaux = new Map<unknown, number>();
  for (const ligne of lignes) {
    totaux.set(ligne.indicateur, (totaux.get(ligne.indicateur) ?? 0) + nombre(ligne.total));
  }
  return [...totaux]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([indicateur, total]) => ({ indicateur, total }));
};

// Cartes calculées à partir du résultat d'une autre, sans nouvelle requête SQL.
export const DERIVEES: Record<number, Derivee> = {
  63: { source: 59, transformer: exportsParIndicateur },
  69: { source: 58, transformer: northStarParDate },
  73: {
    source: 74,
    transformer: (lignes) => lignes.map((ligne) => ({ returning_visitors: ligne.returning_visitors }))
  },
  99: { source: 81, transformer: (lignes) => lignes }
};
