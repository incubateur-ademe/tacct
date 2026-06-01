'use client';

import ExporterIcon from '@/assets/icons/export_icon_white.svg';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import ExportDataTrigger from '@/hooks/ExportDataTrigger';
import html2canvas from 'html2canvas';
import { usePostHog } from 'posthog-js/react';
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from '../components.module.scss';
import { CopyLinkClipboard } from '../interactions/CopyLinkClipboard';

export const ExportPngSimple = ({
  containerRef,
  fileName = 'export.png',
  buttonText = 'Exporter (.png)',
  buttonSize = 'sm',
  disabled = false,
  style
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  fileName?: string;
  buttonText?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: React.CSSProperties;
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPng = async () => {
    if (!containerRef.current || isExporting || disabled) return;

    setIsExporting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(containerRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        ignoreElements: (element) => {
          return element.classList.contains('export-button-ignore');
        }
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
        setIsExporting(false);
      });
    } catch (error) {
      console.error('Error exporting PNG:', error);
      setIsExporting(false);
    }
  };

  return (
    <div className="export-button-ignore">
      <BoutonPrimaireClassic
        onClick={handleExportPng}
        disabled={isExporting || disabled}
        icone={isExporting ? null : ExporterIcon}
        size={buttonSize}
        text={isExporting ? 'En cours...' : buttonText}
        style={style}
      />
    </div>
  );
};

export const ExportPngMaplibreSimple = ({
  mapRef,
  mapContainer,
  legendContainer,
  fileName = 'carte.png',
  buttonText = 'Exporter (.png)',
  buttonSize = 'sm',
  disabled = false,
  style
}: {
  mapRef: RefObject<maplibregl.Map | null>;
  mapContainer: RefObject<HTMLDivElement | null>;
  legendContainer?: RefObject<HTMLDivElement | null>;
  fileName?: string;
  buttonText?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: React.CSSProperties;
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPng = async () => {
    if (!mapRef.current || !mapContainer.current || isExporting || disabled) return;

    setIsExporting(true);

    try {
      const navControls = mapContainer.current.querySelectorAll('.maplibregl-ctrl-top-right');
      navControls.forEach((control) => {
        (control as HTMLElement).style.display = 'none';
      });

      await new Promise<void>((resolve) => {
        mapRef.current!.once('render', async () => {
          try {
            const mapCanvas = await html2canvas(mapContainer.current!, {
              useCORS: true,
              allowTaint: true
            });

            let finalCanvas = mapCanvas;

            if (legendContainer?.current) {
              const legendCanvas = await html2canvas(legendContainer.current, {
                useCORS: true,
                allowTaint: true
              });

              finalCanvas = document.createElement('canvas');
              const ctx = finalCanvas.getContext('2d') as CanvasRenderingContext2D;
              finalCanvas.width = mapCanvas.width;
              finalCanvas.height = mapCanvas.height + legendCanvas.height;
              ctx.drawImage(mapCanvas, 0, 0);
              ctx.drawImage(legendCanvas, 0, mapCanvas.height);
            }

            finalCanvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }
              navControls.forEach((control) => {
                (control as HTMLElement).style.display = '';
              });
              setIsExporting(false);
              resolve();
            });
          } catch (error) {
            console.error('Error exporting PNG:', error);
            navControls.forEach((control) => {
              (control as HTMLElement).style.display = '';
            });
            setIsExporting(false);
            resolve();
          }
        });
        mapRef.current!.triggerRepaint();
      });
    } catch (error) {
      console.error('Error exporting PNG:', error);
      setIsExporting(false);
    }
  };

  return (
    <BoutonPrimaireClassic
      onClick={handleExportPng}
      disabled={isExporting || disabled}
      icone={isExporting ? null : ExporterIcon}
      size={buttonSize}
      text={isExporting ? 'En cours...' : buttonText}
      style={style}
    />
  );
};

