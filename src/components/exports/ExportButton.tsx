'use client';
import ExporterIcon from '@/assets/icons/export_icon_white.svg';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import ExportDataTrigger from '@/hooks/ExportDataTrigger';
import {
  exportMultipleSheetToXLSX,
  exportToXLSX
} from '@/lib/utils/export/exportXlsx';
import Image from 'next/image';
import { usePostHog } from 'posthog-js/react';
import { useLayoutEffect, useRef, useState } from 'react';
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

export const ExportButton = ({
  data,
  baseName,
  type,
  libelle,
  code,
  sheetName,
  documentation,
  children = 'Exporter',
  style
}: ExportButtonProps) => {
  const posthog = usePostHog();
  const [isExporting, setIsExporting] = useState(false);
  posthog.capture(
    baseName === 'inconfort_thermique'
      ? 'export_xlsx_thematique_bouton'
      : 'export_xlsx_bouton',
    {
      thematique: baseName,
      code: code,
      libelle: libelle,
      type: type,
      date: new Date()
    }
  );
  const handleExport = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!data || data.length === 0) {
      console.log('Aucune donnée à exporter');
      return;
    }
    setIsExporting(true);
    e.currentTarget.blur();
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
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={styles.exportIndicatorButton}
      style={{
        cursor: isExporting ? 'wait' : 'pointer',
        ...style
      }}
    >
      {isExporting ? 'Export en cours...' : children}
      <Image
        alt="Exporter les données"
        src={ExporterIcon}
        width={16}
        height={16}
      />
    </button>
  );
};

export const ExportButtonNouveauParcours = ({
  data,
  baseName,
  type,
  libelle,
  code,
  sheetName,
  documentation,
  children = 'Exporter',
  style,
  disabled,
  anchor
}: ExportButtonProps) => {
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
<<<<<<< HEAD
          <BoutonPrimaireClassic
            onClick={handleExport}
            disabled={disabled || isExporting}
            icone={isExporting ? null : ExporterIcon}
            size="sm"
            text={isExporting ? 'Export en cours...' : (children as string)}
            style={{
              cursor: isExporting ? 'wait' : 'pointer',
              ...style
            }}
          />
=======
          <div ref={buttonWrapperRef} style={{ display: 'inline-flex' }}>
            <BoutonPrimaireClassic
              onClick={handleExport}
              disabled={disabled || isExporting}
              icone={isExporting ? null : ExporterIcon}
              size="sm"
              text={isExporting ? 'En cours...' : (children as string)}
              style={{
                minWidth: buttonMinWidth,
                cursor: isExporting ? 'wait' : 'pointer',
                ...style
              }} />
          </div>
>>>>>>> 2d50777f (chore: fixed width export buttons)
          {isClicked && <ExportDataTrigger />}
        </div>
      )}
    </>
  );
};
