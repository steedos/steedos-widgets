/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-01-18 18:58:37
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-03 17:43:08
 */
import React, { useEffect, useState, useRef } from 'react';
import { keyBy, map, isNaN, isNil, union, debounce, each, clone, forEach, filter } from "lodash";
import { AmisAgGrid } from '../AgGrid';
import { TablesGridProvider } from './provider';
import { TablesGridCore } from './TablesGridCore';
import { getGridOptions, getMeta, filterModelToSteedosFilters } from './core';
import {
  IServerSideGetRowsParams,
} from "ag-grid-community";

export const B6_TABLES_BASEID = "default";

const ROOT_URL = "http://127.0.0.1:5800";
const B6_HOST = "http://localhost:5100";//process.env.B6_HOST || "";
const B6_TABLES_API = `${B6_HOST}/api/v6/tables`;
export const B6_TABLES_ROOTURL = `${B6_TABLES_API}/${B6_TABLES_BASEID}`;

type Mode = 'read' | 'edit' | 'admin';

type TablesGrid3Props = {
  tableId: string;
  mode: Mode;
  [key: string]: any;
};

const customGetColumns = () => {
  return [
    { headerName: 'Name', field: 'name' },
    { headerName: 'Age', field: 'age' },
  ];
};

const customGetRows = () => {
  return [
    { name: 'John', age: 25 },
    { name: 'Jane', age: 30 },
  ];
};

const getRows = async function (params: any, tableId: string) {
  console.log('Server Side Datasource - Requesting rows from server:', params.request);
  let gridApi = params.api;
  // agGridRefs[tableId] = gridApi;\

  try {
    const colDefs = keyBy(
      map(params.api.getAllGridColumns(), col => col.colDef),
      "field"
    );
    const modelFilters = filterModelToSteedosFilters(params.request.filterModel, colDefs);
    console.log('Server Side Datasource - Requesting rows by modelFilters:', modelFilters);

    let url = `${B6_TABLES_ROOTURL}/${tableId}`;
    const startRow = params.request.startRow;
    const pageSize = params.api.paginationGetPageSize();
    let separator = url.includes('?') ? '&' : '?';
    url += `${separator}skip=${startRow}&top=${pageSize}&expands=created_by,modified_by`;

    // 过滤
    let queryFilters = [];
    const collectFilters = [];
    // if (B6_TABLES_DATA_COLLECT_FIELDNAME && collectId) {
    //     collectFilters = [B6_TABLES_DATA_COLLECT_FIELDNAME, "=", collectId];
    // }
    if (collectFilters.length && modelFilters.length) {
      queryFilters = [collectFilters, modelFilters];
    } else if (collectFilters.length) {
      queryFilters = collectFilters;
    } else {
      queryFilters = modelFilters;
    }
    if (queryFilters.length > 0) {
      separator = url.includes('?') ? '&' : '?';
      url += `${separator}filters=${JSON.stringify(queryFilters)}`;
    }

    // 排序
    const sortModel = params.request.sortModel;
    const sort = [];
    forEach(sortModel, sortField => {
      sort.push(`${sortField.colId} ${sortField.sort}`);
    });
    console.log('Server Side Datasource - Requesting rows by sortModel:', sortModel);
    if (sort.length > 0) {
      separator = url.includes('?') ? '&' : '?';
      url += `${separator}sort=${sort.join(",")}`;
    }

    const response = await fetch(url, {
      credentials: 'include',
      // headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer ${context.tenantId},${context.authToken}' //TODO context中没取到数据
      // }
    });

    if (!response.ok) {
      throw new Error(`Server error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Server Side Datasource - data:', data);

    params.success({
      rowData: data.data,
      rowCount: data.totalCount
    });
  } catch (error) {
    console.error('Error fetching data from server:', error);
    // env.notify("error", '无法从服务器获取数据，请检查网络连接并重试。如果问题持续，请联系技术支持。');
    params.fail();
  }
}

export const AmisTablesGrid3: React.FC<TablesGrid3Props> = (props) => {
  const {
    tableId,
    mode,
    env
  } = props;
  console.log('AmisTablesGrid3===tableId===', tableId);
  // const [meta, setMeta] = useState(null);
  // const ref = useRef(null);

  // useEffect(() => {
  //   const fetchMeta = async () => {
  //     const result = await getMeta(tableId);
  //     setMeta(result);
  //   };

  //   fetchMeta();
  // }, [tableId]);

  // if (!meta) {
  //   return <div>Loading...</div>;
  // }


  const getTableMeta = async () => {
    const meta = await getMeta(tableId);
    console.log('getTableMeta===meta===', meta);
    return meta;
  }

  const getRowsRaw = async (params: IServerSideGetRowsParams) => {
    await getRows(params, tableId);
  }

  return (
    <TablesGridProvider
      getTableMeta={getTableMeta}
      getColumnDefs={customGetColumns}
      getRows={getRowsRaw}
    >
      <TablesGridCore
        // ref={ref}
        // config={config}
        {...props}
      />
    </TablesGridProvider>)
};
