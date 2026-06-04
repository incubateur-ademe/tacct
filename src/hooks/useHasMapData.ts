'use client';
import { mapStyles } from 'carte-facile';
import maplibregl from 'maplibre-gl';
import { useEffect, useState } from 'react';

export const useHasMapData = (params: {
  bucketUrl: string;
  layer: string;
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
}) => {
  const { bucketUrl, layer, coordonneesCommunes } = params;
  const [hasData, setHasData] = useState<boolean | null>(null);

  useEffect(() => {
    if (!coordonneesCommunes) {
      setHasData(null);
      return;
    }

    const container = document.createElement('div');
    container.style.width = '100px';
    container.style.height = '100px';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    const map = new maplibregl.Map({
      container,
      style: mapStyles.desaturated,
      attributionControl: false
    });

    map.on('sourcedata', (e) => {
      if (e.sourceId === `${bucketUrl}-tiles`) {
        if (e.isSourceLoaded) {
          const features = map.querySourceFeatures(`${bucketUrl}-tiles`, {
            sourceLayer: layer
          });

          const matchingFeatures = features.filter(
            (f: maplibregl.GeoJSONFeature) =>
              coordonneesCommunes.codes.includes(
                f.properties?.code_geographique
              )
          );

          setHasData(matchingFeatures.length > 0);
        }
      }
    });

    map.on('load', () => {
      if (coordonneesCommunes?.bbox) {
        map.fitBounds(
          [
            [coordonneesCommunes.bbox.minLng, coordonneesCommunes.bbox.minLat],
            [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.maxLat]
          ],
          { padding: 20 }
        );
      }

      map.addSource(`${bucketUrl}-tiles`, {
        type: 'vector',
        tiles: [
          `${process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL}/${bucketUrl}/tiles/{z}/{x}/{y}.pbf`
        ],
        minzoom: 4,
        maxzoom: 13
      });

      map.addLayer({
        id: `${bucketUrl}-fill`,
        type: 'fill',
        source: `${bucketUrl}-tiles`,
        'source-layer': layer,
        filter: [
          'in',
          ['get', 'code_geographique'],
          ['literal', coordonneesCommunes.codes]
        ],
        paint: { 'fill-color': '#000000' }
      });
    });

    return () => {
      map.remove();
      document.body.removeChild(container);
    };
  }, [bucketUrl, layer, coordonneesCommunes]);

  return hasData;
};
