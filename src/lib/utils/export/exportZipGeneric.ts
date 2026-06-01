import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { type RefObject } from 'react';
import * as XLSX from 'xlsx';
import { type Any } from '../types';
import { calculateColumnWidths } from './calculateColumnWidths';
import { generateExportFilename } from './exportXlsx';

type ExportDataRow = Record<
  string,
  string | number | boolean | null | bigint | undefined
>;

interface ExcelFileConfig {
  data: ExportDataRow[];
  baseName: string;
  sheetName: string;
  type: string;
  libelle: string;
}

interface PngFileConfig {
  ref: RefObject<Any>;
  filename: string;
}

interface BlobFileConfig {
  blob: Blob;
  filename: string;
}

interface ZipExportOptions {
  excelFiles?: ExcelFileConfig[];
  pngFiles?: PngFileConfig[];
  blobFiles?: BlobFileConfig[];
  zipFilename?: string;
}

/**
 * Downloads a blob as a file
 */
const downloadBlob = (blob: Blob, filename: string): void => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

/**
 * Creates an Excel blob without downloading it
 */
const createExcelBlob = (
  data: ExportDataRow[],
  sheetName: string
): { blob: Blob; buffer: ArrayBuffer } => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = calculateColumnWidths(worksheet);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const buffer = XLSX.write(workbook, { type: 'array' });
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  return { blob, buffer };
};

/**
 * Creates a PNG blob without downloading it
 */
const createPngBlob = async (
  ref: RefObject<Any>
): Promise<{ blob: Blob; buffer: Uint8Array }> => {
  if (!ref.current) {
    throw new Error('PNG reference is not available');
  }

  const pngDataUrl = await toPng(ref.current, {
    quality: 1,
    pixelRatio: 1,
    width: ref.current.offsetWidth * 2,
    height: ref.current.offsetHeight * 2,
    style: {
      transform: 'scale(2)',
      transformOrigin: 'top left'
    },
    cacheBust: true,
    onImageErrorHandler: (error) => {
      console.error('Error exporting image:', error);
      throw new Error("Erreur lors de la capture de l'image");
    }
  });

  // Convert data URL to blob without fetch (CSP-safe)
  const base64Data = pngDataUrl.split(',')[1];
  const buffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
  const blob = new Blob([buffer], { type: 'image/png' });

  return { blob, buffer };
};

/**
 * Exports multiple files in a ZIP archive
 */
export const exportAsZip = async ({
  excelFiles = [],
  pngFiles = [],
  blobFiles = [],
  zipFilename = `export_${new Date().toISOString().split('T')[0]}.zip`
}: ZipExportOptions): Promise<void> => {
  try {
    const zip = new JSZip();
    const allFiles: Array<{ blob: Blob; filename: string }> = [];

    // Process Excel files
    for (const excelConfig of excelFiles) {
      if (!excelConfig.data || excelConfig.data.length === 0) {
        console.warn(`Skipping Excel file ${excelConfig.baseName}: no data`);
        continue;
      }

      const { blob, buffer } = createExcelBlob(
        excelConfig.data,
        excelConfig.sheetName
      );
      const filename = generateExportFilename(
        excelConfig.baseName,
        excelConfig.type,
        excelConfig.libelle
      );

      zip.file(filename, buffer);
      allFiles.push({ blob, filename });
    }

    // Process PNG files
    for (const pngConfig of pngFiles) {
      if (!pngConfig.ref.current) {
        console.warn(
          `Skipping PNG file ${pngConfig.filename}: ref not available`
        );
        continue;
      }

      try {
        const { blob, buffer } = await createPngBlob(pngConfig.ref);
        zip.file(pngConfig.filename, buffer);
        allFiles.push({ blob, filename: pngConfig.filename });
      } catch (error) {
        console.error(
          `Error processing PNG file ${pngConfig.filename}:`,
          error
        );
        // Continue with other files instead of failing completely
      }
    }

    // Process additional blob files
    for (const blobConfig of blobFiles) {
      zip.file(blobConfig.filename, blobConfig.blob);
      allFiles.push(blobConfig);
    }

    if (allFiles.length === 0) {
      throw new Error('Aucun fichier à exporter');
    }

    // Generate ZIP and download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, zipFilename);
  } catch (error) {
    console.error('Error during ZIP export:', error);

    // Fallback to separate downloads if ZIP creation fails
    try {
      console.log('ZIP creation failed, falling back to separate downloads...');

      let fileIndex = 0;

      // Download Excel files separately
      for (const excelConfig of excelFiles || []) {
        if (!excelConfig.data || excelConfig.data.length === 0) continue;

        const { blob } = createExcelBlob(
          excelConfig.data,
          excelConfig.sheetName
        );
        const filename = generateExportFilename(
          excelConfig.baseName,
          excelConfig.type,
          excelConfig.libelle
        );

        setTimeout(() => downloadBlob(blob, filename), 1000 * fileIndex++);
      }

      // Download PNG files separately
      for (const pngConfig of pngFiles || []) {
        if (!pngConfig.ref.current) continue;

        try {
          const { blob } = await createPngBlob(pngConfig.ref);
          setTimeout(
            () => downloadBlob(blob, pngConfig.filename),
            1000 * fileIndex++
          );
        } catch (pngError) {
          console.error(
            `Error processing PNG file ${pngConfig.filename} in fallback:`,
            pngError
          );
        }
      }

      // Download blob files separately
      for (const blobConfig of blobFiles || []) {
        setTimeout(
          () => downloadBlob(blobConfig.blob, blobConfig.filename),
          1000 * fileIndex++
        );
      }
    } catch (fallbackError) {
      console.error('Fallback export also failed:', fallbackError);

      // Show user-friendly error message
      let errorMessage = "Une erreur est survenue lors de l'exportation.";

      if (error instanceof Error) {
        if (
          error.message.includes('PNG reference') ||
          error.message.includes('ref not available')
        ) {
          errorMessage =
            "Erreur lors de la capture de l'image. Veuillez réessayer.";
        } else if (error.message.includes('Aucun fichier')) {
          errorMessage = 'Aucun fichier à exporter.';
        } else if (error.message.includes("capture de l'image")) {
          errorMessage = error.message;
        }
      }

      alert(errorMessage);
      throw error;
    }
  }
};

// Legacy function for backward compatibility
export const exportAsZipLegacy = async (options: {
  excelData: ExportDataRow[];
  excelBaseName: string;
  excelSheetName: string;
  pngRef: RefObject<Any>;
  pngFilename: string;
  type: string;
  libelle: string;
  zipFilename?: string;
}): Promise<void> => {
  return exportAsZip({
    excelFiles: [
      {
        data: options.excelData,
        baseName: options.excelBaseName,
        sheetName: options.excelSheetName,
        type: options.type,
        libelle: options.libelle
      }
    ],
    pngFiles: [
      {
        ref: options.pngRef,
        filename: options.pngFilename
      }
    ],
    zipFilename: options.zipFilename
  });
};
