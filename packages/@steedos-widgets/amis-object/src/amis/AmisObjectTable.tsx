/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: liaodaxue
 * @LastEditTime: 2023-11-15 17:05:16
 * @Description: 
 */
import './AmisObjectTable.less';
import { getTableSchema, conditionsToFilters, createObject } from '@steedos-widgets/amis-lib'
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
  const { $schema, filters, filtersFunction, amisCondition, top, headerSchema, fields: includedFields, fieldsExtend,
    sort, sortField, sortOrder, extraColumns, data, defaultData,
    formFactor = window.innerWidth < 768 ? 'SMALL' : 'LARGE',
    className = "", requestAdaptor,  adaptor, filterVisible = true, headerToolbarItems,
    crudDataFilter, onCrudDataFilter, env, crudMode, hiddenColumnOperation=false } = props;
  let ctx = props.ctx;
  let crud = props.crud || {};
  if(!ctx){
    ctx = {};
  }
  if(!ctx.hiddenColumnOperation){
    ctx.hiddenColumnOperation = hiddenColumnOperation;
  }
  if(!ctx.formFactor){
    ctx.formFactor = formFactor;
  }
  const columns = getTableColumns(props.columns, includedFields, fieldsExtend) || [];
  let defaults: any = {};
  let objectApiName = props.objectApiName || "space_users";

  if (crudMode) {
    // 把crudMode属性传入到crud.mode属性值中
    // 如果只配置了crudMode属性，则后续内核代码会自动生成对应mode的默认属性值，比如card,listItem
    // 这样可以手动配置crud.card或crud.listItem属性的时间提高开发效率
    crud = Object.assign({
      mode: crudMode
    }, crud);
  }

  if (!(ctx && ctx.defaults)) {
    const schemaKeys = difference(keys($schema), ["type", "objectApiName", "columns", "extraColumns","id",
      "crud", "crudDataFilter", "onCrudDataFilter", "env", "crudMode"]);
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
  const allData = createObject(data, defaultData);
  const appId = data?.appId || defaultData?.appId;
  // ctx中值为undefined的属性不能保留，否则会导致 filters等被覆盖。
  ctx = pickBy(ctx, (value)=>{ return value !== undefined })
  let amisSchema = (await getTableSchema(appId, objectApiName, columns, { 
    filters: tableFilters, filtersFunction, top, sort, sortField, sortOrder, extraColumns, defaults, ...ctx, 
    setDataToComponentId, requestAdaptor, adaptor, filterVisible, headerToolbarItems, 
    crudDataFilter, onCrudDataFilter, amisData: allData, env })).amisSchema;
  amisSchema.data = Object.assign({}, amisSchema.data, amisSchemaData);
  if(has(props, 'objectApiName')){
    amisSchema.data.objectName = objectApiName;
  }
  amisSchema.className = `steedos-object-table ${amisSchema.className} h-full flex flex-col ${className}`;
  amisSchema.objectApiName = objectApiName;//设计器中切换对象时画布中显示的列未同步变更
  // console.timeEnd('AmisObjectTable')
  return amisSchema;
}