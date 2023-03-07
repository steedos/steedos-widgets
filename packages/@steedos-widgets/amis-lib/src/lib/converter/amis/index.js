import { getAuthToken , getTenantId, getRootUrl, getSteedosAuth } from '../../steedos.client.js';
import { getReadonlyFormInitApi, getSaveApi, getEditFormInitApi, getBatchDelete } from './api';
import { getTableSchema, getTableApi } from './fields/table';
import { getFormBody } from './form';
import { getListSchema, getCardSchema } from './fields/list';
import _, { map } from 'lodash';
import { defaultsDeep } from '../../defaultsDeep';
import { getObjectHeaderToolbar, getObjectFooterToolbar, getObjectFilter } from './toolbar';
function getBulkActions(objectSchema){
    return [
      {
        "type": "button",
        "level": "danger",
        "label": "批量删除",
        "actionType": "ajax",
        "confirmText": "确定要删除吗",
        "className": "hidden",
        "id": "batchDelete",
        "api": getBatchDelete(objectSchema.name),
      }
        // {
        //   "label": "批量修改",
        //   "actionType": "dialog",
        //   "dialog": {
        //     "title": "批量编辑",
        //     "name": "sample-bulk-edit",
        //     "body": {
        //       "type": "form",
        //       "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample/bulkUpdate2",
        //       "controls": [
        //         {
        //           "type": "hidden",
        //           "name": "ids"
        //         },
        //         {
        //           "type": "text",
        //           "name": "name",
        //           "label": "Name"
        //         }
        //       ]
        //     }
        //   }
        // }
      ]
}

function getHeaderToolbar(mainObject, formFactor){

  if(formFactor === 'SMALL'){
    return [
      "bulkActions",
      {
          "type": "reload",
          "align": "right"
      },
      {
        "type": "search-box",
        "align": "right",
        "name": "__keywords",
        "placeholder": "请输入关键字",
        "mini": true
      }
  ]
  }else{
    return [
      "filter-toggler",
      "bulkActions",
      // {
      //     "type": "export-excel",
      //     "align": "right"
      // },
      // {
      //     "type": "reload",
      //     "align": "right"
      // },
      // {
      //     "type": "columns-toggler",
      //     "align": "right"
      // },
      {
        "type": "search-box",
        "align": "right",
        "name": "__keywords",
        "placeholder": "请输入关键字",
        "mini": true
      },
      // {
      //     "type": "drag-toggler",
      //     "align": "right"
      // },
      // {
      //     "type": "pagination",
      //     "align": "right"
      // }
  ]
  }


    
}


function footerToolbar(){
    return [
        "statistics",
        // "switch-per-page",
        "pagination"
      ]
}

function getFilter(){
    return {
        "title": "条件搜索",
        "submitText": "",
        "body": [
          {
            "type": "input-text",
            "name": "name",
            "placeholder": "合同名称",
            "addOn": {
              "label": "搜索",
              "type": "submit"
            }
          }
        ]
      }
}

