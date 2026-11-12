'use client';

import { CarteParCommuneAvecLegende } from '@/components/maps/carteParCommuneAvecLegende';
import type { CarteParCommune } from '@/components/maps/mapPartParCommune';
import SubTabs from '@/components/ui/SubTabs';
import { ReactNode, useState } from 'react';
import styles from './inconfortThermiqueCharts.module.scss';

export const OngletsGraphiqueCarte = (props: {
  ongletGraphique: 'Évolution' | 'Répartition';
  graphique: ReactNode;
  carte: CarteParCommune | null;
}) => {
  const { ongletGraphique, graphique, carte } = props;
  const [datavizTab, setDatavizTab] = useState<string>(ongletGraphique);

  if (!carte) return <>{graphique}</>;

  return (
    <div className={styles.dataWrapper}>
      <div className={styles.graphTabsWrapper}>
        <SubTabs
          data={[ongletGraphique, 'Cartographie']}
          defaultTab={datavizTab}
          setValue={setDatavizTab}
        />
      </div>
      {datavizTab === 'Cartographie' ? (
        <CarteParCommuneAvecLegende carte={carte} />
      ) : (
        graphique
      )}
    </div>
  );
};
