
import { RetardScroll } from '@/hooks/RetardScroll';
import { ConsommationNAF } from '@/lib/postgres/models';
import { listeArrondissements } from '@/lib/territoireData/arrondissements';
import { mapStyles } from 'carte-facile';
import maplibregl, { ExpressionSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RefObject, useEffect, useRef } from 'react';
import { EspacesNafTooltip } from './subcomponents/tooltips';
import { AccessibleMapWrapper } from './AccessibleMapWrapper';

const getColor = (d: number) => {
  return d > 200000
    ? '#680000'
    : d > 100000
      ? '#B5000E'
      : d > 50000
        ? '#E8323B'
        : d > 20000
          ? '#FF9699'
          : d > 10000
            ? '#FFECEE'
            : '#D8EFFA';
};

export const MapEspacesNaf = (props: {
  consommationNAF: ConsommationNAF[];
  communesCodes: string[];
  boundingBox?: [[number, number], [number, number]];
}) => {
  const { consommationNAF, communesCodes, boundingBox } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const hoveredFeatureRef = useRef<string | null>(null);
  const filteredCodes = communesCodes.filter(code => !listeArrondissements.includes(code));

  // Créer une Map des valeurs NAF par code commune
  const nafByCommune = new Map(
    consommationNAF.map(item => [item.code_geographique, item.naf09art23 ?? 0])
  );

  // Créer une Map des noms de communes par code
  const nameByCommune = new Map(
    consommationNAF.map(item => [item.code_geographique, item.libelle_geographique])
  );

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.desaturated,
      attributionControl: false,
    });
    mapRef.current = map;
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

      // Créer l'expression de couleur basée sur les valeurs NAF
      const colorPairs: (ExpressionSpecification | string)[] = [];
      consommationNAF.forEach(item => {
        const naf = item.naf09art23 ?? 0;
        const color = getColor(naf);
        colorPairs.push(
          ['==', ['get', 'code_geographique'], item.code_geographique],
          color
        );
      });
      const colorExpression: ExpressionSpecification = ['case', ...colorPairs, '#D8EFFA'] as ExpressionSpecification;

      map.addLayer({
        id: 'naf-fill',
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
        id: 'naf-stroke',
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

      map.on('mouseenter', 'naf-fill', (e) => {
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
          const communeName = nameByCommune.get(newHoveredFeature) ?? 'Commune inconnue';
          const naf = nafByCommune.get(newHoveredFeature) ?? 0;
          const tooltipContent = EspacesNafTooltip(communeName, naf);
          if (popupRef.current) {
            popupRef.current.remove();
          }
          const containerHeight = mapContainer.current?.clientHeight || 500;
          const mouseY = e.point.y;
          const placement = (mouseY > containerHeight / 2) ? 'bottom' : 'top';
          popupRef.current = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'naf-tooltip',
            anchor: placement,
            maxWidth: 'none'
          })
            .setLngLat(e.lngLat)
            .setHTML(tooltipContent)
            .addTo(map);
        }
      });

      map.on('mouseleave', 'naf-fill', () => {
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

      map.on('mousemove', 'naf-fill', (e) => {
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
            const communeName = nameByCommune.get(newHoveredFeature) ?? 'Commune inconnue';
            const naf = nafByCommune.get(newHoveredFeature) ?? 0;
            const tooltipContent = EspacesNafTooltip(communeName, naf);
            if (popupRef.current) popupRef.current.remove();
            popupRef.current = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              className: 'naf-tooltip',
              anchor: placement,
              maxWidth: 'none'
            })
              .setLngLat(e.lngLat)
              .setHTML(tooltipContent)
              .addTo(map);
          } else if (popupRef.current) {
            popupRef.current.setLngLat(e.lngLat);
            const currentAnchor = popupRef.current.getElement()?.getAttribute('class')?.includes('anchor-top') ? 'top' : 'bottom';
            if (currentAnchor !== placement) {
              const communeName = nameByCommune.get(newHoveredFeature) ?? 'Commune inconnue';
              const naf = nafByCommune.get(newHoveredFeature) ?? 0;
              const tooltipContent = EspacesNafTooltip(communeName, naf);
              popupRef.current.remove();
              popupRef.current = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'naf-tooltip',
                anchor: placement,
                maxWidth: 'none'
              })
                .setLngLat(e.lngLat)
                .setHTML(tooltipContent)
                .addTo(map);
            }
          }
        }
      });

      map.on('mouseenter', 'naf-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'naf-fill', () => {
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
  }, [consommationNAF, filteredCodes, boundingBox]);

  // Ref local pour le RetardScroll
  const localContainerRef = mapContainer as RefObject<HTMLElement>;

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
        ariaLabel="Carte choroplèthe de la consommation d'espaces naturels, agricoles et forestiers (NAF) par commune sur votre territoire entre 2009 et 2023"
        style={{ position: 'relative' }}
      >
        <div ref={mapContainer} className='map-container' style={{ height: '500px', width: '100%' }} />
        <RetardScroll mapRef={mapRef} containerRef={localContainerRef} delay={300} />
      </AccessibleMapWrapper>
    </>
  );
};
