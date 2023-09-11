/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-09-11 09:59:32
 * @Description: 
 */
import './AmisObjectTable.less';
import { getTableSchema, conditionsToFilters } from '@steedos-widgets/amis-lib'
import { keys, pick, difference, pickBy, has, each, isString } from 'lodash';


function getTableColumns(columns, includedFields, fieldsExtend = {}){
  if(columns){
    return columns;
  }

  const tableColumns = [];

  let _fieldsExtend = fieldsExtend;

  if(isString(_fieldsExtend)){
    try {
      _fieldsExtend = JSON.parse(_fieldsExtend);
    } catch (error) {
      _fieldsExtend = {}
    }
  }

  each(includedFields, (fName)=>{
    let extend = {};
    try {
      extend = _fieldsExtend[fName] || {}
    } catch (error) {
      
    }
    tableColumns.push(Object.assign({}, extend, { field: fName}))
  })
  return tableColumns;
}

export const AmisObjectTable = async (props) => {
  // console.time('AmisObjectTable')
  console.log(`AmisObjectTable props`, props)
  const { $schema, filters, filtersFunction, amisCondition, top, headerSchema, fields: includedFields, fieldsExtend,
    sort, sortField, sortOrder, extraColumns, data, defaultData, crud = {},
    formFactor = window.innerWidth < 768 ? 'SMALL' : 'LARGE',
    className = "", requestAdaptor,  adaptor, filterVisible = true, headerToolbarItems,
    crudColumns, crudColumnsDataFilter, onCrudColumnsDataFilter, env } = props;
  console.log(`AmisObjectTable crudColumns------------>`, crudColumns)
  let ctx = props.ctx;
  if(!ctx){
    ctx = {};
  }
  if(!ctx.formFactor){
    ctx.formFactor = formFactor;
  }
  const columns = getTableColumns(props.columns, includedFields, fieldsExtend) || [];
  let defaults: any = {};
  let objectApiName = props.objectApiName || "space_users";

  if (!(ctx && ctx.defaults)) {
    const schemaKeys = difference(keys($schema), ["type", "objectApiName", "columns", "extraColumns","id","crud"]);
    const listSchema = pick(props, schemaKeys);
    // className不传入crud组件，crud单独识别crudClassName属性
    listSchema.className = ""
    defaults = {
      listSchema: Object.assign( {}, listSchema, crud )
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
  console.log(`AmisObjectTable===>amisSchemaData`, amisSchemaData)
  const appId = data?.appId || defaultData?.appId;
  // ctx中值为undefined的属性不能保留，否则会导致 filters等被覆盖。
  ctx = pickBy(ctx, (value)=>{ return value !== undefined })
  let amisSchema = (await getTableSchema(appId, objectApiName, columns, { 
    filters: tableFilters, filtersFunction, top, sort, sortField, sortOrder, extraColumns, defaults, ...ctx, 
    setDataToComponentId, requestAdaptor, adaptor, filterVisible, headerToolbarItems, 
    crudColumns, crudColumnsDataFilter, onCrudColumnsDataFilter, amisData: amisSchemaData, env })).amisSchema;
  amisSchema.data = Object.assign({}, amisSchema.data, amisSchemaData);
  if(has(props, 'objectApiName')){
    amisSchema.data.objectName = objectApiName;
  }
  console.log(`AmisObjectTable===>amisSchema.data`, amisSchema.data)
  amisSchema.className = `steedos-object-table h-full flex flex-col ${className}`;
  amisSchema.objectApiName = objectApiName;//设计器中切换对象时画布中显示的列未同步变更
  console.log(`AmisObjectTable===>amisSchema`, amisSchema)
  // console.timeEnd('AmisObjectTable')
  return amisSchema;
}