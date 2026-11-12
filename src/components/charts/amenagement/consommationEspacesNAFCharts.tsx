'use client';

import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { ConsommationEspacesNAFBarChart } from '@/components/charts/amenagement/consommationEspacesNAFBarChart';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { espacesNAFBarChartLegend, espacesNAFDatavizLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import RangeSlider from '@/components/Slider';
import { Loader } from '@/components/ui/loader';
import SubTabs from '@/components/ui/SubTabs';
import { Body } from '@/design-system/base/Textes';
import { ConsommationNAF } from '@/lib/postgres/models';
import { useSearchParams } from 'next/navigation';
import { lazy, Suspense, useMemo, useState } from 'react';
import styles from './amenagementCharts.module.scss';

const MapEspacesNaf = lazy(() =>
  import('@/components/maps/mapEspacesNAF').then((m) => ({
    default: m.MapEspacesNaf
  }))
);

export const ConsommationEspacesNAFCharts = (props: {
  consommationNAF: ConsommationNAF[];
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
}) => {
  const { consommationNAF, coordonneesCommunes } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const [datavizTab, setDatavizTab] = useState<string>('Évolution');
  const [typeValue, setTypeValue] = useState<string>('Tous types');
  const [sliderValue, setSliderValue] = useState<number[]>([2011, 2025]);
  const filteredConsommationNAF = type === 'commune'
    ? consommationNAF.filter((item) => item.code_geographique === code)
    : consommationNAF;
  const afficherCarte = type !== 'commune' && coordonneesCommunes !== null;
  const boundingBox = useMemo<[[number, number], [number, number]] | undefined>(
    () =>
      coordonneesCommunes
        ? [
          [coordonneesCommunes.bbox.minLng, coordonneesCommunes.bbox.minLat],
          [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.maxLat]
        ]
        : undefined,
    [coordonneesCommunes]
  );

  return (
    <>
      {
        filteredConsommationNAF.length > 0 ? (
          <div className={styles.dataWrapper}>
            {afficherCarte && (
              <div className={styles.graphTabsWrapper} style={{ justifyContent: 'flex-end' }}>
                <SubTabs
                  data={['Évolution', 'Cartographie']}
                  defaultTab={datavizTab}
                  setValue={setDatavizTab}
                />
              </div>
            )}
            {afficherCarte && datavizTab === 'Cartographie' ? (
              <Suspense
                fallback={
                  <div className="flex justify-center w-full">
                    <Loader height="500px" />
                  </div>
                }
              >
                <div className="w-full">
                  <MapEspacesNaf
                    consommationNAF={consommationNAF}
                    communesCodes={coordonneesCommunes?.codes ?? []}
                    boundingBox={boundingBox}
                  />
                </div>
                <div
                  className={styles.legend}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <Body weight="bold">
                    - Nombre d’hectares d’espaces naturels, agricoles ou forestiers consommés -
                  </Body>
                  <LegendCompColor legends={espacesNAFDatavizLegend} />
                </div>
              </Suspense>
            ) : (
              <>
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
              </>
            )}
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