export const ExportPngMaplibreButton = ({
  mapRef,
  mapContainer,
  documentDiv = '.exportPNGWrapper',
  fileName = 'indicateur-carte.png',
  style,
  anchor,
  type,
  libelle,
  code,
  thematique
}: {
  mapRef: RefObject<maplibregl.Map | null>;
  mapContainer: RefObject<HTMLDivElement | null>;
  type: string;
  libelle: string;
  code: string;
  thematique: string;
  documentDiv?: string;
  fileName?: string;
  style?: React.CSSProperties;
  anchor?: string;
}) => {
  const posthog = usePostHog();
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const [buttonMinWidth, setButtonMinWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (buttonWrapperRef.current) {
      setButtonMinWidth(buttonWrapperRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    // ajout d'un overlay pour éviter les interactions pendant le chargement
    // et pour afficher un curseur de chargement
    if (isLoading) {
      document.body.style.setProperty('cursor', 'wait', 'important');
      const overlay = document.createElement('div');
      overlay.id = 'export-loading-overlay';
      overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: transparent;
          cursor: wait !important;
          z-index: 9999;
          pointer-events: auto;
        `;
      document.body.appendChild(overlay);
      document.body.classList.add('export-loading');
    } else {
      document.body.style.removeProperty('cursor');
      const overlay = document.getElementById('export-loading-overlay');
      if (overlay) {
        overlay.remove();
      }
      document.body.classList.remove('export-loading');
    }
    return () => {
      document.body.style.removeProperty('cursor');
      const overlay = document.getElementById('export-loading-overlay');
      if (overlay) {
        overlay.remove();
      }
      document.body.classList.remove('export-loading');
    };
  }, [isLoading]);

  const handleExportPng = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsClicked(true);
    if (isLoading) return;

    e.currentTarget.blur();
    setIsLoading(true);

    posthog.capture('export_png_bouton', {
      thematique: thematique,
      code: code,
      libelle: libelle,
      type: type,
      date: new Date()
    });

    // Attendre que React affiche "En cours..." avant de démarrer l'export
    await new Promise((resolve) => setTimeout(resolve, 0));

    if (mapRef.current && mapContainer.current) {
      // On cache les contrôles de navigation pour éviter qu'ils n'apparaissent sur le screenshot
      const navControls = mapContainer.current.querySelectorAll(
        '.maplibregl-ctrl-top-right'
      );
      navControls.forEach((control) => {
        (control as HTMLElement).style.display = 'none';
      });
      // On modifie la taille du logo du cerema
      const logoCeremaDev = mapContainer.current.querySelector(
        '.maps-module-scss-module__4-8-aW__ceremaLogoBottomRight'
      ) as HTMLElement;
      if (logoCeremaDev) {
        logoCeremaDev.style.display = 'none';
      }
      const logoCeremaPreprod = mapContainer.current.querySelector(
        '.maps_ceremaLogoBottomRight__IZXf3'
      ) as HTMLElement;
      if (logoCeremaPreprod) {
        logoCeremaPreprod.style.display = 'none';
      }
      // Ajout du div de la légende et de la source pour le screenshot
      const originalLegendDiv = document.querySelector(
        documentDiv
      ) as HTMLElement;
      // Cacher le bouton d'export avant la capture
      const exportButton = originalLegendDiv?.querySelector(
        '.' + styles.exportIndicatorButton
      ) as HTMLElement;
      if (exportButton) exportButton.style.display = 'none';

      const cleanup = () => {
        navControls.forEach((control) => {
          (control as HTMLElement).style.display = '';
        });
        if (exportButton) exportButton.style.display = '';
      };

      await new Promise<void>((resolve) => {
        const safetyTimeout = setTimeout(() => {
          cleanup();
          resolve();
        }, 7000);

        mapRef.current!.once('render', async () => {
          clearTimeout(safetyTimeout);
          try {
            // Capture native du canvas WebGL (rapide, fiable, non taché grâce
            // au proxy) ; html2canvas seulement pour la légende.
            const mapCanvas = mapRef.current!.getCanvas();
            const legendCanvas = await Promise.race([
              html2canvas(originalLegendDiv, { useCORS: true }),
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('html2canvas timeout')), 20000)
              )
            ]);

            const finalCanvas = document.createElement('canvas');
            const ctx = finalCanvas.getContext('2d') as CanvasRenderingContext2D;
            finalCanvas.width = Math.max(mapCanvas.width, legendCanvas.width);
            finalCanvas.height = mapCanvas.height + legendCanvas.height;
            ctx.drawImage(mapCanvas, 0, 0);
            ctx.drawImage(legendCanvas, 0, mapCanvas.height);

            finalCanvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }
              cleanup();
              resolve();
            });
          } catch (error) {
            console.error('Error capturing canvas:', error);
            cleanup();
            resolve();
          }
        });
        mapRef.current!.triggerRepaint();
      });

      setTimeout(() => setIsLoading(false), 3000);
    } else {
      console.log('Map or container not found');
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.exportShareWrapper}>
      {anchor && <CopyLinkClipboard anchor={anchor} />}
      <div ref={buttonWrapperRef} style={{ display: 'inline-flex' }}>
        <BoutonPrimaireClassic
          onClick={handleExportPng}
          disabled={isLoading}
          icone={isLoading ? null : ExporterIcon}
          size="sm"
          text={isLoading ? 'En cours...' : 'Exporter'}
          style={{
            minWidth: buttonMinWidth,
            cursor: isLoading ? 'wait' : 'pointer',
            ...style
          }}
        />
      </div>
      {isClicked && <ExportDataTrigger />}
    </div>
  );
};

/**
 * Génère un Blob PNG de la carte et de la légende/source, pour un export programmatique (par exemple dans un ZIP).
 * Retourne une Promise<Blob|null>.
 */
export async function generateMapPngBlob({
  mapRef,
  mapContainer,
  documentDiv = '.exportPNGWrapper'
}: {
  mapRef: RefObject<maplibregl.Map | null>;
  mapContainer: RefObject<HTMLDivElement | null>;
  documentDiv?: string | HTMLElement;
  fileName?: string;
}): Promise<Blob | null> {
  if (mapRef.current && mapContainer.current) {
    const navControls = mapContainer.current.querySelectorAll(
      '.maplibregl-ctrl-top-right'
    );
    navControls.forEach((control) => {
      (control as HTMLElement).style.display = 'none';
    });

    const originalLegendDiv =
      typeof documentDiv === 'string'
        ? (document.querySelector(documentDiv) as HTMLElement)
        : documentDiv;

    if (!originalLegendDiv) {
      console.error(
        `generateMapPngBlob - Element not found with selector: ${documentDiv}`
      );
      navControls.forEach((control) => {
        (control as HTMLElement).style.display = '';
      });
      return null;
    }

    const exportButton = originalLegendDiv?.querySelector(
      '.' + styles.exportIndicatorButton
    ) as HTMLElement;
    if (exportButton) exportButton.style.display = 'none';
    // Wait for map to render
    return new Promise((resolve) => {
      const restore = () => {
        navControls.forEach((control) => {
          (control as HTMLElement).style.display = '';
        });
        if (exportButton) exportButton.style.display = '';
      };
      // Garde-fou : si l'event 'render' ne se déclenche pas (cas iOS), on ne
      // bloque pas indéfiniment l'export ZIP.
      const safetyTimeout = setTimeout(() => {
        restore();
        resolve(null);
      }, 8000);

      mapRef.current!.once('render', async () => {
        clearTimeout(safetyTimeout);
        try {
          // Capture native du canvas WebGL (rapide, fiable, non taché grâce au
          // proxy same-origin) au lieu de html2canvas, trop lent sur iOS.
          const mapCanvas = mapRef.current!.getCanvas();
          const legendCanvas = await Promise.race([
            html2canvas(originalLegendDiv, { useCORS: true }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('html2canvas timeout')), 10000)
            )
          ]);
          const finalCanvas = document.createElement('canvas');
          const ctx = finalCanvas.getContext('2d') as CanvasRenderingContext2D;
          finalCanvas.width = Math.max(mapCanvas.width, legendCanvas.width);
          finalCanvas.height = mapCanvas.height + legendCanvas.height;
          ctx.drawImage(mapCanvas, 0, 0);
          ctx.drawImage(legendCanvas, 0, mapCanvas.height);
          finalCanvas.toBlob((blob) => {
            restore();
            resolve(blob);
          });
        } catch (error) {
          console.error('generateMapPngBlob - error:', error);
          restore();
          resolve(null);
        }
      });
      mapRef.current!.triggerRepaint();
    });
  } else {
    console.log('generateMapPngBlob - mapRef or mapContainer not found');
    return null;
  }
}
