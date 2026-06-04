'use client';

import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { ProgressBarDataSurfacesAgricoles } from '@/lib/charts/surfacesAgricoles';
import { SurfacesAgricolesModel } from '@/lib/postgres/models';
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import { useSearchParams } from 'next/navigation';
import { SubAccordionGraph } from '../subAccordionGraph';
import styles from './agriculture.module.scss';

type graphDataItem = {
  [key: string]: {
    id: string;
    value: number | null;
    color: string;
  }[];
}

const SurfacesAgricolesProgressBar = ({
  surfacesAgricoles
}: {
  surfacesAgricoles: SurfacesAgricolesModel[];
}) => {
  const searchParams = useSearchParams();
  const libelle = searchParams.get('libelle');
  const graphData = ProgressBarDataSurfacesAgricoles(surfacesAgricoles);
  const superficieSau = Sum(surfacesAgricoles.map(el => Number(el.superficie_sau)));
  return (
    <div className={styles.surfacesAgricolesWrapper}>
      {libelle && surfacesAgricoles.length ? (
        <>
          {graphData
            .map((item, index) => (
              <SubAccordionGraph
                key={index}
                graphDataItem={item as unknown as graphDataItem}
                superficieSau={superficieSau}
                isDefaultExpanded={index === 0 ? true : false}
              />
            ))}
        </>
      ) : (
        <div className='p-10 flex flex-row justify-center'>
          <DataNotFoundForGraph image={DataNotFound} />
        </div>
      )}
    </div>
  );
};

export default SurfacesAgricolesProgressBar;
