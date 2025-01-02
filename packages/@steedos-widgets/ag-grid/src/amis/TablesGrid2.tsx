/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-12-25 13:52:44
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-02 21:08:54
 */
import './TablesGrid.less';
import React, { useEffect, useState, useRef } from 'react';
import { keys, pick, difference, pickBy, has, each, isString } from 'lodash';
import { getTablesGridSchema } from "./tables2";

export const AmisTablesGrid2 = async (props: any) => {
  const { $schema, data, defaultData, className = "", tableId, mode = "edit", env, style } = props;
  console.log('AmisTablesGrid2===', props);
  const [tableSchema, setTableSchema] = useState({} as any);
  const amisSchemaData = Object.assign({}, data, defaultData);
  // const appId = data?.appId || defaultData?.appId;
  useEffect(() => {
    const fetchData = async () => {
      try {
        let tableSchema = await getTablesGridSchema(tableId, mode, { env });
        console.log("===tableSchema===", tableSchema);
        setTableSchema(tableSchema);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [tableId, mode])
  let amisSchema: any = tableSchema.amisSchema;
  amisSchema.data = Object.assign({}, amisSchema.data, amisSchemaData);
  amisSchema.className = `${amisSchema.className} ${className}`;
  amisSchema.style = style;
  return amisSchema;
}