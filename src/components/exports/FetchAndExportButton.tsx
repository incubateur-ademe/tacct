'use client';
import { exportMultipleSheetToXLSX } from '@/lib/utils/export/exportXlsx';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useState } from 'react';

interface FetchAndExportButtonProps<T extends Record<string, unknown[]>> {
  fetchFunction: () => Promise<T>;
  baseName: string;
  type: string;
  libelle: string;
  code: string;
  children?: React.ReactNode;
}

export const FetchAndExportButton = <T extends Record<string, unknown[]>>({
  fetchFunction,
  baseName,
  type,
  libelle,
  code,
  children = 'Télécharger les données'
}: FetchAndExportButtonProps<T>) => {
  const posthog = usePostHog();
  posthog.capture('export_xlsx_thematique_bouton', {
    thematique: baseName,
    code: code,
    libelle: libelle,
    type: type,
    date: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleFetchAndExport = async () => {
    setIsLoading(true);
    try {
      const rawData = await fetchFunction();
      // Check si la donnée existe
      const hasData = Object.values(rawData).some(
        (dataArray) => dataArray && dataArray.length > 0
      );
      if (!hasData) {
        return;
      }
      // Export XLSX avec plusieurs feuilles
      exportMultipleSheetToXLSX(rawData, baseName, type, libelle);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération et de l'export des données:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleFetchAndExport} disabled={isLoading}>
      {isLoading ? 'Téléchargement en cours...' : children}
    </Button>
  );
};
