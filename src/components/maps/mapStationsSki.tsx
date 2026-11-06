'use client';

import { StationSki } from '@/lib/postgres/models';
import { listeArrondissements } from '@/lib/territoireData/arrondissements';
import { mapStyles } from 'carte-facile';
import maplibregl, { ExpressionSpecification, MapLayerMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useMemo, useRef } from 'react';
import { AccessibleMapWrapper } from './AccessibleMapWrapper';
import { stationsSkiTailleClasses } from './legends/datavizLegends';
import { StationsSkiTooltip } from './subcomponents/tooltips';

export type StationsSkiCommune = {
  code: string;
  name: string;
  stations: StationSki[];
  taille: string | null;
};

const couleurCommune = (commune: StationsSkiCommune) =>
  stationsSkiTailleClasses.find((c) => c.value === commune.taille)?.color ?? 'white';

export const MapStationsSki = (props: {
  communesCodes: string[];
  stationsSki: StationsSkiCommune[];
  boundingBox: number[][] | null;
}) => {
  const { communesCodes, stationsSki, boundingBox } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const hoveredFeatureRef = useRef<string | null>(null);
  const filteredCodes = communesCodes.filter((code) => !listeArrondissements.includes(code));

  const stationsParCommune = useMemo(() => {
    const map = new Map<string, StationsSkiCommune>();
    stationsSki.forEach((item) => map.set(item.code, item));
    return map;
  }, [stationsSki]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.desaturated,
      attributionControl: false,
      cooperativeGestures: typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
      locale: {
        'CooperativeGesturesHandler.MobileHelpText': 'Utilisez deux doigts pour déplacer la carte'
      }
    });
    mapRef.current = map;

    const setHover = (code: string | null, hover: boolean) => {
      if (!code) return;
      map.setFeatureState(
        { source: 'communes-tiles', sourceLayer: 'contour_communes', id: code },
        { hover }
      );
    };

    const afficherInfobulle = (e: MapLayerMouseEvent) => {
      const properties = e.features?.[0]?.properties;
      const code: string | undefined = properties?.code_geographique;
      if (!code) return;
      const containerHeight = mapContainer.current?.clientHeight || 500;
      const placement = e.point.y > containerHeight / 2 ? 'bottom' : 'top';
      if (hoveredFeatureRef.current !== code) {
        setHover(hoveredFeatureRef.current, false);
        hoveredFeatureRef.current = code;
        setHover(code, true);
      } else if (popupRef.current) {
        const currentAnchor = popupRef.current.getElement()?.getAttribute('class')?.includes('anchor-top') ? 'top' : 'bottom';
        if (currentAnchor === placement) {
          popupRef.current.setLngLat(e.lngLat);
          return;
        }
      }
      const commune = stationsParCommune.get(code);
      const tooltipContent = StationsSkiTooltip(
        commune?.name || properties?.libelle_geographique || 'Commune inconnue',
        commune?.stations ?? []
      );
      popupRef.current?.remove();
      popupRef.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'stations-ski-tooltip',
        anchor: placement,
        maxWidth: 'none'
      })
        .setLngLat(e.lngLat)
        .setHTML(tooltipContent)
        .addTo(map);
    };

    map.on('load', () => {
      if (
        boundingBox &&
        boundingBox.length > 1 &&
        Array.isArray(boundingBox[0]) &&
        boundingBox[0].length === 2
      ) {
        const lons = boundingBox.map((coord) => coord[0]);
        const lats = boundingBox.map((coord) => coord[1]);
        map.fitBounds(
          [[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]],
          { padding: 20 }
        );
      }

      map.addSource('communes-tiles', {
        type: 'vector',
        tiles: [`${process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL}/communes/tiles/{z}/{x}/{y}.pbf`],
        minzoom: 4,
        maxzoom: 13,
        promoteId: 'code_geographique'
      });

      const colorPairs: (ExpressionSpecification | string)[] = [];
      stationsSki.forEach((item) => {
        colorPairs.push(['==', ['get', 'code_geographique'], item.code], couleurCommune(item));
      });
      const colorExpression = (
        colorPairs.length ? ['case', ...colorPairs, 'white'] : 'white'
      ) as ExpressionSpecification;

      map.addLayer({
        id: 'stations-ski-fill',
        type: 'fill',
        source: 'communes-tiles',
        'source-layer': 'contour_communes',
        filter: ['in', ['get', 'code_geographique'], ['literal', filteredCodes]],
        paint: {
          'fill-color': colorExpression,
          'fill-opacity': 1
        }
      });

      map.addLayer({
        id: 'stations-ski-stroke',
        type: 'line',
        source: 'communes-tiles',
        'source-layer': 'contour_communes',
        filter: ['in', ['get', 'code_geographique'], ['literal', filteredCodes]],
        paint: {
          'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#0D2100', '#161616'],
          'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 3, 1]
        }
      });

      map.on('mousemove', 'stations-ski-fill', afficherInfobulle);
      map.on('mouseenter', 'stations-ski-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'stations-ski-fill', () => {
        map.getCanvas().style.cursor = '';
        setHover(hoveredFeatureRef.current, false);
        hoveredFeatureRef.current = null;
        popupRef.current?.remove();
        popupRef.current = null;
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [communesCodes, stationsParCommune, boundingBox, stationsSki]);

  return (
    <>
      <style jsx global>{`
        .maplibregl-popup .maplibregl-popup-content {
          box-shadow: 0px 2px 6px 0px rgba(0, 0, 18, 0.16) !important;
          border-radius: 6px !important;
          padding: 1rem !important;
        }
        .map-container {
          overflow: visible !important;
        }
      `}</style>
      <AccessibleMapWrapper
        ariaLabel="Carte représentant la taille des stations de ski de chaque commune de votre territoire"
        style={{ position: 'relative' }}
      >
        <div ref={mapContainer} className="map-container" style={{ height: '500px', width: '100%' }} />
      </AccessibleMapWrapper>
    </>
  );
};
