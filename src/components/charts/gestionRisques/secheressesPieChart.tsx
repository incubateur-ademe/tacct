// @ts-nocheck
'use client';

import useWindowDimensions from '@/hooks/windowDimensions';
import { SecheressesParsed } from '@/lib/postgres/models';
import styles from '../charts.module.scss';
import NivoPieChart from '../NivoPieChart';

const SecheressesPieChart = (props: { secheresses: SecheressesParsed[] }) => {
  const { secheresses } = props;
  const windowDimensions = useWindowDimensions();

  // Compter les occurrences de chaque type d'eau
  const typeCounts: Record<string, number> = {
    'SOU': 0,
    'SUP': 0,
    'AEP': 0
  };

  secheresses.forEach(secheresse => {
    for (let year = 2013; year <= 2024; year++) {
      const restrictionsKey = `restrictions_${year}`;
      const restrictions = secheresse[restrictionsKey];
      
      if (restrictions && Array.isArray(restrictions)) {
        restrictions.forEach((restriction) => {
          const type = restriction.zas?.type;
          if (type && typeCounts[type] !== undefined) {
            typeCounts[type]++;
          }
        });
      }
    }
  });

  // Transformer en format pour le PieChart
  const typeLabels: Record<string, string> = {
    'SOU': 'Eau souterraine',
    'SUP': 'Eau superficielle',
    'AEP': 'Eau potable'
  };

  const graphData = Object.entries(typeCounts)
    .filter(([_, value]) => value > 0)
    .map(([type, value]) => ({
      id: typeLabels[type],
      label: typeLabels[type],
      value: value / Object.values(typeCounts).reduce((a, b) => a + b, 0) * 100,
      count: value
    }));

  return (
    <div className={styles.responsivePieContainer}>
      <NivoPieChart
        graphData={graphData}
      />
    </div>
  )
}

export default SecheressesPieChart;
