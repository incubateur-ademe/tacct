// @ts-nocheck
'use client';

import { Body } from '@/design-system/base/Textes';
import useWindowDimensions from '@/hooks/windowDimensions';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { Any } from '@/lib/utils/types';
import styles from '../charts.module.scss';
import NivoPieChart from '../NivoPieChart';

const PieChartAiresAppellationsControlees = (props: { airesAppellationsControlees: Any[] }) => {
  const { airesAppellationsControlees } = props;
  const windowDimensions = useWindowDimensions();
  const signesCount = new Map<string, number>();
  airesAppellationsControlees.forEach(({ signe }) => {
    signesCount.set(signe, (signesCount.get(signe) || 0) + 1);
  });
  const colors: Record<string, string> = {
    'AOC': '#00C190',
    'IGP': '#FF6B6B',
  };

  const total = Array.from(signesCount.values()).reduce((sum, count) => sum + count, 0);
  const graphData = Array.from(signesCount.entries()).map(([signe, count]) => ({
    id: signe,
    count,
    color: colors[signe] || '#CCCCCC',
    value: total > 0 ? (count / total) * 100 : 0,
  }));

  const CenteredMetric = ({
    dataWithArc,
    centerX,
    centerY
  }: PieCustomLayerProps<DefaultRawDatum>) => {
    const mainFontSize = windowDimensions?.width > 1248 ? 32 : windowDimensions?.width > 1024 ? 26 : 18;
    const subFontSize = Math.max(10, Math.round(mainFontSize / 3));
    const mainYOffset = -Math.round(mainFontSize / 2);
    const subYOffset = Math.round(subFontSize / 1.2);

    return (
      <>
        <text
          x={centerX}
          y={centerY + mainYOffset}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: `${mainFontSize}px`,
            fontWeight: 700,
          }}
        >
          {total}
        </text>
        <text
          x={centerX}
          y={centerY + subYOffset}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: `${subFontSize}px`,
            fontWeight: 400
          }}
        >
          appellation(s)
        </text>
        <text
          x={centerX}
          y={centerY + subYOffset + 20}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: `${subFontSize}px`,
            fontWeight: 400
          }}
        >
          contrôlée(s)
        </text>
      </>
    );
  };


  return (
    <div className={styles.responsivePieContainer}>
      <NivoPieChart
        graphData={graphData}
        colors={({ id }) => colors[id as string] || '#CCCCCC'}
        CenteredMetric={CenteredMetric}
        tooltip={({ datum }) => {
          return (
            <div className={styles.tooltipEvolutionWrapper}>
              <div className={styles.itemWrapper}>
                <div className={styles.titre}>
                  <div
                    className={styles.colorSquare}
                    style={{ background: datum.color }}
                  />
                  <Body size="sm">{datum.id} : <b>{Round(Number(datum.data.count), 0)} appellation(s) contrôlée(s)</b></Body>
                </div>
              </div>
            </div>
          )
        }}
      />
    </div>
  )
}

export default PieChartAiresAppellationsControlees;
