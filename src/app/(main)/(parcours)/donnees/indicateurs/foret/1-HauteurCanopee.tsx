'use client';
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { Loader } from '@/components/ui/loader';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { HauteurCanopeeTooltipText } from '@/lib/tooltipTexts';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useSearchParams } from 'next/navigation';
import { lazy, Suspense, useRef } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapCanopeeLazy = lazy(() => import('@/components/maps/mapCanopee').then(m => ({ default: m.MapCanopee })));

export const HauteurCanopee = ({
  coordonneesCommunes,
  contoursCommunes
}: {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  contoursCommunes: { geometry: string } | null;
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  return (
    <>
      <div className={styles.datavizMapContainer}>
        <div
          className={styles.chiffreDynamiqueWrapper}
          style={{ alignItems: 'center' }}
        >
          <div className={styles.text}>
            <p>TEST</p>
            <CustomTooltipNouveauParcours
              title={HauteurCanopeeTooltipText}
              texte="D'où vient ce chiffre ?"
            />
          </div>
        </div>
        <div className='pr-5 pt-8'>
          <ReadMoreFade maxHeight={100}>
            <div>
              COUCOU
            </div>
          </ReadMoreFade>
        </div>
        <div className={styles.mapWrapper}>
          {coordonneesCommunes && coordonneesCommunes.codes.length ? (
            <Suspense fallback={<Loader />}>
              <MapCanopeeLazy
                coordonneesCommunes={coordonneesCommunes}
                contoursCommunes={contoursCommunes}
                mapRef={mapRef}
                mapContainer={mapContainer}
              />
            </Suspense>
          ) : (
            <div className="p-10 flex flex-row justify-center">
              <DataNotFoundForGraph image={DataNotFound} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.sourcesExportMapWrapper}>
        <Body size="sm" style={{ color: 'var(--gris-dark)' }}>
          Source :
        </Body>
      </div>
    </>
  );
};
