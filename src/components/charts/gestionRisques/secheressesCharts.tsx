import { CarteParCommuneAvecLegende } from '@/components/maps/carteParCommuneAvecLegende';
import type { CarteParCommune } from '@/components/maps/mapPartParCommune';
import SubTabs from '@/components/ui/SubTabs';
import { transformerRestrictionsParAnneeUnique, transformerRestrictionsSaisons } from '@/lib/charts/gestionRisques';
import { SecheressesPasseesModel } from '@/lib/postgres/models';
import styles from './gestionRisquesCharts.module.scss';
import { SecheressesBarChart } from './secheressesBarChart';
import { SecheressesSaisonsBarChart } from './secheressesSaisonsBarChart';

type Props = {
  datavizTab: string;
  setDatavizTab: (value: string) => void;
  secheresses: SecheressesPasseesModel[];
  carte: CarteParCommune | null;
};


const SecheressesCharts = (props: Props) => {
  const {
    datavizTab,
    setDatavizTab,
    secheresses,
    carte
  } = props;

  const toutesLesRestrictions = secheresses.flatMap(s =>
    s.restrictions
      ? JSON.parse(s.restrictions.replace(/None/g, 'null').replace(/'/g, '"'))
      : []
  );
  const restrictionsParAnnee = transformerRestrictionsParAnneeUnique(toutesLesRestrictions);
  const restrictionsParSaison = transformerRestrictionsSaisons(toutesLesRestrictions);
  return (
    <div className={styles.dataWrapper}>
      <div className={styles.graphTabsWrapper}>
        <SubTabs
          data={['Intensité', 'Saisonnalité', ...(carte ? ['Cartographie'] : [])]}
          defaultTab={datavizTab}
          setValue={setDatavizTab}
        />
      </div>
      {datavizTab === 'Intensité' ? (
        <SecheressesBarChart restrictionsParAnnee={restrictionsParAnnee} />
      ) : datavizTab === 'Saisonnalité' ? (
        <SecheressesSaisonsBarChart restrictionsParSaison={restrictionsParSaison} />
      ) : datavizTab === 'Cartographie' && carte ? (
        <CarteParCommuneAvecLegende carte={carte} />
      ) : (
        ''
      )}
    </div>
  );
};

export default SecheressesCharts;
