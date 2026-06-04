'use client';

import { O3 } from '@/lib/postgres/models';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { Any } from '@/lib/utils/types';
import { mapStyles } from 'carte-facile';
import 'carte-facile/carte-facile.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { getO3Color, O3StationsTooltip, O3Tooltip } from './components/tooltips';
import styles from './maps.module.scss';

const color = (valeur: number) => {
  return valeur > 50
    ? '#5524A0'
    : valeur > 37
      ? '#960032'
      : valeur > 25
        ? '#E8323B'
        : valeur > 16
          ? '#FFCF5E'
          : valeur > 8
            ? '#50CCAA'
            : valeur >= 0
              ? '#50F0E6'
              : '#ADADAD';
};

export const MapTilesO3 = (props: {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  mapRef: RefObject<maplibregl.Map | null>;
  mapContainer: RefObject<HTMLDivElement | null>;
  bucketUrl: string;
  layer: string;
  paint: { [key: string]: Any };
  o3: O3[];
  legend?: React.ReactNode;
  style?: React.CSSProperties;
  onLoadingChange?: (isLoading: boolean) => void;
}) => {
  const {
    coordonneesCommunes,
    mapRef,
    mapContainer,
    style,
    bucketUrl,
    layer,
    paint,
    o3,
    legend,
    onLoadingChange
  } = props;
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const [isTilesLoading, setIsTilesLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  const o3Data = useMemo(() => {
    return o3.map((o3) => {
      return {
        coordinates: [o3.longitude, o3.latitude],
        value: Round(o3.valeur, 2),
        nom_site: o3.nom_site,
        color: color(o3.valeur!)
      };
    });
  }, [o3]);

  const o3GeoJson = useMemo(() => {
    return {
      type: 'FeatureCollection' as 'FeatureCollection',
      features: o3Data.map((o3, index) => ({
        type: 'Feature' as 'Feature',
        geometry: {
          type: 'Point' as 'Point',
          coordinates: o3.coordinates
        },
        properties: {
          nom_site: o3.nom_site,
          value: o3.value,
          color: o3.color
        },
        id: index
      }))
    };
  }, [o3Data]);

  useEffect(() => {
    if (!mapContainer.current || !coordonneesCommunes) return;

    setIsTilesLoading(true);
    hasLoadedOnce.current = false;
    onLoadingChange?.(true);

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.desaturated,
      attributionControl: false
    });
    mapRef.current = map;

    const loadingTimeout = setTimeout(() => {
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

      map.addSource('o3-points', {
        type: 'geojson',
        data: o3GeoJson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 30
      });

      map.addLayer({
        id: 'clusters-outline',
        type: 'circle',
        source: 'o3-points',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': 'rgba(128, 130, 132, 0.4)',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            23,
            4,
            25.5,
            10,
            35.5
          ]
        }
      });

      map.addLayer({
        id: 'clusters-border',
        type: 'circle',
        source: 'o3-points',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#ffffff',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            21.4,
            4,
            23.9,
            10,
            33.9
          ]
        }
      });

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'o3-points',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#8d8d8d',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            4,
            22.5,
            10,
            32.5
          ]
        }
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'o3-points',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Marianne', 'Serif Bold'],
          'text-size': 14
        },
        paint: {
          'text-color': '#ffffff'
        }
      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'o3-points',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': ['get', 'color'],
          'circle-radius': 9,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#000000'
        }
      });

      map.on('click', 'clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        if (features.length > 0) {
          const clusterId = features[0].properties?.cluster_id;
          const source = map.getSource('o3-points') as maplibregl.GeoJSONSource;
          try {
            const zoom = await source.getClusterExpansionZoom(clusterId);
            if (features[0].geometry.type === 'Point') {
              map.easeTo({
                center: features[0].geometry.coordinates as [number, number],
                zoom: zoom
              });
            }
          } catch (err) {
            console.error('Error getting cluster expansion zoom:', err);
          }
        }
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Hover sur les points O3 non clusterisés
      map.on('mouseenter', 'unclustered-point', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        if (e.features && e.features.length > 0) {
          const properties = e.features[0].properties;
          const nom_site = properties?.nom_site;
          const value = properties?.value;
          const color = properties?.color;
          const containerHeight = mapContainer.current?.clientHeight || 500;
          const mouseY = e.point.y;
          const placement = (mouseY > containerHeight / 2) ? 'bottom' : 'top';

          if (popupRef.current) {
            popupRef.current.remove();
          }

          popupRef.current = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            anchor: placement,
            maxWidth: 'max-content',
            offset: placement === 'top' ? [0, 25] : [0, -20]
          })
            .setLngLat(e.lngLat)
            .setHTML(O3StationsTooltip(value, color, nom_site))
            .addTo(map);
        }
      });

      map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) {
          popupRef.current.remove();
        }
      });

      // Hover sur les tuiles (seulement si pas sur un point O3)
      map.on('mousemove', `${bucketUrl}-fill`, (e) => {
        const o3Features = map.queryRenderedFeatures(e.point, {
          layers: ['unclustered-point', 'clusters']
        });

        if (o3Features.length > 0) {
          return;
        }

        map.getCanvas().style.cursor = 'pointer';

        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const valeur = Number(Round(feature.properties?.valeur, 0));
          const containerHeight = mapContainer.current?.clientHeight || 500;
          const mouseY = e.point.y;
          const placement = (mouseY > containerHeight / 2) ? 'bottom' : 'top';

          if (popupRef.current) {
            popupRef.current.remove();
          }
          const color = getO3Color(valeur);

          if (valeur !== undefined) {
            popupRef.current = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              anchor: placement,
              maxWidth: 'max-content',
              offset: placement === 'top' ? [0, 25] : [0, -20]
            })
              .setLngLat(e.lngLat)
              .setHTML(O3Tooltip(valeur, color))
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
          setIsTilesLoading(false);
          onLoadingChange?.(false);
          hasLoadedOnce.current = true;
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
    <div style={{ position: 'relative', ...style }}>
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
    </div>
  );
};
