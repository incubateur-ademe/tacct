'use client';

import { MoustiqueTigreTooltip } from '@/components/maps/subcomponents/tooltips';
import departementsNoms from '@/lib/data/departements.json';
import moustiqueTigreGeoJSON from '@/lib/data/moustique_tigre_departements.json';
import 'carte-facile/carte-facile.css';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import maplibregl, { ExpressionSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RefObject, useEffect, useRef, useState } from 'react';

const BLANK_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {},
  layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#ffffff' } }]
};

const COULEUR_PRESENT = '#FF8094';
const COULEUR_ABSENT = '#f5f5f5';

const casToCouleur = (cas: number): string => {
  if (cas === 0) return '#ffffff';
  if (cas === 1) return '#FFCD72';
  if (cas <= 9) return '#F8B334';
  if (cas <= 19) return '#CF911E';
  if (cas <= 39) return '#A6710E';
  return '#7E5202';
};

export const MapJson = (props: {
  mapRef: RefObject<maplibregl.Map | null>;
  mapContainer: RefObject<HTMLDivElement | null>;
  annee: number;
  casParDepartement?: Record<string, number>;
}) => {
  const { mapRef, mapContainer, annee, casParDepartement } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const hoveredFeatureRef = useRef<string | null>(null);
  const anneeRef = useRef(annee);
  const casParDepartementRef = useRef(casParDepartement);
  anneeRef.current = annee;
  casParDepartementRef.current = casParDepartement;

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: BLANK_STYLE,
      attributionControl: false,
      interactive: true,
      scrollZoom: false,
      bounds: [[-5.5, 41.2], [10.0, 51.5]],
      fitBoundsOptions: { padding: 0 }
    });
    mapRef.current = map;

    map.on('load', () => {
      map.addSource('departements', {
        type: 'geojson',
        data: moustiqueTigreGeoJSON as FeatureCollection<Geometry, GeoJsonProperties>
      });

      map.addLayer({
        id: 'departements-fill',
        type: 'fill',
        source: 'departements',
        paint: {
          'fill-color': COULEUR_ABSENT,
          'fill-opacity': 0.8
        }
      });

      map.addLayer({
        id: 'departements-outline',
        type: 'line',
        source: 'departements',
        paint: {
          'line-color': '#161616',
          'line-width': 0.5
        }
      });

      map.on('mousemove', 'departements-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        const code = e.features[0].properties?.code as string | undefined;
        if (!code) return;

        const nom = `${(departementsNoms as Record<string, string>)[code]} (${code})`;
        const currentCas = casParDepartementRef.current;
        const currentAnnee = anneeRef.current;
        const valeur = currentCas
          ? `${currentCas[code] ?? 0} cas`
          : `${(e.features[0].properties?.annees)?.includes(String(currentAnnee)) ? 'Présence' : 'Absence'}`;

        if (hoveredFeatureRef.current !== code) {
          hoveredFeatureRef.current = code;
          if (popupRef.current) popupRef.current.remove();
          popupRef.current = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            maxWidth: 'none'
          })
            .setLngLat(e.lngLat)
            .setHTML(MoustiqueTigreTooltip(
              nom,
              valeur,
              currentCas ? casToCouleur(
                currentCas
                  ? currentCas[code] ?? 0
                  : (e.features[0].properties?.annees)?.includes(String(currentAnnee)) ? 1 : 0
              ) : (e.features[0].properties?.annees)?.includes(String(currentAnnee))
                ? COULEUR_PRESENT
                : COULEUR_ABSENT
            ))
            .addTo(map);
        } else if (popupRef.current) {
          popupRef.current.setLngLat(e.lngLat);
          popupRef.current.setHTML(
            MoustiqueTigreTooltip(
              nom,
              valeur,
              currentCas ? casToCouleur(
                currentCas
                  ? currentCas[code] ?? 0
                  : (e.features[0].properties?.annees)?.includes(String(currentAnnee)) ? 1 : 0
              ) : (e.features[0].properties?.annees)?.includes(String(currentAnnee))
                ? COULEUR_PRESENT
                : COULEUR_ABSENT
            )
          );
        }
      });

      map.on('mouseleave', 'departements-fill', () => {
        hoveredFeatureRef.current = null;
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
        map.getCanvas().style.cursor = '';
      });

      map.on('mouseenter', 'departements-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      setIsLoaded(true);
    });

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
      map.fitBounds([[-5.5, 41.2], [10.0, 51.5]], { padding: 0, animate: false });
    });
    resizeObserver.observe(mapContainer.current);

    return () => {
      resizeObserver.disconnect();
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    let colorExpression: ExpressionSpecification | string;

    if (casParDepartement) {
      const entries = Object.entries(casParDepartement);
      if (entries.length === 0) {
        colorExpression = '#ffffff';
      } else {
        const matchArgs: (ExpressionSpecification | string)[] = ['match', ['get', 'code']];
        for (const [code, cas] of entries) {
          matchArgs.push(code, casToCouleur(cas));
        }
        matchArgs.push('#ffffff');
        colorExpression = matchArgs as unknown as ExpressionSpecification;
      }
    } else {
      colorExpression = [
        'case',
        ['in', String(annee), ['get', 'annees']],
        COULEUR_PRESENT,
        COULEUR_ABSENT
      ];
    }

    mapRef.current.setPaintProperty('departements-fill', 'fill-color', colorExpression);
  }, [annee, isLoaded, casParDepartement]);

  return (
    <>
      <style jsx global>{`
        .maplibregl-popup .maplibregl-popup-content {
          box-shadow: 0px 2px 6px 0px rgba(0, 0, 18, 0.16) !important;
          border-radius: 6px !important;
          padding: 0.5rem 1rem !important;
        }
        .map-container {
            overflow: visible !important;
          }
      `}</style>
      <div style={{ position: 'relative', aspectRatio: '1.146' }}>
        <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />
      </div>
    </>
  );
};
