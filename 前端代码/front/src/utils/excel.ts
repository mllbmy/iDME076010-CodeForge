import { message } from 'antd';

interface ExportOptions {
  data: Record<string, unknown>[];
  columns: { key: string; title: string }[];
  filename: string;
  sheetName?: string;
}

interface MultiSheetExportOptions {
  sheets: { data: Record<string, unknown>[]; sheetName: string }[];
  filename: string;
}

export async function exportToExcel(options: ExportOptions): Promise<void> {
  const { data, columns, filename, sheetName = 'Sheet1' } = options;

  try {
    const XLSX = await import('xlsx');

    const header = columns.map((col) => col.title);
    const keys = columns.map((col) => col.key);

    const rows = data.map((item) => keys.map((key) => item[key] ?? ''));

    const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    XLSX.writeFile(workbook, `${filename}.xlsx`);

    message.success('导出成功');
  } catch (error) {
    console.error('Excel 导出失败:', error);
    message.error('导出失败，请稍后重试');
  }
}

export async function exportMultiSheetExcel(options: MultiSheetExportOptions): Promise<void> {
  const { sheets, filename } = options;

  try {
    const XLSX = await import('xlsx');

    const workbook = XLSX.utils.book_new();

    for (const sheet of sheets) {
      const worksheet = XLSX.utils.json_to_sheet(sheet.data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
    }

    XLSX.writeFile(workbook, filename);

    message.success('导出成功');
  } catch (error) {
    console.error('Excel 导出失败:', error);
    message.error('导出失败，请稍后重试');
  }
}

export async function getExcelUtils() {
  const XLSX = await import('xlsx');
  return XLSX;
}
