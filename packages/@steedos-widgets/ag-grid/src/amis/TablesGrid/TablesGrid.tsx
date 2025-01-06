/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-12-25 13:52:44
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-06 17:45:24
 */
import React, { useEffect, useState, useRef } from 'react';
import { keys, pick, difference, pickBy, has, each, isString } from 'lodash';
import { getTablesGridSchema } from "./tables";

export const AmisTablesGrid = async (props: any) => {
  const { $schema, data, defaultData, className = "", tableId, mode = "edit", env, style } = props;
  console.log('AmisTablesGrid===', props);
  // const [tableSchema, setTableSchema] = useState({} as any);
  const amisSchemaData = Object.assign({}, data, defaultData);
  // const appId = data?.appId || defaultData?.appId;
  let tableSchema = await getTablesGridSchema(tableId, mode, { env });
  let amisSchema: any = tableSchema.amisSchema;
  amisSchema.data = Object.assign({}, amisSchema.data, amisSchemaData);
  amisSchema.className = `${amisSchema.className} ${className}`;
  amisSchema.style = style;
  return amisSchema;
}