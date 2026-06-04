// @ts-nocheck
'use client';

import useWindowDimensions from '@/hooks/windowDimensions';
import { IncendiesForet } from '@/lib/postgres/models';
import { CountOcc } from '@/lib/utils/reusableFunctions/occurencesCount';
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import { animated } from '@react-spring/web';
import styles from '../charts.module.scss';
import { simplePieChartCountTooltip } from '../ChartTooltips';
import NivoPieChart from '../NivoPieChart';

const colors: { [key: string]: string } = {
  Malveillance: '#91D1CC',
  Accidentelle: '#038278',
  'Involontaire (particulier)': '#095D55',
  'Involontaire (travaux)': '#05413B',
  Naturelle: '#D3EDEB',
  Inconnues: '#d7f8ff'
};

const PieChartFeuxForet = (props: { incendiesForet: IncendiesForet[] }) => {
  const { incendiesForet } = props;
  const windowDimensions = useWindowDimensions();
  const countTypes = CountOcc(incendiesForet, 'nature');
  const graphData = Object.entries(countTypes).map(([id, value]) => ({
    id,
    count: value,
    value: value / Sum(Object.values(countTypes)) * 100
  }));

  const arcLabelsComponent = ({ datum, label, style }: ArcLinkLabelComponent<ComputedDatum<{
    id: string;
    value: number;
  }>>) => {
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
              if (label.length <= 15) {
                return label;
              }
              // Trouver le dernier espace avant ou à la position 15
              const breakPoint = label.lastIndexOf(' ', 15);
              // Si aucun espace n'est trouvé dans les 15 premiers caractères, chercher le premier espace après
              if (breakPoint === -1) {
                const nextSpace = label.indexOf(' ', 15);
                if (nextSpace === -1) {
                  // Pas d'espace trouvé, retourner le label complet
                  return label;
                }
                return (
                  <>
                    {label.slice(0, nextSpace)}
                    <tspan x="0" dy="1.2em">{label.slice(nextSpace + 1)}</tspan>
                  </>
                );
              }
              return (
                <>
                  {label.slice(0, breakPoint)}
                  <tspan x="0" dy="1.2em">{label.slice(breakPoint + 1)}</tspan>
                </>
              );
            })()}
          </animated.tspan>
          <animated.tspan style={{ fontWeight: 600 }} x="0" dy="1.2em">
            {datum.value}{' '}
          </animated.tspan>
          <animated.tspan>
            ({((100 * datum.value) / Sum(Object.values(countTypes))).toFixed(1)}%)
          </animated.tspan>
        </animated.text>
      </animated.g>
    );
  };

  return (
    <div className={styles.responsivePieContainer}>
      <NivoPieChart
        graphData={graphData}
        colors={(graphData) => colors[graphData.id]}
        tooltip={({ datum }) => simplePieChartCountTooltip({ datum, unite: 'ha' })}
      />
    </div>
  );
};

export default PieChartFeuxForet;
