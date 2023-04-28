/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-28 11:11:42
 * @Description: 
 */
import { getListSchema, getObjectListHeader, getUISchema, Router } from '@steedos-widgets/amis-lib'
import { keys, pick, difference, find } from 'lodash';

export const AmisObjectListView = async (props) => {
  // console.time('AmisObjectListView')
  console.log(`AmisObjectListView props`, props)
  const { $schema, top, perPage, showHeader=true, data, defaultData, 
      className="", 
      crudClassName, 
      showDisplayAs = false,
      sideSchema,
      columnsTogglable=false,
      filterVisible = true,
      headerToolbarItems} = props;
  let { headerSchema } = props;
  let ctx = props.ctx;
  let listName = defaultData?.listName || data?.listName || props?.listName;
  // console.log('AmisObjectListView ==listName=>', listName)
  let defaults: any = {};
  let objectApiName = props.objectApiName || "space_users"; // 只是为了设计器,才在此处设置了默认值. TODO , 使用其他方式来辨别是否再设计器中
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

  const uiSchema = await getUISchema(objectApiName, false);
  const listView =  find(
    uiSchema.list_views,
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
    // 此次是从 props中 抓取到 用户配置的 crud属性, 此处是一个排除法
    const listSchema = pick(props, schemaKeys);
    // className不传入crud组件，crud单独识别crudClassName属性
    listSchema.className = crudClassName;
    listSchema.onEvent = {}; // 为啥要将一个内置event放在此处?
    listSchema.onEvent[`@data.changed.${objectApiName}`] = {
      "actions": [
        {
          "args": {
            "url": "/app/${appId}/${objectName}/view/${event.data.result.data.recordId}?display=${ls:page_display || 'grid'}&side_object=${objectName}&side_listview_id=${listName}",
            "blank": false
          },
          "actionType": "link",
          "expression": "${!!!event.data.recordId && event.data.__deletedRecord != true && event.data._isRelated != true}" //是新建, 则进入详细页面. 
        },
        {
          "actionType": "reload",
          "expression": "${(event.data.recordId || event.data.__deletedRecord === true || event.data.displayAs === 'split') && event.data._isRelated != true}" //不是新建, 或分栏模式下新建主对象记录, 则刷新列表
        }
      ]
    }
    defaults = {
      listSchema
    };
  }

  let setDataToComponentId = ctx && ctx.setDataToComponentId;
  if(!setDataToComponentId){
    setDataToComponentId = `service_listview_${objectApiName}`;
  }

  const amisSchemaData = Object.assign({}, data, defaultData);
  const listViewId = ctx?.listViewId || amisSchemaData.listViewId;
  const listViewSchemaProps = { 
    top, perPage, showHeader, defaults, ...ctx, listViewId, setDataToComponentId, filterVisible, showDisplayAs, displayAs, headerToolbarItems
  }

  if(!headerSchema){
    headerSchema = getObjectListHeader(uiSchema, listName, ctx); 
  }

  // TODO: recordPermissions和_id是右上角按钮需要强依赖的变量，应该写到按钮那边去
  const serviceData: any = Object.assign({}, { showDisplayAs, displayAs, recordPermissions: uiSchema.permissions, _id: null, $listviewId: listName });
  if(objectApiName){
    serviceData.objectName = objectApiName;
  }
  // console.timeEnd('AmisObjectListView')
  return {
    type: "service",
    data: serviceData,
    className: `${className} sm:bg-gray-100 h-full sm:shadow sm:rounded-tl sm:rounded-tr steedos-object-listview`,
    body: [{
      "type": "wrapper",
      "size": "none",
      "className": "flex flex-1 overflow-hidden h-full",
      body: [
        sideSchema ? {
          "type": "wrapper",
          "size": "none",
          "className": "flex-shrink-0 min-w-[200px] h-full border-r border-gray-200 lg:order-first lg:flex lg:flex-col",
          "body": sideSchema
        } : null,
        {
          "type": "wrapper",
          "size": "none",
          "className": sideSchema ? `flex-1 focus:outline-none lg:order-last w-96 h-full` : 'w-full h-full',
          "body": {
            type: "wrapper",
            className: "p-0 m-0 steedos-object-table h-full flex flex-col",
            body: [
              ...headerSchema, //list view header,
              {
                "type": "service",
                "schemaApi": {
                    "url": "${context.rootUrl}/graphql?listName=${listName}&display=${display}",
                    "method": "post",
                    "messages": {
                    },
                    "headers": {
                        "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                    },
                    "requestAdaptor": "console.log('service listview schemaApi requestAdaptor======>');api.data={query: '{spaces__findOne(id: \"none\"){_id,name}}'};return api;",
                    "adaptor": `
                        console.log('service listview schemaApi adaptor....', api.body); 
                        const { appId, objectName, listName, display, formFactor: defaultFormFactor} = api.body;
                        return new Promise((resolve)=>{
                          const listViewSchemaProps = ${JSON.stringify(listViewSchemaProps)};
                          const formFactor = (["split"].indexOf(display) > -1) ? 'SMALL': defaultFormFactor;
                          listViewSchemaProps.formFactor = formFactor;
                          // console.log("====listViewSchemaProps===>", listViewSchemaProps)
                          window.getListSchema(appId, objectName, listName, listViewSchemaProps).then((schema)=>{
                            payload.data = schema.amisSchema;
                            // console.log("payload================>", payload)
                            resolve(payload)
                          });
                        });
                      `
                },
                // "body": body,
                // "data": serviceData
              }
            ]
          }
        }
      ]
    }
    ]
  }
}