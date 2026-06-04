import * as XLSX from 'xlsx';
import { calculateColumnWidths } from './calculateColumnWidths';

type ExportDataRow = Record<
  string,
  string | number | boolean | null | bigint | undefined
>;

export const generateExportFilename = (
  baseName: string,
  type: string,
  libelle: string
): string => {
  const cleanLibelle = libelle
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Œ/g, 'OE')
    .replace(/œ/g, 'oe')
    .replace(/Æ/g, 'AE')
    .replace(/æ/g, 'ae')
    .replace(/[^a-zA-Z0-9]/g, '_');
  return `${baseName}_${type}_${cleanLibelle}.xlsx`;
};

export const exportToXLSX = (
  data: ExportDataRow[],
  baseName: string,
  type: string,
  libelle: string,
  sheetName: string
): void => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }
  try {
    const filename = baseName !== "arbovirose" ? generateExportFilename(baseName, type, libelle) : `${baseName}.xlsx`;
    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet['!cols'] = calculateColumnWidths(worksheet);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Error exporting to XLSX:', error);
    throw new Error('Failed to export data to XLSX');
  }
};

export const exportMultipleSheetToXLSX = <T extends Record<string, unknown[]>>(
  data: T,
  baseName: string,
  type: string,
  libelle: string
): void => {
  try {
    const filename = generateExportFilename(baseName, type, libelle);
    const workbook = XLSX.utils.book_new();

    Object.entries(data).forEach(([sheetName, sheetData]) => {
      if (sheetData && sheetData.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        worksheet['!cols'] = calculateColumnWidths(worksheet);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }
    });

    if (workbook.SheetNames.length > 0) {
      XLSX.writeFile(workbook, filename);
    } else {
      console.warn('No data to export in any sheet');
    }
  } catch (error) {
    console.error('Error exporting multiple sheets to XLSX:', error);
    throw new Error('Failed to export data to XLSX');
  }
};
