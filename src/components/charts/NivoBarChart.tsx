import useWindowDimensions from '@/hooks/windowDimensions';
import { numberWithSpacesRegex } from '@/lib/utils/regex';
import { Any } from '@/lib/utils/types';
import {
  BarDatum,
  BarLegendProps,
  BarTooltipProps,
  ResponsiveBar
} from '@nivo/bar';
import { JSX } from 'react';

type Datum = {
  id: string | number;
  label: string | number;
  hidden?: boolean;
  color?: string;
  fill?: string;
};

const legendProps: BarLegendProps = {
  dataFrom: 'keys',
  anchor: 'bottom-right',
  direction: 'column',
  justify: false,
  translateX: 120,
  translateY: 0,
  itemsSpacing: 2,
  itemWidth: 100,
  itemHeight: 25,
  itemDirection: 'left-to-right',
  itemOpacity: 0.85,
  symbolSize: 20
};

type NivoBarChartProps = {
  graphData: BarDatum[];
  keys: string[];
  indexBy: string;
  bottomTickValues?: (string | number)[];
  colors?: string[];
  legendData?: Datum[];
  tooltip?: ({ data }: BarTooltipProps<BarDatum>) => JSX.Element;
  axisLeftLegend?: string;
  axisBottomLegend?: string;
  axisLeftTickFactor?: number;
  groupMode?: 'grouped' | 'stacked' | undefined;
  showLegend?: boolean;
  isBarLine?: boolean;
  graphMarginBottom?: number;
  tickRotation?: number;
  isMobile?: boolean;
};

export const NivoBarChart = ({
  graphData,
  keys,
  indexBy,
  bottomTickValues,
  colors,
  legendData,
  tooltip,
  axisLeftLegend,
  axisBottomLegend,
  axisLeftTickFactor = 1,
  groupMode = 'stacked',
  showLegend = true,
  isBarLine = false,
  graphMarginBottom,
  isMobile = false,
  tickRotation = 0
}: NivoBarChartProps) => {
  return (
    <div className="nivo-bar-chart-container" style={{ width: '100%', height: '100%' }}>
      <ResponsiveBar
        data={graphData}
        keys={keys}
        isFocusable={true}
        indexBy={indexBy}
        colors={colors}
        margin={
          isBarLine
            ? { top: 40, right: 80, bottom: graphMarginBottom ?? 60, left: 80 }
            : { top: 40, right: 80, bottom: graphMarginBottom ?? 100, left: 80 }
        }
        groupMode={groupMode}
        padding={0.3}
        innerPadding={2}
        borderRadius={1}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickValues: bottomTickValues,
          tickSize: 0,
          tickPadding: 15,
          legend: axisBottomLegend,
          legendOffset: 50,
          legendPosition: 'middle',
          renderTick: (e: Any) => {
            return (
              <g transform={`translate(${e.x},${e.y})`} className="bottom-tick">
                <foreignObject
                  x={-50}
                  y={0}
                  width={100}
                  height={isMobile ? 160 : 45}
                >
                  <div style={{
                    maxWidth: '15ch',
                    wordBreak: 'keep-all',
                    textAlign: 'center',
                    fontSize: 12,
                    fontWeight: 400,
                    margin: isMobile ? '2rem 0' : '0.5rem 0',
                    lineHeight: "normal",
                    rotate: tickRotation ? `${tickRotation}deg` : undefined,
                  }}>{e.value}</div>
                </foreignObject>
              </g>
            );
          }
        }}
        gridYValues={5}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: axisLeftLegend,
          legendPosition: 'middle',
          legendOffset: -50,
          truncateTickAt: 0,
          tickValues: 5, //number of tickvalues displayed along the ax
          renderTick: (e) => {
            return (
              <g transform={`translate(${e.x},${e.y})`}>
                <text
                  x={-20}
                  y={5}
                  textAnchor="middle"
                  style={{
                    fill: 'black',
                    fontSize: 12,
                    fontWeight: 400
                  }}
                >
                  {(e.value / axisLeftTickFactor) % 1 != 0
                    ? ''
                    : numberWithSpacesRegex(e.value / axisLeftTickFactor)}
                </text>
              </g>
            );
          }
        }}
        enableLabel={false}
        legends={
          showLegend
            ? [
              {
                ...legendProps,
                data: legendData,
                direction: "row",
                anchor: "bottom",
                translateX: 0,
                translateY: 80,
                itemsSpacing: 50,
              }
            ]
            : []
        }
        tooltip={tooltip}
        role="application"
      // motionConfig={{
      //   friction: 20,
      //   mass: 2,
      //   tension: 170
      // }}
      />
    </div>
  );
};

