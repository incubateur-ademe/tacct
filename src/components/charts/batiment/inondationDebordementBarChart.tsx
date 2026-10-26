"use client";

import { LegendCompColor } from "@/components/maps/legends/legendComp";
import couleurs from "@/design-system/couleurs";
import useWindowDimensions from "@/hooks/windowDimensions";
import { simpleBarChartTooltip } from "../ChartTooltips";
import { NivoBarChart } from "../NivoBarChart";

export type PartsExposees = {
  libelle: string;
  surface: number;
  population: number;
  logements: number;
};

export const InondationDebordementBarChart = ({
  territoire,
  reference
}: {
  territoire: PartsExposees;
  reference: PartsExposees;
}) => {
  const windowDimensions = useWindowDimensions();
  const legende = [
    { value: territoire.libelle, color: couleurs.principales.vert },
    { value: reference.libelle, color: couleurs.graphiques.violet[2] }
  ];
  const graphData = (
    [
      ['surface', 'Surface'],
      ['population', 'Population'],
      ['logements', 'Logements']
    ] as const
  ).map(([cle, indicateur]) => ({
    [territoire.libelle]: territoire[cle],
    [reference.libelle]: reference[cle],
    indicateur
  }));

  return (
    <div
      style={{
        height: "450px",
        width: '100%',
        backgroundColor: "white"
      }}>
      <NivoBarChart
        graphData={graphData}
        keys={legende.map(el => el.value)}
        indexBy="indicateur"
        colors={legende.map(el => el.color)}
        groupMode="grouped"
        showLegend={false}
        axisLeftLegend="Part exposée (%)"
        graphMarginBottom={windowDimensions.width! < 1230 ? 120 : 100}
        xMargins={windowDimensions.width! < 600 ? 40 : 80}
        tooltip={({ data }) => simpleBarChartTooltip({ data, legende, unite: '%', arrondi: 1 })}
      />
      <div style={{ position: "relative", top: windowDimensions.width! < 1230 ? "-60px" : "-50px", margin: "0 1rem" }}>
        <LegendCompColor
          legends={legende.map((el, index) => ({
            id: index,
            value: el.value,
            color: el.color
          }))}
          style={{ columnGap: "1em" }}
        />
      </div>
    </div>
  );
};
