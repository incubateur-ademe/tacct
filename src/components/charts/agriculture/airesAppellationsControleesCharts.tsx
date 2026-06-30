"use client";

import SubTabs from '@/components/ui/SubTabs';
import styles from './agriculture.module.scss';
import PieChartAiresAppellationsControlees from "./pieChartAiresAppellationsControlees";

type Props = {
  datavizTab: string;
  setDatavizTab: (value: string) => void;
  airesAppellationsControlees: {
    nom: string;
    signe: string;
  }[];
};

const AiresAppellationsControleesCharts = (props: Props) => {
  const { datavizTab, setDatavizTab, airesAppellationsControlees } = props;

  return (
    <div className={styles.dataWrapper}>
      <div className={styles.graphTabsWrapper}>
        <SubTabs
          data={['Répartition']}
          defaultTab={datavizTab}
          setValue={setDatavizTab}
        />
      </div>
      {datavizTab === 'Répartition' ? (
        <PieChartAiresAppellationsControlees
          airesAppellationsControlees={airesAppellationsControlees}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default AiresAppellationsControleesCharts;
