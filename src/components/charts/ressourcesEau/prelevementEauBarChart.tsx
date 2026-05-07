'use client';

import { prelevementEauBarChartLegend, ressourcesEauBarChartLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import useWindowDimensions from '@/hooks/windowDimensions';
import { PrelevementsEauParsed } from '@/lib/postgres/models';
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import { useSearchParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { simpleBarChartTooltip } from '../ChartTooltips';
import { NivoBarChartRessourcesEau } from '../NivoBarChart';

type GraphData = {
  Irrigation: number;
  'Eau potable': number;
  'Industries et autres usages économiques (hors irrigation, hors énergie)': number;
  'Énergie': number;
  'Alimentation des canaux': number;
  "Production d'électricité (barrages hydro-électriques)": number;
  annee: string;
};

type Years =
  | 'A2008'
  | 'A2009'
  | 'A2010'
  | 'A2011'
  | 'A2012'
  | 'A2013'
  | 'A2014'
  | 'A2015'
  | 'A2016'
  | 'A2017'
  | 'A2018'
  | 'A2019'
  | 'A2020'
  | 'A2021'
  | 'A2022'
  | 'A2023';

const ressourcesEauYears = [
  'A2008',
  'A2009',
  'A2010',
  'A2011',
  'A2012',
  'A2013',
  'A2014',
  'A2015',
  'A2016',
  'A2017',
  'A2018',
  'A2019',
  'A2020',
  'A2021',
  'A2022',
  'A2023'
];

const graphDataFunct = (filteredYears: string[], data: PrelevementsEauParsed[]) => {
  const dataArr: GraphData[] = [];
  filteredYears.forEach((year) => {
    const sumBySousChamp = (code: string) =>
      Sum(
        data
          .filter((item) => item.sous_champ === code)
          .map((e) => e[year as Years])
          .filter((value): value is number => value !== null)
      );
    const obj = {
      Irrigation: sumBySousChamp('irr'),
      'Eau potable': sumBySousChamp('aep'),
      'Industries et autres usages économiques (hors irrigation, hors énergie)': sumBySousChamp('ind'),
      'Énergie': sumBySousChamp('ene'),
      'Alimentation des canaux': sumBySousChamp('can'),
      "Production d'électricité (barrages hydro-électriques)": sumBySousChamp('bar'),
      annee: year.split('A')[1]
    };
    const isNull = Sum(Object.values(obj).slice(0, -1) as number[]);
    if (isNull !== 0) dataArr.push(obj);
  });
  return dataArr;
};

const PrelevementEauBarChart = ({
  ressourcesEau,
  sliderValue
}: {
  ressourcesEau: PrelevementsEauParsed[];
  sliderValue: number[];
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  const windowDimensions = useWindowDimensions();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dataParMaille = type === "commune"
    ? ressourcesEau.filter((obj) => obj.code_geographique === code)
    : type === "epci"
      ? ressourcesEau.filter((obj) => obj.epci === code)
      : type === "petr"
        ? ressourcesEau.filter((obj) => obj.libelle_petr === libelle)
        : type === "ept"
          ? ressourcesEau.filter((obj) => obj.ept === libelle)
          : ressourcesEau;
  const [selectedYears, setSelectedYears] = useState<string[]>(
    ressourcesEauYears.map((year) => year.split('A')[1])
  );
  const graphData = graphDataFunct(selectedYears, dataParMaille);

  useEffect(() => {
    setSelectedYears(
      ressourcesEauYears.slice(
        ressourcesEauYears.indexOf(`A${sliderValue[0]}`),
        ressourcesEauYears.indexOf(`A${sliderValue[1]}`) + 1
      )
    );
  }, [sliderValue]);

  const minValueXTicks = Math.min(...graphData.map((e) => Number(e.annee)));
  const maxValueXTicks = Math.max(...graphData.map((e) => Number(e.annee)));

  useLayoutEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [minValueXTicks, maxValueXTicks]);

  return (
    <div
      style={{ height: '500px', minWidth: '450px', backgroundColor: 'white' }}
    >
      <style>{`
        .prelevement-eau-bar-chart-container .bottom-tick {
          opacity: ${isTransitioning ? '0' : '1'};
          transition: opacity 0.2s ease-in-out;
        }
      `}</style>
      {graphData && graphData.length ? (
        <>
          <NivoBarChartRessourcesEau
            bottomTickValues={
              minValueXTicks != maxValueXTicks
                ? [`${minValueXTicks}`, `${maxValueXTicks}`]
                : [`${minValueXTicks}`]
            }
            colors={prelevementEauBarChartLegend.map((e) => e.color)}
            graphData={graphData}
            keys={prelevementEauBarChartLegend.map((e) => e.value)}
            indexBy="annee"
            showLegend={false}
            tooltip={({ data }) => simpleBarChartTooltip({
              data,
              legende: ressourcesEauBarChartLegend,
              unite: 'Mm³',
              multiplicateur: 0.000001
            })}
            axisLeftLegend="Volumétrie en Mm3"
            axisLeftTickFactor={1000000}
          />
          <div style={{
            paddingBottom: '1rem',
            marginTop: windowDimensions.width! > 1850 ? '-5rem' : windowDimensions.width! > 1700 ? '-7rem' : '-9rem'
          }}>
            <LegendCompColor legends={prelevementEauBarChartLegend} />
          </div>
        </>
      ) : (
        <div
          style={{
            height: 'inherit',
            alignContent: 'center',
            textAlign: 'center'
          }}
        >
          Aucun prélèvement en eau avec ces filtres
        </div>
      )}
    </div>
  );
};

export default PrelevementEauBarChart;
