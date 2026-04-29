/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2026-04-29 16:40:25
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
    crudDataFilter, onCrudDataFilter, env, crudMode, hiddenColumnOperation=false, searchable_default, filter_required } = props;
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
  let objectApiName = "space_users";

  if(props.$$editor){
    if(props.objectApiName){
      objectApiName = props.objectApiName
    }
  }else{
    // 优先使用组件显式配置的 objectApiName；
    // 排除未被 amis 解析的模板字面量 "${objectName}"（出现在父级 scope 没有 objectName 时），
    // 此时回退到 props.data.objectName，最后再回退到默认值 space_users。
    const configuredObjectApiName =
      props.objectApiName && props.objectApiName !== '${objectName}'
        ? props.objectApiName
        : undefined;
    if(configuredObjectApiName){
      objectApiName = configuredObjectApiName;
    }else if(props.data?.objectName){
      objectApiName = props.data.objectName;
    }
    console.debug('[AmisObjectTable] resolve objectApiName', {
      configuredObjectApiName: props.objectApiName,
      contextObjectName: props.data?.objectName,
      resolved: objectApiName,
    });
  }

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
  else{
    // 相关列表组件传入crud属性，此时ctx.defaults有值，所以合并crud属性
    const listSchema = ctx && ctx.defaults && ctx.defaults.listSchema;
    if(listSchema){
      ctx.defaults.listSchema = Object.assign({}, listSchema, crud)
    }
  }

  // 支持通过直接定义headerSchema属性来定制表头，而不一定要通过ctx.defaults.headerSchema传入
  if(headerSchema){
    defaults.headerSchema = headerSchema;
  }

  let setDataToComponentId = ctx && ctx.setDataToComponentId;
  if(!setDataToComponentId){
    setDataToComponentId = `service_listview_${objectApiName}`;
  }
  // console.log(`objectApiName`, objectApiName)
  const amisFilters = amisCondition && conditionsToFilters(amisCondition);
  const tableFilters = filters || amisFilters;
  const amisSchemaData = Object.assign({}, data, defaultData);
  const allData = createObject(data, defaultData);
  const appId = data?.appId || defaultData?.appId;
  // ctx中值为undefined的属性不能保留，否则会导致 filters等被覆盖。
  ctx = pickBy(ctx, (value)=>{ return value !== undefined })
  // console.log(`columns`, columns)
  let tableSchema = await getTableSchema(appId, objectApiName, columns, { 
    filters: tableFilters, filtersFunction, top, sort, sortField, sortOrder, extraColumns, defaults, ...ctx, 
    setDataToComponentId, requestAdaptor, adaptor, filterVisible, headerToolbarItems, 
    crudDataFilter, onCrudDataFilter, amisData: allData, env, searchable_default, filter_required });
  let amisSchema: any = tableSchema.amisSchema;
  let uiSchema = tableSchema.uiSchema;
  amisSchema.data = Object.assign({}, amisSchema.data, amisSchemaData);
  // if(has(props, 'objectApiName')){
  //   amisSchema.data.objectName = objectApiName;
  // }
  amisSchema.className = `steedos-object-table ${uiSchema.enable_tree ? "is-steedos-tree-table" : ""} ${amisSchema.className} h-full flex flex-col ${className}`;
  // amisSchema.objectApiName = objectApiName;//设计器中切换对象时画布中显示的列未同步变更
  // console.timeEnd('AmisObjectTable')
  // console.log(`AmisObjectTable=====>`, props, amisSchema)
  return amisSchema;
}