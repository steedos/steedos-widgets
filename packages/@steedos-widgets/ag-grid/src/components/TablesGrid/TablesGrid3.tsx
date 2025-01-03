/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-01-18 18:58:37
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-03 16:40:29
 */
import React, { useEffect, useState, useRef } from 'react';
import { AmisAgGrid } from '../AgGrid';
import { TablesGridProvider } from './provider';
import { TablesGridCore } from './TablesGridCore';
import { getGridOptions, getMeta } from './core';

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

  return (
    <TablesGridProvider
      getTableMeta={getTableMeta}
      getColumnDefs={customGetColumns}
      getRows={customGetRows}
    >
      <TablesGridCore
        // ref={ref}
        // config={config}
        {...props}
      />
    </TablesGridProvider>)
};
