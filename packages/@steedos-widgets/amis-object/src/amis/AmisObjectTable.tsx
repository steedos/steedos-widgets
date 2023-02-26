/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-02-26 14:54:00
 * @Description: 
 */
import { getTableSchema, conditionsToFilters } from '@steedos-widgets/amis-lib'
import { keys, pick, difference, pickBy, has } from 'lodash';

export const AmisObjectTable = async (props) => {
  // console.log(`AmisObjectTable props`, props)
  const { $schema, filters, filtersFunction, amisCondition, top, headerSchema, 
    sort, sortField, sortOrder, extraColumns, data, defaultData, 
    formFactor = window.innerWidth < 768 ? 'SMALL' : 'LARGE',
    className = "", requestAdaptor,  adaptor} = props;
  let ctx = props.ctx;
  if(!ctx){
    ctx = {};
  }
  if(!ctx.formFactor){
    ctx.formFactor = formFactor;
  }
  const columns = props.columns || [];
  let defaults: any = {};
  let objectApiName = props.objectApiName || "space_users";

  if (!(ctx && ctx.defaults)) {
    const schemaKeys = difference(keys($schema), ["type", "objectApiName", "columns", "extraColumns","id"]);
    const listSchema = pick(props, schemaKeys);
    // className不传入crud组件，crud单独识别crudClassName属性
    listSchema.className = ""
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
  const appId = data?.appId || defaultData?.appId;
  // ctx中值为undefined的属性不能保留，否则会导致 filters等被覆盖。
  ctx = pickBy(ctx, (value)=>{ return value !== undefined })
  let amisSchema = (await getTableSchema(appId, objectApiName, columns, { filters: tableFilters, filtersFunction, top, sort, sortField, sortOrder, extraColumns, defaults, ...ctx, setDataToComponentId, requestAdaptor,  adaptor })).amisSchema;
  amisSchema.data = Object.assign({}, amisSchema.data, amisSchemaData);

  amisSchema.className = `steedos-object-table h-full flex flex-col ${className}`
  return amisSchema;
}