export const NivoBarChartRessourcesEau = ({
  graphData,
  keys,
  indexBy,
  bottomTickValues,
  colors,
  legendData,
  tooltip,
  axisLeftLegend,
  axisBottomLegend,
  axisLeftTickFactor = 1,
  groupMode = 'stacked',
  showLegend = true
}: NivoBarChartProps) => {
  const windowDimensions = useWindowDimensions();
  return (
    <div className="prelevement-eau-bar-chart-container" style={{ width: '100%', height: '100%' }}>
      <ResponsiveBar
        data={graphData}
        keys={keys}
        isFocusable={true}
        indexBy={indexBy}
        colors={colors}
        margin={
          showLegend
            ? {
              top: 40,
              right: 80,
              bottom: legendData && legendData.length >= 4 ? 120 : 80,
              left: 80
            }
            : {
              top: 40,
              right: 80,
              bottom: windowDimensions.width! > 1850 ? 130 : windowDimensions.width! > 1700 ? 160 : 220,
              left: 80
            }
        }
        groupMode={groupMode}
        padding={0.3}
        innerPadding={2}
        borderRadius={1}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickValues: bottomTickValues,
          tickSize: 0,
          tickPadding: 15,
          legend: axisBottomLegend,
          legendOffset: 50,
          legendPosition: 'middle',
          renderTick: (e: Any) => {
            return (
              <g transform={`translate(${e.x},${e.y})`} className="bottom-tick">
                <foreignObject x={-50} y={0} width={100} height={40}>
                  <div {...({ xmlns: 'http://www.w3.org/1999/xhtml' } as Any)} style={{
                    maxWidth: '10ch',
                    wordBreak: 'keep-all',
                    textAlign: 'center',
                    color: 'black',
                    fontSize: 12,
                    fontWeight: 400,
                    margin: '0 auto'
                  }}>{e.value}</div>
                </foreignObject>
              </g>
            );
          }
        }}
        gridYValues={5}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: axisLeftLegend,
          legendPosition: 'middle',
          legendOffset: -50,
          truncateTickAt: 0,
          tickValues: 5, //number of tickvalues displayed along the ax
          renderTick: (e) => {
            return (
              <g transform={`translate(${e.x},${e.y})`}>
                <text
                  x={-20}
                  y={5}
                  textAnchor="middle"
                  style={{
                    fill: 'black',
                    fontSize: 12,
                    fontWeight: 400
                  }}
                >
                  {(e.value / axisLeftTickFactor) % 1 != 0
                    ? ''
                    : numberWithSpacesRegex(e.value / axisLeftTickFactor)}
                </text>
              </g>
            );
          }
        }}
        enableLabel={false}
        legends={
          showLegend && legendData
            ? legendData.length >= 4
              ? [
                // First row - first half of items
                {
                  ...legendProps,
                  data: legendData.slice(0, Math.ceil(legendData.length / 2)),
                  direction: "row",
                  anchor: "bottom",
                  translateX: 0,
                  translateY: 70,
                  itemsSpacing: 40,
                  itemWidth: 120,
                  itemHeight: 25,
                  symbolSize: 15,
                },
                // Second row - second half of items
                {
                  ...legendProps,
                  data: legendData.slice(Math.ceil(legendData.length / 2)),
                  direction: "row",
                  anchor: "bottom",
                  translateX: 0,
                  translateY: 100,
                  itemsSpacing: 40,
                  itemWidth: 120,
                  itemHeight: 25,
                  symbolSize: 15,
                }
              ]
              : [
                {
                  ...legendProps,
                  data: legendData,
                  direction: "row",
                  anchor: "bottom",
                  translateX: 0,
                  translateY: 70,
                  itemsSpacing: 50,
                }
              ]
            : []
        }
        tooltip={tooltip}
        role="application"
      />
    </div>
  );
};

