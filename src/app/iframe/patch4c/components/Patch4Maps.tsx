"use client";

import { ExportPngMaplibreSimple } from '@/components/exports/ExportPng';
import { CopyLinkClipboard } from "@/components/interactions/CopyLinkClipboard";
import { MapPatch4 } from "@/components/maps/mapPatch4";
import { Body } from '@/design-system/base/Textes';
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
      </div>
      <div className={styles.exportShareContainer}>
        <Body size="sm" style={{ color: "#666666" }}>
          Source : Météo France
        </Body>
        <div className={styles.exportShareWrapper}>
          <CopyLinkClipboard anchor={selectedAnchor} />
          <ExportPngMaplibreSimple
            mapRef={mapRef}
            mapContainer={exportContainerRef}
            fileName={`patch4c-${libelle}-${selectedAnchor}.png`}
            style={{
              width: "153px"
            }}
          />
        </div>
      </div>
    </>
  );
}
