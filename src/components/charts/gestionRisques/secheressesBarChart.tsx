"use client";

import { secheressesBarChartLegend } from "@/components/maps/legends/datavizLegends";
import { LegendCompColor } from "@/components/maps/legends/legendComp";
import { Body } from "@/design-system/base/Textes";
import useWindowDimensions from "@/hooks/windowDimensions";
import { simpleBarChartTooltip } from "../ChartTooltips";
import { NivoBarChart } from "../NivoBarChart";

export const SecheressesBarChart = (
  {
    restrictionsParAnnee
  }: {
    restrictionsParAnnee: {
      annee: string;
      vigilance: number;
      alerte: number;
      alerte_renforcee: number;
      crise: number;
    }[]
  }
) => {
  const graphData = restrictionsParAnnee
    .filter(data => ['2020', '2021', '2022', '2023', '2024', '2025'].includes(data.annee))
    .map(data => ({
      annee: data.annee,
      'Vigilance': data.vigilance,
      'Alerte': data.alerte,
      'Alerte renforcée': data.alerte_renforcee,
      'Crise': data.crise
    }));

  const windowDimensions = useWindowDimensions();

  return (
    <div
      style={{
        height: "450px",
        width: '100%',
        backgroundColor: "white",
        borderRadius: "1rem"
      }}>
      {graphData && graphData.length ?
        <>
          <NivoBarChart
            graphData={graphData}
            keys={["Vigilance", "Alerte", "Alerte renforcée", "Crise"]}
            indexBy="annee"
            showLegend={false}
            axisLeftLegend="Nombre de jours de restrictions"
            bottomTickValues={graphData.map(data => data.annee)}
            colors={secheressesBarChartLegend.map(legend => legend.color)}
            graphMarginBottom={windowDimensions.width! < 1230 ? 120 : 100}
            tooltip={({ data }) => simpleBarChartTooltip({ data, legende: secheressesBarChartLegend })}
          />
          <div style={{ position: "relative", top: windowDimensions.width! < 1230 ? "-70px" : "-50px", margin: "0 1rem" }}>
            <LegendCompColor
              legends={secheressesBarChartLegend.map((legend, index) => ({
                id: index,
                value: legend.value,
                color: legend.color
              }))}
              style={{ columnGap: "1em" }}
            />
          </div>
        </>
        : <div
          style={{
            height: 'inherit',
            alignContent: 'center',
            textAlign: 'center'
          }}
        >
          <Body>Aucune donnée disponible</Body>
        </div>
      }
    </div>
  )
};
