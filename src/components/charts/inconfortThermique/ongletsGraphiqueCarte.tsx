'use client';

import { LegendCompColor } from '@/components/maps/legends/legendComp';
import type { CarteParCommune } from '@/components/maps/mapPartParCommune';
import { Loader } from '@/components/ui/loader';
import SubTabs from '@/components/ui/SubTabs';
import { Body } from '@/design-system/base/Textes';
import { lazy, ReactNode, Suspense, useState } from 'react';
import styles from './inconfortThermiqueCharts.module.scss';

const MapPartParCommune = lazy(() =>
  import('@/components/maps/mapPartParCommune').then((m) => ({
    default: m.MapPartParCommune
  }))
);

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
        <Suspense
          fallback={
            <div className="flex justify-center">
              <Loader height="500px" />
            </div>
          }
        >
          <MapPartParCommune carte={carte} />
          <div className={styles.legend}>
            <Body weight="bold">- {carte.titreLegende} -</Body>
            <LegendCompColor
              legends={carte.classes.map(({ value, color }) => ({ value, color }))}
            />
          </div>
        </Suspense>
      ) : (
        graphique
      )}
    </div>
  );
};
