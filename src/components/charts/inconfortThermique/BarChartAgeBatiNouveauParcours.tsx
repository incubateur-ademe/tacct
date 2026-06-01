'use client';

import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { DateConstructionResidencesLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import { Body } from '@/design-system/base/Textes';
import couleurs from '@/design-system/couleurs';
import useWindowDimensions from '@/hooks/windowDimensions';
import { ResponsiveBar } from '@/lib/nivo/bar';
import { isIOS } from '@/lib/utils/browser';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { wrapWords } from '@/lib/utils/string';
import { Any } from '@/lib/utils/types';
import styles from '../charts.module.scss';

type Props = {
  chartData: Array<{
    France: number;
    FranceColor: string;
    'Votre territoire'?: string;
    'Votre territoireColor'?: string;
    periode: string;
  }>;
};

export const BarChartAgeBatiNouveauParcours = ({ chartData }: Props) => {
  const sumAllCount = chartData.reduce((sum, item) => sum + (Number(item["Votre territoire"]) || 0), 0);
  const window = useWindowDimensions();
  return (
    <div style={{
      height: sumAllCount > 0 ? '500px' : "fit-content",
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '1rem'
    }}>
      {sumAllCount > 0 ?
        <>
          <ResponsiveBar
            data={chartData}
            keys={['Votre territoire', 'France']}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 1.6]]
            }}
            enableLabel={false}
            tooltip={({ id, value, color }) => (
              <div
                className={styles.tooltipEvolutionWrapper}
                style={{ right: '5rem' }}
              >
                <div className={styles.itemWrapper}>
                  <div className={styles.titre}>
                    <div
                      className={styles.colorSquare}
                      style={{ background: color }}
                    />
                    <Body size='sm'>{id} :</Body>
                    <Body size='sm' weight='bold'>{Round(value, 1)} %</Body>
                  </div>
                </div>
              </div>
            )}
            groupMode="grouped"
            indexBy="periode"
            margin={{ top: 50, right: 30, bottom: window.width! < 600 ? 120 : 80, left: 40 }}
            valueScale={{ type: 'linear' }}
            colors={[couleurs.graphiques.rouge[3], couleurs.graphiques.bleu[1]]}
            innerPadding={2}
            axisBottom={{
              renderTick: (e: Any) => {
                const isMobile = window.width! < 600;
                if (isIOS()) {
                  const lines = wrapWords(String(e.value));
                  return (
                    <g
                      transform={isMobile ? `translate(${e.x - 25},${e.y + 30})` : `translate(${e.x},${e.y})`}
                    >
                      <text
                        textAnchor="middle"
                        transform={isMobile ? 'rotate(-45)' : undefined}
                        style={{ fontSize: 12, fontWeight: 400, fill: '#23282B' }}
                      >
                        {lines.map((line, i) => (
                          <tspan key={i} x={0} dy={i === 0 ? '1em' : '1.2em'}>
                            {line}
                          </tspan>
                        ))}
                      </text>
                    </g>
                  );
                }
                return (
                  <g transform={`translate(${e.x},${e.y})`}>
                    <foreignObject x={-50} y={0} width={100} height={isMobile ? 100 : 45}>
                      <div style={{
                        maxWidth: '15ch',
                        wordBreak: 'keep-all',
                        textAlign: 'center',
                        fontSize: 12,
                        fontWeight: 400,
                        margin: isMobile ? '1.5rem 0' : '0.5rem 0',
                        lineHeight: "normal",
                        rotate: isMobile ? `-45deg` : undefined,
                      }}>{e.value}</div>
                    </foreignObject>
                  </g>
                );
              }
            }}
          />
          <div style={{ margin: "-2.5rem 0.5rem" }}>
            <LegendCompColor legends={DateConstructionResidencesLegend} />
          </div>
        </>
        : <div className='p-10 flex flex-row justify-center'><DataNotFoundForGraph image={DataNotFound} /></div>
      }
    </div>
  );
};
