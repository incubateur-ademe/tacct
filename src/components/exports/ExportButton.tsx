'use client';
import ExporterIcon from '@/assets/icons/export_icon_white.svg';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import ExportDataTrigger from '@/hooks/ExportDataTrigger';
import {
  exportMultipleSheetToXLSX,
  exportToXLSX
} from '@/lib/utils/export/exportXlsx';
import { usePostHog } from 'posthog-js/react';
import { useState } from 'react';
import styles from '../components.module.scss';
import { CopyLinkClipboard } from '../interactions/CopyLinkClipboard';

type ExportDataRow = Record<
  string,
  string | number | boolean | null | bigint | undefined
>;

interface ExportButtonProps {
  data: ExportDataRow[];
  baseName: string;
  type: string;
  libelle: string;
  code: string;
  sheetName: string;
  children?: React.ReactNode;
  documentation?: { [key: string]: string }[];
  style?: React.CSSProperties;
  disabled?: boolean;
  anchor?: string;
}

export function ExportButton({
  data, baseName, type, libelle, code, sheetName, documentation, children = 'Exporter', style, disabled, anchor
}: ExportButtonProps) {
  const posthog = usePostHog();
  const [isExporting, setIsExporting] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

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

    if (!data || data.length === 0) {
      console.log('Aucune donnée à exporter');
      setIsExporting(false);
      return;
    }

    try {
      if (documentation) {
        exportMultipleSheetToXLSX(
          {
            [sheetName]: data,
            Documentation: Array.isArray(documentation)
              ? documentation
              : [{ Documentation: documentation }]
          },
          baseName,
          type,
          libelle
        );
      } else {
        exportToXLSX(data, baseName, type, libelle, sheetName);
      }
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
      {data.length === 0 ? null : (
        <div className={styles.exportShareWrapper}>
          {anchor && <CopyLinkClipboard anchor={anchor} />}
          <BoutonPrimaireClassic
            onClick={handleExport}
            disabled={disabled || isExporting}
            icone={isExporting ? null : ExporterIcon}
            size="sm"
            text={isExporting ? 'En cours...' : (children as string)}
            style={{
              cursor: isExporting ? 'wait' : 'pointer',
              ...style
            }} />
          {isClicked && <ExportDataTrigger />}
        </div>
      )}
    </>
  );
}
