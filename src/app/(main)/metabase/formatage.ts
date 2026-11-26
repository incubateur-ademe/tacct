import type { Valeur } from '@/lib/queries/metabase/types';

const FORMAT_NOMBRE = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 });
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

export const formaterNombre = (valeur: number, suffixe = ''): string =>
  `${FORMAT_NOMBRE.format(valeur)}${suffixe}`;

const formaterDate = (iso: string): string => {
  const date = new Date(iso);
  if (iso.endsWith('T00:00:00.000Z')) {
    return date.toLocaleDateString('fr-FR', { timeZone: 'UTC' });
  }
  return date.toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
    dateStyle: 'short',
    timeStyle: 'short'
  });
};

export const formaterValeur = (valeur: Valeur, suffixe = ''): string => {
  if (valeur === null) return '—';
  if (typeof valeur === 'boolean') return valeur ? 'Oui' : 'Non';
  if (typeof valeur === 'number') return formaterNombre(valeur, suffixe);
  if (ISO.test(valeur)) return formaterDate(valeur);
  return valeur;
};

export const versNombre = (valeur: Valeur): number => {
  if (typeof valeur === 'number') return valeur;
  if (typeof valeur === 'string') {
    const nombre = Number(valeur);
    return Number.isFinite(nombre) ? nombre : 0;
  }
  return 0;
};

export const tronquer = (texte: string, longueur: number): string =>
  texte.length > longueur ? `${texte.slice(0, longueur - 1)}…` : texte;
