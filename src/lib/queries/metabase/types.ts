import type { Prisma } from '@/generated/client/client';
import type { Granularite, Periode } from './periode';

export type ParametresRequete = {
  periode: Periode;
  periodeEtape2: Periode;
  granularite: Granularite;
};

export type Requetes = Record<number, (parametres: ParametresRequete) => Prisma.Sql>;

export type LigneBrute = Record<string, unknown>;

export type Valeur = string | number | boolean | null;

export type Ligne = Record<string, Valeur>;

export type ResultatCarte = {
  colonnes: string[];
  lignes: Ligne[];
  tronque: boolean;
};
