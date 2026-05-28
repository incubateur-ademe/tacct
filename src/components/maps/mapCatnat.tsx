'use client';

import { CatnatTypes } from '@/app/(main)/types';
import { mapStyles } from 'carte-facile';
import 'carte-facile/carte-facile.css';
import maplibregl, { ExpressionSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { GraphDataNotFound } from '../graph-data-not-found';
import { colorsCatnat } from './legends/legendCatnat';
import { CatnatTooltip } from './subcomponents/tooltips';
import { AccessibleMapWrapper } from './AccessibleMapWrapper';
import { Any } from '@/lib/utils/types';

const getColor = (d: number, max: number, typeCatnat: string) => {
  const colorPalette = colorsCatnat[typeCatnat];
  return max > 5
    ? d >= (4 / 5) * max
      ? colorPalette[4]
      : d >= (3 / 5) * max
        ? colorPalette[3]
        : d >= (2 / 5) * max
          ? colorPalette[2]
          : d >= (1 / 5) * max
            ? colorPalette[1]
            : colorPalette[0]
    : max === 1
      ? colorPalette[2]
      : max === 2
        ? d === 1
          ? colorPalette[1]
          : colorPalette[3]
        : max === 3
          ? d === 1
            ? colorPalette[0]
            : d === 2
              ? colorPalette[2]
              : colorPalette[4]
          : max === 4
            ? d === 1
              ? colorPalette[0]
              : d === 2
                ? colorPalette[2]
                : d === 3
                  ? colorPalette[3]
                  : colorPalette[4]
            : colorPalette[d - 1];
};

export const MapCatnat = (props: {
  catnatData: { code: string; name: string; catnat: Any }[];
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
  typeRisqueValue: CatnatTypes;
}) => {
  const { catnatData, coordonneesCommunes, typeRisqueValue } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const hoveredFeatureRef = useRef<string | null>(null);

  const catnatByCommune = useMemo(() => {
    const map = new Map<string, Any>();
    catnatData.forEach(item => {
      map.set(item.code, item.catnat);
    });
    return map;
  }, [catnatData]);

  const nameByCommune = useMemo(() => {
    const map = new Map<string, string>();
    catnatData.forEach(item => {
      if (item.name) {
        map.set(item.code, item.name);
      }
    });
    return map;
  }, [catnatData]);

  const maxValue = useMemo(() => {
    return typeRisqueValue === 'Tous types'
      ? Math.max(...catnatData.map(el => el.catnat?.sumCatnat || 0))
      : Math.max(...catnatData.map(el => el.catnat?.[typeRisqueValue] || 0));
  }, [catnatData, typeRisqueValue]);

  const createColorExpression = useMemo(() => {
    const colorPairs: (ExpressionSpecification | string)[] = [];
    catnatData.forEach(item => {
      const value = typeRisqueValue === 'Tous types'
        ? item.catnat?.sumCatnat || 0
        : item.catnat?.[typeRisqueValue] || 0;
      const color = value > 0 ? getColor(value, maxValue, typeRisqueValue) : 'transparent';
      colorPairs.push(
        ['==', ['get', 'code_geographique'], item.code],
        color
      );
    });
    return ['case', ...colorPairs, 'transparent'] as ExpressionSpecification;
  }, [catnatData, typeRisqueValue, maxValue]);

  useEffect(() => {
    if (!mapContainer.current || !coordonneesCommunes) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.desaturated,
      attributionControl: false,
    });
    mapRef.current = map;

    map.on('load', () => {
      if (coordonneesCommunes?.bbox) {
        setTimeout(() => {
          map.fitBounds(
            [[coordonneesCommunes.bbox.minLng, coordonneesCommunes.bbox.minLat],
            [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.maxLat]],
            { padding: 20 }
          );
        }, 100);
      }

      map.addSource('communes-tiles', {
        type: 'vector',
        tiles: [`${process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL}/communes/tiles/{z}/{x}/{y}.pbf`],
        minzoom: 4,
        maxzoom: 13,
        promoteId: 'code_geographique'
      });

      map.addLayer({
        id: 'catnat-fill',
        type: 'fill',
        source: 'communes-tiles',
        'source-layer': 'contour_communes',
        filter: ['in', ['get', 'code_geographique'], ['literal', coordonneesCommunes.codes]],
        paint: {
          'fill-color': createColorExpression,
          'fill-opacity': 1,
        }
      });

      map.addLayer({
        id: 'catnat-stroke',
        type: 'line',
        source: 'communes-tiles',
        'source-layer': 'contour_communes',
        filter: ['in', ['get', 'code_geographique'], ['literal', coordonneesCommunes.codes]],
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#0D2100',
            '#161616'
          ],
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            3,
            1
          ]
        }
      });

      map.on('mouseenter', 'catnat-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const properties = feature.properties;
          const code = properties?.code_geographique;

          if (hoveredFeatureRef.current) {
            map.setFeatureState(
              { source: 'communes-tiles', sourceLayer: 'contour_communes', id: hoveredFeatureRef.current },
              { hover: false }
            );
          }
          const newHoveredFeature = code;
          hoveredFeatureRef.current = newHoveredFeature;
          if (newHoveredFeature) {
            map.setFeatureState(
              { source: 'communes-tiles', sourceLayer: 'contour_communes', id: newHoveredFeature },
              { hover: true }
            );
          }

          const communeName = nameByCommune.get(code) || properties?.libelle_geographique || 'Commune inconnue';
          const catnat = catnatByCommune.get(code);
          if (catnat && communeName) {
            const { ...restCatnat } = catnat;
            const tooltipContent = CatnatTooltip(restCatnat, communeName);
            if (popupRef.current) {
              popupRef.current.remove();
            }
            const containerHeight = mapContainer.current?.clientHeight || 500;
            const mouseY = e.point.y;
            const placement = (mouseY > containerHeight / 2) ? 'bottom' : 'top';

            popupRef.current = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              className: 'catnat-tooltip',
              anchor: placement,
              maxWidth: 'none'
            })
              .setLngLat(e.lngLat)
              .setHTML(tooltipContent)
              .addTo(map);
          }
        }
      });

      map.on('mouseleave', 'catnat-fill', () => {
        if (hoveredFeatureRef.current) {
          map.setFeatureState(
            { source: 'communes-tiles', sourceLayer: 'contour_communes', id: hoveredFeatureRef.current },
            { hover: false }
          );
        }
        hoveredFeatureRef.current = null;
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      });

      map.on('mousemove', 'catnat-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const properties = feature.properties;
          const code = properties?.code_geographique;
          const newHoveredFeature = code;
          const containerHeight = mapContainer.current?.clientHeight || 500;
          const mouseY = e.point.y;
          const placement = (mouseY > containerHeight / 2) ? 'bottom' : 'top';

          if (hoveredFeatureRef.current !== newHoveredFeature) {
            if (hoveredFeatureRef.current) {
              map.setFeatureState(
                { source: 'communes-tiles', sourceLayer: 'contour_communes', id: hoveredFeatureRef.current },
                { hover: false }
              );
            }
            hoveredFeatureRef.current = newHoveredFeature;
            if (newHoveredFeature) {
              map.setFeatureState(
                { source: 'communes-tiles', sourceLayer: 'contour_communes', id: newHoveredFeature },
                { hover: true }
              );
            }
            const communeName = nameByCommune.get(code) || properties?.libelle_geographique || 'Commune inconnue';
            const catnat = catnatByCommune.get(code);
            if (catnat && communeName) {
              const { ...restCatnat } = catnat;
              const tooltipContent = CatnatTooltip(restCatnat, communeName);
              if (popupRef.current) popupRef.current.remove();
              popupRef.current = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'catnat-tooltip',
                anchor: placement,
                maxWidth: 'none'
              })
                .setLngLat(e.lngLat)
                .setHTML(tooltipContent)
                .addTo(map);
            }
          } else if (popupRef.current) {
            popupRef.current.setLngLat(e.lngLat);
            const currentAnchor = popupRef.current.getElement()?.getAttribute('class')?.includes('anchor-top') ? 'top' : 'bottom';
            if (currentAnchor !== placement) {
              const communeName = nameByCommune.get(code) || properties?.libelle_geographique || 'Commune inconnue';
              const catnat = catnatByCommune.get(code);
              if (catnat && communeName) {
                const { ...restCatnat } = catnat;
                const tooltipContent = CatnatTooltip(restCatnat, communeName);
                popupRef.current.remove();
                popupRef.current = new maplibregl.Popup({
                  closeButton: false,
                  closeOnClick: false,
                  className: 'catnat-tooltip',
                  anchor: placement,
                  maxWidth: 'none'
                })
                  .setLngLat(e.lngLat)
                  .setHTML(tooltipContent)
                  .addTo(map);
              }
            }
          }
        }
      });

      map.on('mouseenter', 'catnat-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'catnat-fill', () => {
        map.getCanvas().style.cursor = '';
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

  // Mettre à jour les couleurs quand typeRisqueValue change
  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded() && mapRef.current.getLayer('catnat-fill')) {
      mapRef.current.setPaintProperty('catnat-fill', 'fill-color', createColorExpression);
    }
  }, [createColorExpression]);

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
      {!coordonneesCommunes ? (
        <GraphDataNotFound code={code} libelle={libelle} />
      ) : (
        <AccessibleMapWrapper
          ariaLabel="Carte choroplèthe du nombre d'arrêtés de catastrophe naturelle par commune sur votre territoire"
          style={{ position: 'relative' }}
        >
          <div ref={mapContainer} className='map-container' style={{ height: '500px', width: '100%' }} />
        </AccessibleMapWrapper>
      )}
    </>
  );
};
