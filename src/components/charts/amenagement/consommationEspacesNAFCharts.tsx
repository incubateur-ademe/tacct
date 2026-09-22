'use client';

import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { ConsommationEspacesNAFBarChart } from '@/components/charts/amenagement/consommationEspacesNAFBarChart';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { espacesNAFBarChartLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import RangeSlider from '@/components/Slider';
import SubTabs from '@/components/ui/SubTabs';
import { ConsommationNAF } from '@/lib/postgres/models';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from './amenagementCharts.module.scss';

export const ConsommationEspacesNAFCharts = (props: {
  consommationNAF: ConsommationNAF[];
}) => {
  const { consommationNAF } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const [typeValue, setTypeValue] = useState<string>('Tous types');
  const [sliderValue, setSliderValue] = useState<number[]>([2011, 2025]);
  const filteredConsommationNAF = type === 'commune'
    ? consommationNAF.filter((item) => item.code_geographique === code)
    : consommationNAF;

  return (
    <>
      {
        filteredConsommationNAF.length > 0 ? (
          <div className={styles.dataWrapper}>
            <div className={styles.graphTabsWrapper}>
              <SubTabs
                data={[
                  'Tous types',
                  'Habitat',
                  'Activité',
                  'Mixte',
                  'Routes',
                  'Ferroviaire',
                  'Inconnu'
                ]}
                defaultTab={typeValue}
                setValue={setTypeValue}
              />
            </div>
            <div className={styles.sliderWrapper}>
              <RangeSlider
                firstValue={2011}
                lastValue={2025}
                minDist={1}
                setSliderValue={setSliderValue}
                sliderValue={sliderValue}
              />
            </div>
            <ConsommationEspacesNAFBarChart
              consommationEspacesNAF={filteredConsommationNAF}
              sliderValue={sliderValue}
              filterValue={typeValue}
            />
            <div className={styles.legend} style={{ paddingBottom: '1rem' }}>
              <LegendCompColor legends={espacesNAFBarChartLegend} />
            </div>
          </div>
        ) : (
          <div className='p-6 flex flex-col justify-center h-full'>
            <DataNotFoundForGraph image={DataNotFound} />
          </div>
        )
      }
    </>
  );
};
