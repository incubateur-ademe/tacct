'use client';

import WarningIcon from '@/assets/icons/exclamation_point_icon_black.png';
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { AgricultureBioBarChart } from '@/components/charts/biodiversite/agricultureBioBarChart';
import { AgricultureBioPieCharts } from '@/components/charts/biodiversite/agricultureBioPieCharts';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { agricultureBioBarChartLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import RangeSlider from '@/components/Slider';
import SubTabs from '@/components/ui/SubTabs';
import { Body } from '@/design-system/base/Textes';
import { AgricultureBio } from '@/lib/postgres/models';
import { multipleEpciBydepartementLibelle } from '@/lib/territoireData/multipleEpciBydepartement';
import { multipleEpciByPnrLibelle } from '@/lib/territoireData/multipleEpciByPnr';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from './biodiversiteCharts.module.scss';

const SurfacesEnBioCharts = ({
  agricultureBio,
  datavizTab,
  setDatavizTab
}: {
  agricultureBio: AgricultureBio[];
  datavizTab: string;
  setDatavizTab: (value: string) => void;
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  const territoiresPartiellementCouverts =
    type === 'departement'
      ? multipleEpciBydepartementLibelle.find(
        (dept) => dept.departement === code
      )?.liste_epci_multi_dept
      : type === 'pnr'
        ? multipleEpciByPnrLibelle.find((pnr) => pnr.libelle_pnr === libelle)
          ?.liste_epci_multi_pnr
        : undefined;
  const [sliderValue, setSliderValue] = useState<number[]>([2008, 2024]);
  return (
    <>
      {agricultureBio.length !== 0 ? (
        <div className={styles.dataWrapper}>
          <div className={styles.graphTabsWrapper}>
            <SubTabs
              data={['Répartition', 'Évolution']}
              defaultTab={datavizTab}
              setValue={setDatavizTab}
            />
          </div>
          {datavizTab === 'Répartition' ? (
            <>
              <AgricultureBioPieCharts agricultureBio={agricultureBio} />
              {territoiresPartiellementCouverts &&
                territoiresPartiellementCouverts.length > 0 && (
                  <div className={styles.warningBox}>
                    <div className="flex flex-row items-center justify-center">
                      <Image
                        src={WarningIcon}
                        alt="Attention"
                        width={24}
                        height={24}
                        style={{ marginRight: '0.5em', alignItems: 'center' }}
                      />
                      <Body size="xs">
                        {territoiresPartiellementCouverts.length} EPCI{' '}
                        {territoiresPartiellementCouverts.length === 1
                          ? 'déborde'
                          : 'débordent'}{' '}
                        de votre périmètre
                      </Body>
                    </div>
                  </div>
                )}
            </>
          ) : (
            <>
              <div className={styles.sliderWrapper}>
                <RangeSlider
                  firstValue={2008}
                  lastValue={2023}
                  minDist={1}
                  setSliderValue={setSliderValue}
                  sliderValue={sliderValue}
                />
              </div>
              <AgricultureBioBarChart
                agricultureBio={agricultureBio}
                sliderValue={sliderValue}
              />
              <div className={styles.legend} style={{ paddingBottom: '1rem' }}>
                <LegendCompColor legends={agricultureBioBarChartLegend} />
              </div>
              {territoiresPartiellementCouverts &&
                territoiresPartiellementCouverts.length > 0 && (
                  <div className={styles.warningBox}>
                    <div className="flex flex-row items-center justify-center">
                      <Image
                        src={WarningIcon}
                        alt="Attention"
                        width={24}
                        height={24}
                        style={{ marginRight: '0.5em', alignItems: 'center' }}
                      />
                      <Body size="xs">
                        Attention, {territoiresPartiellementCouverts.length}{' '}
                        EPCI ne{' '}
                        {territoiresPartiellementCouverts.length === 1
                          ? 'fait'
                          : 'font'}{' '}
                        que partiellement partie de votre territoire
                      </Body>
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      ) : (
        <div className={styles.dataWrapper} style={{ padding: '1rem' }}>
          <DataNotFoundForGraph image={DataNotFound} />
        </div>
      )}
    </>
  );
};

export default SurfacesEnBioCharts;
