"use client";
import GraphNotFound from '@/assets/images/no_data_on_territory.svg';
import { ExportPngMaplibreButton } from '@/components/exports/ExportPng';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { LegendErosionCotiere } from '@/components/maps/legends/legendErosionCotiere';
import { Loader } from '@/components/ui/loader';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from "@/components/utils/Tooltips";
import { Body } from "@/design-system/base/Textes";
import { ErosionCotiereMapper } from '@/lib/mapper/erosionCotiere';
import { ErosionCotiere } from "@/lib/postgres/models";
import { ErosionCotiereText } from '@/lib/staticTexts';
import { erosionCotiereTooltipText } from '@/lib/tooltipTexts';
import { useSearchParams } from "next/navigation";
import { lazy, Suspense, useRef } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapErosionCotiere = lazy(() => import('@/components/maps/mapErosionCotiere').then(m => ({ default: m.MapErosionCotiere })));

export const ErosionCotiereComp = ({
  erosionCotiere,
  coordonneesCommunes
}: {
  erosionCotiere: [ErosionCotiere[], string];
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
}) => {
  const searchParams = useSearchParams();
  const libelle = searchParams.get('libelle')!;
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const erosionCotiereMap = erosionCotiere[0].map(ErosionCotiereMapper);

  return (
    <>
      <div className={styles.datavizMapContainer}>
        <ReadMoreFade maxHeight={250}>
          <Body weight='bold' style={{ color: "var(--gris-dark)" }} >
            L’érosion est un phénomène qui touche inégalement les côtes, en
            fonction de leur profil géologique. Elle s’observe sur des temps
            longs mais peut connaître des épisodes brutaux selon les
            endroits.
          </Body>
          <CustomTooltipNouveauParcours title={erosionCotiereTooltipText} texte="D'où vient ce chiffre ?" />
          <ErosionCotiereText />
        </ReadMoreFade>
        <div className={styles.mapWrapper} style={{ height: 'fit-content' }}>
          {
            erosionCotiere[0].length > 0 ?
              <>
                <Suspense fallback={<Loader />}>
                  <MapErosionCotiere
                    erosionCotiere={erosionCotiereMap}
                    envelope={JSON.parse(erosionCotiere[1])}
                    coordonneesCommunes={coordonneesCommunes}
                    mapRef={mapRef}
                    mapContainer={mapContainer}
                  />
                </Suspense>
                <div className='erosionCotiereLegendWrapper'>
                  <LegendErosionCotiere />
                </div>
              </>
              : <div className='p-10 flex flex-row justify-center'><DataNotFoundForGraph image={GraphNotFound} /></div>
          }
        </div>
      </div>
      <div className={styles.sourcesExportMapWrapper}>
        <Body size='sm' style={{ color: "var(--gris-dark)" }}>
          Source : CEREMA, 2018
        </Body>
        <ExportPngMaplibreButton
          mapRef={mapRef}
          mapContainer={mapContainer}
          documentDiv=".erosionCotiereLegendWrapper"
          fileName={`Erosion_cotiere_${type}_${libelle}`}
          anchor='Érosion-côtière'
          type={type}
          libelle={libelle}
          code={code}
          thematique="erosion_cotiere"
        />
      </div>
    </>
  );
};
