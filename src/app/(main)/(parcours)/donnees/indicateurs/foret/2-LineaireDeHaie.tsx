"use client";
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { ExportPngMaplibreButton } from '@/components/exports/ExportPng';
import DataNotFoundForGraph from "@/components/graphDataNotFound";
import { Loader } from '@/components/ui/loader';
import { Body } from "@/design-system/base/Textes";
import { useSearchParams } from "next/navigation";
import { lazy, Suspense, useRef } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapHaies = lazy(() => import('@/components/maps/mapHaies').then(m => ({ default: m.MapHaies })));
const MapHaiesWFS = lazy(() => import('@/components/maps/mapHaiesWFS').then(m => ({ default: m.MapHaiesWfs })));

export const LineaireDeHaie = ({
  coordonneesCommunes,
  contoursCommunes
}: {
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
  contoursCommunes: { geometry: string } | null;
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainer2 = useRef<HTMLDivElement>(null);
  const mapRef2 = useRef<maplibregl.Map | null>(null);



  return (
    <>
      <div className={styles.datavizMapContainer}>
        Linéraire de haie texte
        <div className={styles.mapWrapper}>
          {
            coordonneesCommunes ? (
              <div>
                <Suspense fallback={<Loader />}>
                  <MapHaiesWFS
                    coordonneesCommunes={coordonneesCommunes}
                    contoursCommunes={contoursCommunes}
                    mapRef={mapRef}
                    mapContainer={mapContainer}
                  />
                  <MapHaies
                    coordonneesCommunes={coordonneesCommunes}
                    contoursCommunes={contoursCommunes}
                    mapRef={mapRef2}
                    mapContainer={mapContainer2}
                  />
                </Suspense>
              </div>
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
          Source : IGN
        </Body>
        <ExportPngMaplibreButton
          mapRef={mapRef}
          mapContainer={mapContainer}
          fileName={`Lineaire_de_haie_${type}_${libelle}`}
          anchor='Linéaire de haie'
          type={type}
          libelle={libelle}
          code={code}
          thematique="lineaire_de_haie"
        />
      </div>
    </>
  );
};
