'use client';

import * as turf from '@turf/turf';
import { mapStyles } from 'carte-facile';
import 'carte-facile/carte-facile.css';
import { Feature, Geometry, LineString, Polygon } from 'geojson';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RefObject, useEffect, useState } from 'react';
import styles from './maps.module.scss';

const HEDGE_WFS_BASE = 'https://data.geopf.fr/wfs/ows';
const HEDGE_WMS_BASE = 'https://data.geopf.fr/wms-v/ows';

type BBox = { minLng: number; minLat: number; maxLng: number; maxLat: number };

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

export const MapHaiesWfs = ({
  coordonneesCommunes,
  contoursCommunes,
  mapRef,
  mapContainer
}: {
  coordonneesCommunes: {
    codes: string[];
    bbox: BBox;
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
          filter: ['in', ['get', 'code_geographique'], ['literal', coordonneesCommunes.codes]],
          paint: { 'line-color': '#161616', 'line-width': 1 }
        });
      } catch (error) {
        console.error('Erreur ajout couche contour communes :', error);
      }

      try {
        const { bbox } = coordonneesCommunes;
        const PAGE_SIZE = 5000;
        const allFeatures: GeoJSON.Feature[] = [];
        let startIndex = 0;

        while (true) {
          const params = new URLSearchParams({
            SERVICE: 'WFS',
            VERSION: '2.0.0',
            REQUEST: 'GetFeature',
            TYPENAMES: 'HAIES.BOCAGES:haie',
            OUTPUTFORMAT: 'application/json',
            COUNT: String(PAGE_SIZE),
            STARTINDEX: String(startIndex),
            BBOX: `${bbox.minLng},${bbox.minLat},${bbox.maxLng},${bbox.maxLat},EPSG:4326`
          });

          const response = await fetch(`${HEDGE_WFS_BASE}?${params.toString()}`, {
            signal: abortController.signal
          });

          if (!response.ok) throw new Error(`WFS error: ${response.status}`);

          const page = await response.json() as GeoJSON.FeatureCollection;
          allFeatures.push(...page.features);

          if (page.features.length < PAGE_SIZE) break;
          startIndex += PAGE_SIZE;

          if (abortController.signal.aborted) return;
        }

        const geojson: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: allFeatures };

        if (abortController.signal.aborted || !mapRef.current) return;

        let clippedData: GeoJSON.FeatureCollection = geojson;

        if (contoursCommunes) {
          try {
            const communeGeometry = JSON.parse(contoursCommunes.geometry) as Geometry;
            const communePolygons: Feature<Polygon>[] =
              communeGeometry.type === 'MultiPolygon'
                ? (communeGeometry as GeoJSON.MultiPolygon).coordinates.map((coords) => turf.polygon(coords))
                : [turf.polygon((communeGeometry as Polygon).coordinates)];

            const clippedFeatures = geojson.features.flatMap((feature) => {
              const line = feature as Feature<LineString>;
              return communePolygons.flatMap((poly) => {
                try {
                  if (!turf.booleanIntersects(line, poly)) return [];
                  if (turf.booleanWithin(line, poly)) return [line];
                  const split = turf.lineSplit(line, poly);
                  return split.features.filter((seg) => {
                    const mid = turf.along(seg, turf.length(seg) / 2);
                    return turf.booleanPointInPolygon(mid, poly);
                  });
                } catch {
                  return [line];
                }
              });
            });
            clippedData = turf.featureCollection(clippedFeatures);
          } catch {
            console.warn('Clip turf échoué, affichage sans découpage');
          }
        }

        map.addSource('haies-wfs', {
          type: 'geojson',
          data: clippedData
        });

        map.addLayer(
          {
            id: 'haies-wfs-layer',
            type: 'line',
            source: 'haies-wfs',
            paint: {
              'line-color': '#2e7d32',
              'line-width': [
                'interpolate', ['linear'], ['zoom'],
                8, 4,
                10, 2,
                13, 1.5
              ]
            }
          },
          'communes-outline-layer'
        );
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Erreur chargement haies WFS :', error);
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
    <div style={{ position: 'relative' }}>
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
          Chargement des données…
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
    </div>
  );
};

export default MapHaiesWfs;
