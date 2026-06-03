"use client";
import { mapStyles } from 'carte-facile';
import maplibregl from 'maplibre-gl';
import { useEffect } from "react";

export const MapO3 = ({
  mapRef,
  mapContainer,
  coordonneesCommunes
}: {
  mapRef: React.RefObject<maplibregl.Map | null>;
  mapContainer: React.RefObject<HTMLDivElement | null>;
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
}) => {

  useEffect(() => {
    if (!mapContainer.current || !coordonneesCommunes) return;

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
      if (coordonneesCommunes?.bbox) {
        map.fitBounds(
          [[coordonneesCommunes.bbox.minLng, coordonneesCommunes.bbox.minLat],
          [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.maxLat]],
          { padding: 20 }
        );
      }

      // Charger le GeoJSON directement
      map.addSource('o3-source', {
        type: 'geojson',
        data: 'https://facili-tacct-dev.s3.fr-par.scw.cloud/app/seuils_reglementaires_o3/test_fixed.geojson'
      });

      map.addLayer({
        id: 'o3-layer',
        type: 'fill',
        source: 'o3-source',
        paint: {
          'fill-color': [
            'step',
            ['get', 'valeur'],
            '#E0F9F7',  // 0-0.5 - Bleu très très clair
            0.5, '#C8F3EE',  // 0.5-1
            1, '#A4F5EE',  // 1-2
            2, '#85E6D8',  // 2-3
            3, '#A6E4D3',  // 3-4
            4, '#C4E8A3',  // 4-5 - Vert clair
            5, '#DFEC7B',  // 5-6
            6, '#F5E290',  // 6-8 - Jaune
            8, '#FFD97A',  // 8-10
            10, '#FFBD6B', // 10-12 - Orange clair
            12, '#FFAB66', // 12-15
            15, '#FC9999', // 15-20 - Rose clair
            20, '#F37D7D', // 20-25
            25, '#E06060', // 25-30 - Rose foncé
            30, '#C97189', // 30-35
            35, '#B982B2'  // >=35 - Violet
          ],
          'fill-opacity': 0.7,
          'fill-antialias': false
        }
      });

      // Contours des communes
      map.addSource('communes-tiles', {
        type: 'vector',
        tiles: [`${process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL}/communes/tiles/{z}/{x}/{y}.pbf`],
        minzoom: 4,
        maxzoom: 13
      });

      map.addLayer({
        id: 'communes-outline',
        type: 'line',
        source: 'communes-tiles',
        'source-layer': 'contour_communes',
        filter: ['in', ['get', 'code_geographique'], ['literal', coordonneesCommunes.codes]],
        paint: {
          'line-color': '#161616',
          'line-width': 1
        }
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


  return (
    <div ref={mapContainer} style={{ height: '500px', width: '100%' }} />
  )
}
