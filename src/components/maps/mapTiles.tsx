'use client';

import { Any } from '@/lib/utils/types';
import { mapStyles } from 'carte-facile';
import { mapTransformRequest } from './mapTransformRequest';
import 'carte-facile/carte-facile.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RefObject, useEffect } from 'react';
import styles from './maps.module.scss';
import { AccessibleMapWrapper } from './AccessibleMapWrapper';

export const MapTiles = (props: {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  mapRef: RefObject<maplibregl.Map | null>;
  mapContainer: RefObject<HTMLDivElement | null>;
  bucketUrl: string;
  layer: string;
  paint: { [key: string]: Any };
  legend?: React.ReactNode;
  style?: React.CSSProperties;
  ariaLabel: string;
}) => {
  const {
    coordonneesCommunes,
    mapRef,
    mapContainer,
    style,
    bucketUrl,
    layer,
    paint,
    legend,
    ariaLabel
  } = props;

  useEffect(() => {
    if (!mapContainer.current || !coordonneesCommunes) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.desaturated,
      attributionControl: false,
      transformRequest: mapTransformRequest,
      canvasContextAttributes: { preserveDrawingBuffer: true }
    });
    mapRef.current = map;

    map.on('load', () => {
      if (coordonneesCommunes?.bbox) {
        setTimeout(() => {
          map.fitBounds(
            [
              [
                coordonneesCommunes.bbox.minLng,
                coordonneesCommunes.bbox.minLat
              ],
              [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.maxLat]
            ],
            { padding: 20 }
          );
        }, 100);
      }

      map.addSource(`${bucketUrl}-tiles`, {
        type: 'vector',
        tiles: [
          `${process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL}/${bucketUrl}/tiles/{z}/{x}/{y}.pbf`
        ],
        minzoom: 4,
        maxzoom: 13
      });

      map.addLayer({
        id: `${bucketUrl}-fill`,
        type: 'fill',
        source: `${bucketUrl}-tiles`,
        'source-layer': layer,
        filter: [
          'in',
          ['get', 'code_geographique'],
          ['literal', coordonneesCommunes.codes]
        ],
        paint: paint
      });

      // Add communes outline avec tuiles vectorielles
      map.addSource('communes-tiles', {
        type: 'vector',
        tiles: [
          `${process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL}/communes/tiles/{z}/{x}/{y}.pbf`
        ],
        minzoom: 4,
        maxzoom: 13
      });

      map.addLayer({
        id: 'communes-outline-layer',
        type: 'line',
        source: 'communes-tiles',
        'source-layer': 'contour_communes',
        filter: [
          'in',
          ['get', 'code_geographique'],
          ['literal', coordonneesCommunes.codes]
        ],
        paint: {
          'line-color': '#161616',
          'line-width': 1
        }
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coordonneesCommunes]);

  return (
    <AccessibleMapWrapper
      ariaLabel={ariaLabel}
      style={{ position: 'relative', ...style }}
    >
      <div ref={mapContainer} style={{ height: '500px', width: '100%' }} />
      <div
        className={
          layer === 'debroussaillement' ? 'debroussaillementLegendWrapper' : ''
        }
      >
        <div
          className={styles.legendRGA}
          style={{ width: 'auto', justifyContent: 'center' }}
        >
          {legend && legend}
        </div>
      </div>
    </AccessibleMapWrapper>
  );
};
