"use client";
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import DataNotFoundForGraph from "@/components/graphDataNotFound";
import { Loader } from '@/components/ui/loader';
import { Body } from "@/design-system/base/Textes";
import type * as maplibregl from 'maplibre-gl';
import { useSearchParams } from "next/navigation";
import { lazy, Suspense, useRef } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapOCSGE = lazy(() => import('@/components/maps/mapOCSGE'));

export const OCSGE = ({
  coordonneesCommunes,
}: {
  coordonneesCommunes: {
    codes: string[],
    bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number }
  } | null;
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  return (
    <>
      <div className={styles.datavizMapContainer}>
        <div className={styles.mapWrapper}>
          {
            coordonneesCommunes ? (
              <Suspense fallback={<Loader />}>
                <MapOCSGE
                  coordonneesCommunes={coordonneesCommunes}
                  mapRef={mapRef}
                  mapContainer={mapContainer}
                  isLoading={false}
                />
              </Suspense>
            ) : (
              <div className='p-10 flex flex-row justify-center'>
                <DataNotFoundForGraph image={DataNotFound} />
              </div>
            )
          }
        </div>
      </div>
      <div className={styles.sourcesExportMapWrapper}>
        <Body size='sm' style={{ color: "var(--gris-dark)" }}>
          Source
        </Body>
      </div>
    </>
  );
};
