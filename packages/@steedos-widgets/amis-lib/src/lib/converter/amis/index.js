import { getAuthToken , getTenantId, getRootUrl, getSteedosAuth } from '../../steedos.client.js';
import { getReadonlyFormInitApi, getSaveApi, getEditFormInitApi, getBatchDelete } from './api';
import { getTableSchema, getTableApi } from './fields/table';
import { getFormBody } from './form';
import { getListSchema, getCardSchema } from './fields/list';
import _, { map } from 'lodash';
import { defaultsDeep } from '../../defaultsDeep';

function getBulkActions(objectSchema){
    return [
      {
        "type": "button",
        "level": "danger",
        "label": "批量删除",
        "actionType": "ajax",
        "confirmText": "确定要删除吗",
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

function getToolbar(){
    return [
        
      ]
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

export async function getObjectList(objectSchema, fields, options){

    const bulkActions = getBulkActions(objectSchema)

    const bodyProps = {
      toolbar: getToolbar(), 
      footerToolbar: footerToolbar(), 
      headerToolbar: getHeaderToolbar(objectSchema, options.formFactor),
      bulkActions: options.bulkActions != false ? bulkActions : false, 
      bodyClassName: "",
      // filterTogglable: true,
      // filterDefaultVisible: true,
      // filter: getFilter()
    }

    let body = null;
    const id = `listview_${objectSchema.name}`;
    if(options.formFactor === 'SMALL'){
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
        api: await getTableApi(objectSchema, fields, options)}, 
        bodyProps
        );
    }else{
      const table = await getTableSchema(fields, Object.assign({idFieldName: objectSchema.idFieldName, labelFieldName: objectSchema.NAME_FIELD_KEY || 'name'}, options));
      delete table.mode;
      body = Object.assign({}, table, {
        type: 'crud', 
        primaryField: '_id', 
        affixHeader: false,
        id: id,
        name: id,
        keepItemSelectionOnPageChange: true, 
        api: await getTableApi(objectSchema, fields, options)}, 
        bodyProps
        )
    }

    const defaults = options.defaults;
    if (defaults) {
      const listSchema = defaults.listSchema || {};
      body = defaultsDeep({}, listSchema, body);
      const headerSchema = defaults.headerSchema;
      const footerSchema = defaults.footerSchema;
      if (headerSchema || footerSchema) {
        const wrappedBody = [body];
        if (headerSchema) {
          wrappedBody.unshift(headerSchema);
        }
        if (footerSchema) {
          wrappedBody.push(footerSchema);
        }
        body = wrappedBody;
      }
    }

    return {
      type: 'service',
      className: 'border mb-2',
      id: `service_${id}`,
      name: `page`,
      data: {
        context: { rootUrl: getRootUrl(), tenantId: getTenantId(), authToken: getAuthToken() },
        objectName: objectSchema.name,
        _id: null,
        recordPermissions: objectSchema.permissions,
        uiSchema: objectSchema
      },
      body: body
    }
}

const getGlobalData = (mode)=>{
  const user = getSteedosAuth();
  return {mode: mode, user: user, spaceId: user.spaceId, userId: user.userId}
}

export async function getObjectForm(objectSchema, ctx){
    const { recordId, formFactor, layout = formFactor === 'SMALL' ? 'normal' : "horizontal", labelAlign, tabId, appId, defaults } = ctx;
    const fields = _.values(objectSchema.fields);
    const formSchema =  defaults && defaults.formSchema || {};
    const amisSchema =  {
      type: 'service',
      className: 'p-0',
      name: `page_edit_${recordId}`,
      api: await getEditFormInitApi(objectSchema, recordId, fields),
      // data: {global: getGlobalData('edit'), recordId: recordId, objectName: objectSchema.name, context: {rootUrl: getRootUrl(), tenantId: getTenantId(), authToken: getAuthToken()}},
      initApi: null,
      initFetch: null ,
      body: [defaultsDeep({}, formSchema, {
        type: "form",
        mode: layout,
        labelAlign,
        persistData: false,
        promptPageLeave: true,
        name: `form_edit_${recordId}`,
        debug: false,
        title: "",
        submitText: "", // amis 表单不显示提交按钮, 表单提交由项目代码接管
        api: await getSaveApi(objectSchema, recordId, fields, {}),
        initFetch: recordId != 'new',
        body: await getFormBody(fields, objectSchema, ctx),
        panelClassName:'m-0 sm:rounded-lg shadow-none',
        bodyClassName: 'p-0',
        className: 'steedos-amis-form',
        onEvent: {
          "submitSucc": {
            "weight": 0,
            "actions": [
              {
                "componentId": `listview_${objectSchema.name}`,
                "actionType": "reload",
                "expression": "!!listViewId"
              },
              {
                "componentId": `detail_${recordId}`,
                "actionType": "reload",
                "expression": "!!!listViewId"
              },
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
    const { formFactor, layout = formFactor === 'SMALL' ? 'normal' : "horizontal", labelAlign, formInitProps } = ctx;
    const fields = _.values(objectSchema.fields);
    return {
        type: 'service',
        name: `page_readonly_${recordId}`,
        id: `detail_${recordId}`,
        data: {global: getGlobalData('read'), context: {rootUrl: getRootUrl(), tenantId: getTenantId(), authToken: getAuthToken()}},
        api: await getReadonlyFormInitApi(objectSchema, recordId, fields, formInitProps),
        body: [
            {
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
                body: await getFormBody(map(fields, (field)=>{field.readonly = true;}), objectSchema, Object.assign({}, ctx, {showSystemFields: true})),
                className: 'steedos-amis-form bg-white pt-2 px-2',
                actions: [] // 不显示表单默认的提交按钮
            }
        ],
        onEvent: {
          "fetchInited": {
            "weight": 0,
            "actions": [
              {
                "componentId": `${objectSchema.name}_record_detail`,
                "actionType": "setValue",
                "args": {
                  "value": { record: "${event.data}", uiSchema: objectSchema }
                }
              }
            ]
          }
        }
    }
}