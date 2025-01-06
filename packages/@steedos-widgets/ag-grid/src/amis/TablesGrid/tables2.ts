/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-01-02 15:39:40
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-06 11:48:41
 */
// import { getMeta, getColumnDef, getGridOptions, getTableHeader } from '../tables';
import { getMeta, getColumnDef, getDataTypeDefinitions } from '../AirtableGrid/gridOptions';
import { getDataSource } from './dataSource';

export const B6_TABLES_BASEID = "default";

const ROOT_URL = "http://127.0.0.1:5800";
const B6_HOST = "http://localhost:5100";//process.env.B6_HOST || "";
const B6_TABLES_API = `${B6_HOST}/api/v6/tables`;
export const B6_TABLES_ROOTURL = `${B6_TABLES_API}/${B6_TABLES_BASEID}`;

export const B6_TABLES_METABASE_ROOTURL = `${B6_TABLES_API}/meta/bases/${B6_TABLES_BASEID}/tables`;

export async function getTablesGridSchema(
    tableId: string,
    mode: string, //edit/read/admin
    { env }
) {
    const meta = await getMeta(tableId);
    const baseUrl = B6_HOST;
    const baseId = B6_TABLES_BASEID;
    const dataSource = getDataSource({ baseUrl, baseId, tableId});

    const getColumnDefs = async ({ dispatchEvent }) => {
        let dataTypeDefinitions = getDataTypeDefinitions();
        var columnDefs = meta.fields.map(function (field: any) {
            return getColumnDef(field, dataTypeDefinitions, mode, { dispatchEvent, env });
        });
        return columnDefs;
    }

    const amisSchema = {
        "type": "steedos-airtable-grid",
        "className": "abc123 steedos-tables-grid h-full",
        "title": meta.label,
        "mode": mode,
        "getColumnDefs": getColumnDefs,
        "dataSource": dataSource
    };
    return {
        meta,
        amisSchema,
    };
}