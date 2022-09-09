/**
 * 导出 Excel 功能
 */
import './ColumnToggler';
import type { TableProps, ExportExcelToolbar } from './index';
export declare function exportExcel(ExcelJS: any, props: TableProps, toolbar: ExportExcelToolbar): Promise<void>;
