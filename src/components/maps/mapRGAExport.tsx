"use client";

import { mapStyles } from 'carte-facile';
import { mapTransformRequest } from './mapTransformRequest';
import 'carte-facile/carte-facile.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RefObject, useEffect } from 'react';
import { AccessibleMapWrapper } from './AccessibleMapWrapper';
import { RgaMapLegend } from './legends/datavizLegends';
import { LegendCompColor } from './legends/legendComp';
import styles from './maps.module.scss';

export const MapRGAExport = (props: {
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
  exportMapRef: RefObject<maplibregl.Map | null>;
  exportMapContainer: RefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
}) => {
  const { coordonneesCommunes, exportMapRef, exportMapContainer, style } = props;

  useEffect(() => {
    if (!exportMapContainer.current || !coordonneesCommunes) return;

    const map = new maplibregl.Map({
      container: exportMapContainer.current,
      style: mapStyles.desaturated,
      attributionControl: false,
      transformRequest: mapTransformRequest,
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });
    exportMapRef.current = map;

    map.on('load', () => {
      // Fit bounds avec coordonneesCommunes (sans animation pour l'export)
      if (coordonneesCommunes?.bbox) {
        map.fitBounds(
          [[coordonneesCommunes.bbox.minLng, coordonneesCommunes.bbox.minLat],
          [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.maxLat]],
          { padding: 20, duration: 0 }
        );
      }

      // Add vector tiles source
      map.addSource('rga-tiles', {
        type: 'vector',
        tiles: [`${process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL}/rga/tiles/{z}/{x}/{y}.pbf`],
        minzoom: 4,
        maxzoom: 13
      });

      // Add fill layer for RGA zones with color based on alea level
      map.addLayer({
        id: 'rga-fill',
        type: 'fill',
        source: 'rga-tiles',
        'source-layer': 'rga',
        filter: ['in', ['get', 'code_geographique'], ['literal', coordonneesCommunes.codes]],
        paint: {
          'fill-color': [
            'match',
            ['get', 'alea'],
            'Moyen', '#F66E19',
            'Faible', '#FFCF5E',
            'Fort', '#E8323B',
            'white'
          ],
          'fill-opacity': 0.45
        }
      });

      // Add communes outline avec tuiles vectorielles
      map.addSource('communes-tiles', {
        type: 'vector',
        tiles: [`${process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL}/communes/tiles/{z}/{x}/{y}.pbf`],
        minzoom: 4,
        maxzoom: 13
      });

      map.addLayer({
        id: 'communes-outline-layer',
        type: 'line',
        source: 'communes-tiles',
        'source-layer': 'contour_communes',
        filter: ['in', ['get', 'code_geographique'], ['literal', coordonneesCommunes.codes]],
        paint: {
          'line-color': '#161616',
          'line-width': 1
        }
      });
    });

  }, []);

  return (
    <AccessibleMapWrapper
      ariaLabel="Cartographie des zones d'exposition au retrait-gonflement des argiles (aléa faible, moyen ou fort) par commune sur votre territoire"
      style={{ position: 'relative', ...style }}
    >
      <div ref={exportMapContainer} style={{ height: "500px", width: "100%" }} />
      <div className="exportPNGWrapper">
        <div
          className={styles.legendRGA}
          style={{ width: 'auto', justifyContent: 'center' }}
        >
          <LegendCompColor legends={RgaMapLegend} />
        </div>
      </div>
    </AccessibleMapWrapper>
  );
};
