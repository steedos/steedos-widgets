/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-12-25 13:52:44
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-12-25 15:58:16
 */
import { keys, pick, difference, pickBy, has, each, isString } from 'lodash';
import { getTablesGridSchema } from "./tables";

export const AmisTablesGrid = async (props: any) => {
  const { $schema, data, defaultData, className = "", tableId, mode = "edit"} = props;
  let ctx = props.ctx;
  if(!ctx){
    ctx = {};
  }

  const amisSchemaData = Object.assign({}, data, defaultData);
  // const appId = data?.appId || defaultData?.appId;
  let tableSchema = await getTablesGridSchema(tableId, mode);
  let amisSchema: any = tableSchema.amisSchema;
  amisSchema.data = Object.assign({}, amisSchema.data, amisSchemaData);
  amisSchema.className = `steedos-object-ag-grid ${className}`;
  // amisSchema.objectApiName = objectApiName;//设计器中切换对象时画布中显示的列未同步变更
  // console.timeEnd('AmisObjectTable')
  return amisSchema;
}