export async function getObjectCRUD(objectSchema, fields, options){
    const { top, perPage, showDisplayAs = false, displayAs, crudClassName = "" } = options;
    const nonpaged = objectSchema.paging && objectSchema.paging.enabled === false;
    const isTreeObject = objectSchema.enable_tree;
    const bulkActions = getBulkActions(objectSchema)

    const bodyProps = {
      // toolbar: getToolbar(),
      // headerToolbar: getObjectHeaderToolbar(objectSchema, options.formFactor, {showDisplayAs}),
      headerToolbarClassName: "px-4 py-2 border-gray-300 bg-gray-100 border-solid border-b",
      footerToolbar: getObjectFooterToolbar(objectSchema, options.formFactor, {
        disableStatistics: options.queryCount === false
      }), 
    }
    if(options.formFactor !== 'SMALL'){
      Object.assign(bodyProps, {
        filter: !!options.filterVisible && await getObjectFilter(objectSchema, fields, options),
        bulkActions: options.bulkActions != false ? bulkActions : false
      });
    }
    // yml里配置的 不分页和enable_tree:true 优先级最高，组件中输入的top次之。
    options.queryCount = true;
    if(nonpaged || isTreeObject){
      options.top = 50000;
      bodyProps.footerToolbar = [];
      options.queryCount = true; // 禁止翻页的时候, 需要查找总数
    }else if(top){
      bodyProps.footerToolbar = [];
      options.queryCount = false;
    }

    bodyProps.headerToolbar = getObjectHeaderToolbar(objectSchema, options.formFactor, {showDisplayAs, hiddenCount: options.queryCount === false});


    let body = null;
    const id = `listview_${objectSchema.name}`;
    if(options.formFactor === 'SMALL' && false){
      delete bodyProps.bulkActions;
      delete bodyProps.headerToolbar;
      delete bodyProps.footerToolbar;
      const card = await getCardSchema(fields, Object.assign({idFieldName: objectSchema.idFieldName, labelFieldName: objectSchema.NAME_FIELD_KEY || 'name'}, options, {actions: false}));
      body = Object.assign({}, card , {
        type: 'crud', 
        primaryField: '_id', 
        id: id,
        name: id,
        keepItemSelectionOnPageChange: false, 
        api: await getTableApi(objectSchema, fields, options),
        hiddenOn: options.tableHiddenOn,
        }, 
        bodyProps
        );
    }else{
      let labelFieldName = objectSchema.NAME_FIELD_KEY || 'name';
      // organizations 对象的历史遗留问题, fullname 被标记为了 名称字段. 在此处特殊处理.
      if(objectSchema.name === 'organizations'){
        labelFieldName = 'name';
      }
      const table = await getTableSchema(fields, Object.assign({idFieldName: objectSchema.idFieldName, labelFieldName: labelFieldName}, options));
      delete table.mode;

      body = Object.assign({}, table, {
        type: 'crud', 
        primaryField: '_id', 
        affixHeader: false,
        id: id,
        name: id,
        keepItemSelectionOnPageChange: true, 
        api: await getTableApi(objectSchema, fields, options),
        hiddenOn: options.tableHiddenOn,
        autoFillHeight: false,
        className: `flex-auto ${crudClassName || ""}`,
        crudClassName: crudClassName,
      }, 
        bodyProps,
        )
    }

    const defaults = options.defaults;
    if (defaults) {
      const listSchema = defaults.listSchema || {};
      body = defaultsDeep({}, listSchema, body);
      const headerSchema = defaults.headerSchema;
      const footerSchema = defaults.footerSchema;
      const sideSchema = defaults.sideSchema;
      if (sideSchema) {
        body = {
          "type": "wrapper",
          "size": "none",
          "className": "flex",
          "body": [
            {
              "type": "wrapper",
              "size": "none",
              // "className": "border-r border-slate-300 border-solid w-72 bg-white",
              // "visibleOn": `${displayAs === "split_three"}`,
              "body": sideSchema
            }, 
            body
          ]
        };
      }
      if (headerSchema || footerSchema) {
        let wrappedBody = [body];
        if (headerSchema) {
          if(_.isArray(headerSchema)){
            wrappedBody = _.union(headerSchema,wrappedBody);
          }
          else{
            wrappedBody.unshift(headerSchema);
          }
        }
        if (footerSchema) {
          if(_.isArray(footerSchema)){
            wrappedBody = _.union(wrappedBody,footerSchema);
          }
          else{
            wrappedBody.push(footerSchema);
          }
        }
        body = wrappedBody;
      }
    }

    // TODO: data应该只留loaded，其他属性都改为从上层传递下来
    return {
      type: 'service',
      className: '',
      id: `service_${id}`,
      name: `page`,
      data: {
        "$master": '$$',
        objectName: objectSchema.name,
        _id: null,
        recordPermissions: objectSchema.permissions,
        uiSchema: objectSchema,
        loaded: false //crud接收适配器中设置为true，否则就是刷新浏览器第一次加载
      },
      body: body
    }
}

const getGlobalData = (mode)=>{
  const user = getSteedosAuth();
  return {mode: mode, user: user, spaceId: user.spaceId, userId: user.userId}
}

const getFormFields = (objectSchema, formProps)=>{
  // console.log(`getFormFields`, objectSchema, formProps)
  const { fields: objectFields } = objectSchema;
  
  const { fields: formFields } = formProps;
  
  if(!formFields){
    const fieldsArr = [];
    _.forEach(objectSchema.fields, (field, fieldName)=>{
      if(!lodash.has(field, "name")){
        field.name = fieldName
      }
      fieldsArr.push(field)
    });
    return fieldsArr;
  }

  const fields = [];

  _.each(formFields, (item)=>{
    if(item && item.name){
      fields.push(Object.assign({}, objectFields[item.name], item))
    }
  })
  return fields;
}

