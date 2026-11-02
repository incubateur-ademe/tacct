"use client";
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { MicroNumberCircle } from '@/components/charts/MicroDataviz';
import { ExportButton } from '@/components/exports/ExportButton';
import DataNotFoundForGraph from "@/components/graphDataNotFound";
import { aot40Legends } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import type { ValeursTerritoire } from '@/components/maps/mapTilesAOT40';
import { Loader } from '@/components/ui/loader';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from "@/design-system/base/Textes";
import { AOT40 } from "@/lib/postgres/models";
import { AOT40AgricultureText } from '@/lib/staticTexts';
import { AOT40AgricultureDynamicText } from '@/lib/textesIndicateurs/agricultureDynamicTexts';
import { AOT40AgricultureTooltipText } from '@/lib/tooltipTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { Skeleton } from 'antd';
import type { Geometry } from 'geojson';
import { useSearchParams } from "next/navigation";
import { lazy, Suspense, useMemo, useRef, useState } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapTilesAOT40 = lazy(() => import('@/components/maps/mapTilesAOT40').then(m => ({ default: m.MapTilesAOT40 })));

export const OzoneEtCultures = (props: {
  aot40: AOT40[];
  contoursCommunes: { geometry: string } | null;
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
}) => {
  const { aot40, contoursCommunes, coordonneesCommunes } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [valeurs, setValeurs] = useState<ValeursTerritoire | undefined>(undefined);

  const territoireGeometry = useMemo<Geometry | null>(
    () => (contoursCommunes ? JSON.parse(contoursCommunes.geometry) : null),
    [contoursCommunes]
  );
  const carteDisponible = Boolean(coordonneesCommunes && coordonneesCommunes.codes.length);
  const isOutreMer = coordonneesCommunes
    ? coordonneesCommunes.bbox.maxLat < 41 || coordonneesCommunes.bbox.maxLng < -6
    : false;
  const valeursTerritoire = carteDisponible && territoireGeometry ? valeurs : null;
  const enCalcul = valeursTerritoire === undefined && !isOutreMer;
  const exportData = IndicatorExportTransformations.biodiversite.aot40(aot40);

  return (
    <>
      <div className={styles.datavizMapContainer}>
        <div className={styles.chiffreDynamiqueWrapper} >
          {enCalcul ? (
            <div style={{ marginBottom: '0.875rem' }}>
              <Skeleton.Avatar active shape="circle" size={110} />
            </div>
          ) : valeursTerritoire && !isOutreMer && (
            <MicroNumberCircle
              valeur={valeursTerritoire.moyenne}
              arrondi={0}
              unite='µg/m³.h'
              ariaLabel="Exposition moyenne des cultures à l'ozone (AOT40) sur votre territoire, en microgrammes par mètre cube heure"
            />
          )}
          <div className={styles.text} style={enCalcul ? { flex: 1 } : undefined}>
            {enCalcul ? (
              <div role="status" aria-label="Calcul de l'exposition de votre territoire en cours" style={{ width: '100%' }}>
                <Skeleton active title={false} paragraph={{ rows: 3 }} />
              </div>
            ) : (
              <AOT40AgricultureDynamicText
                valeurs={valeursTerritoire}
                isOutreMer={isOutreMer}
                type={type}
              />
            )}
            <CustomTooltipNouveauParcours
              title={AOT40AgricultureTooltipText}
              texte="D'où vient ce chiffre ?"
            />
          </div>
        </div>
        <div className='pr-5 pt-8'>
          <ReadMoreFade
            maxHeight={100}
          >
            <AOT40AgricultureText />
          </ReadMoreFade>
        </div>
        <div className={styles.mapWrapper}>
          {coordonneesCommunes && coordonneesCommunes.codes.length ? (
            <Suspense fallback={<Loader />}>
              <MapTilesAOT40
                coordonneesCommunes={coordonneesCommunes}
                mapRef={mapRef}
                mapContainer={mapContainer}
                bucketUrl="aot40"
                layer="aot40"
                territoireGeometry={territoireGeometry}
                onValeursTerritoire={setValeurs}
                paint={{
                  'fill-color': [
                    'step',
                    ['round', ['get', 'valeur']],
                    '#A4F5EE',
                    3000,
                    '#C4E8A3',
                    6000,
                    '#F5E290',
                    9000,
                    '#FFAB66',
                    10000,
                    '#FC9999',
                    11000,
                    '#F37D7D',
                    12000,
                    '#E06060',
                    15000,
                    '#C97189',
                    18000,
                    '#B982B2'
                  ],
                  'fill-opacity': 0.7,
                  'fill-antialias': false
                }}
                legend={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                    <Body weight='bold'>- Ozone en μg/m³.heure -</Body>
                    <LegendCompColor legends={aot40Legends} />
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
        <Body size='sm' style={{ color: "var(--gris-dark)" }}>
          Source : INERIS, 2024 (consultée en mai 2026)
        </Body>
        {
          aot40.length && contoursCommunes ? (
            <ExportButton
              data={exportData}
              baseName="aot_40"
              type={type}
              libelle={libelle}
              code={code}
              sheetName="AOT 40"
              anchor='Ozone-et-cultures'
            />
          ) : null}
      </div>
    </>
  );
};
