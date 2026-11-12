import { BarLineFeuxForet } from '@/components/charts/gestionRisques/BarLineFeuxForet';
import PieChartFeuxForet from '@/components/charts/gestionRisques/pieChartFeuxForet';
import { CarteParCommuneAvecLegende } from '@/components/maps/carteParCommuneAvecLegende';
import type { CarteParCommune } from '@/components/maps/mapPartParCommune';
import SubTabs from '@/components/ui/SubTabs';
import { IncendiesForet } from '@/lib/postgres/models';
import { CountOcc } from '@/lib/utils/reusableFunctions/occurencesCount';
import styles from './gestionRisquesCharts.module.scss';

type Props = {
  datavizTab: string;
  setDatavizTab: (value: string) => void;
  incendiesForet: IncendiesForet[];
  carte: CarteParCommune | null;
};

const FeuxForetCharts = (props: Props) => {
  const { datavizTab, setDatavizTab, incendiesForet, carte } = props;
  const sumTypes = Object.values(CountOcc(incendiesForet, 'nature')).reduce(
    (a, b) => a + b,
    0
  );
  const onglets = [
    ...(sumTypes > 3 ? ['Répartition'] : []),
    'Évolution',
    ...(carte ? ['Cartographie'] : [])
  ];
  const ongletActif = onglets.includes(datavizTab) ? datavizTab : onglets[0];

  return (
    <div className={styles.dataWrapper}>
      {onglets.length > 1 && (
        <div className={styles.graphTabsWrapper}>
          <SubTabs
            data={onglets}
            defaultTab={ongletActif}
            setValue={setDatavizTab}
          />
        </div>
      )}
      {ongletActif === 'Répartition' ? (
        <PieChartFeuxForet incendiesForet={incendiesForet} />
      ) : ongletActif === 'Cartographie' && carte ? (
        <CarteParCommuneAvecLegende carte={carte} />
      ) : (
        <BarLineFeuxForet incendiesForet={incendiesForet} />
      )}
    </div>
  );
};

export default FeuxForetCharts;
