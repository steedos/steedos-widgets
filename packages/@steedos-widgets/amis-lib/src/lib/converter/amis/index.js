import { getAuthToken , getTenantId, getRootUrl, getSteedosAuth } from '../../steedos.client.js';
import { getReadonlyFormInitApi, getSaveApi, getEditFormInitApi, getBatchDelete } from './api';
import { getTableSchema, getTableApi } from './fields/table';
import { getFormBody } from './form';
import { getListSchema, getCardSchema } from './fields/list';
import _, { map, filter } from 'lodash';
import { defaultsDeep } from '../../defaultsDeep';
import { getObjectHeaderToolbar, getObjectFooterToolbar, getObjectFilter } from './toolbar';
import { i18next } from "../../../i18n"
import { createObject } from '../../../utils/object';

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
        "feedback": {
          "title": "删除警告",
          "visibleOn": "${deleteErrorMessage}",
          "body": [
            {
              "type": "each",
              "name": "deleteErrorMessage",
              "items": {
                "type": "alert",
                "body": "${item}",
                "level": "danger",
                "className": "mb-3"
              }
            }
          ],
          "actions": [
            {
              "type": "button",
              "actionType": "close",
              "label": "关闭"
            }
          ]
        }
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

async function getCrudSchemaWithDataFilter(crud, options = {}){
  const { crudDataFilter, amisData, env } = options;
  let onCrudDataFilter = options.onCrudDataFilter;
  if (!onCrudDataFilter && typeof crudDataFilter === 'string') {
    onCrudDataFilter = new Function(
      'crud',
      'env',
      'data',
      crudDataFilter
    );
  }

  try {
    onCrudDataFilter && (crud = await onCrudDataFilter(crud, env, amisData) || crud);
  } catch (e) {
    console.warn(e);
  }
  return crud;
}

