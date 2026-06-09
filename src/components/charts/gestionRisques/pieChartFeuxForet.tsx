// @ts-nocheck
'use client';

import { IncendiesForet } from '@/lib/postgres/models';
import { CountOcc } from '@/lib/utils/reusableFunctions/occurencesCount';
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import styles from '../charts.module.scss';
import { simplePieChartCountTooltip } from '../ChartTooltips';
import NivoPieChart from '../NivoPieChart';

const colors: { [key: string]: string } = {
  Malveillance: '#91D1CC',
  Accidentelle: '#038278',
  'Involontaire (particulier)': '#095D55',
  'Involontaire (travaux)': '#05413B',
  Naturelle: '#D3EDEB',
  Inconnues: '#d7f8ff'
};

const PieChartFeuxForet = (props: { incendiesForet: IncendiesForet[] }) => {
  const { incendiesForet } = props;
  const countTypes = CountOcc(incendiesForet, 'nature');
  const graphData = Object.entries(countTypes).map(([id, value]) => ({
    id,
    count: value,
    value: value / Sum(Object.values(countTypes)) * 100
  }));

  return (
    <div className={styles.responsivePieContainer}>
      <NivoPieChart
        graphData={graphData}
        colors={(graphData) => colors[graphData.id]}
        tooltip={({ datum }) => simplePieChartCountTooltip({ datum, unite: 'départ(s) de feux' })}
      />
    </div>
  );
};

export default PieChartFeuxForet;
