'use client';

import PasDeDonneesImage from "@/assets/images/donnees_zero.png";
import { prelevementEauBarChartLegend, ressourcesEauBarChartLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import { Body } from "@/design-system/base/Textes";
import { PrelevementsEauParsed } from '@/lib/postgres/models';
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { simpleBarChartTooltip } from '../ChartTooltips';
import { NivoBarChartRessourcesEau } from '../NivoBarChart';
import styles from './eau.module.scss';

type GraphData = {
  Irrigation: number;
  'Eau potable': number;
  'Industries et autres usages économiques (hors irrigation, hors énergie)': number;
  'Énergie': number;
  'Alimentation des canaux': number;
  "Production hydro-électriques": number;
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
      "Production hydro-électriques": sumBySousChamp('bar'),
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
  const legendRef = useRef<HTMLDivElement>(null);
  const [legendHeight, setLegendHeight] = useState(80);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [filterEnergie, setFilterEnergie] = useState(false);
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

  useEffect(() => {
    const element = legendRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setLegendHeight(entry.contentRect.height);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const energieKeys = ['Énergie', "Production hydro-électriques"];
  const filteredLegend = filterEnergie
    ? prelevementEauBarChartLegend.filter((e) => !energieKeys.includes(e.value))
    : prelevementEauBarChartLegend;

  const minValueXTicks = Math.min(...graphData.map((e) => Number(e.annee)));
  const maxValueXTicks = Math.max(...graphData.map((e) => Number(e.annee)));

  useLayoutEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [minValueXTicks, maxValueXTicks]);

  return (
    <>
      <div className={styles.filtreEauWrapper} style={{ padding: "1rem 1.75rem" }}>
        <input
          type="checkbox"
          id="filter-energie"
          checked={filterEnergie}
          onChange={(e) => setFilterEnergie(e.target.checked)}
          style={{ cursor: 'pointer', width: '1rem', height: '1rem', accentColor: 'var(--principales-vert)' }}
        />
        <label htmlFor="filter-energie" style={{ cursor: 'pointer' }}>
          <Body size='sm' style={{ color: "var(--gris-medium-dark)" }}>
            Filtrer les prélèvements en eau pour l&apos;énergie
          </Body>
        </label>
      </div>
      <div className={styles.warningBox} style={{ height: "500px" }}>
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
              colors={filteredLegend.map((e) => e.color)}
              graphData={graphData}
              keys={filteredLegend.map((e) => e.value)}
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
              graphMarginBottom={legendHeight + 40}
            />
            <div ref={legendRef} style={{
              paddingBottom: '1rem',
              marginTop: `-${legendHeight}px`
            }}>
              <LegendCompColor
                legends={filteredLegend}
                textStyle={{ fontSize: '12px' }}
              />
            </div>
          </>
        ) : (
          <div
            style={{
              height: 'inherit',
              alignContent: 'center',
              textAlign: 'center',
              padding: "1rem 4rem"
            }}
          >
            <Image
              src={PasDeDonneesImage}
              alt=""
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "300px",
                margin: "0 auto",
                padding: "0rem 2rem"
              }}
            />
            <p className="text-center text-gray-500 mt-4">
              Aucune donnée de prélèvement d'eau disponible pour la période sélectionnée
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default PrelevementEauBarChart;
