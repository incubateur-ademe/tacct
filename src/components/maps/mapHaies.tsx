'use client';

import { mapStyles } from 'carte-facile';
import { mapTransformRequest } from './mapTransformRequest';
import 'carte-facile/carte-facile.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RefObject, useEffect, useState } from 'react';
import styles from './maps.module.scss';
import { AccessibleMapWrapper } from './AccessibleMapWrapper';

const HEDGE_WMS_BASE = 'https://data.geopf.fr/wms-v/ows';

const TARGET_RESOLUTION_M = 0.1;
const MAX_CANVAS_SIZE = 4096;
const MIN_CANVAS_SIZE = 512;

type BBox = { minLng: number; minLat: number; maxLng: number; maxLat: number };

type GeoJSONGeometry =
  | { type: 'Polygon'; coordinates: number[][][] }
  | { type: 'MultiPolygon'; coordinates: number[][][][] };

type HaieProperties = {
  cleabs?: string;
  hauteur?: number | null;
  largeur?: number | null;
  sources?: string;
  date_creation?: string;
  date_modification?: string;
  methode_d_acquisition_planimetrique?: string;
  precision_planimetrique?: number;
  [key: string]: string | number | null | undefined;
};

const HAIE_LABELS: Array<{ key: keyof HaieProperties; label: string; format?: (v: unknown) => string }> = [
  { key: 'cleabs', label: 'Identifiant' },
  { key: 'hauteur', label: 'Hauteur (m)' },
  { key: 'largeur', label: 'Largeur (m)' },
  { key: 'sources', label: 'Source' },
  { key: 'methode_d_acquisition_planimetrique', label: "Méthode d'acquisition" },
  { key: 'precision_planimetrique', label: 'Précision (m)' },
  {
    key: 'date_creation',
    label: 'Création',
    format: (v) => (typeof v === 'string' ? v.slice(0, 10) : String(v))
  },
  {
    key: 'date_modification',
    label: 'Dernière modification',
    format: (v) => (typeof v === 'string' ? v.slice(0, 10) : String(v))
  }
];

const lngLatToMeters = (lng: number, lat: number) => {
  const x = (lng * 20037508.34) / 180;
  let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
  return { x, y };
};

const computeCanvasSize = (bbox: BBox) => {
  const latMid = (bbox.minLat + bbox.maxLat) / 2;
  const widthM = (bbox.maxLng - bbox.minLng) * 111000 * Math.cos((latMid * Math.PI) / 180);
  const heightM = (bbox.maxLat - bbox.minLat) * 111000;
  const clamp = (v: number) =>
    Math.min(MAX_CANVAS_SIZE, Math.max(MIN_CANVAS_SIZE, Math.round(v)));
  return {
    width: clamp(widthM / TARGET_RESOLUTION_M),
    height: clamp(heightM / TARGET_RESOLUTION_M)
  };
};

const applyClipPath = (
  ctx: CanvasRenderingContext2D,
  geometry: GeoJSONGeometry,
  bbox: BBox,
  width: number,
  height: number
) => {
  ctx.beginPath();
  const rings: number[][][][] =
    geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates];

  for (const polygon of rings) {
    for (const ring of polygon) {
      ring.forEach(([lng, lat], i) => {
        const x = ((lng - bbox.minLng) / (bbox.maxLng - bbox.minLng)) * width;
        const y = ((bbox.maxLat - lat) / (bbox.maxLat - bbox.minLat)) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
    }
  }
  ctx.clip('evenodd');
};

const fetchHaiesCanvas = async (
  bbox: BBox,
  geometry: GeoJSONGeometry | null,
  signal: AbortSignal
): Promise<HTMLCanvasElement | null> => {
  const { width, height } = computeCanvasSize(bbox);
  const sw = lngLatToMeters(bbox.minLng, bbox.minLat);
  const ne = lngLatToMeters(bbox.maxLng, bbox.maxLat);

  const params = new URLSearchParams({
    service: 'WMS',
    request: 'GetMap',
    version: '1.3.0',
    layers: 'hedge.hedge',
    styles: '',
    format: 'image/png',
    transparent: 'true',
    crs: 'EPSG:3857',
    width: String(width),
    height: String(height),
    bbox: `${sw.x},${sw.y},${ne.x},${ne.y}`
  });

  const url = `${HEDGE_WMS_BASE}?${params.toString()}`;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      img.src = '';
      reject(new Error('aborted'));
    };
    if (signal.aborted) {
      onAbort();
      return;
    }
    signal.addEventListener('abort', onAbort, { once: true });
    img.onload = () => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    };
    img.onerror = () => {
      signal.removeEventListener('abort', onAbort);
      reject(new Error('WMS image load failed'));
    };
    img.src = url;
  });

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  if (geometry) applyClipPath(ctx, geometry, bbox, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) {
      data[i] = 0x2e;
      data[i + 1] = 0x7d;
      data[i + 2] = 0x32;
    }
  }
  ctx.putImageData(imageData, 0, 0);

  return canvas;
};

