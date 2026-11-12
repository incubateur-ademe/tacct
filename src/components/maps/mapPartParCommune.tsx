'use client';

import maplibregl from '@/lib/maplibre';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { mapStyles } from 'carte-facile';
import { ExpressionSpecification, MapLayerMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useMemo, useRef } from 'react';
import { AccessibleMapWrapper } from './AccessibleMapWrapper';
import { PartCommuneTooltip } from './subcomponents/tooltips';

export type PartCommune = {
  code: string;
  name: string;
  part: number | null;
};

export type ClassePart = {
  min: number;
  value: string;
  color: string;
};

export type CarteParCommune = {
  communesCodes: string[];
  donnees: PartCommune[];
  bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  classes: ClassePart[];
  titreLegende: string;
  libelleInfobulle: string;
  ariaLabel: string;
  formatValeur?: (valeur: number) => string;
  valeurSiAbsente?: number;
};

const formatPourcentage = (valeur: number) => `${Round(valeur, 1)} %`;

export const MapPartParCommune = (props: {
  carte: CarteParCommune;
}) => {
  const {
    communesCodes,
    donnees,
    bbox,
    classes,
    libelleInfobulle,
    ariaLabel,
    formatValeur = formatPourcentage,
    valeurSiAbsente
  } = props.carte;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const hoveredFeatureRef = useRef<string | null>(null);

  const donneesParCommune = useMemo(
    () => new Map(donnees.map((d) => [d.code, d])),
    [donnees]
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    const couleurPart = (part: number | null) => {
      if (part === null) return 'white';
      const classe = [...classes].reverse().find((c) => part >= c.min);
      return classe ? classe.color : 'white';
    };

    const valeurDe = (code: string) => {
      const commune = donneesParCommune.get(code);
      return commune ? commune.part : (valeurSiAbsente ?? null);
    };

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
      const valeur = valeurDe(code);
      const tooltipContent = PartCommuneTooltip(
        donneesParCommune.get(code)?.name || properties?.libelle_geographique || 'Commune inconnue',
        libelleInfobulle,
        valeur === null ? 'Aucune donnée' : formatValeur(valeur)
      );
      popupRef.current?.remove();
      popupRef.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        anchor: placement,
        maxWidth: 'none'
      })
        .setLngLat(e.lngLat)
        .setHTML(tooltipContent)
        .addTo(map);
    };

    map.on('load', () => {
      map.fitBounds(
        [[bbox.minLng, bbox.minLat], [bbox.maxLng, bbox.maxLat]],
        { padding: 20 }
      );

      map.addSource('communes-tiles', {
        type: 'vector',
        tiles: [`${process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL}/communes/tiles/{z}/{x}/{y}.pbf`],
        minzoom: 4,
        maxzoom: 13,
        promoteId: 'code_geographique'
      });

      const couleurParDefaut = couleurPart(valeurSiAbsente ?? null);
      let colorExpression: ExpressionSpecification | string = couleurParDefaut;
      if (donneesParCommune.size) {
        const matchArgs: (ExpressionSpecification | string)[] = ['match', ['get', 'code_geographique']];
        donneesParCommune.forEach((d) => {
          matchArgs.push(d.code, couleurPart(d.part));
        });
        matchArgs.push(couleurParDefaut);
        colorExpression = matchArgs as unknown as ExpressionSpecification;
      }

      map.addLayer({
        id: 'part-fill',
        type: 'fill',
        source: 'communes-tiles',
        'source-layer': 'contour_communes',
        filter: ['in', ['get', 'code_geographique'], ['literal', communesCodes]],
        paint: {
          'fill-color': colorExpression,
          'fill-opacity': 1
        }
      });

      map.addLayer({
        id: 'part-stroke',
        type: 'line',
        source: 'communes-tiles',
        'source-layer': 'contour_communes',
        filter: ['in', ['get', 'code_geographique'], ['literal', communesCodes]],
        paint: {
          'line-color': '#161616',
          'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 3, 1]
        }
      });

      map.on('mousemove', 'part-fill', afficherInfobulle);
      map.on('mouseenter', 'part-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'part-fill', () => {
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
  }, [communesCodes, donneesParCommune, bbox, classes, libelleInfobulle, formatValeur, valeurSiAbsente]);

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
      <AccessibleMapWrapper ariaLabel={ariaLabel} style={{ position: 'relative' }}>
        <div ref={mapContainer} className="map-container" style={{ height: '500px', width: '100%' }} />
      </AccessibleMapWrapper>
    </>
  );
};