export const NivoBarChartCatnat = ({
  graphData,
  keys,
  indexBy,
  bottomTickValues,
  colors,
  legendData,
  tooltip,
  axisLeftLegend,
  axisBottomLegend,
  axisLeftTickFactor = 1,
  groupMode = 'stacked',
  showLegend = true
}: NivoBarChartProps) => {
  const windowDimensions = useWindowDimensions();
  return (
    <div className="nivo-bar-chart-container" style={{ width: '100%', height: '100%' }}>
      <ResponsiveBar
        data={graphData}
        keys={keys}
        isFocusable={true}
        indexBy={indexBy}
        colors={colors}
        margin={
          showLegend
            ? {
              top: 40,
              right: 100,
              bottom: legendData && legendData.length >= 4 ? 120 : 80,
              left: 80
            }
            : {
              top: 40,
              right: windowDimensions.width && windowDimensions.width < 600 ? 30 : 100,
              bottom: windowDimensions.width && windowDimensions.width < 600 ? 250 : 150,
              left: 80
            }
        }
        groupMode={groupMode}
        padding={0.3}
        innerPadding={2}
        borderRadius={1}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickValues: bottomTickValues,
          tickSize: 0,
          tickPadding: 15,
          legend: axisBottomLegend,
          renderTick: (e: Any) => {
            return (
              <g transform={`translate(${e.x},${e.y})`} className="bottom-tick">
                <foreignObject x={-50} y={0} width={100} height={40}>
                  <div {...({ xmlns: 'http://www.w3.org/1999/xhtml' } as Any)} style={{
                    maxWidth: '10ch',
                    wordBreak: 'keep-all',
                    textAlign: 'center',
                    color: 'black',
                    fontSize: 12,
                    fontWeight: 400,
                    margin: '0 auto'
                  }}>{e.value}</div>
                </foreignObject>
              </g>
            );
          }
        }}
        gridYValues={5}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: axisLeftLegend,
          legendPosition: 'middle',
          legendOffset: -50,
          truncateTickAt: 0,
          tickValues: 5,
          renderTick: (e) => {
            return (
              <g transform={`translate(${e.x},${e.y})`}>
                <text
                  x={-20}
                  y={5}
                  textAnchor="middle"
                  style={{
                    fill: 'black',
                    fontSize: 12,
                    fontWeight: 400
                  }}
                >
                  {(e.value / axisLeftTickFactor) % 1 != 0
                    ? ''
                    : numberWithSpacesRegex(e.value / axisLeftTickFactor)}
                </text>
              </g>
            );
          }
        }}
        enableLabel={false}
        legends={
          showLegend && legendData
            ? legendData.length >= 4
              ? [
                // First row - first half of items
                {
                  ...legendProps,
                  data: legendData.slice(0, Math.ceil(legendData.length / 2)),
                  direction: "row",
                  anchor: "bottom",
                  translateX: 0,
                  translateY: 70,
                  itemsSpacing: 40,
                  itemWidth: 120,
                  itemHeight: 25,
                  symbolSize: 15,
                },
                // Second row - second half of items
                {
                  ...legendProps,
                  data: legendData.slice(Math.ceil(legendData.length / 2)),
                  direction: "row",
                  anchor: "bottom",
                  translateX: 0,
                  translateY: 100,
                  itemsSpacing: 40,
                  itemWidth: 120,
                  itemHeight: 25,
                  symbolSize: 15,
                }
              ]
              : [
                {
                  ...legendProps,
                  data: legendData,
                  direction: "row",
                  anchor: "bottom",
                  translateX: 0,
                  translateY: 70,
                  itemsSpacing: 50,
                }
              ]
            : []
        }
        tooltip={tooltip}
        role="application"
      />
    </div>
  );
};
