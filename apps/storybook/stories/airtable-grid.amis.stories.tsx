/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-01-06 17:56:09
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-06 18:15:25
 */
import { React, AmisRender } from '../components/AmisRender';
import { useEffect, useState, useRef } from 'react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Enterprise/Air Table',
};

const data = {};

const env = {
  assetUrls: [
    process.env.STEEDOS_UNPKG_URL + '/@steedos-widgets/amis-object/dist/assets.json',
    process.env.STEEDOS_UNPKG_URL + '/@steedos-widgets/ag-grid/dist/assets.json',
  ],
};

// Helper function to check if a value is not empty
function isNotEmpty(value: any): boolean {
  return value !== null && value !== undefined && value !== '';
}

const getDataSource = () => {
  // console.log("getDataSource ====", { baseUrl, baseId, tableId, key });
  // return new AirtableDataSource({
  //   baseUrl: baseUrl,
  //   baseId: baseId,
  //   tableId: tableId,
  //   key: key,
  //   getFullUrl(): string {
  //     console.log("getFullUrl ====");
  //     return `${this.baseUrl}/api/v6/tables/${this.baseId}/${this.tableId}`;
  //   },
  //   load: async function (loadOptions) {
  //     try {
  //       const params: Record<string, string> = {};

  //       [
  //         // "filter",
  //         // "group",
  //         // "groupSummary",
  //         // "parentIds",
  //         // "requireGroupCount",
  //         // "requireTotalCount",
  //         // "searchExpr",
  //         // "searchOperation",
  //         // "searchValue",
  //         // "select",
  //         // "sort",
  //         // "skip",
  //         // "take",
  //         // "totalSummary",
  //         // "userData",
  //         "skip",
  //         "top",
  //         "filters",
  //         "sort",
  //         "expands",
  //       ].forEach((i) => {
  //         if (i in loadOptions && isNotEmpty(loadOptions[i])) {
  //           params[i] = JSON.stringify(loadOptions[i]);
  //         }
  //       });

  //       const response = await fetch(this.getFullUrl() + '?' + new URLSearchParams(params), { credentials: 'include' });
  //       if (!response.ok) throw new Error("Data loading error");
  //       const data = await response.json();

  //       return {
  //         data: data.data,
  //         totalCount: data.totalCount,
  //         summary: data.summary,
  //         groupCount: data.groupCount,
  //       };
  //     } catch (error) {
  //       throw new Error("Data loading error");
  //     }
  //   },

  //   insert: async function (values) {
  //     try {
  //       const response = await fetch(this.getFullUrl(), {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify(values),
  //         credentials: 'include'
  //       });
  //       if (!response.ok) throw new Error("Insertion failed");
  //       return await response.json();
  //     } catch (error) {
  //       throw new Error("Insertion failed");
  //     }
  //   },

  //   remove: async function (keys) {
  //     try {
  //       const response = await fetch(this.getFullUrl(), {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify({ records: keys }),
  //         credentials: 'include'
  //       });
  //       if (!response.ok) throw new Error("Deletion failed");
  //       return await response.json();
  //     } catch (error) {
  //       throw new Error("Deletion failed");
  //     }
  //   },

  //   update: async function (key, values) {
  //     try {
  //       const response = await fetch(this.getFullUrl() + '/' + encodeURIComponent(key), {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify(values),
  //         credentials: 'include'
  //       });
  //       if (!response.ok) throw new Error("Update failed");
  //       return await response.json();
  //     } catch (error) {
  //       throw new Error("Update failed");
  //     }
  //   }
  // });
}

// async function getMeta(tableId: string, force: boolean = false) {
//     if (!tableId) {
//         return;
//     }
//     try {
//         const response = await fetch(`${B6_TABLES_METABASE_ROOTURL}/${tableId}`, {
//             credentials: 'include',
//             // "headers": {
//             //     'Content-Type': 'application/json',
//             //     "Authorization": "Bearer ${context.tenantId},${context.authToken}" //TODO context中没取到数据
//             // }
//         });

//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error(`getUISchema`, tableId, error);
//     }
// }

const getColumnDefs = async ({ dispatchEvent }) => {
    // let dataTypeDefinitions = getDataTypeDefinitions();
    // var columnDefs = meta.fields.map(function (field: any) {
    //     return getColumnDef(field, dataTypeDefinitions, mode, { dispatchEvent, env });
    // });
    // return columnDefs;
    return []
}

export const Gerneral = () => (
  <AmisRender
    data={data}
    env={env}
    schema={{
      "type": "page",
      "body": [
        {
          "type": "steedos-airtable-grid",
          "className": "h-96",
          "getColumnDefs": getColumnDefs,
          // "dataSource": getDataSource(),
          "style": {
            "height": "calc(100vh - 58px)"
          },
          "tableId": "67658ac0cc184d0efc68b752",
          "mode": "admin"
        }
      ],
    }}
  />
)
