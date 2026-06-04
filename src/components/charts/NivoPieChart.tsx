//@ts-nocheck
'use client';

import useWindowDimensions from '@/hooks/windowDimensions';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { Any } from '@/lib/utils/types';
import { OrdinalColorScaleConfig } from '@nivo/colors';
import { ComputedDatum, DefaultRawDatum, PieCustomLayerProps, PieTooltipProps, ResponsivePie } from '@nivo/pie';
import { animated } from '@react-spring/web';
import { FC, ReactNode } from 'react';
import styles from './charts.module.scss';


type NivoPieChartProps = {
  graphData: readonly {
    id: string;
    count: number | null;
    color: string;
    value: number | null;
}[];
  CenteredMetric?: ({ dataWithArc, centerX, centerY }: PieCustomLayerProps<DefaultRawDatum>) => ReactNode;
  colors?: OrdinalColorScaleConfig<Omit<ComputedDatum<{
    id: string;
    label: string;
    value: number;
  }>, "fill" | "color" | "arc">> | undefined;
  tooltip?: FC<PieTooltipProps<{
    id: string;
    label: string;
    value: number;
  }>> | undefined;
  unit?: string;
  arrondi?: number;
};

const NivoPieChart = ({
  graphData,
  CenteredMetric,
  colors,
  tooltip,
  unit,
  arrondi = 0
}: NivoPieChartProps) => {
  // filtrer les null ou undefined values
  const filteredGraphData = graphData.filter(item => item.value !== null && item.value !== undefined);
  const windowDimensions = useWindowDimensions();
  const arcLabelsComponent = ({ datum, style }: Any) => {
    return (
      <animated.g style={style}>
        <animated.path
          fill="none"
          stroke={datum.color}
          strokeWidth={style.thickness}
          d={style.path}
        />
        <animated.text
          transform={style.textPosition}
          dominantBaseline="central"
          style={{
            fontSize: 12,
            fontWeight: 400
          }}
        >
          <animated.tspan>
            {(() => {
              if (datum.label.length <= 15) {
                return datum.label + ' :';
              }
              // Trouver le dernier espace avant ou à la position 15
              const breakPoint = datum.label.lastIndexOf(' ', 15);
              // Si aucun espace n'est trouvé dans les 15 premiers caractères, chercher le premier espace après
              if (breakPoint === -1) {
                const nextSpace = datum.label.indexOf(' ', 15);
                if (nextSpace === -1) {
                  // Pas d'espace trouvé, retourner le datum.label complet
                  return datum.label;
                }
                return (
                  <>
                    {datum.label.slice(0, nextSpace)}
                    <tspan x="0" dy="1.2em">{datum.label.slice(nextSpace + 1)}</tspan>
                  </>
                );
              }
              return (
                <>
                  {datum.label.slice(0, breakPoint)}
                  <tspan x="0" dy="1.2em">{datum.label.slice(breakPoint + 1)} :</tspan>
                </>
              );
            })()}
          </animated.tspan>
          <animated.tspan style={{ fontWeight: 600 }} x="0" dy="1.2em">
            {Round(datum.data.count ? datum.data.count : datum.data.value, arrondi)} {unit}{' '}
          </animated.tspan>
          <animated.tspan>
            ({Round(datum.value, 1)} %) {/* 100 * datum.arc.angleDeg / 360 */}
          </animated.tspan>
        </animated.text>
      </animated.g>
    );
  };

  return (
    <div className={styles.responsivePieContainer}>
      <ResponsivePie
        data={filteredGraphData}
        margin={{
          top: windowDimensions.width && windowDimensions.width > 1248 ? 70 : 20,
          right: 10,
          bottom: windowDimensions.width && windowDimensions.width > 1248 ? 70 : 2,
          left: 10
        }}
        colors={colors}
        isInteractive={true}
        innerRadius={0.5}
        padAngle={1}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        enableArcLinkLabels={windowDimensions.width && windowDimensions.width > 1248 ? true : false}
        arcLinkLabelComponent={arcLabelsComponent}
        arcLinkLabel={({ id }) => `${id}`}
        arcLinkLabelsSkipAngle={20}
        sortByValue={false}
        layers={CenteredMetric ? [
          'arcs',
          'arcLinkLabels',
          CenteredMetric
        ] : [
          'arcs',
          'arcLinkLabels'
        ]}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]]
        }}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLinkLabelsOffset={15}
        arcLinkLabelsDiagonalLength={16}
        arcLinkLabelsStraightLength={12}
        tooltip={tooltip}
      />
    </div>
  )
}

export default NivoPieChart;
