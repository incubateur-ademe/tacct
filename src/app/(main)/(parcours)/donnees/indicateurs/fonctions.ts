import type {
  CarteParCommune,
  PartCommune
} from '@/components/maps/mapPartParCommune';
import { sansDoublonArrondissements } from '@/lib/territoireData/arrondissements';

export const aUneValeurParCode = (donnees: PartCommune[]) => {
  const parts = new Map(donnees.map((d) => [d.code, d.part]));
  return (code: string) => (parts.get(code) ?? null) !== null;
};

export const carteParCommune = (
  type: string,
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null,
  donnees: PartCommune[],
  config: Omit<CarteParCommune, 'communesCodes' | 'donnees' | 'bbox'>
): CarteParCommune | null => {
  if (type === 'commune' || !coordonneesCommunes) return null;
  return {
    communesCodes: sansDoublonArrondissements(
      coordonneesCommunes.codes,
      (code) => code,
      aUneValeurParCode(donnees)
    ),
    donnees,
    bbox: coordonneesCommunes.bbox,
    ...config
  };
};

export const sumProperty = <T, K extends keyof T>(
  items: T[],
  property: K,
  defaultValue: number = 0
): number => {
  return items.reduce((accumulator, item) => {
    const value = item[property];
    return accumulator + (typeof value === 'number' ? value : defaultValue);
  }, 0);
};

export const averageProperty = <T, K extends keyof T>(
  array: T[],
  prop: K
): number => {
  return (
    array.reduce((a, b) => {
      const value = b[prop];
      return a + (typeof value === 'number' ? value : 0);
    }, 0) / array.length
  );
};
