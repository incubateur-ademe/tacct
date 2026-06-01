
import { ErosionCotiereDto } from '@/lib/dto';
import { mapStyles } from 'carte-facile';
import { mapTransformRequest } from './mapTransformRequest';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect } from 'react';
import { AccessibleMapWrapper } from './AccessibleMapWrapper';

export const MapErosionCotiere = (props: {
  erosionCotiere: ErosionCotiereDto[];
  envelope: { type: "Polygon"; coordinates: number[][][] };
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
  mapRef: React.RefObject<maplibregl.Map | null>;
  mapContainer: React.RefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
}) => {
  const { erosionCotiere, envelope, coordonneesCommunes, style, mapRef, mapContainer } = props;
  const envelopeParsed = envelope.coordinates[0].map(([lng, lat]) => [lat, lng]);

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.desaturated,
      transformRequest: mapTransformRequest,
      attributionControl: false,
    });
    mapRef.current = map;

    // Add erosionCotiere geojson layer
    map.on('load', () => {
      map.addSource('erosionCotiere', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: erosionCotiere as Feature<Geometry, GeoJsonProperties>[]
        }
      });
      map.addLayer({
        id: 'erosionCotiere-layer',
        type: 'fill',
        source: 'erosionCotiere',
        paint: {
          'fill-color': [
            'case',
            ['>=', ['get', 'taux'], 3], '#046803',
            ['all', ['<', ['get', 'taux'], 3], ['>=', ['get', 'taux'], 1.5]], '#1DA546',
            ['all', ['<', ['get', 'taux'], 1.5], ['>=', ['get', 'taux'], 0.5]], '#86CD63',
            ['all', ['<', ['get', 'taux'], 0.5], ['>=', ['get', 'taux'], 0.1]], '#DCEE9F',
            ['all', ['<', ['get', 'taux'], 0.1], ['>', ['get', 'taux'], -0.1]], '#AFF7F1',
            ['all', ['<=', ['get', 'taux'], -0.1], ['>', ['get', 'taux'], -0.5]], '#FEDD9A',
            ['all', ['<=', ['get', 'taux'], -0.5], ['>', ['get', 'taux'], -1.5]], '#F59550',
            ['all', ['<=', ['get', 'taux'], -1.5], ['>', ['get', 'taux'], -3]], '#B87830',
            ['<=', ['get', 'taux'], -3], '#A74E10',
            '#9D9C9C'
          ],
          'fill-opacity': 0.95,
        }
      });
      // Add communes outline avec tuiles vectorielles
      map.addSource('communes-tiles', {
        type: 'vector',
        tiles: [`${process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL}/communes/tiles/{z}/{x}/{y}.pbf`],
        minzoom: 4,
        maxzoom: 13
      });
      map.addLayer({
        id: 'communes-outline-layer',
        type: 'line',
        source: 'communes-tiles',
        'source-layer': 'contour_communes',
        filter: coordonneesCommunes ? ['in', ['get', 'code_geographique'], ['literal', coordonneesCommunes.codes]] : ['==', ['get', 'code_geographique'], ''],
        paint: {
          'line-color': '#161616',
          'line-width': 1,
          'line-opacity': 0.5
        }
      });
      // Fit bounds
      if (envelopeParsed && Array.isArray(envelopeParsed) && envelopeParsed.length > 1 && Array.isArray(envelopeParsed[0]) && envelopeParsed[0].length === 2) {
        const lons = envelopeParsed.map(coord => coord[1]);
        const lats = envelopeParsed.map(coord => coord[0]);
        const minLng = Math.min(...lons);
        const maxLng = Math.max(...lons);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        map.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat]
          ],
          { padding: 20 }
        );
      }
    });
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [erosionCotiere, coordonneesCommunes, envelope]);

  return (
    <AccessibleMapWrapper
      ariaLabel="Carte représentant le taux d'évolution du trait de côte (érosion ou accrétion en m/an) sur le littoral de votre territoire"
      style={{ position: 'relative', ...style }}
    >
      <div ref={mapContainer} style={{ height: '500px', width: '100%' }} />
    </AccessibleMapWrapper>
  );
};
