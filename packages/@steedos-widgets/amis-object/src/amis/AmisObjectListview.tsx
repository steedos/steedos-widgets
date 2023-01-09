/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-01-05 11:42:43
 * @Description: 
 */
import { getListSchema, getObjectListHeaderFirstLine, getUISchema } from '@steedos-widgets/amis-lib'
import { keys, pick, difference, find } from 'lodash';

export const AmisObjectListView = async (props) => {
  // console.log(`AmisObjectListView props`, props)
  const { $schema, top, perPage, showHeader, headerSchema, data, defaultData, className="", tableClassName} = props;
  // const urlListNameMatchs = location.pathname.match(/grid\/(\w+)/);  // 错误的规则
  // const urlListName = urlListNameMatchs && urlListNameMatchs[1]
  // let listName = props.listName || urlListName;
  let ctx = props.ctx;
  let listName = defaultData?.listName || data?.listName || props?.listName;
  let defaults: any = {};
  let objectApiName = props.objectApiName || "space_users";
  if(!ctx){
    ctx = {};
  }
  if(!ctx.formFactor){
    ctx.formFactor = window.innerWidth < 768 ? 'SMALL' : 'LARGE';
  }

  const objectUiSchema = await getUISchema(objectApiName, false);
  const listView =  find(
    objectUiSchema.list_views,
    (listView, name) => {
        // 传入listViewName空值则取第一个
        if(!listName){
          listName = name;
        }
        return name === listName || listView._id === listName;
    }
  );
  if(!listView) {
    return {
      "type": "alert",
      "body": `当前${listName}视图不存在！`,
      "level": "warning",
      "showIcon": true,
      "className": "mb-3"
    }
  }

  listName = listView.name;

  if (!(ctx && ctx.defaults)) {
    // 支持把crud组件任意属性通过listSchema属性传入到底层crud组件中
    const schemaKeys = difference(keys($schema), ["type", "showHeader","id"]);
    const listSchema = pick(props, schemaKeys);
    // className不传入crud组件，crud单独识别tableClassName属性
    listSchema.className = tableClassName;
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

  const amisSchemaData = Object.assign({}, data, defaultData);
  const listViewId = ctx?.listViewId || amisSchemaData.listViewId;
  let schema: any = (await getListSchema(amisSchemaData.appId, objectApiName, listName, { 
    top, perPage, showHeader, defaults, ...ctx, listViewId, setDataToComponentId, filterVisible: true
  }));
  const amisSchema = schema.amisSchema;
  const uiSchema = schema.uiSchema;
  const body = [amisSchema];
  if(schema.isCustomAmisSchema || schema.isCalendar){
    let firstLineSchema = getObjectListHeaderFirstLine(uiSchema, listName, ctx);
    body.unshift({
      "type": "wrapper",
      "body": [firstLineSchema],
      "className": "bg-gray-100 pb-0 sm:rounded-tl sm:rounded-tr",
    });
  }
  // TODO: recordPermissions和_id是右上角按钮需要强依赖的变量，应该写到按钮那边去
  const serviceData = Object.assign({}, amisSchema.data, amisSchemaData, { listName, uiSchema, recordPermissions: uiSchema.permissions, _id: null });
  return {
    "type": "service",
    "body": body,
    "className": `${className}`,
    "data": serviceData
  }
}