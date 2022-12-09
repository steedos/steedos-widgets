/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-02 10:56:21
 * @Description: 
 */
import { getTableSchema, conditionsToFilters } from '@steedos-widgets/amis-lib'
import { keys, pick, difference } from 'lodash';

export const AmisObjectTable = async (props) => {
  // console.log(`AmisObjectTable props`, props)
  const { $schema, filters, amisCondition, top, headerSchema,globalFilter, sortField, sortOrder, extraColumns, ctx, data, defaultData } = props;
  const columns = props.columns || [];
  let defaults: any = {};
  let objectApiName = props.objectApiName || "space_users";

  if (!(ctx && ctx.defaults)) {
    const schemaKeys = difference(keys($schema), ["type", "objectApiName", "columns", "extraColumns","id"]);
    const listSchema = pick(props, schemaKeys);
    defaults = {
      listSchema
    };
  }

  // 支持通过直接定义headerSchema属性来定制表头，而不一定要通过ctx.defaults.headerSchema传入
  if(headerSchema){
    defaults.headerSchema = headerSchema;
  }

  let setDataToComponentId = ctx && ctx.setDataToComponentId;
  if(!setDataToComponentId){
    setDataToComponentId = `service_listview_${objectApiName}`;
  }
  const amisFilters = amisCondition && conditionsToFilters(amisCondition);
  const tableFilters = filters || amisFilters;

  const amisSchemaData = Object.assign({}, data, defaultData);
  let amisSchema = (await getTableSchema(amisSchemaData.appId, objectApiName, columns, { filters: tableFilters, top, sortField, sortOrder, extraColumns,globalFilter, defaults, ...ctx, setDataToComponentId })).amisSchema;
  amisSchema.data = Object.assign({}, amisSchema.data, amisSchemaData);
  return amisSchema;
}