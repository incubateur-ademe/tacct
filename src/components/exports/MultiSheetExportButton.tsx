'use client';
import ExporterIcon from '@/assets/icons/export_icon_white.svg';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import ExportDataTrigger from '@/hooks/ExportDataTrigger';
import { exportMultipleSheetToXLSX } from '@/lib/utils/export/exportXlsx';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import styles from '../components.module.scss';
import { CopyLinkClipboard } from '../interactions/CopyLinkClipboard';

type ExportDataRow = Record<
  string,
  string | number | boolean | null | bigint | undefined
>;

interface SheetData {
  sheetName: string;
  data: ExportDataRow[];
}

interface MultiSheetExportButtonProps {
  sheetsData: SheetData[];
  baseName: string;
  type: string;
  libelle: string;
  code: string;
  children?: React.ReactNode;
  documentationSheet?: ExportDataRow[];
  anchor?: string;
}

export const MultiSheetExportButton = ({
  sheetsData,
  baseName,
  type,
  libelle,
  code,
  children = 'Exporter',
  documentationSheet,
  anchor
}: MultiSheetExportButtonProps) => {
  const posthog = usePostHog();
  const [isExporting, setIsExporting] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const [buttonMinWidth, setButtonMinWidth] = useState<number | undefined>(
    undefined
  );

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

  const handleExport = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsClicked(true);
    if (isExporting) return;

    e.currentTarget.blur();
    setIsExporting(true);

    posthog.capture('export_xlsx_bouton', {
      thematique: baseName,
      code: code,
      libelle: libelle,
      type: type,
      date: new Date()
    });

    // Attendre que React affiche "Export en cours..." avant de démarrer l'export
    await new Promise((resolve) => setTimeout(resolve, 0));

    const hasData = sheetsData.some(
      (sheet) => sheet.data && sheet.data.length > 0
    );
    if (!hasData) {
      setIsExporting(false);
      return;
    }

    try {
      const dataForExport: Record<string, ExportDataRow[]> = {};
      sheetsData.forEach((sheet) => {
        if (sheet.data && sheet.data.length > 0) {
          dataForExport[sheet.sheetName] = sheet.data;
        }
      });

      if (documentationSheet && documentationSheet.length > 0) {
        dataForExport['Documentation'] = documentationSheet;
      }

      exportMultipleSheetToXLSX(dataForExport, baseName, type, libelle);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
      }, 3000);
    }
  };

  return (
    <>
      {sheetsData.map((sheet) => sheet.data).flat(1).length === 0 ? null : (
        <div className={styles.exportShareWrapper}>
          {anchor && <CopyLinkClipboard anchor={anchor} />}
          <div ref={buttonWrapperRef} style={{ display: 'inline-flex' }}>
            <BoutonPrimaireClassic
              onClick={handleExport}
              disabled={isExporting}
              icone={isExporting ? null : ExporterIcon}
              size="sm"
              text={isExporting ? 'En cours...' : (children as string)}
              style={{
                minWidth: buttonMinWidth,
                cursor: isExporting ? 'wait' : 'pointer'
              }}
            />
          </div>
          {isClicked && <ExportDataTrigger />}
        </div>
      )}
    </>
  );
};