// const dilationRadiusForZoom = (zoom: number): number => {
//   if (zoom >= 13) return 0;
//   if (zoom >= 12) return 1;
//   if (zoom >= 11) return 2;
//   return 3;
// };

// const drawWithDilation = (
//   source: HTMLCanvasElement,
//   target: HTMLCanvasElement,
//   radius: number
// ): void => {
//   const ctx = target.getContext('2d');
//   if (!ctx) return;
//   ctx.clearRect(0, 0, target.width, target.height);
//   if (radius === 0) {
//     ctx.drawImage(source, 0, 0);
//     return;
//   }
//   for (let dy = -radius; dy <= radius; dy++) {
//     for (let dx = -radius; dx <= radius; dx++) {
//       if (Math.sqrt(dx * dx + dy * dy) <= radius) {
//         ctx.drawImage(source, dx, dy);
//       }
//     }
//   }
// };

export const MapHaies = ({
  coordonneesCommunes,
  contoursCommunes,
  mapRef,
  mapContainer
}: {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  contoursCommunes: { geometry: string } | null;
  mapRef: RefObject<maplibregl.Map | null>;
  mapContainer: RefObject<HTMLDivElement | null>;
}) => {
  const [isTilesLoading, setIsTilesLoading] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !coordonneesCommunes) return;

    const abortController = new AbortController();

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.desaturated,
      transformRequest: mapTransformRequest,
      canvasContextAttributes: { preserveDrawingBuffer: true },
      attributionControl: false,
      bounds: [
        [coordonneesCommunes.bbox.minLng, coordonneesCommunes.bbox.minLat],
        [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.maxLat]
      ],
      fitBoundsOptions: { padding: 20 }
    });
    mapRef.current = map;

    const loadingTimeout = setTimeout(() => setIsTilesLoading(false), 20000);

    map.on('load', async () => {
      setIsTilesLoading(true);

      try {
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
          paint: { 'line-color': '#161616', 'line-width': 1 }
        });
      } catch (error) {
        console.error('Erreur ajout couche contour communes :', error);
      }

      try {
        const geometry = contoursCommunes
          ? (JSON.parse(contoursCommunes.geometry) as GeoJSONGeometry)
          : null;

        const canvas = await fetchHaiesCanvas(
          coordonneesCommunes.bbox,
          geometry,
          abortController.signal
        );

        if (!mapRef.current || abortController.signal.aborted || !canvas) return;

        const displayCanvas = document.createElement('canvas');
        displayCanvas.width = canvas.width;
        displayCanvas.height = canvas.height;
        displayCanvas.getContext('2d')?.drawImage(canvas, 0, 0);

        map.addSource('haies-canvas', {
          type: 'canvas',
          canvas: displayCanvas,
          animate: true,
          coordinates: [
            [coordonneesCommunes.bbox.minLng, coordonneesCommunes.bbox.maxLat],
            [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.maxLat],
            [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.minLat],
            [coordonneesCommunes.bbox.minLng, coordonneesCommunes.bbox.minLat]
          ]
        });

        // map.on('zoomend', () => {
        //   drawWithDilation(canvas, displayCanvas, dilationRadiusForZoom(map.getZoom()));
        // });

        map.addLayer(
          {
            id: 'haies-canvas-layer',
            type: 'raster',
            source: 'haies-canvas',
            paint: { 'raster-opacity': 1 }
          },
          'communes-outline-layer'
        );
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Erreur chargement image haies WMS :', error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsTilesLoading(false);
        }
      }
    });

    map.on('click', async (e) => {
      if (map.getZoom() < 13) return;
      const point = e.lngLat;

      const bounds = map.getBounds();
      const sw = lngLatToMeters(bounds.getWest(), bounds.getSouth());
      const ne = lngLatToMeters(bounds.getEast(), bounds.getNorth());
      const container = map.getContainer();
      const width = container.clientWidth;
      const height = container.clientHeight;

      const params = new URLSearchParams({
        service: 'WMS',
        version: '1.3.0',
        request: 'GetFeatureInfo',
        layers: 'hedge.hedge',
        query_layers: 'hedge.hedge',
        info_format: 'application/json',
        crs: 'EPSG:3857',
        bbox: `${sw.x},${sw.y},${ne.x},${ne.y}`,
        width: String(width),
        height: String(height),
        i: String(Math.round(e.point.x)),
        j: String(Math.round(e.point.y)),
        feature_count: '5',
        FI_POINT_TOLERANCE: '10'
      });

      try {
        const response = await fetch(`${HEDGE_WMS_BASE}?${params.toString()}`);
        const data = await response.json();
        const feature = data?.features?.[0];

        if (!feature) {
          new maplibregl.Popup()
            .setLngLat([point.lng, point.lat])
            .setHTML('Aucune haie à cet endroit.')
            .addTo(map);
          return;
        }

        const props = (feature.properties ?? {}) as HaieProperties;
        let content = `<h4 style='font-size:16px; margin:0 0 0.5rem;'><b>Haie</b></h4>`;
        for (const { key, label, format } of HAIE_LABELS) {
          const value = props[key];
          if (value !== undefined && value !== null && value !== '') {
            const formatted = format ? format(value) : value;
            content += `<p>${label} : <b>${formatted}</b></p>`;
          }
        }

        new maplibregl.Popup({ className: 'custom-popup' })
          .setLngLat([point.lng, point.lat])
          .setHTML(content)
          .addTo(map);
      } catch {
        new maplibregl.Popup()
          .setLngLat([point.lng, point.lat])
          .setHTML('Erreur lors de la récupération des données.')
          .addTo(map);
      }
    });

    map.on('zoom', () => {
      map.getCanvas().style.cursor = map.getZoom() >= 13 ? 'pointer' : '';
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      abortController.abort();
      clearTimeout(loadingTimeout);
      setIsTilesLoading(false);
      if (mapRef.current) {
        mapRef.current = null;
      }
      map.remove();
    };
  }, [coordonneesCommunes, contoursCommunes]);

  return (
    <AccessibleMapWrapper
      ariaLabel="Carte raster représentant le linéaire de haies (BD HAIE — IGN, 2025) sur votre territoire"
      style={{ position: 'relative' }}
    >
      <style jsx global>{`
        .maplibregl-popup {
          z-index: 1002 !important;
        }
        .custom-popup .maplibregl-popup-content {
          font-family: 'Marianne' !important;
          background-color: #ffffff !important;
          border-radius: 0.5rem !important;
          padding: 20px !important;
          box-shadow: 0px 2px 6px 0px rgba(0, 0, 18, 0.16) !important;
          min-width: max-content !important;
        }
        .custom-popup .maplibregl-popup-content p {
          margin: 0 !important;
          font-size: 14px !important;
          font-weight: 400 !important;
        }
        .custom-popup .maplibregl-popup-tip {
          border-top-color: #ffffff !important;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ width: '100%', height: '500px' }}
      />
      {isTilesLoading && (
        <div className={styles.tileLoadingWrapper}>
          <div
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              alignSelf: 'center',
              marginRight: '0.5rem'
            }}
          />
          Chargement des haies (IGN BD HAIE)…
        </div>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0',
          fontSize: '0.875rem'
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '24px',
            height: '4px',
            backgroundColor: '#2e7d32'
          }}
        />
        <span>Haies (BD HAIE — IGN, 2025)</span>
      </div>
    </AccessibleMapWrapper>
  );
};

export default MapHaies;
