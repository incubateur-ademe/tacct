"use client";

import { secheressesSaisonsChartLegend } from "@/components/maps/legends/datavizLegends";
import { LegendCompColor } from "@/components/maps/legends/legendComp";
import { Body } from "@/design-system/base/Textes";
import useWindowDimensions from "@/hooks/windowDimensions";
import { simpleBarChartTooltip } from "../ChartTooltips";
import { NivoBarChart } from "../NivoBarChart";

export const SecheressesSaisonsBarChart = (
  {
    restrictionsParSaison
  }: {
    restrictionsParSaison: {
      saison: string;
      [annee: string]: number | string;
    }[]
  }
) => {
  const graphData = restrictionsParSaison;
  const windowDimensions = useWindowDimensions();
  const anneesDisponibles = graphData.length > 0
    ? Array.from(
      new Set(
        graphData.flatMap(saison =>
          Object.keys(saison).filter(key => key !== 'saison' && parseInt(key) >= 2020 && parseInt(key) <= 2025)
        )
      )
    ).toSorted()
    : [];

  return (
    <div
      style={{
        height: "450px",
        width: '100%',
        backgroundColor: "white",
        borderRadius: "1rem"
      }}>

      {graphData && graphData.length && anneesDisponibles.length ?
        <>
          <NivoBarChart
            graphData={graphData}
            keys={anneesDisponibles}
            indexBy="saison"
            showLegend={false}
            axisLeftLegend="Nombre de jours de restrictions"
            colors={
              secheressesSaisonsChartLegend.filter(
                legend => anneesDisponibles.includes(legend.value)
              ).map(legend => legend.color)
            }
            groupMode="grouped"
            graphMarginBottom={windowDimensions.width! < 1260 ? 120 : 100}
            tooltip={({ data }) => simpleBarChartTooltip({ data, legende: secheressesSaisonsChartLegend })}
          />
          <div style={{ position: "relative", top: windowDimensions.width! < 1260 ? "-70px" : "-50px", margin: "0 1rem" }}>
            <LegendCompColor
              legends={secheressesSaisonsChartLegend.map((legend, index) => ({
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
