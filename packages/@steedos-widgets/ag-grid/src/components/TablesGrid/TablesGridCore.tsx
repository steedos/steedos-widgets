/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-01-18 18:58:37
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-03 17:07:11
 */
import React, { useEffect, useState, useRef } from 'react';
import { AmisAgGrid } from '../AgGrid';
import { TablesGridProvider } from './provider';
import { getGridOptions, getMeta } from './core';
import { useTablesGridContext } from './provider';

type Mode = 'read' | 'edit' | 'admin';

type TablesGrid3Props = {
  tableId: string;
  mode: Mode;
  [key: string]: any;
};

export const TablesGridCore: React.FC<TablesGrid3Props> = (props) => {
  const {
    tableId,
    mode,
    env
  } = props;
  console.log('TablesGridCore===tableId===');
  const [meta, setMeta] = useState(null);
  const ref = useRef(null);
  const { getTableMeta } = useTablesGridContext();

  useEffect(() => {
    const fetchMeta = async () => {
      const result = await getTableMeta();
      setMeta(result);
    };

    fetchMeta();
  }, []);

  if (!meta) {
    return <div>Loading...</div>;
  }

  const onDataFilter = async function (config: any, AgGrid: any, props: any, data: any, ref: any) {
    // 为ref.current补上props属性，否则props.dispatchEvent不能生效
    ref.current.props = props;
    let dispatchEvent = async function (action, data) {
      props.dispatchEvent(action, data, ref.current);
    }
    let gridOptions = getGridOptions(meta, mode, {
      dispatchEvent,
      env
    });
    return gridOptions;
  }

  return (
    <AmisAgGrid
      ref={ref}
      onDataFilter={onDataFilter}
    // config={config}
      {...props}
    />)
};
