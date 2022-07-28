import { getAuthToken , getTenantId } from '@/lib/steedos.client.js';
import { getReadonlyFormInitApi, getSaveApi, getEditFormInitApi, getBatchDelete } from '@/lib/converter/amis/api';
import { getTableSchema, getTableApi } from '@/lib/converter/amis/fields/table';
import { getFormBody } from '@/lib/converter/amis/form';
import { getListSchema } from '@/lib/converter/amis/fields/list';
import { map } from 'lodash';

const ROOT_URL = process.env.NEXT_PUBLIC_STEEDOS_ROOT_URL

function getBulkActions(objectSchema){
    return [
      {
        "type": "button",
        "level": "danger",
        "label": "批量删除",
        "actionType": "ajax",
        "confirmText": "确定要删除吗",
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
      // "filter-toggler",
      "bulkActions",
      {
          "type": "export-excel",
          "align": "right"
      },
      {
          "type": "reload",
          "align": "right"
      },
      {
          "type": "columns-toggler",
          "align": "right"
      },
      {
        "type": "search-box",
        "align": "right",
        "name": "__keywords",
        "placeholder": "请输入关键字",
        "mini": true
      },
      {
          "type": "drag-toggler",
          "align": "right"
      },
      {
          "type": "pagination",
          "align": "right"
      }
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
        "switch-per-page",
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

export function getObjectList(objectSchema, fields, options){
    
    const bulkActions = getBulkActions(objectSchema)

    const bodyProps = {
      toolbar: getToolbar(), 
      footerToolbar: footerToolbar(), 
      headerToolbar: getHeaderToolbar(objectSchema, options.formFactor),
      bulkActions: bulkActions, 
      // filter: getFilter()
    }

    let body = null;
    const id = `listview_${objectSchema.name}`;
    if(options.formFactor === 'SMALL'){
      body = Object.assign({}, getListSchema(fields, options), {
        type: 'crud', 
        primaryField: '_id', 
        id: id,
        keepItemSelectionOnPageChange: true, 
        api: getTableApi(objectSchema, fields, options)}, 
        bodyProps
        );
    }else{
      const table = getTableSchema(fields, Object.assign({idFieldName: objectSchema.idFieldName, labelFieldName: objectSchema.NAME_FIELD_KEY || 'name'}, options));
      delete table.mode;
      body = Object.assign({}, table, {
        type: 'crud', 
        primaryField: '_id', 
        id: id,
        keepItemSelectionOnPageChange: true, 
        api: getTableApi(objectSchema, fields, options)}, 
        bodyProps
        )
    }

    return {
        type: 'page',
        bodyClassName: 'bg-white sm:rounded-lg',
        name: `page_list_${objectSchema.name}`,
        data: {context: {rootUrl: ROOT_URL, tenantId: getTenantId(), authToken: getAuthToken()}},
        body: body
    }
}

export async function getObjectForm(objectSchema, ctx){
    const { recordId, tabId, appId } = ctx;
    const fields = _.values(objectSchema.fields);
    return {
        type: 'page',
        bodyClassName: '',
        regions: [
            "body"
        ],
        name: `page_edit_${recordId}`,
        data: {recordId: recordId, objectName: objectSchema.name, context: {rootUrl: ROOT_URL, tenantId: getTenantId(), authToken: getAuthToken()}},
        initApi: null,
        initFetch: null ,
        body: [
            {
                type: "form",
                mode: "horizontal",
                persistData: false,
                promptPageLeave: true,
                name: `form_edit_${recordId}`,
                debug: false,
                title: "",
                api: getSaveApi(objectSchema, recordId, fields, {}),
                initApi: getEditFormInitApi(objectSchema, recordId, fields),
                initFetch: recordId != 'new',
                body: await getFormBody(fields, objectSchema, ctx),
                panelClassName:'m-0 sm:rounded-lg',
                bodyClassName: 'p-0',
                className: 'p-4 sm:p-0 steedos-amis-form',
                redirect: `/app/${appId}/${tabId}/view/\${recordId}`
            }
        ]
    }
}

export async function getObjectDetail(objectSchema, recordId, ctx){
    const fields = _.values(objectSchema.fields);
    return {
        type: 'page',
        bodyClassName: '', //p-0
        regions: [
            "body"
        ],
        name: `page_readonly_${recordId}`,
        data: {context: {rootUrl: ROOT_URL, tenantId: getTenantId(), authToken: getAuthToken()}},
        initApi: getReadonlyFormInitApi(objectSchema, recordId, fields),
        initFetch: true ,
        body: [
            {
                type: "form",
                mode: "horizontal",
                persistData: false,
                promptPageLeave: false,
                name: `form_readonly_${recordId}`,
                debug: false,
                title: "",
                body: await getFormBody(map(fields, (field)=>{field.readonly = true;}), objectSchema, ctx),
                panelClassName:'m-0 sm:rounded-lg',
                bodyClassName: 'p-0',
                className: 'p-4 sm:p-0 steedos-amis-form',
                actions: [] // 不显示表单默认的提交按钮
            }
        ]
    }
}