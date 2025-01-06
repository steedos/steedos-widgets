/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-12-25 13:52:44
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-06 16:50:36
 */
import './AirtableGrid.less';
import React, { useEffect, useState, useRef } from 'react';
import { keys, pick, difference, pickBy, has, each, isString } from 'lodash';
import { getAirtableGridSchema } from "./gridOptions";
import { ColDef } from 'ag-grid-community';
import { AirtableDataSource } from "./DataSource";

interface AirtableGridProps {
  mode: 'admin' | 'edit' | 'read';
  dataSource: AirtableDataSource;
  getColumnDefs: () => Promise<ColDef[]>;
  [key: string]: any;
}

export const AmisAirtableGrid = async (props: AirtableGridProps) => {
  const { $schema, data, defaultData, className = "", tableId, title, mode = "edit", dataSource, getColumnDefs, env, style } = props;
  console.log('AmisTablesGrid2===', props);
  const amisSchemaData = Object.assign({}, data, defaultData);
  // const appId = data?.appId || defaultData?.appId;
  let tableSchema = await getAirtableGridSchema({ tableId, title, mode, dataSource, getColumnDefs, env });
  let amisSchema: any = tableSchema.amisSchema;
  amisSchema.data = Object.assign({}, amisSchema.data, amisSchemaData);
  amisSchema.className = `${amisSchema.className} ${className}`;
  amisSchema.style = style;
  return amisSchema;
}