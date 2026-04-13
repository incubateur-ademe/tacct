'use client';

import { feuxForetBarChartLegend } from '@/components/maps/legends/datavizLegends';
import { Body } from '@/design-system/base/Textes';
import { IncendiesForet } from '@/lib/postgres/models';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { BarDatum } from '@nivo/bar';
import { NivoBarChart } from '../NivoBarChart';
import { NivoLineChart } from '../NivoLineChart';
import styles from './gestionRisquesCharts.module.scss';

interface IncendiesEnriched extends IncendiesForet {
  nombreIncendies: number;
}

export const BarLineFeuxForet = (props: {
  incendiesForet: IncendiesForet[];
}) => {
  const { incendiesForet } = props;
  const incendiesForetEnriched = incendiesForet.map((el) => {
    return {
      ...el,
      surface_parcourue: el.surface_parcourue * 100, //conversion en ha 1km² = 100ha
      nombreIncendies: incendiesForet.filter((item) => item.annee === el.annee)
        .length
    };
  });

  const barGraphData = incendiesForetEnriched.reduce(
    (acc: IncendiesEnriched[], curr: IncendiesEnriched) => {
      const x = acc.find((item) => item.annee === curr.annee);
      if (x) {
        x.surface_parcourue += curr.surface_parcourue;
      } else {
        acc.push(curr);
      }
      return acc;
    },
    []
  ).toSorted((a, b) => a.annee - b.annee);

  const lineGraphData = [
    {
      id: "Nombre de départ d'incendies",
      data: barGraphData
        .toSorted((a, b) => a.annee - b.annee)
        .map((el) => {
          return {
            x: el.annee.toString(),
            y: el.nombreIncendies
          };
        })
    }
  ];
  const annees = barGraphData.map(e => e.annee);
  const minValueXTicks = Math.min(...annees);
  const maxValueXTicks = Math.max(...annees);
  return (
    <div className={styles.graphContainer}>
      <div className="absolute h-[95%] w-full">
        <NivoBarChart
          colors={feuxForetBarChartLegend.map((e) => e.couleur)}
          graphData={barGraphData as unknown as BarDatum[]}
          keys={['surface_parcourue']}
          indexBy="annee"
          axisLeftLegend="Surface en ha"
          axisBottomLegend="Années"
          showLegend={false}
          isBarLine={true}
          bottomTickValues={[minValueXTicks, maxValueXTicks]}
        />
      </div>
      <div className="absolute h-[95%] w-full">
        <NivoLineChart
          graphData={lineGraphData}
          dataLength={lineGraphData[0].data.length}
          axisRightLegend="Nombre d'incendies"
          colors={['#ED8DAE']}
          tooltip={({ point }) => {
            return (
              <div className={styles.barLineTooltipContainer}>
                <Body weight="bold" style={{ paddingBottom: "0.5rem" }}>{point.data.xFormatted}</Body>
                <div className={styles.line}>
                  <div className={styles.circle} />
                  <Body size='sm'>{point.data.yFormatted} départ(s) d'incendies</Body>
                </div>
                <div className={styles.line}>
                  <div className={styles.square} />
                  <Body size='sm'>
                    {Round(
                      barGraphData.find(
                        (el) =>
                          Number(el.annee) === Number(point.data.xFormatted)
                      )?.surface_parcourue!,
                      2
                    )}{' '}
                    ha consommé(s)
                  </Body>
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};
