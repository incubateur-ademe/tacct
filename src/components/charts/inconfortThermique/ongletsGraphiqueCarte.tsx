'use client';

import camembertIcon from '@/assets/icons/camembert_icon_green.svg';
import cartographieIcon from '@/assets/icons/cartographie_icon_green.svg';
import evolutionIcon from '@/assets/icons/evolution_icon_green.svg';
import { CarteParCommuneAvecLegende } from '@/components/maps/carteParCommuneAvecLegende';
import type { CarteParCommune } from '@/components/maps/mapPartParCommune';
import SubTabs from '@/components/ui/SubTabs';
import { Onglets } from '@/design-system/base/Onglets';
import { ReactNode, useState } from 'react';
import styles from './inconfortThermiqueCharts.module.scss';

export const OngletsGraphiqueCarte = (props: {
  ongletGraphique: 'Évolution' | 'Répartition';
  graphique: ReactNode;
  carte: CarteParCommune | null;
  varianteOnglets?: 'souligne' | 'classeur';
}) => {
  const { ongletGraphique, graphique, carte, varianteOnglets } = props;
  const [datavizTab, setDatavizTab] = useState<string>(ongletGraphique);

  if (!carte) return <>{graphique}</>;

  const contenu =
    datavizTab === 'Cartographie' ? (
      <CarteParCommuneAvecLegende carte={carte} />
    ) : (
      graphique
    );

  if (varianteOnglets) {
    return (
      <div className={styles.dataWrapper}>
        <Onglets
          variante={varianteOnglets}
          ariaLabel="Mode de représentation des données"
          onglets={[
            {
              libelle: ongletGraphique,
              icone: ongletGraphique === 'Répartition' ? camembertIcon : evolutionIcon
            },
            { libelle: 'Cartographie', icone: cartographieIcon }
          ]}
          ongletActif={datavizTab}
          onChange={setDatavizTab}
        >
          {contenu}
        </Onglets>
      </div>
    );
  }

  return (
    <div className={styles.dataWrapper}>
      <div className={styles.graphTabsWrapper}>
        <SubTabs
          data={[ongletGraphique, 'Cartographie']}
          defaultTab={datavizTab}
          setValue={setDatavizTab}
        />
      </div>
      {contenu}
    </div>
  );
};
