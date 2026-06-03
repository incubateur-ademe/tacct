'use client';

import { mapStyles } from 'carte-facile';
import 'carte-facile/carte-facile.css';
import type { TypedArray, TypedArrayArrayWithDimensions } from 'geotiff';
import { fromUrl } from 'geotiff';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RefObject, useEffect, useRef, useState } from 'react';
import { AccessibleMapWrapper } from './AccessibleMapWrapper';
import { HauteurCanopeeLegend } from './legends/legendCanopee';
import styles from './maps.module.scss';
import { CanopeeTooltip } from './subcomponents/tooltips';

const COG_PATH = '/canopee/France_Forest_COG.tif';
const TARGET_RESOLUTION_M = 10;
const MAX_CANVAS_SIZE = 1024;
const MIN_CANVAS_SIZE = 512;
const MAX_CANOPY_HEIGHT = 30;
const COLOR_LOW: [number, number, number] = [217, 255, 217];
const COLOR_HIGH: [number, number, number] = [26, 107, 24];

type BBox = { minLng: number; minLat: number; maxLng: number; maxLat: number };

type GeoJSONGeometry =
  | { type: 'Polygon'; coordinates: number[][][] }
  | { type: 'MultiPolygon'; coordinates: number[][][][] };

type RasterData = {
  band: TypedArray;
  noDataValue: number | null;
  bbox: BBox;
  width: number;
  height: number;
};

type CogRenderResult = {
  canvas: HTMLCanvasElement;
  rasterData: RasterData | null;
  maxVal: number;
  maxObservedVal: number;
};

const computeCanvasSize = (bbox: BBox): { width: number; height: number } => {
  const latMid = (bbox.minLat + bbox.maxLat) / 2;
  const widthM = (bbox.maxLng - bbox.minLng) * 111000 * Math.cos((latMid * Math.PI) / 180);
  const heightM = (bbox.maxLat - bbox.minLat) * 111000;
  const clamp = (v: number) =>
    Math.min(MAX_CANVAS_SIZE, Math.max(MIN_CANVAS_SIZE, Math.round(v)));
  return {
    width: clamp(widthM / TARGET_RESOLUTION_M),
    height: clamp(heightM / TARGET_RESOLUTION_M)
  };
}

const applyClipPath = (
  ctx: CanvasRenderingContext2D,
  geometry: GeoJSONGeometry,
  bbox: BBox,
  width: number,
  height: number
): void => {
  ctx.beginPath();
  const rings: number[][][][] =
    geometry.type === 'MultiPolygon'
      ? geometry.coordinates
      : [geometry.coordinates];

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
}

const heightToRGBA = (intensity: number): [number, number, number, number] => {
  return [
    Math.round(COLOR_LOW[0] + (COLOR_HIGH[0] - COLOR_LOW[0]) * intensity),
    Math.round(COLOR_LOW[1] + (COLOR_HIGH[1] - COLOR_LOW[1]) * intensity),
    Math.round(COLOR_LOW[2] + (COLOR_HIGH[2] - COLOR_LOW[2]) * intensity),
    Math.round(200 + 55 * intensity)
  ];
}