export async function getObjectForm(objectSchema, ctx){
    const { recordId, formFactor, layout = formFactor === 'SMALL' ? 'normal' : "normal", labelAlign, tabId, appId, defaults } = ctx;
    const fields = _.values(objectSchema.fields);
    const formFields = getFormFields(objectSchema, ctx);
    const formSchema =  defaults && defaults.formSchema || {};
    if(_.has(formSchema, 'className')){
      formSchema.className = 'steedos-amis-form'
    }
    const amisSchema =  {
      type: 'service',
      className: 'p-0',
      name: `page_edit_${recordId}`,
      api: await getEditFormInitApi(objectSchema, recordId, fields),
      data:{
        editFormInited: false
      },
      // data: {global: getGlobalData('edit'), recordId: recordId, objectName: objectSchema.name, context: {rootUrl: getRootUrl(), tenantId: getTenantId(), authToken: getAuthToken()}},
      initApi: null,
      initFetch: null ,
      body: [defaultsDeep({}, formSchema, {
        type: "form",
        mode: layout,
        data: {
          "&": "${initialValues}"
        },
        labelAlign,
        persistData: false,
        promptPageLeave: true,
        canAccessSuperData: false,
        name: `form_edit_${recordId}`,
        debug: false,
        title: "",
        submitText: "", // amis 表单不显示提交按钮, 表单提交由项目代码接管
        api: await getSaveApi(objectSchema, recordId, fields, {}),
        initFetch: recordId != 'new',
        body: await getFormBody(fields, formFields, ctx),
        panelClassName:'m-0 sm:rounded-lg shadow-none',
        bodyClassName: 'p-0',
        className: 'steedos-amis-form',
        hiddenOn: "${editFormInited != true}",
        onEvent: {
          "submitSucc": {
            "weight": 0,
            "actions": [
              {
                "actionType": "broadcast",
                "args": {
                  "eventName": `@data.changed.${objectSchema.name}`
                },
                "data": {
                  "objectName": `${objectSchema.name}`
                }
              }
            ]
          }
        }
      })]
    };
    if(formSchema.id){
      amisSchema.id = `service-${formSchema.id}`;
    }
    return amisSchema;
}

export async function getObjectDetail(objectSchema, recordId, ctx){
    const { formFactor, layout = formFactor === 'SMALL' ? 'normal' : "normal", labelAlign, formInitProps } = ctx;
    const fields = _.values(objectSchema.fields);
    const formFields = getFormFields(objectSchema, ctx);
    const serviceId = `detail_${recordId}`;
    return {
        type: 'service',
        name: `page_readonly_${recordId}`,
        id: serviceId,
        data: {global: getGlobalData('read'), context: {rootUrl: getRootUrl(), tenantId: getTenantId(), authToken: getAuthToken()}},
        api: await getReadonlyFormInitApi(objectSchema, recordId, fields, formInitProps),
        body: [
          {
            "type": "wrapper",   //form 的 hiddenOn 会导致 form onEvent 异常, 使用wrapper包裹一次form,并在wrapper上控制显隐
            hiddenOn: "${recordLoaded != true}",
            "className": "p-0 m-0",
            "body": {
              type: "form",
              mode: layout,
              labelAlign,
              persistData: false,
              promptPageLeave: false,
              name: `form_readonly_${recordId}`,
              debug: false,
              title: "",
              data: {
                "formData": "$$"
              },
              wrapWithPanel: false, 
              body: await getFormBody(map(fields, (field)=>{field.readonly = true; return field;}), formFields, Object.assign({}, ctx, {showSystemFields: true})),
              className: 'steedos-amis-form bg-white',
              actions: [], // 不显示表单默认的提交按钮
              onEvent: {
                [`@data.changed.${objectSchema.name}`]: {  // 由于amis service 组件的 onEvent 存在bug ,此处借助form来刷新 上层 service https://github.com/baidu/amis/issues/6294
                  "actions": [
                    {
                      "actionType": "reload",
                      "componentId": serviceId,
                      "expression": "this.__deletedRecord != true"
                    },
                    {
                      "args": {
                        "url": "/app/${appId}/${objectName}/grid/${side_listview_id}",
                        "blank": false
                      },
                      "actionType": "link",
                      "expression": "this.__deletedRecord === true"
                    }
                  ]
                }
              }
          },
          }
        ],
        onEvent: {
          "fetchInited": {
            "weight": 0,
            "actions": [
              {
                actionType: 'broadcast',
                eventName: "recordLoaded",
                args: {
                  eventName: "recordLoaded"
                },
                data: {
                  record: "${event.data}"
                }
              },
              {
                "actionType": "setValue",
                "args": {
                   value: {
                    "recordLoaded": true,
                   }
                }
            }
            ]
          }
        }
    }
}