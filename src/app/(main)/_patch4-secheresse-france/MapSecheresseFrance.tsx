'use client';

import ExporterIcon from '@/assets/icons/export_icon_white.svg';
import { LegendBlockColor } from '@/components/maps/legends/legendBlocks';
import { mapTransformRequest } from '@/components/maps/mapTransformRequest';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body } from '@/design-system/base/Textes';
import { mapStyles } from 'carte-facile';
import html2canvas from 'html2canvas';
import maplibregl, { ExpressionSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';

// Taille affichée de la carte (px CSS) et facteur de résolution de l'export :
// le PNG fait MAP_SIZE × EXPORT_PIXEL_RATIO px de large.
const MAP_SIZE = 1600;
const EXPORT_PIXEL_RATIO = 3;

export const MapSecheresseFrance = ({
  codesByColor,
  bounds,
  region
}: {
  codesByColor: { color: string; codes: string[] }[];
  bounds: [[number, number], [number, number]];
  region: { code: string; nom: string } | null;
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.desaturated,
      attributionControl: false,
      transformRequest: mapTransformRequest,
      canvasContextAttributes: { preserveDrawingBuffer: true },
      pixelRatio: EXPORT_PIXEL_RATIO,
      maxCanvasSize: [8192, 8192],
      bounds,
      fitBoundsOptions: { padding: 20 }
    });
    mapRef.current = map;

    map.on('load', () => {
      // tolerance: 0 → MapLibre ne resimplifie pas chaque commune séparément (ce qui recréerait des interstices)
      map.addSource('communes', {
        type: 'geojson',
        data: `${window.location.origin}/patch4-secheresse-france/communes${region ? `?region=${region.code}` : ''}`,
        tolerance: 0
      });

      // 'match' (table de correspondance) plutôt que 'case' : ~35 000 communes
      const colorExpression = [
        'match',
        ['get', 'code_geographique'],
        ...codesByColor.flatMap(({ color, codes }) => [codes, color]),
        '#E5E5E5'
      ] as unknown as ExpressionSpecification;

      map.addLayer({
        id: 'patch4-fill',
        type: 'fill',
        source: 'communes',
        paint: {
          'fill-color': colorExpression,
          'fill-opacity': 0.99
        }
      });

      // Comble d'éventuels interstices résiduels entre communes voisines, visibles en haute résolution
      map.addLayer({
        id: 'patch4-gap-fill',
        type: 'line',
        source: 'communes',
        paint: {
          'line-color': colorExpression,
          'line-width': 1
        }
      });

      map.addLayer({
        id: 'patch4-stroke',
        type: 'line',
        source: 'communes',
        paint: {
          'line-color': '#161616',
          'line-width': 0.2,
          'line-opacity': 0.3
        }
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [codesByColor, bounds, region]);

  const handleExport = async () => {
    const map = mapRef.current;
    if (!map || !legendRef.current || isExporting) return;
    setIsExporting(true);
    try {
      if (!map.loaded()) {
        await new Promise<void>((resolve) => map.once('idle', () => resolve()));
      }
      const mapCanvas = map.getCanvas();
      const legendCanvas = await html2canvas(legendRef.current, {
        scale: EXPORT_PIXEL_RATIO,
        backgroundColor: '#ffffff',
        logging: false
      });
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = Math.max(mapCanvas.width, legendCanvas.width);
      finalCanvas.height = mapCanvas.height + legendCanvas.height;
      const ctx = finalCanvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      ctx.drawImage(mapCanvas, 0, 0);
      ctx.drawImage(legendCanvas, 0, mapCanvas.height);
      const blob = await new Promise<Blob | null>((resolve) => finalCanvas.toBlob(resolve));
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `patch4c-secheresse-sols-${region ? `region-${region.code}` : 'france'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export PNG France :', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: MAP_SIZE }}>
      <BoutonPrimaireClassic
        onClick={handleExport}
        disabled={isExporting}
        icone={isExporting ? undefined : ExporterIcon}
        size="sm"
        text={isExporting ? 'En cours...' : 'Exporter (.png)'}
        style={{ alignSelf: 'flex-start' }}
      />
      <div>
        <div ref={mapContainer} style={{ height: MAP_SIZE, width: MAP_SIZE }} />
        <div
          ref={legendRef}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', backgroundColor: '#ffffff' }}
        >
          <Body weight="bold">
            Patch 4°C - Sécheresse des sols : niveau d&apos;aggravation par commune{region ? ` - ${region.nom}` : ''}
          </Body>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', columnGap: '1rem', rowGap: '0.5rem' }}>
            <LegendBlockColor color="#FF1C64" value="Aggravation très forte" />
            <LegendBlockColor color="#FFB181" value="Aggravation forte" />
            <LegendBlockColor color="#FFEBB6" value="Aggravation modérée" />
            <LegendBlockColor color="#ffffff" value="Pas d'évolution" />
          </div>
          <Body size="sm" style={{ color: '#666666' }}>
            Source : Météo France
          </Body>
        </div>
      </div>
    </div>
  );
};
