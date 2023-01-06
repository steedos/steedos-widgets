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
    const { top, perPage } = options;
    const nonpaged = objectSchema.paging && objectSchema.paging.enabled === false;
    const bulkActions = getBulkActions(objectSchema)

    const bodyProps = {
      toolbar: getToolbar(),
      bodyClassName: "",
      className: `${options.className || ""}`
    }
    if(options.formFactor !== 'SMALL'){
      Object.assign(bodyProps, {
        headerToolbar: getObjectHeaderToolbar(objectSchema, options.formFactor),
        footerToolbar: getObjectFooterToolbar(), 
        filter: !!options.filterVisible && await getObjectFilter(objectSchema, fields, options),
        headerToolbarClassName: "px-4 py-2 border-gray-300 bg-gray-100 b-b",
        bulkActions: options.bulkActions != false ? bulkActions : false
      });
    }
    if(top || perPage){
      if(top){
        bodyProps.footerToolbar = [];
      }
    }else{
      if(nonpaged){
        options.top = 1000;
        bodyProps.footerToolbar = [];
      }
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
        api: await getTableApi(objectSchema, fields, options),
        hiddenOn: options.tableHiddenOn,
        }, 
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
        api: await getTableApi(objectSchema, fields, options),
        hiddenOn: options.tableHiddenOn,
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

export async function getObjectForm(objectSchema, ctx){
    const { recordId, formFactor, layout = formFactor === 'SMALL' ? 'normal' : "horizontal", labelAlign, tabId, appId, defaults } = ctx;
    const fields = _.values(objectSchema.fields);
    const formSchema =  defaults && defaults.formSchema || {};
    const onSubmitSuccCustomScript = `
      const { recordId, listViewId } = context.props.data;
      const data = event.data;
      const appId = data.appId;
      const objectName = data.objectName;
      // 在记录详细界面时isRecordDetail为true
      // TODO: isRecordDetail这个判断需要优化
      const isRecordDetail = !!data.$master && data.$master.$master?.recordId;
      if(recordId){
        // 编辑记录时，刷新主表单
        doAction({
          componentId: \`detail_\${recordId}\`,
          actionType: "reload",
          expression: \`!\${listViewId}\`
        });
      }
      else if(!isRecordDetail){
        // 在列表视图界面新建记录时跳转到详细页面
        const listName = event.data.listName;
        const uiSchema = event.data.uiSchema;
        const listView = uiSchema && uiSchema.list_views[listName];
        const newRecordId = data.result.data?.recordId;
        doAction({
          "args": {
            "url": "/app/" + appId + "/" + objectName + "/view/" + newRecordId,
            "blank": false
          },
          "actionType": "link"
        });
      }
    `;
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
                "actionType": "custom",
                "script": onSubmitSuccCustomScript
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
                body: await getFormBody(map(fields, (field)=>{field.readonly = true; return field;}), objectSchema, Object.assign({}, ctx, {showSystemFields: true})),
                className: 'steedos-amis-form bg-white',
                actions: [], // 不显示表单默认的提交按钮
                hiddenOn: "${recordLoaded != true}"
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