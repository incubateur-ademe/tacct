'use client';

import type { ResultatCarte } from '@/lib/queries/metabase/types';
import { ResponsiveBar, type BarTooltipProps } from '@nivo/bar';
import styles from '../metabase.module.scss';
import { formaterNombre, tronquer, versNombre } from '../formatage';
import { InfoBulle } from './InfoBulle';
import { COULEUR_SERIE, THEME_NIVO } from './theme';

type Barre = { categorie: string; valeur: number };

const BARRES_SANS_DEFILEMENT = 20;
const HAUTEUR_BARRE = 26;

export const Barres = ({
  resultat,
  x,
  y,
  libelleX,
  libelleY,
  horizontal = false,
  suffixe = ''
}: {
  resultat: ResultatCarte;
  x: string;
  y: string;
  libelleX?: string;
  libelleY?: string;
  horizontal?: boolean;
  suffixe?: string;
}) => {
  const barres: Barre[] = resultat.lignes.map((ligne) => ({
    categorie: String(ligne[x] ?? '—'),
    valeur: versNombre(ligne[y] ?? null)
  }));
  const donnees = horizontal ? [...barres].reverse() : barres;
  const plusLongLibelle = Math.max(0, ...barres.map((barre) => barre.categorie.length));
  const defilant = horizontal && barres.length > BARRES_SANS_DEFILEMENT;
  const formaterAxe = (valeur: string | number) => formaterNombre(Number(valeur), suffixe);
  const axeValeurs = {
    tickSize: 0,
    tickPadding: 8,
    tickValues: 5,
    format: formaterAxe,
    legend: libelleY,
    legendPosition: 'middle' as const
  };

  const Info = ({ indexValue, value, color }: BarTooltipProps<Barre>) => (
    <InfoBulle couleur={color} libelle={String(indexValue)} valeur={formaterNombre(value, suffixe)} />
  );

  const margeLibelles = horizontal
    ? Math.min(260, 24 + Math.min(plusLongLibelle, 38) * 6.4)
    : Math.min(150, 28 + Math.min(plusLongLibelle, 26) * 4.6);

  return (
    <div className={styles.graphique}>
      <div className={defilant ? styles.graphiqueDefilant : styles.graphiqueInterieur}>
        <div style={{ height: defilant ? barres.length * HAUTEUR_BARRE + 72 : '100%' }}>
          <ResponsiveBar<Barre>
            data={donnees}
            keys={['valeur']}
            indexBy="categorie"
            layout={horizontal ? 'horizontal' : 'vertical'}
            valueScale={{ type: 'linear', nice: true }}
            margin={
              horizontal
                ? {
                    top: defilant ? (libelleY ? 52 : 32) : 8,
                    right: 24,
                    bottom: defilant ? 8 : libelleY ? 52 : 32,
                    left: margeLibelles
                  }
                : { top: 16, right: 16, bottom: margeLibelles, left: libelleY ? 76 : 56 }
            }
            padding={0.3}
            colors={[COULEUR_SERIE]}
            borderRadius={2}
            enableLabel={false}
            enableGridX={horizontal}
            enableGridY={!horizontal}
            axisLeft={
              horizontal
                ? {
                    tickSize: 0,
                    tickPadding: 8,
                    format: (valeur: string) => tronquer(valeur, 38),
                    legend: libelleX,
                    legendPosition: 'middle',
                    legendOffset: -16
                  }
                : { ...axeValeurs, legendOffset: -64 }
            }
            axisTop={defilant ? { ...axeValeurs, legendOffset: -40 } : null}
            axisBottom={
              defilant
                ? null
                : horizontal
                  ? { ...axeValeurs, legendOffset: 40 }
                  : {
                      tickSize: 0,
                      tickPadding: 8,
                      tickRotation: plusLongLibelle > 8 ? -40 : 0,
                      format: (valeur: string) => tronquer(valeur, 26)
                    }
            }
            tooltip={Info}
            theme={THEME_NIVO}
            role="img"
            ariaLabel={libelleY ?? y}
          />
        </div>
      </div>
    </div>
  );
};
