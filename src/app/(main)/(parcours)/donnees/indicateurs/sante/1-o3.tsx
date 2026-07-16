'use client';
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { ExportPngMaplibreButton } from '@/components/exports/ExportPng';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { o3Legend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import { Loader } from '@/components/ui/loader';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { O3Text } from '@/lib/staticTexts';
import { O3DynamicText } from '@/lib/textesIndicateurs/biodiversiteDynamicTexts';
import { O3TooltipText } from '@/lib/tooltipTexts';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useSearchParams } from 'next/navigation';
import { lazy, Suspense, useRef } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapTilesO3 = lazy(() =>
  import('@/components/maps/mapTilesO3').then((m) => ({
    default: m.MapTilesO3
  }))
);

export const SeuilsReglementairesO3 = ({
  coordonneesCommunes
}: {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
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
            <O3DynamicText />
            <CustomTooltipNouveauParcours
              title={O3TooltipText}
              texte="D'où vient ce chiffre ?"
            />
            <a
              className="fr-sr-only"
              href="https://www.ineris.fr/fr/recherche-appui/risques-chroniques/mesure-prevision-qualite-air/qualite-air-france-metropolitaine"
              target="_blank"
              rel="noopener noreferrer"
            >
              Consulter la carte de la qualité de l&apos;air sur le site de
              l&apos;Ineris (nouvelle fenêtre)
            </a>
          </div>
        </div>
        <div className="pr-5 pt-8">
          <ReadMoreFade maxHeight={100}>
            <O3Text />
          </ReadMoreFade>
        </div>
        <div className={styles.mapWrapper}>
          {coordonneesCommunes && coordonneesCommunes.codes.length ? (
            <Suspense fallback={<Loader />}>
              <MapTilesO3
                coordonneesCommunes={coordonneesCommunes}
                mapRef={mapRef}
                mapContainer={mapContainer}
                bucketUrl="seuils_reglementaires_o3"
                layer="o3"
                paint={{
                  'fill-color': [
                    'step',
                    ['round', ['get', 'valeur']],
                    '#A4F5EE', // 0-4
                    5,
                    '#C4E8A3', // 5-9
                    10,
                    '#F5E290', // 10-14
                    15,
                    '#FFAB66', // 15-19
                    20,
                    '#FC9999', // 20-24
                    25,
                    '#F37D7D', // 25-29
                    30,
                    '#E06060', // 30-34
                    35,
                    '#C97189', // 35-39
                    40,
                    '#B982B2' // >= 40
                  ],
                  'fill-opacity': 0.7,
                  'fill-antialias': false
                }}
                legend={
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Body weight="bold">
                      - Nombre de jours avec dépassement du seuil (moyenne sur 3
                      ans) -
                    </Body>
                    <LegendCompColor legends={o3Legend} />
                  </div>
                }
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
          Source : INERIS, 2024 (consultée en janvier 2026)
        </Body>
        <ExportPngMaplibreButton
          mapRef={mapRef}
          mapContainer={mapContainer}
          documentDiv=".legendWrapper"
          fileName={`Seuils_reglementaires_o3_${type}_${libelle}`}
          anchor="Pollution-à-l’ozone"
          type={type}
          libelle={libelle}
          code={code}
          thematique="o3"
        />
      </div>
    </>
  );
};
