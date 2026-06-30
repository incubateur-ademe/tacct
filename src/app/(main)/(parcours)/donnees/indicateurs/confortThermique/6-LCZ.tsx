"use client";
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { ExportPngMaplibreButton } from '@/components/exports/ExportPng';
import DataNotFoundForGraph from "@/components/graphDataNotFound";
import { Loader } from '@/components/ui/loader';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from "@/design-system/base/Textes";
import { TableCommuneModel } from "@/lib/postgres/models";
import { LCZCeremaText1, LCZText, LCZText2 } from '@/lib/staticTexts';
import { LCZTooltipText } from '@/lib/tooltipTexts';
import { useSearchParams } from "next/navigation";
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapLCZ = lazy(() => import('@/components/maps/mapLCZ').then(m => ({ default: m.MapLCZ })));

export const LCZ = ({
  coordonneesCommunes,
  tableCommune
}: {
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
  tableCommune: TableCommuneModel[];
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const exportPNGRef = useRef<HTMLDivElement | null>(null);
  const [isLczCovered, setIsLczCovered] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const couvertureLcz = type === "commune" ? tableCommune.filter(el => el.code_geographique === code) : tableCommune

  useEffect(() => {
    if (couvertureLcz.every(el => el.couverture_lcz === null)) {
      setIsLczCovered(false);
      setIsLoading(false);
    } else {
      setIsLczCovered(true);
      setIsLoading(false);
    }
  }, [code]);

  return (
    <>
      <div className={styles.datavizMapContainer}>
        <ReadMoreFade maxHeight={350}>
          {isLczCovered ? <LCZCeremaText1 /> : <LCZText2 />}
          <CustomTooltipNouveauParcours title={LCZTooltipText} texte='Que sont les LCZ ?' />
          <a
            className="fr-sr-only"
            href="https://journals.ametsoc.org/view/journals/bams/93/12/bams-d-11-00019.1.xml"
            target="_blank"
            rel="noopener noreferrer"
          >
            Consulter l&apos;article de Stewart et Oke (2012) sur la typologie LCZ (nouvelle fenêtre)
          </a>
          <LCZText />
        </ReadMoreFade>
        <div className={styles.mapWrapper}>
          {
            coordonneesCommunes ? (
              <Suspense fallback={<Loader />}>
                <div ref={exportPNGRef}>
                  <MapLCZ
                    coordonneesCommunes={coordonneesCommunes}
                    isLoading={isLoading}
                    isLczCovered={isLczCovered}
                    mapRef={mapRef}
                    mapContainer={mapContainer}
                  />
                </div>
              </Suspense>
            ) : <DataNotFoundForGraph image={DataNotFound} />
          }
        </div>
      </div>
      <div className={styles.sourcesExportMapWrapper}>
        <Body size='sm' style={{ color: "var(--gris-dark)" }}>
          Source : {
            isLczCovered
              ? "CEREMA, 2025 (consultée en janvier 2026)"
              : <a
                href="https://doi.org/10.5194/essd-14-3835-2022"
                target="_blank"
                rel="noopener noreferrer"
              >
                Matthias Demuzere et al. 2022
              </a>}
        </Body>
        <ExportPngMaplibreButton
          mapRef={mapRef}
          mapContainer={mapContainer}
          documentDiv=".lczLegendWrapper"
          fileName={`LCZ_${type}_${libelle}`}
          anchor='LCZ'
          type={type}
          libelle={libelle}
          code={code}
          thematique="lcz"
        />
      </div>
    </>
  );
};
