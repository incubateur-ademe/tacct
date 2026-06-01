'use client';
import ExporterIcon from '@/assets/icons/export_icon_white.svg';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import ExportDataTrigger from '@/hooks/ExportDataTrigger';
import { setPreOpenedWindow } from '@/lib/utils/export/exportZipGeneric';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from '../components.module.scss';
import { CopyLinkClipboard } from '../interactions/CopyLinkClipboard';

interface ZipExportButtonProps {
  handleExport: () => Promise<void>;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  anchor?: string;
  code?: string;
  libelle?: string;
  type?: string;
  thematique?: string;
}

export const ZipExportButton = ({
  handleExport,
  children = 'Exporter',
  style,
  anchor,
  code,
  libelle,
  type,
  thematique
}: ZipExportButtonProps) => {
  const posthog = usePostHog();
  const [isExporting, setIsExporting] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const [buttonMinWidth, setButtonMinWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (buttonWrapperRef.current) {
      setButtonMinWidth(buttonWrapperRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (isExporting) {
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
  }, [isExporting]);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsClicked(true);
    if (isExporting) return;

    // Ouvrir la fenêtre de façon synchrone (dans le contexte du geste utilisateur)
    // avant tout await, sinon iOS Safari bloque window.open()
    const iosDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (iosDevice) {
      setPreOpenedWindow(window.open('about:blank', '_blank'));
    }

    e.currentTarget.blur();
    setIsExporting(true);

    posthog.capture('export_zip_bouton', {
      thematique: thematique,
      code: code,
      libelle: libelle,
      type: type,
      date: new Date()
    });

    // Attendre que React affiche "Export en cours..." avant de démarrer l'export
    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
      await Promise.race([
        handleExport(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Export timeout')), 8000)
        )
      ]);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
      }, 3000);
    }
  };

  return (
    <div className={styles.exportShareWrapper}>
      {anchor && <CopyLinkClipboard anchor={anchor} />}
      <div ref={buttonWrapperRef} style={{ display: 'inline-flex' }}>
        <BoutonPrimaireClassic
          onClick={handleClick}
          disabled={isExporting}
          icone={isExporting ? null : ExporterIcon}
          size="sm"
          text={isExporting ? 'En cours...' : (children as string)}
          style={{
            minWidth: buttonMinWidth,
            cursor: isExporting ? 'wait' : 'pointer',
            ...style
          }}
        />
      </div>
      {isClicked && <ExportDataTrigger />}
    </div>
  );
};
