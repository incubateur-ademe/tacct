"use client";

import { LoaderText } from '@/components/ui/loader';
import couleurs from '@/design-system/couleurs';
import { listeVillesAvecArrondissements } from '@/lib/territoireData/arrondissements';
import { mapStyles } from 'carte-facile';
import 'carte-facile/carte-facile.css';
import maplibregl, { ExpressionSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { AccessibleMapWrapper } from './AccessibleMapWrapper';
import { FragiliteEconomiqueTooltip } from './subcomponents/tooltips';

export const MapConfortThermique = (props: {
  precariteData: { code: string; value: number; name: string }[];
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
}) => {
  const { precariteData, coordonneesCommunes } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const hoveredFeatureRef = useRef<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Pour cet indicateur qui est avec une précision au niveau des arrondissements
  // on exclut les communes de Paris, Lyon et Marseille pour éviter les conflits d'affichage
  const filtreCommunesArrondissements = coordonneesCommunes ? {
    codes: coordonneesCommunes.codes.filter(code => !listeVillesAvecArrondissements.includes(code)),
    bbox: coordonneesCommunes.bbox
  } : null;

  useEffect(() => {
    if (!mapContainer.current || !filtreCommunesArrondissements) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.desaturated,
      attributionControl: false,
      cooperativeGestures: typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
      locale: {
        'CooperativeGesturesHandler.MobileHelpText': 'Utilisez deux doigts pour déplacer la carte',
      },
    });
    mapRef.current = map;

    map.on('load', () => {
      map.addSource('communes-tiles', {
        type: 'vector',
        tiles: [`${process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL}/communes/tiles/{z}/{x}/{y}.pbf`],
        minzoom: 4,
        maxzoom: 13,
        promoteId: 'code_geographique'
      });

      // Créer l'expression de couleur basée sur les valeurs de précarité
      const colorPairs: (ExpressionSpecification | string)[] = [];
      precariteData.forEach(item => {
        const value = item.value;
        let color: string;
        // Gérer les NaN et valeurs manquantes
        if (value === null || value === undefined || isNaN(value)) {
          color = 'white';
        } else if (value >= 0.3) {
          color = couleurs.graphiques.bleu[5];
        } else if (value >= 0.2) {
          color = couleurs.graphiques.bleu[1];
        } else if (value >= 0.1) {
          color = couleurs.graphiques.bleu[2];
        } else if (value > 0) {
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
        id: 'precarite-fill',
        type: 'fill',
        source: 'communes-tiles',
        'source-layer': 'contour_communes',
        filter: ['in', ['get', 'code_geographique'], ['literal', filtreCommunesArrondissements.codes]],
        paint: {
          'fill-color': colorExpression,
          'fill-opacity': 1,
        }
      });

      map.addLayer({
        id: 'precarite-stroke',
        type: 'line',
        source: 'communes-tiles',
        'source-layer': 'contour_communes',
        filter: ['in', ['get', 'code_geographique'], ['literal', filtreCommunesArrondissements.codes]],
        paint: {
          'line-color': '#161616',
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            3,
            1
          ]
        }
      });

      // Appliquer le fitBounds après un court délai pour l'effet de zoom
      setTimeout(() => {
        map.fitBounds(
          [
            [filtreCommunesArrondissements.bbox.minLng, filtreCommunesArrondissements.bbox.minLat],
            [filtreCommunesArrondissements.bbox.maxLng, filtreCommunesArrondissements.bbox.maxLat]
          ],
          { padding: 20 }
        );
      }, 100);

      map.on('mouseenter', 'precarite-fill', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const codeGeo = feature.properties?.code_geographique;

          if (hoveredFeatureRef.current) {
            map.setFeatureState(
              { source: 'communes-tiles', sourceLayer: 'contour_communes', id: hoveredFeatureRef.current },
              { hover: false }
            );
          }

          hoveredFeatureRef.current = codeGeo;
          if (codeGeo) {
            map.setFeatureState(
              { source: 'communes-tiles', sourceLayer: 'contour_communes', id: codeGeo },
              { hover: true }
            );
          }

          const precariteItem = precariteData.find(d => d.code === codeGeo);
          const communeName = precariteItem?.name ?? '';
          const precariteValue = precariteItem?.value ?? 0;
          const tooltipContent = FragiliteEconomiqueTooltip(communeName, precariteValue);

          if (popupRef.current) {
            popupRef.current.remove();
          }
          const containerHeight = mapContainer.current?.clientHeight || 500;
          const mouseY = e.point.y;
          const placement = (mouseY > containerHeight / 2) ? 'bottom' : 'top';
          popupRef.current = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'inconfort-thermique-tooltip',
            anchor: placement,
            maxWidth: 'none'
          })
            .setLngLat(e.lngLat)
            .setHTML(tooltipContent)
            .addTo(map);
        }
      });

      map.on('mouseleave', 'precarite-fill', () => {
        map.getCanvas().style.cursor = '';
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

      map.on('mousemove', 'precarite-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const codeGeo = feature.properties?.code_geographique;
          const containerHeight = mapContainer.current?.clientHeight || 500;
          const mouseY = e.point.y;
          const placement = (mouseY > containerHeight / 2) ? 'bottom' : 'top';

          if (hoveredFeatureRef.current !== codeGeo) {
            if (hoveredFeatureRef.current) {
              map.setFeatureState(
                { source: 'communes-tiles', sourceLayer: 'contour_communes', id: hoveredFeatureRef.current },
                { hover: false }
              );
            }
            hoveredFeatureRef.current = codeGeo;
            if (codeGeo) {
              map.setFeatureState(
                { source: 'communes-tiles', sourceLayer: 'contour_communes', id: codeGeo },
                { hover: true }
              );
            }

            const precariteItem = precariteData.find(d => d.code === codeGeo);
            const communeName = precariteItem?.name ?? '';
            const precariteValue = precariteItem?.value ?? 0;
            const tooltipContent = FragiliteEconomiqueTooltip(communeName, precariteValue);

            if (popupRef.current) popupRef.current.remove();
            popupRef.current = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              className: 'inconfort-thermique-tooltip',
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
              const precariteItem = precariteData.find(d => d.code === codeGeo);
              const communeName = precariteItem?.name ?? '';
              const precariteValue = precariteItem?.value ?? 0;
              const tooltipContent = FragiliteEconomiqueTooltip(communeName, precariteValue);
              popupRef.current.remove();
              popupRef.current = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'inconfort-thermique-tooltip',
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

      map.addControl(new maplibregl.NavigationControl(), 'top-right');
      setIsMapLoaded(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [filtreCommunesArrondissements, precariteData]);

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
        ariaLabel="Cartographie de la précarité énergétique liée au logement par commune sur votre territoire"
        style={{ position: 'relative' }}
      >
        {!isMapLoaded && (
          <LoaderText text='Chargement de la cartographie...' height="500px" />
        )}
        <div
          ref={mapContainer}
          className='map-container'
          style={{
            height: isMapLoaded ? '500px' : '0px',
            width: '100%',
            opacity: isMapLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in'
          }}
        />
      </AccessibleMapWrapper>
    </>
  );
};
