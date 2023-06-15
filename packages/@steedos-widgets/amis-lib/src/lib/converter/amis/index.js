import { getAuthToken , getTenantId, getRootUrl, getSteedosAuth } from '../../steedos.client.js';
import { getReadonlyFormInitApi, getSaveApi, getEditFormInitApi, getBatchDelete } from './api';
import { getTableSchema, getTableApi } from './fields/table';
import { getFormBody } from './form';
import { getListSchema, getCardSchema } from './fields/list';
import _, { map } from 'lodash';
import { defaultsDeep } from '../../defaultsDeep';
import { getObjectHeaderToolbar, getObjectFooterToolbar, getObjectFilter } from './toolbar';
import { i18next } from "../../../i18n"
function getBulkActions(objectSchema){
    return [
      {
        "type": "button",
        "level": "danger",
        "label": "批量删除",
        "actionType": "ajax",
        "confirmText": i18next.t('frontend_delete_many_confirm_text'),
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
    // console.time('getObjectCRUD');
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
      filter: options.filterVisible !== false && await getObjectFilter(objectSchema, fields, options),
    };
    if(options.formFactor !== 'SMALL' || ["split"].indexOf(options.displayAs) == -1){
      Object.assign(bodyProps, {
        bulkActions: options.bulkActions != false ? bulkActions : false
      });
    }
    // yml里配置的 不分页和enable_tree:true 优先级最高，组件中输入的top次之。
    options.queryCount = true;
    if(nonpaged || isTreeObject){
      options.top = 5000;
      bodyProps.footerToolbar = [];
      options.queryCount = true; // 禁止翻页的时候, 需要查找总数
    }else if(top){
      bodyProps.footerToolbar = [];
      if(options.isRelated){
        options.queryCount = true;
      }else{
        options.queryCount = false;
      }
    }
    // console.log(`getObjectHeaderToolbar====2===>`, options.filterVisible)
    bodyProps.headerToolbar = getObjectHeaderToolbar(objectSchema, options.formFactor, {
      showDisplayAs, 
      hiddenCount: options.queryCount === false, 
      headerToolbarItems: options.headerToolbarItems,
      filterVisible: options.filterVisible
    });


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
      const table = await getTableSchema(fields, Object.assign({idFieldName: objectSchema.idFieldName, labelFieldName: labelFieldName, permissions:objectSchema.permissions,enable_inline_edit:objectSchema.enable_inline_edit}, options));
      delete table.mode;
      //image与avatar需要在提交修改时特别处理
      const imageNames = _.compact(_.map(_.filter(fields, (field) => ["image","avatar"].includes(field.type)), 'name'));
      const quickSaveApiRequestAdaptor = `
        var graphqlOrder = "";
        var imageNames = ${JSON.stringify(imageNames)};
        api.data.rowsDiff.forEach(function (item, index) {
          for(key in item){
            if(_.includes(imageNames, key)){
              if(typeof item[key] == "string"){
                const match = item[key].match(/\\/([^\\/]+)$/);
                item[key] = match && match.length > 1?match[1]:"";
              }else{
                item[key] = _.map(item[key], function(ele){
                  const match = ele.match(/\\/([^\\/]+)$/);
                  return match && match.length > 1?match[1]:"";
                })
              }
            }
          }
          const itemOrder = 'update' + index + ':' + api.data.objectName + '__update(id:"' + item._id + '", doc:' + JSON.stringify(JSON.stringify(_.omit(item, '_id'))) + ') {_id}';
          graphqlOrder += itemOrder;
        })
        graphqlOrder = 'mutation {' + graphqlOrder + '}';
        return {
            ...api,
            data: {
                query: graphqlOrder
            }
        }
      `

      body = Object.assign({}, table, {
        type: 'crud', 
        primaryField: '_id', 
        affixHeader: false,
        id: id,
        name: id,
        keepItemSelectionOnPageChange: true, 
        api: await getTableApi(objectSchema, fields, options),
        hiddenOn: options.tableHiddenOn,
        autoFillHeight: options.isRelated ? false : true,
        className: `flex-auto ${crudClassName || ""}`,
        bodyClassName: "bg-white",
        crudClassName: crudClassName,
        quickSaveApi: {
          url: `\${context.rootUrl}/graphql`,
          method: "post",
          dataType: "json",
          headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}",
          },
          requestAdaptor: quickSaveApiRequestAdaptor,
        },
        rowClassNameExpr: options.rowClassNameExpr
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
    // console.timeEnd('getObjectCRUD');
    // TODO: data应该只留loaded，其他属性都改为从上层传递下来
    return {
      type: 'service',
      className: '',
      id: `service_${id}`,
      name: `page`,
      data: {
        objectName: objectSchema.name,
        // _id: null,
        recordPermissions: objectSchema.permissions,
        uiSchema: objectSchema,
        // loaded: false //crud接收适配器中设置为true，否则就是刷新浏览器第一次加载
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
  /**
   * fieldsExtend: 重写字段定义
   * fields: 包含的字段
   * excludedFields: 排除的字段
   */
  const { fieldsExtend, fields: includedFields, excludedFields } = formProps;
  
  let fields = {};
  // 以uiSchema fields  为基础, 遍历字段, 并更新字段定义
  _.forEach(objectSchema.fields, (field, fieldName)=>{
    if(!lodash.has(field, "name")){
      field.name = fieldName
    }
    if(fieldsExtend && fieldsExtend[fieldName]){
      fields[field.name] = Object.assign({}, field, fieldsExtend[fieldName], {name: field.name})
    }else{
      fields[field.name] = field
    }
  });

  if(!_.isEmpty(includedFields) && _.isArray(includedFields)){
    const includedFieldsMap = {}
    _.each(includedFields, (fName, index)=>{
      if(fields[fName]){
        includedFieldsMap[fName] = Object.assign({}, fields[fName], {sort_no: index})
      }
    })
    fields = includedFieldsMap
  }

  if(!_.isEmpty(excludedFields) && _.isArray(excludedFields)){
    _.each(excludedFields, (fName)=>{
      delete fields[fName]
    })
  }

  return lodash.sortBy(_.values(fields), "sort_no");
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
      api: await getEditFormInitApi(objectSchema, recordId, fields, ctx),
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
        resetAfterSubmit: true,
        preventEnterSubmit: true,
        promptPageLeave: true,
        canAccessSuperData: false,
        name: `form_edit_${recordId}`,
        debug: false,
        title: "",
        submitText: "", // amis 表单不显示提交按钮, 表单提交由项目代码接管
        api: await getSaveApi(objectSchema, recordId, fields, ctx),
        initFetch: recordId != 'new',
        body: await getFormBody(fields, formFields, ctx),
        panelClassName:'m-0 sm:rounded-lg shadow-none border-none',
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
                  "objectName": `${objectSchema.name}`,
                  "displayAs": "${displayAs}"
                }
              },
              {
                "actionType": "broadcast",
                "args": {
                  "eventName": "@data.changed.${_master.objectName}"
                },
                "data": {
                  "objectName": "${_master.objectName}",
                  "_isRelated": "${_isRelated || _master._isRelated}"
                },
                "expression": `\${_master.objectName != '${objectSchema.name}' && _master.objectName}`
              },
              // {
              //   "actionType": "custom",
              //   "script": "debugger;"
              // },
              // {
              //   "args": {},
              //   "actionType": "closeDialog"
              // }
            ]
          }
        }
      })]
    };
    if(formSchema.id){
      amisSchema.id = `service-${formSchema.id}`;
    }else{
      amisSchema.id = `new-${objectSchema.name}`;
    }
    return amisSchema;
}

export async function getObjectDetail(objectSchema, recordId, ctx){
    const { formFactor, layout = formFactor === 'SMALL' ? 'normal' : "normal", labelAlign, formInitProps } = ctx;
    const fields = _.values(objectSchema.fields);
    const formFields = getFormFields(objectSchema, ctx);
    const serviceId = `service_detail_page`;
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
              body: await getFormBody(map(fields, (field)=>{field.readonly = true; return field;}), map(formFields, (field)=>{field.readonly = true; return field;}), Object.assign({}, ctx, {showSystemFields: true})),
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
                      // "args": {
                      //   "url": "/app/${appId}/${objectName}/grid/${side_listview_id}",
                      //   "blank": false
                      // },
                      "actionType": "custom",
                      "script": "Steedos.goBack()",
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
                  objectName: "${event.data.__objectName}",
                  record: "${event.data.__record}"
                },
                expression: "${event.data.__response.error != true}"
              },
              {
                "actionType": "setValue",
                "args": {
                   value: {
                    "recordLoaded": true,
                   }
                },
                expression: "${event.data.__response.error != true}"
            }
            ]
          }
        }
    }
}