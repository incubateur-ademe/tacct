// @ts-nocheck
'use client';

import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import ZeroData from '@/assets/images/zero_data_found.png';
import styles from '@/components/charts/charts.module.scss';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import couleurs from '@/design-system/couleurs';
import useWindowDimensions from '@/hooks/windowDimensions';
import { PieChartDataSurfacesAgricoles } from '@/lib/charts/surfacesAgricoles';
import { SurfacesAgricolesModel } from '@/lib/postgres/models';
import { simplePieChartCountTooltip } from '../ChartTooltips';
import NivoPieChart from '../NivoPieChart';

export const PieChartAgriculture = ({
  surfacesAgricoles
}: {
  surfacesAgricoles: SurfacesAgricolesModel[];
}) => {
  const graphData = PieChartDataSurfacesAgricoles(surfacesAgricoles);
  const sumAllCount = graphData.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );
  const windowDimensions = useWindowDimensions();
  return (
    <div className={styles.responsivePieContainer}>
      {sumAllCount > 0 ? (
        <NivoPieChart
          graphData={graphData}
          colors={[
            couleurs.graphiques.vert[5], // cultures permanents,
            couleurs.graphiques.vert[1], // STH
            couleurs.graphiques.vert[3], // arables
            couleurs.graphiques.vert[2] // jardins
          ]}
          tooltip={({ datum }) =>
            simplePieChartCountTooltip({ datum, unite: 'ha' })
          }
          unit="ha"
        />
      ) : (
        <div className="p-10 flex flex-row justify-center">
          <DataNotFoundForGraph
            image={surfacesAgricoles.length === 0 ? DataNotFound : ZeroData}
          />
        </div>
      )}
    </div>
  );
};
