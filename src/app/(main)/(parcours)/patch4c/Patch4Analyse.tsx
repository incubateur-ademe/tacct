'use client';

import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { ZipExportButton } from '@/components/exports/ZipExportButton';
import DataNotFoundForGraph from "@/components/graphDataNotFound";
import { NewContainer } from "@/design-system/layout";
import { Patch4 } from "@/lib/postgres/models";
import { Patch4Export } from '@/lib/utils/export/environmentalDataExport';
import { exportAsZip } from '@/lib/utils/export/exportZipGeneric';
import html2canvas from 'html2canvas';
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CircleVisualization from "./circleVisualization";
import { BlocAleas } from "./components/blocAleas";
import CursorVisualization from "./cursorVisualization";
import styles from './patch4c.module.scss';

export const Patch4Analyse = ({
  patch4,
  coordonneesCommunes
}: {
  patch4: Patch4[];
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
}) => {
  const [selectedAleaKey, setSelectedAleaKey] = useState<string | undefined>(undefined);
  const shouldScrollRef = useRef(false);
  const circleExportRef = useRef<HTMLDivElement>(null);
  const params = useSearchParams();
  const libelle = params.get('libelle')!;
  const type = params.get('type')!;

  const handleSelectAlea = (key: string, shouldScroll: boolean = false) => {
    shouldScrollRef.current = shouldScroll;
    setSelectedAleaKey(key);
  };

  useEffect(() => {
    if (selectedAleaKey && shouldScrollRef.current) {
      setTimeout(() => {
        const element = document.getElementById(selectedAleaKey);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        shouldScrollRef.current = false;
      }, 100);
    }
  }, [selectedAleaKey]);

  const patch4Export = patch4 && patch4.length && patch4.length === 1 ? Patch4Export({ type, patch4: patch4[0] }) : null;

  return (
    <>
      <NewContainer size="xl" style={{ padding: "40px 1rem 0" }}>
        {
          patch4 && patch4.length ? (
            <>
              {patch4.length === 1 ?
                // Pour les territoires EPCI ou communes
                <div ref={circleExportRef}>
                  <CircleVisualization
                    patch4={patch4[0]}
                    selectedAleaKey={selectedAleaKey}
                    onSelectAlea={handleSelectAlea}
                  />
                  <div className={styles.CursorVisualizationContainer}>
                    <CursorVisualization isMap={patch4.length > 1 ? true : false} />
                    <div className="export-button-ignore">
                    <ZipExportButton
                      handleExport={async () => {
                        let pngBlob: Blob | null = null;
                        if (circleExportRef.current) {
                          const canvas = await html2canvas(circleExportRef.current, {
                            useCORS: true,
                            allowTaint: true,
                            backgroundColor: '#ffffff',
                            ignoreElements: (el) => el.classList.contains('export-button-ignore')
                          });
                          pngBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
                        }
                        await exportAsZip({
                          excelFiles: patch4Export ? [{
                            data: [patch4Export],
                            baseName: 'patch4c',
                            sheetName: 'patch4c',
                            type,
                            libelle
                          }] : [],
                          blobFiles: pngBlob ? [{
                            blob: pngBlob,
                            filename: `patch4c-aggravation-${libelle}.png`
                          }] : [],
                          zipFilename: `patch4c_${type}_${libelle}.zip`
                        });
                      }}
                      code={params.get('code') ?? undefined}
                      libelle={libelle}
                      type={type}
                      thematique="patch4c"
                      style={{ height: 'fit-content' }}
                    >
                      Exporter
                    </ZipExportButton>
                    </div>
                  </div>
                </div>
                : null
              }
              <BlocAleas
                coordonneesCommunes={coordonneesCommunes}
                patch4={patch4}
                selectedAleaKey={selectedAleaKey}
                onSelectAlea={handleSelectAlea}
              />
            </>
          ) : (
            <div className="p-10 flex flex-row justify-center">
              <DataNotFoundForGraph image={DataNotFound} />
            </div>
          )
        }
      </NewContainer>
    </>
  );
};
