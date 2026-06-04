"use client";

import { arboviroseBarChartLegend } from "@/components/maps/legends/datavizLegends";
import { LegendCompColor } from "@/components/maps/legends/legendComp";
import { Body } from "@/design-system/base/Textes";
import useWindowDimensions from "@/hooks/windowDimensions";
import { simpleBarChartTooltip } from "../ChartTooltips";
import { NivoBarChart } from "../NivoBarChart";

export const ArboviroseBarChart = (
  {
    arbovirose
  }: {
    arbovirose: {
      annee: string;
      nb_cas_importes: number;
      nb_cas_autochtones: number;
    }[]
  }
) => {
  const graphData = arbovirose.map(data => ({
      annee: data.annee,
      'Cas importés': data.nb_cas_importes,
      'Cas autochtones': data.nb_cas_autochtones
    }));
  const minValueXTicks = graphData[0]?.annee;
  const maxValueXTicks = graphData[graphData.length - 1]?.annee;
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
            keys={["Cas importés", "Cas autochtones"]}
            indexBy="annee"
            showLegend={false}
            axisLeftLegend="Nombre de cas"
            bottomTickValues={
              minValueXTicks !== maxValueXTicks
                ? [`${minValueXTicks}`, `${maxValueXTicks}`]
                : [`${minValueXTicks}`]
            }
            groupMode="stacked"
            colors={arboviroseBarChartLegend.map(legend => legend.color)}
            graphMarginBottom={windowDimensions.width! < 1230 ? 120 : 100}
            tooltip={({ data }) => simpleBarChartTooltip({ data, legende: arboviroseBarChartLegend })}
          />
          <div style={{ position: "relative", top: windowDimensions.width! < 1230 ? "-70px" : "-50px", margin: "0 1rem" }}>
            <LegendCompColor
              legends={arboviroseBarChartLegend.map((legend, index) => ({
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
