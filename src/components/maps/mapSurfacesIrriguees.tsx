
import couleurs from '@/design-system/couleurs';
import { listeArrondissements } from '@/lib/territoireData/arrondissements';
import { mapStyles } from 'carte-facile';
import maplibregl, { ExpressionSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useMemo, useRef } from 'react';
import { AccessibleMapWrapper } from './AccessibleMapWrapper';
import { SurfacesIrrigueesTooltip } from './subcomponents/tooltips';

export const MapSurfacesIrriguees = (props: {
  communesCodes: string[];
  surfacesIrriguees: { code: string; value: number | null; name: string }[];
  boundingBox: number[][] | null;
}) => {
  const { communesCodes, surfacesIrriguees, boundingBox } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const hoveredFeatureRef = useRef<string | null>(null);
  const filteredCodes = communesCodes.filter(code => !listeArrondissements.includes(code));

  const surfacesIrrigueesByCommune = useMemo(() => {
    const map = new Map<string, number | null>();
    surfacesIrriguees.forEach(item => {
      map.set(item.code, item.value);
    });
    return map;
  }, [surfacesIrriguees]);

  const nameByCommune = useMemo(() => {
    const map = new Map<string, string>();
    surfacesIrriguees.forEach(item => {
      map.set(item.code, item.name);
    });
    return map;
  }, [surfacesIrriguees]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.desaturated,
      attributionControl: false,
    });
    mapRef.current = map;

    map.on('load', () => {
      if (
        boundingBox &&
        Array.isArray(boundingBox) &&
        boundingBox.length > 1 &&
        Array.isArray(boundingBox[0]) &&
        boundingBox[0].length === 2
      ) {
        const lons = boundingBox.map((coord: number[]) => coord[0]);
        const lats = boundingBox.map((coord: number[]) => coord[1]);
        const minLng = Math.min(...lons);
        const maxLng = Math.max(...lons);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        map.fitBounds(
          [[minLng, minLat], [maxLng, maxLat]],
          { padding: 20 },
        );
      }

      // Add vector tiles source
      map.addSource('communes-tiles', {
        type: 'vector',
        tiles: [`${process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL}/communes/tiles/{z}/{x}/{y}.pbf`],
        minzoom: 4,
        maxzoom: 13,
        promoteId: 'code_geographique'
      });

      // Créer l'expression de couleur basée sur les valeurs
      const colorPairs: (ExpressionSpecification | string)[] = [];
      surfacesIrriguees.forEach(item => {
        const value = item.value;
        let color: string;
        // Gérer les NaN et valeurs manquantes
        if (value === null || value === undefined || isNaN(value)) {
          color = 'white';
        } else if (value > 60) {
          color = couleurs.graphiques.bleu[5];
        } else if (value > 40) {
          color = couleurs.graphiques.bleu[1];
        } else if (value > 20) {
          color = couleurs.graphiques.bleu[2];
        } else if (value >= 0.01) {
          color = couleurs.graphiques.bleu[3];
        } else {
          color = couleurs.graphiques.bleu[4];
        }
        colorPairs.push(
          ['==', ['get', 'code_geographique'], item.code],
          color
        );
      });
      const colorExpression: ExpressionSpecification = ['case', ...colorPairs, 'white'] as ExpressionSpecification;

      map.addLayer({
        id: 'surfaces-irriguees-fill',
        type: 'fill',
        source: 'communes-tiles',
        'source-layer': 'contour_communes',
        filter: ['in', ['get', 'code_geographique'], ['literal', filteredCodes]],
        paint: {
          'fill-color': colorExpression,
          'fill-opacity': 1,
        }
      });

      // Add stroke layer
      map.addLayer({
        id: 'surfaces-irriguees-stroke',
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

      map.on('mouseenter', 'surfaces-irriguees-fill', (e) => {
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
          const surfacesIrrigueesValue = surfacesIrrigueesByCommune.get(code) ?? null;
          const tooltipContent = SurfacesIrrigueesTooltip(communeName, surfacesIrrigueesValue);

          if (popupRef.current) {
            popupRef.current.remove();
          }
          const containerHeight = mapContainer.current?.clientHeight || 500;
          const mouseY = e.point.y;
          const placement = (mouseY > containerHeight / 2) ? 'bottom' : 'top';
          popupRef.current = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'surfaces-irriguees-tooltip',
            anchor: placement,
            maxWidth: 'none'
          })
            .setLngLat(e.lngLat)
            .setHTML(tooltipContent)
            .addTo(map);
        }
      });

      map.on('mouseleave', 'surfaces-irriguees-fill', () => {
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

      map.on('mousemove', 'surfaces-irriguees-fill', (e) => {
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
            const surfacesIrrigueesValue = surfacesIrrigueesByCommune.get(code) ?? null;
            const tooltipContent = SurfacesIrrigueesTooltip(communeName, surfacesIrrigueesValue);

            if (popupRef.current) popupRef.current.remove();
            popupRef.current = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              className: 'surfaces-irriguees-tooltip',
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
              const communeName = nameByCommune.get(code) || properties?.libelle_geographique || 'Commune inconnue';
              const surfacesIrrigueesValue = surfacesIrrigueesByCommune.get(code) ?? null;
              const tooltipContent = SurfacesIrrigueesTooltip(communeName, surfacesIrrigueesValue);
              popupRef.current.remove();
              popupRef.current = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'surfaces-irriguees-tooltip',
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

      // Change cursor on hover
      map.on('mouseenter', 'surfaces-irriguees-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'surfaces-irriguees-fill', () => {
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
  }, [communesCodes, surfacesIrrigueesByCommune, nameByCommune, boundingBox, surfacesIrriguees]);

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
        ariaLabel="Carte représentant le pourcentage de surface agricole utile irriguée par commune sur votre territoire"
        style={{ position: 'relative' }}
      >
        <div ref={mapContainer} className='map-container' style={{ height: '500px', width: '100%' }} />
      </AccessibleMapWrapper>
    </>
  );
};
