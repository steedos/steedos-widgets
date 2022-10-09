import { getAuthToken , getTenantId, getRootUrl, getSteedosAuth } from '../../steedos.client.js';
import { getReadonlyFormInitApi, getSaveApi, getEditFormInitApi, getBatchDelete } from './api';
import { getTableSchema, getTableApi } from './fields/table';
import { getFormBody } from './form';
import { getListSchema, getCardSchema } from './fields/list';
import _, { map } from 'lodash';

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
      body = Object.assign({}, getCardSchema(fields, Object.assign({idFieldName: objectSchema.idFieldName, labelFieldName: objectSchema.NAME_FIELD_KEY || 'name'}, options, {actions: false})), {
        type: 'crud', 
        primaryField: '_id', 
        id: id,
        name: id,
        keepItemSelectionOnPageChange: false, 
        api: await getTableApi(objectSchema, fields, options)}, 
        bodyProps
        );
    }else{
      const table = getTableSchema(fields, Object.assign({idFieldName: objectSchema.idFieldName, labelFieldName: objectSchema.NAME_FIELD_KEY || 'name'}, options));
      delete table.mode;
      body = Object.assign({}, table, {
        type: 'crud', 
        primaryField: '_id', 
        id: id,
        name: id,
        keepItemSelectionOnPageChange: true, 
        api: await getTableApi(objectSchema, fields, options)}, 
        bodyProps
        )
    }

    return {
        type: 'service',
        bodyClassName: '',
        name: `page`,
        data: {context: {rootUrl: getRootUrl(), tenantId: getTenantId(), authToken: getAuthToken()}},
        body: body
    }
}

export async function getRecordDetailHeaderAmisSchema(objectSchema, recordId){
  // console.log('amis==>', objectSchema, recordId)
  const { name,  label , icon } = objectSchema;
  let body = [
    {
      "type": "service",
      "body": [
        {
          "type": "panel",
          "title": "标题",
          "body": [],
          "header": {
            "type": "wrapper",
            "body": [
              {
                "type": "grid",
                "columns": [
                  {
                    "body": [
                      {
                        "type": "grid",
                        "columns": [
                          {
                            "body": {
                              "type": "tpl",
                              "className": "block",
                              "tpl": `<img class='slds-icon slds-icon_container slds-icon-standard-${icon}' src='\${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${icon}.svg'>`
                            },
                            "md": "auto",
                            "className": "",
                            "columnClassName": "flex justify-center items-center"
                          },
                          {
                            "body": [
                              {
                                "type": "tpl",
                                "tpl": `${label}`,
                                "inline": false,
                                "wrapperComponent": "",
                                "style": {
                                  "fontFamily": "",
                                  "fontSize": 13
                                },
                                "className": "leading-none"
                              },
                              {
                                "type": "tpl",
                                "tpl": "${name}",
                                "inline": false,
                                "wrapperComponent": "",
                                "style": {
                                  "fontFamily": "",
                                  "fontSize": 20,
                                  "fontWeight": "bold",
                                  "textAlign": "left"
                                },
                                "className": "leading-none"
                              }
                            ],
                          }
                        ]
                      }
                    ],
                    "md": 9
                  },
                  {
                    "body": []
                  }
                ]
              }
            ],
            "size": "xs"
          },
          "affixFooter": false,
          "headerClassName": "",
          "bodyClassName": "p-none"
        }
      ],
      "messages": {},
      "api": {
        "method": "post",
        "url": "${context.rootUrl}/graphql",
        "headers": {
          "Authorization": "Bearer ${context.tenantId},${context.authToken}"
        },
        "data": {
          "query": `{rows:${name}(filters: ["_id","=","${recordId}"]){_id, name} }`
        },
        "sendOn": `${!!recordId}`,
        "requestAdaptor": "",
        "adaptor": `
          const rows = payload.data.rows;
          let label = null;
          if (rows.length) {
            const objectInfo = rows[0];
            label = objectInfo.name;
          }
          delete payload.rows;
          payload.data = {
            name: label
          }
          return payload;
        `
      }
    }
  ];

  return {
      type: 'service',
      bodyClassName: '',
      name: `page`,
      data: {context: {rootUrl: getRootUrl(), tenantId: getTenantId(), authToken: getAuthToken()}},
      body: body
  }
}

const getGlobalData = (mode)=>{
  const user = getSteedosAuth();
  return {mode: mode, user: user, spaceId: user.spaceId, userId: user.userId}
}

export async function getObjectForm(objectSchema, ctx){
    const { recordId, formFactor, layout, labelAlign, tabId, appId, defaults } = ctx;
    const fields = _.values(objectSchema.fields);
    const formSchema =  defaults && defaults.formSchema || {};
    const amisSchema =  {
      type: 'service',
      className: 'p-0',
      name: `page_edit_${recordId}`,
      data: {global: getGlobalData('edit'), recordId: recordId, objectName: objectSchema.name, context: {rootUrl: getRootUrl(), tenantId: getTenantId(), authToken: getAuthToken()}},
      initApi: null,
      initFetch: null ,
      body: [_.defaultsDeep({}, formSchema, {
        type: "form",
        mode: formFactor === 'SMALL' ? 'normal' : layout,
        labelAlign,
        persistData: false,
        promptPageLeave: true,
        name: `form_edit_${recordId}`,
        debug: false,
        title: "",
        submitText: "", // amis 表单不显示提交按钮, 表单提交由项目代码接管
        api: await getSaveApi(objectSchema, recordId, fields, {}),
        initApi: await getEditFormInitApi(objectSchema, recordId, fields),
        initFetch: recordId != 'new',
        body: await getFormBody(fields, objectSchema, ctx),
        panelClassName:'m-0 sm:rounded-lg shadow-none',
        bodyClassName: 'p-0',
        className: 'p-4 sm:p-0 steedos-amis-form',
      })]
    };
    if(formSchema.id){
      amisSchema.id = `service-${formSchema.id}`;
    }
    return amisSchema;
}

export async function getObjectDetail(objectSchema, recordId, ctx){
    const { formFactor, layout, labelAlign } = ctx;
    const fields = _.values(objectSchema.fields);
    return {
        type: 'service',
        name: `page_readonly_${recordId}`,
        id: `detail_${recordId}`,
        data: {global: getGlobalData('read'), context: {rootUrl: getRootUrl(), tenantId: getTenantId(), authToken: getAuthToken()}},
        api: await getReadonlyFormInitApi(objectSchema, recordId, fields),
        body: [
            {
                type: "form",
                mode: formFactor === 'SMALL' ? 'normal' : layout,
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
                className: 'steedos-amis-form',
                actions: [] // 不显示表单默认的提交按钮
            }
        ]
    }
}