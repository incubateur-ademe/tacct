// @ts-nocheck
'use client';

import { catnatPieChartLegend } from '@/components/maps/legends/datavizLegends';
import useWindowDimensions from '@/hooks/windowDimensions';
import { ArreteCatNat } from '@/lib/postgres/models';
import { CountOcc } from '@/lib/utils/reusableFunctions/occurencesCount';
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import { DefaultRawDatum, PieCustomLayerProps } from '@nivo/pie';
import styles from '../charts.module.scss';
import { simplePieChartCountTooltip } from '../ChartTooltips';
import NivoPieChart from '../NivoPieChart';

type ArreteCatNatEnriched = ArreteCatNat & {
  annee_arrete: number;
};

const PieChartCatnat = (props: { gestionRisques: ArreteCatNatEnriched[] }) => {
  const { gestionRisques } = props;
  const windowDimensions = useWindowDimensions();
  const countTypes = CountOcc(gestionRisques, 'lib_risque_jo');
  const mapGraphData = gestionRisques?.map((el) => {
    return {
      id: el.lib_risque_jo ?? '',
      label: el.lib_risque_jo ?? '',
      value: countTypes[el.lib_risque_jo!] / Sum(Object.values(countTypes)) * 100,
      count: countTypes[el.lib_risque_jo!]
    };
  });
  const graphData = mapGraphData.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.label === value.label)
  );

  const CenteredMetric = ({
    dataWithArc,
    centerX,
    centerY
  }: PieCustomLayerProps<DefaultRawDatum>) => {
    const total = Sum(Object.values(countTypes));
    const mainFontSize = windowDimensions?.width > 1248 ? 32 : windowDimensions?.width > 1024 ? 26 : 18;
    const subFontSize = Math.max(10, Math.round(mainFontSize / 3));
    const mainYOffset = -Math.round(mainFontSize / 2);
    const subYOffset = Math.round(subFontSize / 1.2);

    return (
      <>
        <text
          x={centerX}
          y={centerY + mainYOffset}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: `${mainFontSize}px`,
            fontWeight: 700,
          }}
        >
          {total}
        </text>
        <text
          x={centerX}
          y={centerY + subYOffset}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: `${subFontSize}px`,
            fontWeight: 400
          }}
        >
          arrêté(s) CatNat
        </text>
      </>
    );
  };


  return (
    <div className={styles.responsivePieContainer}>
      <NivoPieChart
        graphData={graphData}
        colors={(graphData) => catnatPieChartLegend.find(el => el.value === graphData.id)?.color!}
        CenteredMetric={CenteredMetric}
        tooltip={({ datum }) => simplePieChartCountTooltip({ datum, unite: 'arrêté(s)' })}
      />
    </div>
  )
}

export default PieChartCatnat;