const renderCogToCanvas = async (
  cogUrl: string,
  bbox: BBox,
  geometry: GeoJSONGeometry | null,
  signal: AbortSignal
): Promise<CogRenderResult | null> => {
  const { width: canvasW, height: canvasH } = computeCanvasSize(bbox);

  const tiff = await fromUrl(cogUrl, undefined, signal);
  const firstImage = await tiff.getImage();
  const samplesPerPixel = firstImage.getSamplesPerPixel();
  const noDataValue = firstImage.getGDALNoData();

  const rasters = (await tiff.readRasters({
    bbox: [bbox.minLng, bbox.minLat, bbox.maxLng, bbox.maxLat],
    width: canvasW,
    height: canvasH,
    signal
  })) as TypedArrayArrayWithDimensions;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvasW;
  tempCanvas.height = canvasH;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return null;

  const imageData = tempCtx.createImageData(canvasW, canvasH);
  const pixelCount = canvasW * canvasH;
  let rasterData: RasterData | null = null;
  let maxVal = 1;

  if (samplesPerPixel >= 3) {
    const rBand: TypedArray = rasters[0];
    const gBand: TypedArray = rasters[1];
    const bBand: TypedArray = rasters[2];
    for (let i = 0; i < pixelCount; i++) {
      const r = rBand[i];
      const isNoData = noDataValue !== null && r === noDataValue;
      imageData.data[i * 4] = r;
      imageData.data[i * 4 + 1] = gBand[i];
      imageData.data[i * 4 + 2] = bBand[i];
      imageData.data[i * 4 + 3] = isNoData ? 0 : 255;
    }
  } else {
    const band: TypedArray = rasters[0];
    maxVal = MAX_CANOPY_HEIGHT;
    let maxObservedVal = 0;
    for (let i = 0; i < pixelCount; i++) {
      const v = band[i];
      const isNoData = noDataValue !== null && v === noDataValue;
      if (isNoData || v === 0 || v > MAX_CANOPY_HEIGHT) {
        imageData.data[i * 4 + 3] = 0;
      } else {
        if (v > maxObservedVal) maxObservedVal = v;
        const [r, g, b, a] = heightToRGBA(Math.min(1, v / maxVal));
        imageData.data[i * 4] = r;
        imageData.data[i * 4 + 1] = g;
        imageData.data[i * 4 + 2] = b;
        imageData.data[i * 4 + 3] = a;
      }
    }
    rasterData = { band, noDataValue, bbox, width: canvasW, height: canvasH };
    tempCtx.putImageData(imageData, 0, 0);

    if (!geometry) return { canvas: tempCanvas, rasterData, maxVal, maxObservedVal };

    const clippedCanvas = document.createElement('canvas');
    clippedCanvas.width = canvasW;
    clippedCanvas.height = canvasH;
    const clippedCtx = clippedCanvas.getContext('2d');
    if (!clippedCtx) return null;

    applyClipPath(clippedCtx, geometry, bbox, canvasW, canvasH);
    clippedCtx.drawImage(tempCanvas, 0, 0);

    return { canvas: clippedCanvas, rasterData, maxVal, maxObservedVal };
  }

  tempCtx.putImageData(imageData, 0, 0);

  if (!geometry) return { canvas: tempCanvas, rasterData, maxVal, maxObservedVal: maxVal };

  const clippedCanvas = document.createElement('canvas');
  clippedCanvas.width = canvasW;
  clippedCanvas.height = canvasH;
  const clippedCtx = clippedCanvas.getContext('2d');
  if (!clippedCtx) return null;

  applyClipPath(clippedCtx, geometry, bbox, canvasW, canvasH);
  clippedCtx.drawImage(tempCanvas, 0, 0);

  return { canvas: clippedCanvas, rasterData, maxVal, maxObservedVal: maxVal };
}

