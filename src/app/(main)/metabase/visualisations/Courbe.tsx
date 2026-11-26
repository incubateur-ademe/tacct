'use client';

import type { ResultatCarte } from '@/lib/queries/metabase/types';
import { ResponsiveLine, type SliceTooltipProps } from '@nivo/line';
import styles from '../metabase.module.scss';
import { formaterNombre, versNombre } from '../formatage';
import { InfoBulle } from './InfoBulle';
import { COULEUR_SERIE, THEME_NIVO } from './theme';

const GRADUATIONS_MAX = 8;

export const Courbe = ({
  resultat,
  x,
  y,
  libelleX,
  libelleY
}: {
  resultat: ResultatCarte;
  x: string;
  y: string;
  libelleX?: string;
  libelleY?: string;
}) => {
  const points = resultat.lignes.map((ligne) => ({
    x: String(ligne[x] ?? ''),
    y: versNombre(ligne[y] ?? null)
  }));
  const pas = Math.max(1, Math.ceil(points.length / GRADUATIONS_MAX));
  const graduations = points.filter((_, index) => index % pas === 0).map((point) => point.x);
  const libellesLongs = graduations.some((graduation) => graduation.length > 8);

  const Info = ({ slice }: SliceTooltipProps) => {
    const point = slice.points[0];
    return (
      <InfoBulle
        couleur={point.serieColor}
        libelle={String(point.data.x)}
        valeur={formaterNombre(Number(point.data.y))}
      />
    );
  };

  return (
    <div className={styles.graphique}>
      <div className={styles.graphiqueInterieur}>
        <ResponsiveLine
          data={[{ id: libelleY ?? y, data: points }]}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 'auto', nice: true }}
          curve="monotoneX"
          colors={[COULEUR_SERIE]}
          lineWidth={2}
          enableArea
          areaOpacity={0.12}
          pointSize={points.length > 40 ? 0 : 8}
          pointColor="#FFFFFF"
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enableGridX={false}
          margin={{ top: 16, right: 24, bottom: libellesLongs ? 72 : 48, left: libelleY ? 80 : 56 }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickValues: graduations,
            tickRotation: libellesLongs ? -35 : 0,
            legend: libelleX,
            legendPosition: 'middle',
            legendOffset: libellesLongs ? 64 : 40
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            tickValues: 5,
            format: (valeur: number) => formaterNombre(valeur),
            legend: libelleY,
            legendPosition: 'middle',
            legendOffset: -68
          }}
          enableSlices="x"
          sliceTooltip={Info}
          theme={THEME_NIVO}
          role="img"
        />
      </div>
    </div>
  );
};
