/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-01-02 15:39:40
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-06 20:09:12
 */
// import { getMeta, getColumnDef, getGridOptions, getTableHeader } from '../tables';
import { getColumnDef, getDataTypeDefinitions } from '../AirtableGrid/gridOptions';
import { getDataSource } from './dataSource';

const B6_HOST = "http://localhost:5100";//process.env.B6_HOST || "";

async function getMeta(tableId: string, baseId: string = 'default', baseUrl: string = '') {
    if (!tableId) {
        return;
    }
    const tablesApi = `${baseUrl}/api/v6/tables`;
    const metaApi = `${tablesApi}/meta/bases/${baseId}/tables`;
    try {
        const response = await fetch(`${metaApi}/${tableId}`, {
            credentials: 'include',
            // "headers": {
            //     'Content-Type': 'application/json',
            //     "Authorization": "Bearer ${context.tenantId},${context.authToken}" //TODO context中没取到数据
            // }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`getUISchema`, tableId, error);
    }
}

export async function getTablesGridSchema(
    tableId: string,
    baseId: string,
    mode: string, //edit/read/admin
    { env }
) {
    const baseUrl = B6_HOST;//TODO:要改为从amis data context中取值
    const meta = await getMeta(tableId, baseId, baseUrl);
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
        "className": "steedos-tables-grid h-full",
        "title": meta.label,
        "mode": mode,
        "getColumnDefs": getColumnDefs,
        "dataSource": dataSource,
        tableId
    };
    return {
        meta,
        amisSchema,
    };
}