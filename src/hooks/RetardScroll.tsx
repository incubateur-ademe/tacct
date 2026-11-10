import maplibregl from '@/lib/maplibre';
import { RefObject, useEffect } from 'react';

export type RetardScrollProps = {
  mapRef: RefObject<maplibregl.Map | null> | null;
  containerRef: RefObject<HTMLElement | null>;
  delay: number;
};

/*
 Composant utilitaire (type hook) pour activer le scrollZoom sur une carte (maplibre/Mapbox)
 après un survol prolongé du conteneur. Désactive scrollZoom par défaut
 et le ré-désactive lors du retrait de la souris. Utile pour éviter de capturer le scroll de la page.
*/

export const RetardScroll = ({ mapRef, containerRef, delay }: RetardScrollProps) => {
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;
    let hoverTimer: number | null = null;

    const onMouseEnter = () => {
      if (hoverTimer) return;
      hoverTimer = window.setTimeout(() => {
        const map = mapRef?.current ?? null;
        if (map) {
          try { map.scrollZoom.enable(); } catch (e) { }
        }
        hoverTimer = null;
      }, delay);
    };

    const onMouseLeave = () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
      const map = mapRef?.current ?? null;
      if (map) {
        try { map.scrollZoom.disable(); } catch (e) { }
      }
    };

    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
    };
  }, [mapRef, containerRef, delay]);

  return null;
};

