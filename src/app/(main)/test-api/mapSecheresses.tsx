'use client';

import maplibregl from '@/lib/maplibre';
import { mapStyles } from 'carte-facile';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';

const getColor = (niveauGravite: string) => {
  return niveauGravite === 'alerte_renforcee'
    ? '#B5000E'
    : niveauGravite === 'crise'
      ? '#ea00ffff'
      : niveauGravite === 'alerte'
        ? '#FFA500'
        : niveauGravite === 'vigilance'
          ? '#00f1f1ff'
          : '#D8EFFA';
};

interface ZASFeature {
  code: string;
  LbZAS: string;
  CdDepartement: string;
  TypeZAS: string;
  niveauGravite: string;
  geometry: string; 
}

export const MapSecheresses = (props: {
  zasFeatures: ZASFeature[];
  territoryWKT?: string;
  centerCoords?: [number, number];
}) => {
  const { zasFeatures, territoryWKT, centerCoords } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  // Convert ZAS features to GeoJSON
  const geoJsonData = {
    type: 'FeatureCollection' as const,
    features: zasFeatures.map((zas) => {
      let geometry;
      try {
        geometry = JSON.parse(zas.geometry);
      } catch {
        geometry = { type: 'Polygon', coordinates: [] };
      }

      return {
        type: 'Feature' as const,
        properties: {
          code: zas.code,
          nom: zas.LbZAS,
          departement: zas.CdDepartement,
          type: zas.TypeZAS,
          niveauGravite: zas.niveauGravite,
          color: getColor(zas.niveauGravite)
        },
        geometry: geometry
      };
    })
  };

  useEffect(() => {
    if (!mapContainer.current) return;
    
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.desaturated,
      attributionControl: false,
      center: centerCoords || [2.5, 46.5], // Center of France by default
      zoom: 6
    });
    
    mapRef.current = map;

    map.on('load', () => {
      // Add territory boundary first (so it's below ZAS)
      if (territoryWKT) {
        const territoryGeoJSON = wktToGeoJSON(territoryWKT);
        map.addSource('territory-boundary', {
          type: 'geojson',
          data: territoryGeoJSON
        });

        map.addLayer({
          id: 'territory-fill',
          type: 'fill',
          source: 'territory-boundary',
          paint: {
            'fill-color': '#ff0000',
            'fill-opacity': 0.95
          }
        });

        map.addLayer({
          id: 'territory-outline',
          type: 'line',
          source: 'territory-boundary',
          paint: {
            'line-color': '#ff0000',
            'line-width': 3,
          }
        });
      }

      map.addSource('zas-secheresse', {
        type: 'geojson',
        data: geoJsonData,
        generateId: true
      });

      map.addLayer({
        id: 'zas-fill',
        type: 'fill',
        source: 'zas-secheresse',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.2
        }
      });

      map.addLayer({
        id: 'zas-stroke',
        type: 'line',
        source: 'zas-secheresse',
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#000000',
            '#666666'
          ],
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            3,
            1.5
          ]
        }
      });

      // Fit map to show all ZAS
      if (geoJsonData.features.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        geoJsonData.features.forEach((feature) => {
          if (feature.geometry.coordinates && feature.geometry.coordinates[0]) {
            feature.geometry.coordinates[0].forEach((coord: [number, number]) => {
              bounds.extend(coord);
            });
          }
        });
        map.fitBounds(bounds, { padding: 50 });
      }

      // Hover effect
      let hoveredId: string | number | null = null;
      
      map.on('mousemove', 'zas-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        
        map.getCanvas().style.cursor = 'pointer';
        
        if (hoveredId !== null) {
          map.setFeatureState(
            { source: 'zas-secheresse', id: hoveredId },
            { hover: false }
          );
        }
        
        hoveredId = e.features[0].id!;
        map.setFeatureState(
          { source: 'zas-secheresse', id: hoveredId },
          { hover: true }
        );

        // Show popup
        const properties = e.features[0].properties;
        if (popupRef.current) {
          popupRef.current.remove();
        }
        
        popupRef.current = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false
        })
          .setLngLat(e.lngLat)
          .setHTML(`
            <strong>${properties.nom}</strong><br/>
            Code: ${properties.code}<br/>
            Type: ${properties.type}<br/>
            Département: ${properties.departement}<br/>
            <strong style="color: ${properties.color}">Niveau: ${properties.niveauGravite || 'N/A'}</strong>
          `)
          .addTo(map);
      });

      map.on('mouseleave', 'zas-fill', () => {
        map.getCanvas().style.cursor = '';
        if (hoveredId !== null) {
          map.setFeatureState(
            { source: 'zas-secheresse', id: hoveredId },
            { hover: false }
          );
        }
        hoveredId = null;
        
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');
    });

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Helper function to convert WKT to GeoJSON
  function wktToGeoJSON(wkt: string): GeoJSON.FeatureCollection {
    // WKT format: POLYGON((lon1 lat1, lon2 lat2, ...))
    const coordsMatch = wkt.match(/\(\((.*?)\)\)/);
    if (!coordsMatch) {
      return {
        type: 'FeatureCollection',
        features: []
      };
    }

    const coords = coordsMatch[1].split(',').map((pair) => {
      const [lon, lat] = pair.trim().split(/\s+/).map(Number);
      return [lon, lat];
    });

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [coords]
          }
        }
      ]
    };
  }

  // Update data when features change
  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      const source = mapRef.current.getSource('zas-secheresse');
      if (source) {
        (source as maplibregl.GeoJSONSource).setData(geoJsonData);
      }
    }
  }, [zasFeatures]);

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
      <div style={{ position: 'relative' }}>
        <div ref={mapContainer} className='map-container' style={{ height: '500px', width: '100%' }} />
      </div>
    </>
  );
};
