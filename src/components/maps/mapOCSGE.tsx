'use client';

import { mapStyles } from 'carte-facile';
import 'carte-facile/carte-facile.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RefObject, useEffect, useState } from 'react';
import { Loader } from '../ui/loader';
import { AccessibleMapWrapper } from './AccessibleMapWrapper';
import styles from './maps.module.scss';

export const MapOCSGE = ({
  coordonneesCommunes,
  isLoading,
  mapRef,
  mapContainer
}: {
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
  isLoading: boolean;
  mapRef: RefObject<maplibregl.Map | null>;
  mapContainer: RefObject<HTMLDivElement | null>;
}) => {
  const [isTilesLoading, setIsTilesLoading] = useState(false);

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
      bounds: [
        [coordonneesCommunes.bbox.minLng, coordonneesCommunes.bbox.minLat],
        [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.maxLat]
      ],
      fitBoundsOptions: { padding: 20 }
    });
    mapRef.current = map;

    const loadingTimeout = setTimeout(() => {
      setIsTilesLoading(false);
    }, 10000);

    map.on('load', () => {
      setIsTilesLoading(true);

      try {
        map.addSource('ocsge-usage', {
          type: 'raster',
          tiles: [
            'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=OCSGE.USAGE.2021-2023&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png'
          ],
          tileSize: 256,
          attribution: '&copy; <a href="https://cartes.gouv.fr/">IGN</a>'
        });

        map.addLayer({
          id: 'ocsge-usage-layer',
          type: 'raster',
          source: 'ocsge-usage',
          paint: { 'raster-opacity': 0.8 }
        });

        setIsTilesLoading(false);
      } catch (error) {
        console.error('Error adding OCS GE layer:', error);
        setIsTilesLoading(false);
      }

      try {
        map.addSource('communes-tiles', {
          type: 'vector',
          tiles: [`${process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL}/communes/tiles/{z}/{x}/{y}.pbf`],
          minzoom: 4,
          maxzoom: 13
        });

        if (coordonneesCommunes) {
          map.addLayer({
            id: 'communes-outline-layer',
            type: 'line',
            source: 'communes-tiles',
            'source-layer': 'contour_communes',
            filter: ['in', ['get', 'code_geographique'], ['literal', coordonneesCommunes.codes]],
            paint: {
              'line-color': '#161616',
              'line-width': 2
            }
          });
        }
      } catch (error) {
        console.error('Error adding communes outline layer:', error);
      }
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      if (mapRef.current) {
        mapRef.current = null;
      }
      clearTimeout(loadingTimeout);
      setIsTilesLoading(false);
      map.remove();
    };
  }, [coordonneesCommunes]);

  return (
    <AccessibleMapWrapper
      ariaLabel="Carte de l'occupation et couverture des sols à grande échelle (OCS GE) représentant les usages des sols en 2021-2023 sur votre territoire"
      style={{ position: 'relative' }}
    >
      <style jsx global>{`
        .maplibregl-popup {
          z-index: 1002 !important;
        }
        .map-container {
          overflow: visible !important;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Loader />
        </div>
      ) : (
        <>
          <div ref={mapContainer} className='map-container' style={{ width: '100%', height: '500px' }} />

          {isTilesLoading && (
            <div className={styles.tileLoadingWrapper}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #f3f3f3',
                borderTop: '2px solid #3498db',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                alignSelf: 'center',
                marginRight: '0.5rem'
              }} />
              Chargement des données OCS GE...
            </div>
          )}

          <div className={styles.legendLCZWrapperNouveauParcours}>
            <div className={styles.legendLCZNouveauParcours}>
              <h3>OCS GE - Usages des sols 2021-2023</h3>
              <img
                src="https://data.geopf.fr/annexes/ressources/legendes/LEGEND.jpg"
                alt="Légende OCS GE - Usages des sols"
                style={{ width: '100%', marginTop: '0.5rem', display: 'none' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '12px', marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#FFFFA8', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US1.1 - Agriculture</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#008000', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US1.2 - Sylviculture</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#A600CC', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US1.3 - Activité d'extraction</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#000099', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US1.4 - Pêche et aquaculture</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#996633', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US1.5 - Autres productions primaires</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#E5E5E5', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US2 - Production secondaire</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#E6004D', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US235 - Usage mixte</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#FF8C00', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US3 - Production tertiaire</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#CC0000', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US4.1.1 - Réseaux routiers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#5A5A5A', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US4.1.2 - Réseaux ferrés</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#E6CCE6', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US4.1.3 - Réseaux aériens</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#0066FF', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US4.1.4 - Transport fluvial/maritime</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#660033', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US4.1.5 - Autres réseaux transport</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#FF0000', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US4.2 - Logistique et stockage</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#FF4B00', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US4.3 - Réseaux utilité publique</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#BE0961', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US5 - Usage résidentiel</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#FF4DFF', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US6.1 - Zones en transition</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#404040', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US6.2 - Zones abandonnées</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#F0F028', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US6.3 - Sans usage</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#FFCC00', border: '1px solid #ccc', flexShrink: 0 }}></div>
                  <span>US6.6 - Usage inconnu</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AccessibleMapWrapper>
  );
};

export default MapOCSGE;
