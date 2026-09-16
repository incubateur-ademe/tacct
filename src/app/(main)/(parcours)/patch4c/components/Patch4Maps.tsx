"use client";

import { ZipExportButton } from '@/components/exports/ZipExportButton';
import { LegendBlockColor } from '@/components/maps/legends/legendBlocks';
import { MapPatch4 } from "@/components/maps/mapPatch4";
import { Body } from '@/design-system/base/Textes';
import { exportAsZip } from '@/lib/utils/export/exportZipGeneric';
import html2canvas from 'html2canvas';
import maplibregl from 'maplibre-gl';
import { useSearchParams } from "next/navigation";
import { RefObject, useRef, useState } from 'react';
import CursorVisualization from "../cursorVisualization";
import styles from '../patch4c.module.scss';

export const Patch4Maps = (props: {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  patch4: {
    [x: string]: string;
    code_geographique: string;
    libelle_geographique: string;
  }[];
  selectedAnchor: string;
}) => {
  const {
    coordonneesCommunes,
    patch4,
    selectedAnchor
  } = props;
  const params = useSearchParams()
  const libelle = params.get('libelle')!;
  const type = params.get('type')!;
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const exportContainerRef = useRef<HTMLDivElement>(null);
  const [, setRefsReady] = useState(false);

  const handleMapRef = (ref: RefObject<maplibregl.Map | null>) => {
    mapRef.current = ref.current;
    setRefsReady(true);
  };

  const handleContainerRef = (ref: RefObject<HTMLDivElement | null>) => {
    mapContainerRef.current = ref.current;
  };
  return (
    <>
      <div ref={exportContainerRef}>
        <MapPatch4
          patch4={patch4}
          communesCodes={coordonneesCommunes?.codes ?? []}
          boundingBox={
            coordonneesCommunes ? [
              [coordonneesCommunes.bbox.minLng, coordonneesCommunes.bbox.minLat],
              [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.maxLat]
            ] : undefined
          }
          mapRefCallback={handleMapRef}
          containerRefCallback={handleContainerRef}
        />
        <div className={styles.CursorVisualizationBarColorWrapper}>
          <CursorVisualization isMap={true} />
        </div>
        <div className={styles.legendContainer}>
          <LegendBlockColor color="#FF1C64" value="Aggravation très forte" />
          <LegendBlockColor color="#FFB181" value="Aggravation forte" />
          <LegendBlockColor color="#FFEBB6" value="Aggravation modérée" />
          <LegendBlockColor color="#ffffff" value="Pas d'évolution" />
        </div>
      </div>
      <div className={styles.exportShareContainer}>
        <Body size="sm" style={{ color: "#666666" }}>
          Source : Météo France
        </Body>
        <div className={styles.exportShareWrapper}>
          <ZipExportButton
            anchor={selectedAnchor}
            handleExport={async () => {
              let pngBlob: Blob | null = null;
              if (mapRef.current && mapContainerRef.current && exportContainerRef.current) {
                const navControls = mapContainerRef.current.querySelectorAll('.maplibregl-ctrl-top-right');
                navControls.forEach((c) => { (c as HTMLElement).style.display = 'none'; });
                await new Promise<void>((resolve) => {
                  mapRef.current!.once('render', async () => {
                    const canvas = await html2canvas(exportContainerRef.current!, { useCORS: true, allowTaint: true });
                    pngBlob = await new Promise<Blob | null>((res) => canvas.toBlob(res));
                    navControls.forEach((c) => { (c as HTMLElement).style.display = ''; });
                    resolve();
                  });
                  mapRef.current!.triggerRepaint();
                });
              }
              await exportAsZip({
                excelFiles: [{
                  data: patch4,
                  baseName: 'patch4c',
                  sheetName: 'Aléas climatiques',
                  type,
                  libelle
                }],
                blobFiles: pngBlob ? [{ blob: pngBlob, filename: `patch4c-${libelle}-${selectedAnchor}.png` }] : [],
                zipFilename: `patch4c_${type}_${libelle}.zip`
              });
            }}
            libelle={libelle}
            type={type}
            thematique="patch4c"
          >
            Exporter
          </ZipExportButton>
        </div>
      </div>
    </>
  );
}
