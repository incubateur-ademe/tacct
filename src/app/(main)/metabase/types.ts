import type { Granularite } from '@/lib/queries/metabase/periode';

export type Position = {
  ligne: number;
  colonne: number;
  largeur: number;
  hauteur: number;
};

export type ColonneTableau = {
  titre?: string;
  suffixe?: string;
};

export type Visualisation =
  | { type: 'chiffre' }
  | { type: 'tableau'; colonnes?: Record<string, ColonneTableau>; ordre?: string[] }
  | {
      type: 'barres';
      x: string;
      y: string;
      libelleX?: string;
      libelleY?: string;
      horizontal?: boolean;
      suffixe?: string;
    }
  | { type: 'courbe'; x: string; y: string; libelleX?: string; libelleY?: string }
  | {
      type: 'donut';
      categorie: string;
      valeur: string;
      libelles?: Record<string, string>;
      couleurs?: Record<string, string>;
      suffixeCategorie?: string;
    };

export type BlocCarte = {
  type: 'carte';
  carte: number;
  titre: string;
  description?: string;
  visualisation: Visualisation;
  periode?: string;
  periodeEtape2?: string;
  granularite?: Granularite;
  granulariteModifiable?: boolean;
  position: Position;
};

export type Bloc =
  | { type: 'titre'; texte: string; position: Position }
  | { type: 'texte'; texte: string; position: Position }
  | BlocCarte;

export type TableauDeBord = {
  id: number;
  nom: string;
  blocs: Bloc[];
};
