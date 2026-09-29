'use client';

import * as turf from '@turf/turf';
import { mapStyles } from 'carte-facile';
import 'carte-facile/carte-facile.css';
import type { Geometry, MultiPolygon, Polygon, Position } from 'geojson';
import maplibregl, { FillLayerSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RefObject, useEffect, useRef, useState } from 'react';
import { AccessibleMapWrapper } from './AccessibleMapWrapper';
import styles from './maps.module.scss';
import { AOT40TooltipDispersion, getAOT40Color } from './subcomponents/tooltips';

export type ValeursTerritoire = { moyenne: number; max: number } | null;

const PAS_ECHANTILLONNAGE_KM = 1;
const PAS_INDEX_DEGRES = 0.1;

const valeursSurTerritoire = (
  map: maplibregl.Map,
  sourceId: string,
  sourceLayer: string,
  territoireGeometry: Geometry
): ValeursTerritoire => {
  if (territoireGeometry.type !== 'Polygon' && territoireGeometry.type !== 'MultiPolygon') return null;
  const territoire = turf.feature(territoireGeometry);

  const index = new Map<string, { geometry: Polygon | MultiPolygon; valeur: number }[]>();
  for (const feature of map.querySourceFeatures(sourceId, { sourceLayer })) {
    const valeur = feature.properties?.valeur;
    const geometry = feature.geometry;
    if (typeof valeur !== 'number') continue;
    if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') continue;
    const [minX, minY, maxX, maxY] = turf.bbox(geometry);
    for (let x = Math.floor(minX / PAS_INDEX_DEGRES); x <= Math.floor(maxX / PAS_INDEX_DEGRES); x++) {
      for (let y = Math.floor(minY / PAS_INDEX_DEGRES); y <= Math.floor(maxY / PAS_INDEX_DEGRES); y++) {
        const cle = `${x}:${y}`;
        const mailles = index.get(cle);
        if (mailles) mailles.push({ geometry, valeur });
        else index.set(cle, [{ geometry, valeur }]);
      }
    }
  }

  const valeurAuPoint = (point: Position): number | null => {
    const cle = `${Math.floor(point[0] / PAS_INDEX_DEGRES)}:${Math.floor(point[1] / PAS_INDEX_DEGRES)}`;
    const maille = index.get(cle)?.find(({ geometry }) => turf.booleanPointInPolygon(point, geometry));
    return maille ? maille.valeur : null;
  };

  const points = turf
    .pointGrid(turf.bbox(territoire), PAS_ECHANTILLONNAGE_KM, { units: 'kilometers', mask: territoire })
    .features.map((point) => point.geometry.coordinates);
  if (!points.length) points.push(turf.pointOnFeature(territoire).geometry.coordinates);

  const valeurs = points.map(valeurAuPoint).filter((valeur): valeur is number => valeur !== null);
  if (!valeurs.length) return null;
  return {
    moyenne: valeurs.reduce((somme, valeur) => somme + valeur, 0) / valeurs.length,
    max: Math.max(...valeurs)
  };
};

export const MapTilesAOT40 = (props: {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  mapRef: RefObject<maplibregl.Map | null>;
  mapContainer: RefObject<HTMLDivElement | null>;
  bucketUrl: string;
  layer: string;
  paint: FillLayerSpecification['paint'];
  legend?: React.ReactNode;
  style?: React.CSSProperties;
  onLoadingChange?: (isLoading: boolean) => void;
  territoireGeometry?: Geometry | null;
  onValeursTerritoire?: (valeurs: ValeursTerritoire) => void;
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
    onLoadingChange,
    territoireGeometry,
    onValeursTerritoire
  } = props;
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const [isTilesLoading, setIsTilesLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    if (!mapContainer.current || !coordonneesCommunes) return;

    setIsTilesLoading(true);
    hasLoadedOnce.current = false;
    onLoadingChange?.(true);

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.desaturated,
      attributionControl: false,
      cooperativeGestures: typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
      locale: {
        'CooperativeGesturesHandler.MobileHelpText': 'Utilisez deux doigts pour déplacer la carte',
      },
      maxZoom: 11.9,
      minZoom: 5,
    });
    mapRef.current = map;

    const sourceId = `${bucketUrl}-tiles`;
    let carteChargee = false;
    let valeursCalculees = !(territoireGeometry && onValeursTerritoire);
    const terminerChargement = () => {
      if (!carteChargee || !valeursCalculees) return;
      setIsTilesLoading(false);
      onLoadingChange?.(false);
    };
    const calculerValeurs = () => {
      if (valeursCalculees || !territoireGeometry || !onValeursTerritoire) return;
      map.off('sourcedata', calculerSiSourceChargee);
      onValeursTerritoire(
        map.getSource(sourceId) ? valeursSurTerritoire(map, sourceId, layer, territoireGeometry) : null
      );
      valeursCalculees = true;
      terminerChargement();
    };
    const calculerSiSourceChargee = () => {
      if (map.isSourceLoaded(sourceId)) calculerValeurs();
    };

    const loadingTimeout = setTimeout(() => {
      calculerValeurs();
      setIsTilesLoading(false);
      onLoadingChange?.(false);
    }, 10000);

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
          map.once('moveend', () => {
            map.on('sourcedata', calculerSiSourceChargee);
            map.once('render', calculerSiSourceChargee);
            map.triggerRepaint();
          });
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

      // Hover sur les tuiles
      map.on('mousemove', `${bucketUrl}-fill`, (e) => {
        map.getCanvas().style.cursor = 'pointer';

        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const valeur = feature.properties?.valeur;
          const containerHeight = mapContainer.current?.clientHeight || 500;
          const mouseY = e.point.y;
          const placement = (mouseY > containerHeight / 2) ? 'bottom' : 'top';

          if (popupRef.current) {
            popupRef.current.remove();
          }
          const color = getAOT40Color(valeur);

          if (valeur !== undefined) {
            popupRef.current = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              anchor: placement,
              maxWidth: 'max-content',
              offset: placement === 'top' ? [0, 25] : [0, -20]
            })
              .setLngLat(e.lngLat)
              .setHTML(AOT40TooltipDispersion(valeur, color))
              .addTo(map);
          }
        }
      });

      // Retirer le popup quand on sort de la zone
      map.on('mouseleave', `${bucketUrl}-fill`, () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) {
          popupRef.current.remove();
        }
      });

      map.on('idle', () => {
        if (!hasLoadedOnce.current) {
          hasLoadedOnce.current = true;
          carteChargee = true;
          terminerChargement();
        }
      });
    });

    return () => {
      clearTimeout(loadingTimeout);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coordonneesCommunes]);

  return (
    <AccessibleMapWrapper
      ariaLabel="Carte représentant l'AOT 40 (moyenne sur 5 ans) de O3 pour l'année 2024 sur votre territoire"
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
      <div ref={mapContainer} style={{ height: '500px', width: '100%' }} />
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
          Chargement des données cartographiques...
        </div>
      )}
      <div
        className={`${styles.legendRGA} legendWrapper`}
        style={{ width: 'auto', justifyContent: 'center' }}
      >
        {legend && legend}
      </div>
    </AccessibleMapWrapper>
  );
};
