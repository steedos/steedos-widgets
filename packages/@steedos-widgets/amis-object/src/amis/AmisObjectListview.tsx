/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-03 13:09:35
 * @Description: 
 */
import './AmisObjectListview.less';
import { getListSchema, getObjectListHeader, getUISchema, Router, i18next, createObject } from '@steedos-widgets/amis-lib'
import { keys, pick, difference, find, has, first, values } from 'lodash';

export const AmisObjectListView = async (props) => {
  // console.time('AmisObjectListView')
  // console.log(`AmisObjectListView props`, props)
  const { $schema, top, perPage, showHeader=true, data, defaultData, 
      className="", 
      style={},
      crudClassName, 
      showDisplayAs = false,
      sideSchema,
      columnsTogglable=false,
      filterVisible = true,
      headerToolbarItems, rowClassNameExpr, hiddenColumnOperation=false, columns,
      crudDataFilter, onCrudDataFilter, env, rebuildOn, crudMode, requestAdaptor, adaptor} = props;
  let { headerSchema } = props;
  let ctx = props.ctx;
  let crud = props.crud || {};
  let listName = defaultData?.listName || data?.listName || props?.listName;
  // console.log('AmisObjectListView ==listName=>', listName)
  let defaults: any = {};
  let objectApiName = props.objectApiName || "space_users"; // 只是为了设计器,才在此处设置了默认值. TODO , 使用其他方式来辨别是否再设计器中
  if(!ctx){
    ctx = {};
  }
  const uiSchema = await getUISchema(objectApiName, false);
  const displayAs = Router.getTabDisplayAs(objectApiName, uiSchema.enable_split);
  // console.log(`AmisObjectListView`, 'displayAs===>', displayAs, objectApiName, data)
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

  // 分栏模式不应该改变尺寸变量值
  // if(["split"].indexOf(displayAs) > -1){
  //   formFactor = 'SMALL';
  // }

  if(!ctx.formFactor){
    ctx.formFactor = formFactor;
  }

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
      "body": `${i18next.t('frontend_listview_warning_start')}${listName}${i18next.t('frontend_listview_warning_end')}`,
      "level": "warning",
      "showIcon": true,
      "className": "mb-3"
    }
  }

  listName = listView.name;
  if (crudMode) {
    // 把crudMode属性传入到crud.mode属性值中
    // 如果只配置了crudMode属性，则后续内核代码会自动生成对应mode的默认属性值，比如card,listItem
    // 这样可以省去手动配置crud.card或crud.listItem属性的时间提高开发效率
    crud = Object.assign({
      mode: crudMode
    }, crud);
  }

  if (!(ctx && ctx.defaults)) {
    // 支持把crud组件任意属性通过listSchema属性传入到底层crud组件中
    const schemaKeys = difference(keys($schema), ["type", "showHeader","id", 
      "crud", "crudDataFilter", "onCrudDataFilter", "env", "rebuildOn", "crudMode"]);
    // 此次是从 props中 抓取到 用户配置的 crud属性, 此处是一个排除法
    const listSchema = pick(props, schemaKeys);
    // className不传入crud组件，crud单独识别crudClassName属性
    listSchema.className = crudClassName;
    listSchema.onEvent = {}; // 为啥要将一个内置event放在此处?
    // 下面expression中_isRelated参数判断的是列表视图分栏模式下，新建、编辑、删除相关子表记录时不应该刷新左侧（主表）列表视图组件
    listSchema.onEvent[`@data.changed.${objectApiName}`] = {
      "actions": [
        {
          "args": {
            "link": "/app/${appId}/${objectName}/view/${event.data.result.data.recordId}?side_object=${objectName}&side_listview_id=${listName}",
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
    //触发amis crud 高度重算
    listSchema.onEvent["selectedChange"] = {
      "actions": [
        {
          "actionType": "broadcast",
          "args": {
            "eventName": `@height.changed.${objectApiName}`,
          },
          "data": {
            "timeOut": 500
          }
        }
      ]
    }
    defaults = {
      listSchema: Object.assign( {}, listSchema, crud )
    };
  }

  let setDataToComponentId = ctx && ctx.setDataToComponentId;
  if(!setDataToComponentId){
    setDataToComponentId = `service_listview_${objectApiName}`;
  }

  const amisSchemaData = Object.assign({}, data, defaultData);
  const listViewId = ctx?.listViewId || amisSchemaData.listViewId;
  const allData = createObject(data, defaultData);
  const listViewSchemaProps = { 
    top, perPage, defaults, ...ctx, listViewId, setDataToComponentId, filterVisible, showDisplayAs, displayAs, 
    headerToolbarItems, rowClassNameExpr, hiddenColumnOperation, columns,
    crudDataFilter, onCrudDataFilter, amisData: allData, env, requestAdaptor, adaptor
  }

  if(!headerSchema){
    headerSchema = getObjectListHeader(uiSchema, listName, ctx); 
  }

  headerSchema.className = "steedos-object-listview-header " + headerSchema.className || "";

  // TODO: recordPermissions和_id是右上角按钮需要强依赖的变量，应该写到按钮那边去
  const serviceData: any = Object.assign({}, { showDisplayAs, displayAs, recordPermissions: uiSchema.permissions, _id: null, $listviewId: listName, isObjectListview: true });
  if(has(props, 'objectApiName')){
    serviceData.objectName = objectApiName;
  }
  if(has(props, 'listName') && has(props, '$$editor')){
    serviceData.listName = listName;
  }
  if(!has(data, 'uiSchema')){
    serviceData.uiSchema = uiSchema;
  }

  serviceData.defaultListName = listName ? listName : first(values(uiSchema.list_views))?.name
  if(!showHeader){
    headerSchema = {};
  }
  // console.timeEnd('AmisObjectListView')
  // console.log('serviceData===>', serviceData)
  // console.log('headerSchema===>',headerSchema)
  return {
    type: "service",
    data: {
      defaultListName: listName ? listName : first(values(uiSchema.list_views))?.name,
      recordPermissions: uiSchema.permissions
    },
    style: style,
    className: `${className} sm:bg-gray-50 h-full  steedos-object-listview ${displayAs === 'split'? 'sm:border-r':'sm:border-r'}`,
    body: [{
      "type": "wrapper",
      "size": "none",
      "className": "flex flex-1 h-full",
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
            className: "p-0 m-0 steedos-object-listview-content-wrapper h-full flex flex-col",
            body: [
              ...headerSchema, //list view header,
              {
                "type": "service",
                "id": "service_schema_api_" + objectApiName,
                "className": " steedos-object-listview-content md:overflow-auto grow",//这里加grow是因为crud card模式下底部会有灰色背影
                "schemaApi": {
                    // 这里url上加objectApiName属性是因为设计器中切换对象时不会变更列表视图界面，不可以用objectName=${objectName}使用作用域中objectName变量是因为设计器那边不会监听识别data变化来render组件
                    "url": "${context.rootUrl}/graphql?objectName=" + objectApiName + "&listName=${listName}&display=${display}&rebuildOn=" + rebuildOn,
                    "method": "post",
                    "messages": {
                    },
                    "headers": {
                        "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                    },
                    "requestAdaptor": "api.data={query: '{spaces__findOne(id: \"none\"){_id,name}}'};return api;",
                    "adaptor": `
                        console.log('service listview schemaApi adaptor....', api, context); 
                        let { appId, objectName, defaultListName: listName, display, formFactor: defaultFormFactor, uiSchema} = api.body;
                        if(api.body.listName){
                          listName = api.body.listName;
                        }
                        const listView = _.find(
                          uiSchema.list_views,
                          (listView, name) => {
                              // 传入listViewName空值则取第一个
                              if(!listName){
                                listName = name;
                              }
                              return name === listName || listView._id === listName;
                          }
                        );
                        return new Promise((resolve)=>{
                          const listViewSchemaProps = ${JSON.stringify(listViewSchemaProps)};
                          const formFactor = (["split"].indexOf(display) > -1) ? 'SMALL': defaultFormFactor;
                          listViewSchemaProps.formFactor = formFactor;
                          listViewSchemaProps.displayAs = display;
                          console.log("====listViewSchemaProps===>", listName, display, listViewSchemaProps)
                          const crud_mode = listView.crud_mode;
                          if(crud_mode){
                            if(!listViewSchemaProps.defaults.listSchema.mode){
                              // 这里优先认微页面中为列表视图组件配置的crudMode及crud.mode属性，
                              // 只有组件中未配置该属性时才取元数据中为当前列表视图配置的crud_mode属性作为crud的mode值
                              // 不优先认各个列表视图元数据中的配置，是因为在界面上新建编辑列表视图时，crud_mode字段值默认值是table，这会让微页面中列表视图组件中配置的crudMode及crud.mode属性值不生效
                              // 如果想优先认各个列表视图元数据中的配置，只要把微页面中列表视图组件的crudMode及crud.mode属性值清除即可
                              listViewSchemaProps.defaults.listSchema.mode = crud_mode;
                            }
                          }
                          window.getListSchema(appId, objectName, listName, listViewSchemaProps).then((schema)=>{
                            try{
                              const uiSchema = schema.uiSchema;
                              const listView = _.find(
                                uiSchema.list_views,
                                (listView, name) => {
                                    // 传入listViewName空值则取第一个
                                    if(!listName){
                                      listName = name;
                                    }
                                    return name === listName || listView._id === listName;
                                }
                              );
                              if(listView){
                                window.Steedos && window.Steedos.setDocumentTitle && window.Steedos.setDocumentTitle({pageName: listView.label || listView.name})
                              }
                            }catch(e){
                              console.error(e)
                            }
                            console.log('schema.amisSchema====>', schema.amisSchema)
                            payload.data = schema.amisSchema;
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