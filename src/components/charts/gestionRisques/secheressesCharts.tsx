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
};


const SecheressesCharts = (props: Props) => {
  const {
    datavizTab,
    setDatavizTab,
    secheresses,
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
          data={['Intensité', 'Saisonnalité']}
          defaultTab={datavizTab}
          setValue={setDatavizTab}
        />
      </div>
      {datavizTab === 'Intensité' ? (
        <SecheressesBarChart restrictionsParAnnee={restrictionsParAnnee} />
      ) : datavizTab === 'Saisonnalité' ? (
        <SecheressesSaisonsBarChart restrictionsParSaison={restrictionsParSaison} />
      ) : (
        ''
      )}
    </div>
  );
};

export default SecheressesCharts;
