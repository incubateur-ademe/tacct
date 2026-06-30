
import { RetardScroll } from '@/hooks/RetardScroll';
import { listeArrondissements } from '@/lib/territoireData/arrondissements';
import { mapStyles } from 'carte-facile';
import maplibregl, { ExpressionSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RefObject, useEffect, useMemo, useRef } from 'react';
import { AccessibleMapWrapper } from './AccessibleMapWrapper';
import { mapTransformRequest } from './mapTransformRequest';
import { Patch4Tooltip } from './subcomponents/tooltips';

const getColorByAggravation = (value: number | null) => {
  if (value === null) return '#FFF';
  if (value === 0) return '#FFF';
  if (value < 0.33) return '#FFEBB6';
  if (value <= 0.66) return '#FFB181';
  return '#FF1C64';
};

const getAggravation = (value: number | null) => {
  if (value === null) return 'Pas d\'information';
  if (value === 0) return 'Pas d\'évolution';
  if (value < 0.33) return 'Aggravation modérée';
  if (value <= 0.66) return 'Aggravation forte';
  return 'Aggravation très forte';
};

export const MapPatch4 = (props: {
  patch4: {
    [x: string]: string;
    code_geographique: string;
    libelle_geographique: string;
  }[];
  communesCodes: string[];
  boundingBox?: [[number, number], [number, number]];
  mapRefCallback?: (ref: RefObject<maplibregl.Map | null>) => void;
  containerRefCallback?: (ref: RefObject<HTMLDivElement | null>) => void;
}) => {
  const { patch4, communesCodes, boundingBox, mapRefCallback, containerRefCallback } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const hoveredFeatureRef = useRef<string | null>(null);
  const nameByCommune = useRef<Map<string, string>>(new Map());
  const valueByCommune = useRef<Map<string, number>>(new Map());
  const filteredCodes = communesCodes.filter(code => !listeArrondissements.includes(code));
  const alea = patch4[0] ? Object.keys(patch4[0]).find(key => key !== 'code_geographique' && key !== 'index' && key !== 'libelle_geographique') as 'feux_foret' | 'fortes_chaleurs' | 'fortes_precipitations' | 'niveaux_marins' | 'secheresse_sols' | undefined : undefined;
  // Mettre à jour les Maps à chaque changement de patch4
  useEffect(() => {
    nameByCommune.current = new Map(
      patch4.map(item => [item.code_geographique, item.libelle_geographique ?? 'Commune inconnue'])
    );
    valueByCommune.current = new Map(
      patch4.map(item => {
        const value = alea ? Number((item as never)[alea]) : 0;
        return [item.code_geographique, value];
      })
    );
  }, [patch4, alea]);

  const boundingBoxKey = useMemo(() =>
    boundingBox ? JSON.stringify(boundingBox) : null
    , [boundingBox]);

  const createColorExpression = useMemo(() => {
    if (!alea) return ['literal', '#E5E5E5'] as ExpressionSpecification;
    const colorPairs: (ExpressionSpecification | string)[] = [];
    patch4.forEach(item => {
      const value = Number(item[alea]);
      const color = getColorByAggravation(value);
      colorPairs.push(
        ['==', ['get', 'code_geographique'], item.code_geographique],
        color
      );
    });
    return ['case', ...colorPairs, '#E5E5E5'] as ExpressionSpecification;
  }, [alea, patch4]);


  const colorExpressionRef = useRef(createColorExpression);
  colorExpressionRef.current = createColorExpression;

  const filteredCodesKey = useMemo(() => JSON.stringify(filteredCodes), [filteredCodes]);
  useEffect(() => {
    if (!mapContainer.current || filteredCodes.length === 0) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.desaturated,
      attributionControl: false,
      cooperativeGestures: typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
      locale: {
        'CooperativeGesturesHandler.MobileHelpText': 'Utilisez deux doigts pour déplacer la carte',
      },
      transformRequest: mapTransformRequest,
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });
    mapRef.current = map;

    if (mapRefCallback) {
      mapRefCallback(mapRef);
    }
    if (containerRefCallback) {
      containerRefCallback(mapContainer);
    }
    // s'assure que le zoom au scroll est désactivé immédiatement pour éviter de capturer les défilements de page
    try { map.scrollZoom.disable(); } catch (e) { /* noop */ }

    map.on('load', () => {
      if (boundingBox) {
        map.fitBounds(boundingBox, { padding: 20 });
      }

      // Ajouter la source de tiles pour les communes
      map.addSource('communes-tiles', {
        type: 'vector',
        tiles: [`${process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL}/communes/tiles/{z}/{x}/{y}.pbf`],
        minzoom: 4,
        maxzoom: 13,
        promoteId: 'code_geographique'
      });

      map.addLayer({
        id: 'patch4-fill',
        type: 'fill',
        source: 'communes-tiles',
        'source-layer': 'contour_communes',
        filter: ['in', ['get', 'code_geographique'], ['literal', filteredCodes]],
        paint: {
          'fill-color': colorExpressionRef.current,
          'fill-opacity': 0.99
        }
      });

      map.addLayer({
        id: 'patch4-stroke',
        type: 'line',
        source: 'communes-tiles',
        'source-layer': 'contour_communes',
        filter: ['in', ['get', 'code_geographique'], ['literal', filteredCodes]],
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

      map.on('mouseenter', 'patch4-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const properties = feature.properties;
          if (hoveredFeatureRef.current) {
            map.setFeatureState(
              { source: 'communes-tiles', sourceLayer: 'contour_communes', id: hoveredFeatureRef.current },
              { hover: false }
            );
          }
          const newHoveredFeature = properties?.code_geographique;
          hoveredFeatureRef.current = newHoveredFeature;
          if (newHoveredFeature) {
            map.setFeatureState(
              { source: 'communes-tiles', sourceLayer: 'contour_communes', id: newHoveredFeature },
              { hover: true }
            );
          }
          const communeName = nameByCommune.current.get(newHoveredFeature) ?? 'Commune inconnue';
          const value = valueByCommune.current.get(newHoveredFeature) ?? 0;
          const color = getColorByAggravation(value);
          const aggravation = getAggravation(value);
          if (popupRef.current) {
            popupRef.current.remove();
          }
          const containerHeight = mapContainer.current?.clientHeight || 500;
          const mouseY = e.point.y;
          const placement = (mouseY > containerHeight / 2) ? 'bottom' : 'top';
          popupRef.current = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'patch4-tooltip',
            anchor: placement,
            maxWidth: 'none'
          })
            .setLngLat(e.lngLat)
            .setHTML(Patch4Tooltip(communeName, aggravation, color))
            .addTo(map);
        }
      });

      map.on('mouseleave', 'patch4-fill', () => {
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

      map.on('mousemove', 'patch4-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const properties = feature.properties;
          const newHoveredFeature = properties?.code_geographique;
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
            const communeName = nameByCommune.current.get(newHoveredFeature) ?? 'Commune inconnue';
            const value = valueByCommune.current.get(newHoveredFeature) ?? 0;
            const color = getColorByAggravation(value);
            const aggravation = getAggravation(value);

            if (popupRef.current) popupRef.current.remove();
            popupRef.current = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              className: 'patch4-tooltip',
              anchor: placement,
              maxWidth: 'none'
            })
              .setLngLat(e.lngLat)
              .setHTML(Patch4Tooltip(communeName, aggravation, color))
              .addTo(map);
          } else if (popupRef.current) {
            popupRef.current.setLngLat(e.lngLat);
            const currentAnchor = popupRef.current.getElement()?.getAttribute('class')?.includes('anchor-top') ? 'top' : 'bottom';
            if (currentAnchor !== placement) {
              const communeName = nameByCommune.current.get(newHoveredFeature) ?? 'Commune inconnue';
              const value = valueByCommune.current.get(newHoveredFeature) ?? 0;
              const color = getColorByAggravation(value);
              const aggravation = getAggravation(value);
              popupRef.current.remove();
              popupRef.current = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'patch4-tooltip',
                anchor: placement,
                maxWidth: 'none'
              })
                .setLngLat(e.lngLat)
                .setHTML(Patch4Tooltip(communeName, aggravation, color))
                .addTo(map);
            }
          }
        }
      });

      map.on('mouseenter', 'patch4-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'patch4-fill', () => {
        map.getCanvas().style.cursor = '';
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Force-resync : la valeur du ref peut avoir changé pendant le chargement
      map.setPaintProperty('patch4-fill', 'fill-color', colorExpressionRef.current);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [filteredCodesKey, boundingBoxKey]);

  // Mettre à jour les couleurs quand alea/patch4 change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const ready = map.isStyleLoaded() && map.getLayer('patch4-fill');
    if (ready) {
      map.setPaintProperty('patch4-fill', 'fill-color', createColorExpression);
    } else {
      const handler = () => {
        if (map.getLayer('patch4-fill')) {
          map.setPaintProperty('patch4-fill', 'fill-color', colorExpressionRef.current);
        }
      };
      map.once('idle', handler);
      return () => { map.off('idle', handler); };
    }
  }, [createColorExpression]);

  // Ref local pour le RetardScroll
  const localContainerRef = mapContainer as RefObject<HTMLElement>;

  return (
    <>
      <style jsx global>{`
        .maplibregl-popup .maplibregl-popup-content {
          box-shadow: 0px 2px 6px 0px rgba(0, 0, 18, 0.16) !important;
          border-radius: 6px !important;
          padding: 0.75rem 1rem !important;
        }
        .map-container {
            overflow: visible !important;
          }
      `}</style>
      <AccessibleMapWrapper
        ariaLabel="Cartographie représentant le niveau d'aggravation par aléa climatique par commune sur votre territoire"
        style={{ position: 'relative' }}
      >
        <div ref={mapContainer} className='map-container' style={{ height: '500px', width: '100%' }} />
        <RetardScroll mapRef={mapRef} containerRef={localContainerRef} delay={300} />
      </AccessibleMapWrapper>
    </>
  );
};
