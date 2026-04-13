'use client';

import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { ExportPngSimple } from "@/components/exports/ExportPng";
import DataNotFoundForGraph from "@/components/graphDataNotFound";
import { NewContainer } from "@/design-system/layout";
import { Patch4 } from "@/lib/postgres/models";
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
                    <ExportPngSimple
                      containerRef={circleExportRef}
                      fileName={`patch4c-cercle-${libelle}.png`}
                      style={{
                        height: "fit-content",
                        width: "153px"
                      }}
                    />
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
