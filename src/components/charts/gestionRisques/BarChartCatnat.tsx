'use client';

import { catnatPieChartLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import useWindowDimensions from '@/hooks/windowDimensions';
import { BarDatum } from '@/lib/nivo/bar';
import { ArreteCatNat } from '@/lib/postgres/models';
import { CountOccByIndex } from '@/lib/utils/reusableFunctions/occurencesCount';
import { useLayoutEffect, useState } from 'react';
import { simpleBarChartTooltip } from '../ChartTooltips';
import { NivoBarChartCatnat } from '../NivoBarChart';

type ArreteCatNatEnriched = ArreteCatNat & {
  annee_arrete: number;
};

type GraphData = {
  indexName: number;
  [key: string]: number;
};

export const BarChartCatnat = (props: { gestionRisques: ArreteCatNatEnriched[] }) => {
  const { gestionRisques } = props;
  const windowDimensions = useWindowDimensions();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const graphData = CountOccByIndex(
    gestionRisques,
    'annee_arrete',
    'lib_risque_jo'
  ) as unknown as GraphData[];
  const minDate = Math.min(...gestionRisques.map((e) => e.annee_arrete));
  const maxDate = Math.max(...gestionRisques.map((e) => e.annee_arrete));

  useLayoutEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [minDate, maxDate]);

  return (
    <div
      className="catnat-chart-wrapper"
      style={{
        height: windowDimensions.width && windowDimensions.width < 600 ? '600px' : '450px',
        width: '100%',
        backgroundColor: 'white'
      }}
    >
      <style>{`
        .catnat-chart-wrapper .nivo-bar-chart-container .bottom-tick {
          opacity: ${isTransitioning ? '0' : '1'};
          transition: opacity 0.2s ease-in-out;
        }
      `}</style>
      {graphData.length === 0 ? (
        <div
          style={{
            height: 'inherit',
            alignContent: 'center',
            textAlign: 'center'
          }}
        >
          Aucun arrêté catnat avec ces filtres
        </div>
      ) : (
        <>
          <NivoBarChartCatnat
            graphData={graphData as unknown as BarDatum[]}
            keys={catnatPieChartLegend.map((e) => e.value)}
            indexBy="indexName"
            colors={catnatPieChartLegend.map((e) => e.color)}
            tooltip={({ data }) => simpleBarChartTooltip({ data, legende: catnatPieChartLegend })}
            axisLeftLegend="Nombre de catastrophes recensées"
            showLegend={false}
            bottomTickValues={minDate != maxDate
              ? [minDate, maxDate]
              : [minDate]}
          />
          <div style={{ 
            position: "relative", 
            top: windowDimensions.width && windowDimensions.width < 600 ? "-200px" : "-110px" ,
            padding: "0 0.5rem"
            }}>
            <LegendCompColor
              legends={catnatPieChartLegend.map((legend, index) => ({
                id: index,
                value: legend.value,
                color: legend.color
              }))}
            />
          </div>
        </>
      )}
    </div>
  );
};