export const MapCanopee = (props: {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  contoursCommunes: { geometry: string } | null;
  mapRef: RefObject<maplibregl.Map | null>;
  mapContainer: RefObject<HTMLDivElement | null>;
  legend?: React.ReactNode;
  style?: React.CSSProperties;
  onLoadingChange?: (isLoading: boolean) => void;
}) => {
  const {
    coordonneesCommunes,
    contoursCommunes,
    mapRef,
    mapContainer,
    style,
    legend,
    onLoadingChange
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [maxObservedVal, setMaxObservedVal] = useState<number | null>(null);
  const hasLoadedOnce = useRef(false);
  const rasterDataRef = useRef<RasterData | null>(null);
  const maxValRef = useRef<number>(1);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !coordonneesCommunes) return;

    setIsLoading(true);
    hasLoadedOnce.current = false;
    onLoadingChange?.(true);

    const abortController = new AbortController();

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.desaturated,
      attributionControl: false,
      cooperativeGestures: typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
      locale: {
        'CooperativeGesturesHandler.MobileHelpText': 'Utilisez deux doigts pour déplacer la carte',
      },
    });
    mapRef.current = map;

    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
      onLoadingChange?.(false);
    }, 15000);

    const { bbox } = coordonneesCommunes;

    map.on('load', async () => {
      setTimeout(() => {
        map.fitBounds(
          [[bbox.minLng, bbox.minLat], [bbox.maxLng, bbox.maxLat]],
          { padding: 20 }
        );
      }, 100);

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

      map.addControl(new maplibregl.NavigationControl(), 'top-right');

      try {
        const geometry = contoursCommunes
          ? (JSON.parse(contoursCommunes.geometry) as GeoJSONGeometry)
          : null;

        const cogUrl = `${process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL}${COG_PATH}`;
        const result = await renderCogToCanvas(cogUrl, bbox, geometry, abortController.signal);

        if (!mapRef.current || abortController.signal.aborted) return;

        if (result) {
          rasterDataRef.current = result.rasterData;
          maxValRef.current = result.maxVal;
          setMaxObservedVal(result.maxObservedVal);

          map.addSource('canopee', {
            type: 'canvas',
            canvas: result.canvas,
            animate: false,
            coordinates: [
              [bbox.minLng, bbox.maxLat],
              [bbox.maxLng, bbox.maxLat],
              [bbox.maxLng, bbox.minLat],
              [bbox.minLng, bbox.minLat]
            ]
          });

          map.addLayer(
            {
              id: 'canopee-layer',
              type: 'raster',
              source: 'canopee',
              paint: { 'raster-opacity': 1.0 }
            },
            'communes-outline-layer'
          );

          map.on('mousemove', (e) => {
            const rd = rasterDataRef.current;
            if (!rd) return;
            const { lng, lat } = e.lngLat;
            if (lng < rd.bbox.minLng || lng > rd.bbox.maxLng || lat < rd.bbox.minLat || lat > rd.bbox.maxLat) {
              popupRef.current?.remove();
              map.getCanvas().style.cursor = '';
              return;
            }
            const px = Math.floor(((lng - rd.bbox.minLng) / (rd.bbox.maxLng - rd.bbox.minLng)) * rd.width);
            const py = Math.floor(((rd.bbox.maxLat - lat) / (rd.bbox.maxLat - rd.bbox.minLat)) * rd.height);
            const val = rd.band[py * rd.width + px];
            if (val === undefined || val === 0 || val > MAX_CANOPY_HEIGHT || (rd.noDataValue !== null && val === rd.noDataValue)) {
              popupRef.current?.remove();
              map.getCanvas().style.cursor = '';
              return;
            }
            const intensity = Math.min(1, val / maxValRef.current);
            const [r, g, b] = heightToRGBA(intensity);
            const color = `rgb(${r},${g},${b})`;
            const containerHeight = mapContainer.current?.clientHeight ?? 500;
            const anchor = e.point.y > containerHeight / 2 ? 'bottom' : 'top';
            map.getCanvas().style.cursor = 'crosshair';
            popupRef.current?.remove();
            popupRef.current = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              anchor,
              maxWidth: 'max-content',
              offset: anchor === 'top' ? [0, 25] : [0, -20]
            })
              .setLngLat(e.lngLat)
              .setHTML(CanopeeTooltip(val, color))
              .addTo(map);
          });

          map.on('mouseleave', () => {
            popupRef.current?.remove();
            map.getCanvas().style.cursor = '';
          });
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Erreur chargement COG canopée :', error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          clearTimeout(loadingTimeout);
          setIsLoading(false);
          onLoadingChange?.(false);
          hasLoadedOnce.current = true;
        }
      }
    });

    return () => {
      abortController.abort();
      clearTimeout(loadingTimeout);
      popupRef.current?.remove();
      rasterDataRef.current = null;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coordonneesCommunes, contoursCommunes]);

  return (
    <AccessibleMapWrapper
      ariaLabel="Carte raster représentant la hauteur de la canopée forestière (en mètres) sur votre territoire"
      style={{ position: 'relative', ...style }}
    >
      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      {maxObservedVal !== null && (
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
          Hauteur maximale observée : <strong>{maxObservedVal} m</strong>
        </p>
      )}
      <div ref={mapContainer} style={{ height: '500px', width: '100%' }} />
      {isLoading && (
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
          Chargement des données cartographiques...
        </div>
      )}
      <div
        className={`${styles.legendRGA} legendWrapper`}
        style={{ width: 'auto', justifyContent: 'center' }}
      >
        <HauteurCanopeeLegend />
      </div>
    </AccessibleMapWrapper>
  );
};
