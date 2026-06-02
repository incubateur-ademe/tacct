'use client';
import { ExportPngMaplibreButton } from '@/components/exports/ExportPng';
import { debroussaillementLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import { Loader } from '@/components/ui/loader';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { useHasMapData } from '@/hooks/useHasMapData';
import { DebroussaillementText } from '@/lib/staticTexts';
import { debroussaillementTooltipText } from '@/lib/tooltipTexts';
import { useSearchParams } from 'next/navigation';
import { lazy, Suspense, useRef } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapTiles = lazy(() => import('@/components/maps/mapTiles').then(m => ({ default: m.MapTiles })));

export const Debroussaillement = ({
  coordonneesCommunes
}: {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;

  const hasData = useHasMapData({
    bucketUrl: 'debroussaillement',
    layer: 'debroussaillement',
    coordonneesCommunes: coordonneesCommunes
  });

  return (
    <div className={styles.datavizMapContainer}>
      <DebroussaillementText isDebroussaillement={hasData || false} />
      <CustomTooltipNouveauParcours
        title={debroussaillementTooltipText}
        texte="Définition"
      />
      {coordonneesCommunes &&
        coordonneesCommunes.codes.length &&
        hasData ? (
        <>
          <div className={styles.mapWrapper}>
            <Suspense fallback={<Loader />}>
              <MapTiles
                ariaLabel="Carte des obligations légales de débroussaillement par commune sur votre territoire"
                coordonneesCommunes={coordonneesCommunes}
                mapRef={mapRef}
                mapContainer={mapContainer}
                bucketUrl="debroussaillement"
                layer="debroussaillement"
                paint={{
                  'fill-color': '#F83DD9',
                  'fill-opacity': 0.8
                }}
                legend={<LegendCompColor legends={debroussaillementLegend} />}
              />
            </Suspense>
          </div>
          <div className={styles.sourcesExportMapWrapper}>
            <Body size="sm" style={{ color: 'var(--gris-dark)' }}>
              Source : Institut national de l’information géographique et forestière, 2025 (consultée en février 2026)
            </Body>
            <ExportPngMaplibreButton
              mapRef={mapRef}
              mapContainer={mapContainer}
              documentDiv=".debroussaillementLegendWrapper"
              fileName={`debroussaillement_${type}_${libelle}`}
              anchor="Débroussaillement"
              type={type}
              libelle={libelle}
              code={code}
              thematique="debroussaillement"
            />
          </div>
        </>
      ) : <div style={{ height: '40px' }} />
      }
    </div>
  );
};
