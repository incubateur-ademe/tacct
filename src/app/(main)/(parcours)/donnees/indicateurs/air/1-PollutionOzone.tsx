'use client';
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { MicroNumberCircle } from '@/components/charts/MicroDataviz';
import { ExportPngMaplibreButton } from '@/components/exports/ExportPng';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { o3Legend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import type { ValeursTerritoire } from '@/components/maps/valeursSurTerritoire';
import { Loader } from '@/components/ui/loader';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { O3AirText } from '@/lib/staticTexts';
import { O3AirDynamicText } from '@/lib/textesIndicateurs/airDynamicTexts';
import { O3AirTooltipText } from '@/lib/tooltipTexts';
import { Skeleton } from 'antd';
import type { Geometry } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useSearchParams } from 'next/navigation';
import { lazy, Suspense, useMemo, useRef, useState } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapTilesO3 = lazy(() =>
  import('@/components/maps/mapTilesO3').then((m) => ({
    default: m.MapTilesO3
  }))
);

export const PollutionOzone = ({
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
  const [valeurs, setValeurs] = useState<ValeursTerritoire | undefined>(undefined);

  const territoireGeometry = useMemo<Geometry | null>(
    () => (contoursCommunes ? (JSON.parse(contoursCommunes.geometry) as Geometry) : null),
    [contoursCommunes]
  );
  const carteDisponible = Boolean(coordonneesCommunes && coordonneesCommunes.codes.length);
  const isOutreMer = coordonneesCommunes
    ? coordonneesCommunes.bbox.maxLat < 41 || coordonneesCommunes.bbox.maxLng < -6
    : false;
  const valeursTerritoire = carteDisponible && territoireGeometry ? valeurs : null;
  const enCalcul = valeursTerritoire === undefined && !isOutreMer;

  return (
    <>
      <div className={styles.datavizMapContainer}>
        <div className={styles.chiffreDynamiqueWrapper}>
          {enCalcul ? (
            <div style={{ marginBottom: '0.875rem' }}>
              <Skeleton.Avatar active shape="circle" size={110} />
            </div>
          ) : valeursTerritoire && !isOutreMer && (
            <MicroNumberCircle
              valeur={valeursTerritoire.moyenne}
              arrondi={0}
              unite={Math.round(valeursTerritoire.moyenne) < 2 ? 'jour/an' : 'jours/an'}
              ariaLabel="Nombre moyen de jours par an où l'ozone a dépassé 120 µg/m³ sur 8 heures sur votre territoire, sur 2022-2024"
            />
          )}
          <div className={styles.text} style={enCalcul ? { flex: 1 } : undefined}>
            {enCalcul ? (
              <div role="status" aria-label="Calcul de l'exposition de votre territoire en cours" style={{ width: '100%' }}>
                <Skeleton active title={false} paragraph={{ rows: 3 }} />
              </div>
            ) : (
              <O3AirDynamicText
                valeurs={valeursTerritoire}
                isOutreMer={isOutreMer}
                type={type}
              />
            )}
            <CustomTooltipNouveauParcours
              title={O3AirTooltipText}
              texte="D'où vient ce chiffre ?"
            />
            <a
              className="sr-only"
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
            <O3AirText />
          </ReadMoreFade>
        </div>
        <div className={styles.mapWrapper}>
          {carteDisponible ? (
            <Suspense fallback={<Loader />}>
              <MapTilesO3
                coordonneesCommunes={coordonneesCommunes}
                mapRef={mapRef}
                mapContainer={mapContainer}
                bucketUrl="seuils_reglementaires_o3"
                layer="o3"
                territoireGeometry={territoireGeometry}
                onValeursTerritoire={setValeurs}
                paint={{
                  'fill-color': [
                    'step',
                    ['round', ['get', 'valeur']],
                    '#A4F5EE',
                    5,
                    '#C4E8A3',
                    10,
                    '#F5E290',
                    15,
                    '#FFAB66',
                    20,
                    '#FC9999',
                    25,
                    '#F37D7D',
                    30,
                    '#E06060',
                    35,
                    '#C97189',
                    40,
                    '#B982B2'
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
          Source : INERIS, 2024 (consultée en janvier 2026)
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