export async function getObjectCRUD(objectSchema, fields, options){
    // console.time('getObjectCRUD');
    const { top, perPage, showDisplayAs = false, displayAs, crudClassName = "",
      crudDataFilter, onCrudDataFilter, amisData, env } = options;
    const nonpaged = objectSchema.paging && objectSchema.paging.enabled === false;
    const isTreeObject = objectSchema.enable_tree;
    const bulkActions = getBulkActions(objectSchema);
    const defaults = options.defaults;
    const listSchema = (defaults && defaults.listSchema) || {};

    const bodyProps = {
      // toolbar: getToolbar(),
      // headerToolbar: getObjectHeaderToolbar(objectSchema, options.formFactor, {showDisplayAs}),
      headerToolbarClassName: "px-4 py-2 border-b",
      footerToolbar: getObjectFooterToolbar(objectSchema, options.formFactor, {
        ...options,
        disableStatistics: options.queryCount === false
      }), 
      filter: options.filterVisible !== false && await getObjectFilter(objectSchema, fields, options),
    };
    if(options.formFactor !== 'SMALL' || ["split"].indexOf(options.displayAs) == -1){
      if(listSchema.mode !== "cards"){
        // card模式时默认不显示勾选框
        Object.assign(bodyProps, {
          bulkActions: options.bulkActions != false ? bulkActions : false
        });
      }
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
    bodyProps.headerToolbar = getObjectHeaderToolbar(objectSchema, fields, options.formFactor, {
      showDisplayAs, 
      hiddenCount: options.queryCount === false, 
      headerToolbarItems: options.headerToolbarItems,
      filterVisible: options.filterVisible
    });

    options.amisData = createObject(options.amisData, {
      objectName: objectSchema.name,
      // _id: null,
      recordPermissions: objectSchema.permissions,
      uiSchema: objectSchema,
      // loaded: false //crud接收适配器中设置为true，否则就是刷新浏览器第一次加载
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
      let tableOptions = Object.assign({
        idFieldName: objectSchema.idFieldName, labelFieldName: labelFieldName, 
        permissions:objectSchema.permissions,enable_inline_edit:objectSchema.enable_inline_edit,
        crudId: listSchema.id || id, enable_tree: objectSchema.enable_tree
      }, options);
      tableOptions.amisData = createObject(options.amisData || {}, {});
      const table = await getTableSchema(objectSchema, fields, tableOptions);
      // delete table.mode;
      //image与avatar需要在提交修改时特别处理
      const imageNames = _.compact(_.map(_.filter(fields, (field) => ["image","avatar"].includes(field.type)), 'name'));
      const quickSaveApiRequestAdaptor = `
        var graphqlOrder = "";
        var imageNames = ${JSON.stringify(imageNames)};
        const rowsDiff = _.cloneDeep(api.data.rowsDiff);
        rowsDiff.forEach(function (item, index) {
          for(key in item){
            // image、select等字段清空值后保存的空字符串转换为null。
            if(item[key] === ''){
              item[key] = null;
            }
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
          item = _.omit(item, '_display');
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
      let autoFillHeight = true
      if(options.isRelated || window.innerWidth < 768){
        autoFillHeight = false
      }

      body = Object.assign({}, table, {
        type: 'crud', 
        primaryField: '_id', 
        affixHeader: false,
        id: id,
        name: id,
        keepItemSelectionOnPageChange: true, 
        api: await getTableApi(objectSchema, fields, options),
        hiddenOn: options.tableHiddenOn,
        autoFillHeight,
        className: `flex-auto ${crudClassName || ""}`,
        // 这里不可以用动态className，因为它会把样式类加到.antd-Crud和.antd-Table.antd-Crud-body这两层div中，而子表列表中crudClassName中有hidden样式类会造成所有子表都不显示的bug
        // className: {
        //   [`flex-auto ${crudClassName || ""}`]: "true",
        //   "is-steedos-crud-data-empty": "${!items || COUNT(items) == 0}"
        // },
        bodyClassName: {
          "mb-0": true,
          "is-steedos-crud-data-empty": "${!items || COUNT(items) == 0}"
        },
        crudClassName: crudClassName,
        quickSaveApi: {
          url: `\${context.rootUrl}/graphql`,
          method: "post",
          dataType: "json",
          headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}",
          },
          requestAdaptor: quickSaveApiRequestAdaptor
        },
        // 外层data发生变化的时候, 不会重新渲染rowClassNameExpr, 所以先用css标记tr唯一标识
        // 使用表达式给tr添加初始选中状态
        rowClassNameExpr: options.rowClassNameExpr || "<%= data._id === data.recordId ? 'steedos-record-tr steedos-record-tr-' + data._id + ' steedos-record-selected' : 'steedos-record-tr steedos-record-tr-' + data._id %>" 
      }, bodyProps);

    }

    body = defaultsDeep({}, listSchema, body);
    body = await getCrudSchemaWithDataFilter(body, { crudDataFilter, onCrudDataFilter, amisData, env });

    let crudModeClassName = "";
    if(body.mode){
      crudModeClassName = `steedos-crud-mode-${body.mode}`;
    }

    body.quickSaveApi.adaptor = `
      if(payload.errors){
          payload.status = 2;
          payload.msg = window.t ? window.t(payload.errors[0].message) : payload.errors[0].message;
      }
      var scope = SteedosUI.getRef(context.scopeId);
      var scopeParent = scope && scope.parent;
      var crudScoped = scopeParent.getComponentById('${body.id}');
      setTimeout(()=>{
        crudScoped && crudScoped.control.updateAutoFillHeight();
      }, 500);
      return payload;
    `

    if(body.columns && options.formFactor != 'SMALL'){
      //将_display放入crud的columns的倒数第二列中（最后一列会影响固定列），可以通过setvalue修改行内数据域的_display，而不影响上层items的_display,用于批量编辑
      body.columns.splice(body.columns.length -1 , 0, {name: '_display',type: 'static', width: 1, placeholder: "",id: objectSchema.name + "_display_${_index}", tpl: "${''}"});
    }

    if (defaults) {
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
      className: crudModeClassName,
      //目前crud的service层id不认用户自定义id，只支持默认规则id，许多地方的格式都写死了service_listview_${objectname}
      id: `service_${id}`,
      name: `page`,
      data: options.amisData,
      body: body,
      //监听广播事件，重算crud高度
      onEvent: {
        [`@height.changed.${objectSchema.name}`]: {
          "actions": [
            {
              "actionType": "custom",
              "script": `
                var crudScoped = event.context.scoped.getComponentById('${body.id}');
                var timeOut = event.data.timeOut || 500;
                setTimeout(()=>{
                  crudScoped && crudScoped.control.updateAutoFillHeight();
                }, timeOut);
              `
            }
          ]
        }
      }
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

async function getFormSchemaWithDataFilter(form, options = {}){
  const { formDataFilter, amisData, env } = options;
  let onFormDataFilter = options.onFormDataFilter;
  if (!onFormDataFilter && typeof formDataFilter === 'string') {
    onFormDataFilter = new Function(
      'form',
      'env',
      'data',
      formDataFilter
    );
  }

  try {
    onFormDataFilter && (form = await onFormDataFilter(form, env, amisData) || form);
  } catch (e) {
    console.warn(e);
  }
  return form;
}

export async function getObjectForm(objectSchema, ctx){
    const { recordId, formFactor, layout = formFactor === 'SMALL' ? 'normal' : "horizontal", labelAlign, tabId, appId, defaults, submitSuccActions = [], 
      formDataFilter, onFormDataFilter, amisData, env } = ctx;
    const fields = _.values(objectSchema.fields);
    const formFields = getFormFields(objectSchema, ctx);
    const formSchema =  defaults && defaults.formSchema || {};
    if(_.has(formSchema, 'className')){
      formSchema.className = 'steedos-amis-form'
    }
    if(!formSchema.id){
      formSchema.id = 'form_' + objectSchema.name;
    }
    const amisSchema =  {
      type: 'service',
      id: `service_${formSchema.id}`,
      className: 'p-0',
      name: `page_edit_${recordId}`,
      data:{
        ...amisData
      },
      // data: {global: getGlobalData('edit'), recordId: recordId, objectName: objectSchema.name, context: {rootUrl: getRootUrl(), tenantId: getTenantId(), authToken: getAuthToken()}},
      initApi: null,
      initFetch: null ,
      body: [defaultsDeep({}, formSchema, {
        type: "form",
        mode: layout,
        initApi: await getEditFormInitApi(objectSchema, recordId, fields, ctx),
        data: {
          editFormInited: false,
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
        body: {
          type: 'wrapper',
          className: 'p-0 m-0',
          body: await getFormBody(fields, formFields, Object.assign({}, ctx, {fieldGroups: objectSchema.field_groups, omitReadonlyFields: true})),
          hiddenOn: "${editFormInited != true}",
        },
        panelClassName:'m-0 sm:rounded-lg shadow-none border-none',
        bodyClassName: 'p-0',
        className: 'steedos-amis-form',
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
              ...submitSuccActions,
              // {
              //   "actionType": "custom",
              //   "script": `setTimeout(function(){doAction({'actionType': 'setValue','componentId': '${formSchema.id}','args': {'value': {'sort_no': 879}}})}, 300)`
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
    amisSchema.body[0] = await getFormSchemaWithDataFilter(amisSchema.body[0], { formDataFilter, onFormDataFilter, amisData, env });
    return amisSchema;
}

export async function getObjectDetail(objectSchema, recordId, ctx){
    const { formFactor, layout = formFactor === 'SMALL' ? 'normal' : "horizontal", labelAlign, 
      formDataFilter, onFormDataFilter, amisData, env } = ctx;
    const fields = _.values(objectSchema.fields);
    const formFields = getFormFields(objectSchema, ctx);
    const serviceId = `service_detail_page`;
    const amisSchema = {
        type: 'service',
        name: `page_readonly_${recordId}`,
        id: serviceId,
        // api: await getReadonlyFormInitApi(objectSchema, recordId, fields, ctx),
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
              body: await getFormBody(
                map(fields, (field) => { field.readonly = true; return field; }),
                map(formFields, (field) => { field.readonly = true; return field; }),
                Object.assign({}, ctx, { showSystemFields: true, fieldGroups: objectSchema.field_groups })
              ),
              className: 'steedos-amis-form bg-white',
              actions: [], // 不显示表单默认的提交按钮
          },
          }
        ],
        // onEvent: {
        //   "fetchInited": {
        //     "weight": 0,
        //     "actions": [
        //       {
        //         actionType: 'broadcast',
        //         eventName: "recordLoaded",
        //         args: {
        //           eventName: "recordLoaded"
        //         },
        //         data: {
        //           objectName: "${event.data.__objectName}",
        //           record: "${event.data.__record}"
        //         },
        //         expression: "${event.data.__response.error != true}"
        //       },
        //       {
        //         "actionType": "setValue",
        //         "args": {
        //            value: {
        //             "recordLoaded": true,
        //            }
        //         },
        //         expression: "${event.data.__response.error != true}"
        //     }
        //     ]
        //   }
        // }
    }

    amisSchema.body[0].body = await getFormSchemaWithDataFilter(amisSchema.body[0].body, { formDataFilter, onFormDataFilter, amisData, env });
    // console.log('getObjectDetail=====>', amisSchema);
    return amisSchema;
}