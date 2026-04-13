'use client';

import maplibregl from 'maplibre-gl';
import { RefObject } from 'react';

interface ServiceStatus {
  ceremaAvailable: boolean;
  fallbackToGlobal: boolean;
  errorMessage: string | null;
}
interface CeremaFallbackErrorProps {
  serviceStatus: ServiceStatus;
  setServiceStatus: (status: ServiceStatus) => void;
  styles: { [key: string]: string };
}

export const handleCeremaFallback = (
  map: maplibregl.Map,
  hasTriedFallback: RefObject<boolean>,
  setIsTilesLoading: (loading: boolean) => void,
  setServiceStatus: (status: {
    ceremaAvailable: boolean;
    fallbackToGlobal: boolean;
    errorMessage: string | null;
  }) => void
) => {
  if (hasTriedFallback.current) return;
  hasTriedFallback.current = true;
  try {
    console.warn('Cerema service failed, switching to global LCZ fallback');
    // si les layers Cerema sont déjà présents, on les supprime
    if (map.getLayer('cerema-lcz-tile-layer')) {
      map.removeLayer('cerema-lcz-tile-layer');
    }
    if (map.getLayer('lcz-wms-layer')) {
      map.removeLayer('lcz-wms-layer');
    }
    if (map.getSource('cerema-lcz-tile')) {
      map.removeSource('cerema-lcz-tile');
    }
    if (map.getSource('lcz-wms')) {
      map.removeSource('lcz-wms');
    }

    // fallback global
    if (!map.getSource('lcz-generator-fallback')) {
      setIsTilesLoading(true);
      map.addSource('lcz-generator-fallback', {
        type: 'raster',
        tiles: [
          'https://lcz-generator.rub.de/tms/global-map-tiles/v3/{z}/{x}/{y}.png'
        ],
        tileSize: 256
      });
      map.addLayer({
        id: 'lcz-generator-fallback-layer',
        type: 'raster',
        source: 'lcz-generator-fallback',
        paint: { 'raster-opacity': 0.7 }
      });
    }
    setServiceStatus({
      ceremaAvailable: false,
      fallbackToGlobal: true,
      errorMessage:
        'Les données LCZ du CEREMA sont temporairement indisponibles. Les données affichées sont actuellement moins détaillées.'
    });
  } catch (error) {
    console.error('Error during fallback:', error);
    setServiceStatus({
      ceremaAvailable: false,
      fallbackToGlobal: false,
      errorMessage: 'Erreur lors du chargement des données cartographiques.'
    });
  }
};

export const CeremaFallbackError = ({
  serviceStatus,
  setServiceStatus,
  styles
}: CeremaFallbackErrorProps) => {
  if (!serviceStatus.errorMessage) return null;
  return (
    <div
      className={styles.errorMessageWrapper}
      style={{
        background: serviceStatus.fallbackToGlobal ? '#fff2cc' : '#d17981',
        border: serviceStatus.fallbackToGlobal ? '2px solid rgba(255, 193, 7, 0.9)' : '2px solid #dc3545',
      }}
    >
      {serviceStatus.fallbackToGlobal ? '⚠️' : '❌'} {serviceStatus.errorMessage}
      {serviceStatus.fallbackToGlobal && (
        <button
          className={styles.errorMessageCloseButton}
          onClick={() => setServiceStatus({ ...serviceStatus, errorMessage: null })}
        >
          ✕
        </button>
      )}
    </div>
  );
};
