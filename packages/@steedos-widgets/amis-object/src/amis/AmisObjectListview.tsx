/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-05 18:17:42
 * @Description: 
 */
import { getListSchema, getObjectListHeaderFirstLine, getUISchema, Router } from '@steedos-widgets/amis-lib'
import { keys, pick, difference, find } from 'lodash';

export const AmisObjectListView = async (props) => {
  // console.log(`AmisObjectListView props`, props)
  const { $schema, top, perPage, showHeader=true, headerSchema, data, defaultData, 
      className="", 
      crudClassName, 
      showDisplayAs = false,
      sideSchema,
      columnsTogglable=false} = props;
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
  const displayAs = Router.getTabDisplayAs(objectApiName);
  let formFactor = props.formFactor;
  if(!formFactor){
    const isMobile = window.innerWidth < 768;
    if(isMobile){
      formFactor = 'SMALL';
    }
    else{
      formFactor = 'LARGE';
    }
  }

  if(["split"].indexOf(displayAs) > -1){
    formFactor = 'SMALL';
  }

  if(!ctx.formFactor){
    ctx.formFactor = formFactor;
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
    // className不传入crud组件，crud单独识别crudClassName属性
    listSchema.className = crudClassName;
    listSchema.onEvent = {}; // 为啥要将一个内置event放在此处?
    listSchema.onEvent[`@data.changed.${objectApiName}`] = {
      "actions": [
        {
          "args": {
            "url": "/app/${appId}/${objectName}/view/${event.data.result.data.recordId}?display=${ls:tab.project.display || 'grid'}&side_object=${objectName}&side_listview_id=${listName}",
            "blank": false
          },
          "actionType": "link",
          "expression": "${!!!event.data.recordId && event.data.__deletedRecord != true}" //是新建, 则进入详细页面. 
        },
        {
          "actionType": "reload",
          "expression": "${event.data.recordId || event.data.__deletedRecord === true}" //不是新建, 则刷新列表
        }
      ]
    }
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
    top, perPage, showHeader, defaults, ...ctx, listViewId, setDataToComponentId, filterVisible: true, showDisplayAs, displayAs
  }));
  const amisSchema = schema.amisSchema;
  const uiSchema = schema.uiSchema;
  let body = [amisSchema];
  if(schema.isCustomAmisSchema || schema.isCalendar){
    let firstLineSchema = getObjectListHeaderFirstLine(uiSchema, listName, ctx);
    body.unshift({
      "type": "wrapper",
      "body": [firstLineSchema],
      "className": "bg-gray-100 pb-0 sm:rounded-tl sm:rounded-tr",
    });
  }

  if (sideSchema) {
    body = [{
      "type": "wrapper",
      "size": "none",
      "className": "flex flex-1 overflow-hidden h-full",
      "body": [
        {
          "type": "wrapper",
          "size": "none",
          "className": "flex-shrink-0 min-w-32 overflow-y-auto border-r border-gray-200 xl:order-first xl:flex xl:flex-col",
          "body": sideSchema
        }, 
        {
          "type": "wrapper",
          "size": "none",
          "className": "flex-1 overflow-y-auto focus:outline-none xl:order-last w-96",
          "body": body
        }, 
        
      ]
    }];
  }
  // TODO: recordPermissions和_id是右上角按钮需要强依赖的变量，应该写到按钮那边去
  const serviceData = Object.assign({}, amisSchema.data, amisSchemaData, { listName, uiSchema, showDisplayAs, displayAs, recordPermissions: uiSchema.permissions, _id: null, $listviewId: listName });
  return {
    "type": "service",
    "body": body,
    "className": `${className} steedos-object-listview`,
    "data": serviceData
  }
}