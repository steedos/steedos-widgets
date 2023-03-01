/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:55:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-01 09:39:16
 * @Description:
 */
import { fetchAPI, getUserId } from "./steedos.client";
import { getObjectFieldsFilterFormSchema } from './converter/amis/fields_filter';
import { getObjectCalendar } from './converter/amis/calendar';

import {
    getObjectCRUD,
    getObjectDetail,
    getObjectForm,
} from "./converter/amis/index";
import { getObjectListHeader, getObjectListHeaderFirstLine, getObjectRecordDetailHeader, getObjectRecordDetailRelatedListHeader } from './converter/amis/header';
import _, { cloneDeep, slice, isEmpty, each, has, findKey, find, isString, isObject, keys, includes, isArray, isFunction, map, forEach, defaultsDeep } from "lodash";
import { getRecord } from './record';
import { getListViewItemButtons } from './buttons'
import { getObjectRelatedList } from './objectsRelated';

let UI_SCHEMA_CACHE = {};

let UISchemaFunction;
export const setUISchemaFunction = function(fun){
    UISchemaFunction = fun;
};

if('undefined' != typeof window){
    if(!window.UI_SCHEMA_CACHE){
        window.UI_SCHEMA_CACHE = UI_SCHEMA_CACHE;
    }
    UI_SCHEMA_CACHE = window.UI_SCHEMA_CACHE;
}

const setUISchemaCache = (key, value) => {
    UI_SCHEMA_CACHE[key] = value;
};

const getUISchemaCache = (key) => {
    return cloneDeep(UI_SCHEMA_CACHE[key]);
};

const hasUISchemaCache = (key) => {
    return has(UI_SCHEMA_CACHE, key);
};

export function getListViewColumns(listView, formFactor) {
    let listViewColumns = [];
    if (formFactor === "SMALL") {
        listViewColumns = !isEmpty(listView.mobile_columns)
            ? listView.mobile_columns
            : slice(listView.columns, 0, 4);
    } else {
        listViewColumns = listView.columns;
    }
    return listViewColumns;
};

export function getListViewSort(listView) {
    let sort = '';
    if(listView && listView.sort && listView.sort.length){
        each(listView.sort,function(item,index){
            if(isArray(item)){
                const field_name = item[0];
                const order = item[1] || '';
                let sortStr = field_name + ' ' + order;
                sortStr = index > 0 ? ','+sortStr : sortStr
                sort += sortStr;
            }else{
                let sortStr = item.field_name + ' ' + item.order;
                sortStr = index > 0 ? ','+sortStr : sortStr
                sort += sortStr;
            }
        })
    }
    return sort;
};

export function getListViewFilter(listView){
    if(!listView){
        return ;
    }
    const userId = getUserId();
    let filters = listView.filters;
    if(listView.filter_scope === 'mine'){
        if(_.isEmpty(filters)){
            filters = [["owner", "=", userId]]
        }else{
            filters.push(["owner", "=", userId])
        }
    };
    return filters;
}

function formatUISchemaCache(objectName, uiSchema){
    setUISchemaCache(objectName, uiSchema);
    each(uiSchema.fields, (field)=>{
        try {
            if(field.type === "lookup" && field._reference_to && _.isString(field._reference_to)){
                field.reference_to = eval(`(${field._reference_to})`)();
            }
        } catch (exception) {
            field.reference_to = undefined;
            console.error(exception)
        }
    })
    each(uiSchema.list_views, (v, k)=>{
        v.name = k;
        if(!has(v, 'columns')){
            v.columns = uiSchema.list_views.all.columns;
        }
    })
}

export async function getUISchema(objectName, force) {
    if (!objectName) {
        return;
    }
    if (hasUISchemaCache(objectName) && !force) {
        return getUISchemaCache(objectName);
    }
    let uiSchema = null;
    try {
        if(UISchemaFunction){
            uiSchema = await UISchemaFunction(objectName, force);
        }
        else {
            const url = `/service/api/@${objectName.replace(/\./g, "_")}/uiSchema`;
            uiSchema = await fetchAPI(url, { method: "get" });
        }
        if(!uiSchema){
            return ;
        }
        formatUISchemaCache(objectName, uiSchema);
    } catch (error) {
        console.error(`getUISchema`, objectName, error);
        setUISchemaCache(objectName, null);
    }
    return getUISchemaCache(objectName);
}

export function getUISchemaSync(objectName, force) {
    if (!objectName) {
        return;
    }
    if (hasUISchemaCache(objectName) && !force) {
        return getUISchemaCache(objectName);
    }
    let uiSchema = null;
    try {
        
        const url = `/service/api/@${objectName.replace(/\./g, "_")}/uiSchema`;
        uiSchema = Steedos.authRequest(url, {
            type: 'GET',
            async: false,
        });

        if(!uiSchema){
            return ;
        }
        formatUISchemaCache(objectName, uiSchema);
    } catch (error) {
        console.error(`getUISchema`, objectName, error);
        setUISchemaCache(objectName, null);
    }
    return getUISchemaCache(objectName);
}

export async function getField(objectName, fieldName) {
    const uiSchema = await getUISchema(objectName);
    return uiSchema?.fields[fieldName];
}

// 获取表单页面
export async function getFormSchema(objectName, ctx) {
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectForm(uiSchema, ctx);
    // console.log(`getFormSchema====>`, amisSchema)
    return {
        uiSchema,
        amisSchema,
    };
}

// 获取只读页面
export async function getViewSchema(objectName, recordId, ctx) {
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectDetail(uiSchema, recordId, ctx);
    // console.log(`getViewSchema amisSchema`, amisSchema)
    return {
        uiSchema,
        amisSchema,
    };
}

// 获取列表视图
export async function getListSchema(
    appName,
    objectName,
    listViewName,
    ctx = {}
) {
    const uiSchema = await getUISchema(objectName);
    const listView =  find(
        uiSchema.list_views,
        (listView, name) => {
            // 传入listViewName空值则取第一个
            if(!listViewName){
                listViewName = name;
            }
            return name === listViewName || listView._id === listViewName;
        }
    );

    if (!listView) {
        return { uiSchema };
    }

    if(listView.enable_amis_schema && listView.amis_schema){
        const amisSchema = isString(listView.amis_schema) ? JSON.parse(listView.amis_schema) : listView.amis_schema;
        return {
            uiSchema,
            isCustomAmisSchema: true,
            amisSchema
        };
    }

    let listViewColumns = getListViewColumns(listView, ctx.formFactor);
    let sort = getListViewSort(listView);
    let listviewFilter = getListViewFilter(listView, ctx);
    let listview_filters = listView && listView._filters;
    if(listView.type === "calendar"){
        const amisSchema = {
            "type": "steedos-object-calendar",
            "objectApiName": objectName,
            "filters": listviewFilter,
            "filtersFunction": listview_filters,
            "sort": sort,
            ...listView.options
        };
        return {
            uiSchema,
            isCalendar: true,
            amisSchema
        };
    }

    const defaults = ctx.defaults || {};

    if(!defaults.headerSchema && ctx.showHeader){
        defaults.headerSchema = await getObjectListHeader(uiSchema, listViewName);
    }

    if(!ctx.showHeader){
        defaults.headerSchema = null;
    }

    try {
      const listViewPropsStoreKey = location.pathname + "/crud/" + ctx.listViewId;
      let localListViewProps = localStorage.getItem(listViewPropsStoreKey);
      /**
       * localListViewProps规范来自crud请求api中api.data.$self参数值的。
       * 比如：{"perPage":20,"page":1,"__searchable__name":"7","__searchable__between__n1__c":[null,null],"filter":[["name","contains","a"]]}
       * __searchable__...:顶部放大镜搜索条件
       * filter:右侧过滤器
       * perPage:每页条数
       * page:当前页码
       * orderBy:排序字段
       * orderDir:排序方向
       */
      if (localListViewProps) {
        localListViewProps = JSON.parse(localListViewProps);
        // localListViewProps.perPage = 3;
        let listSchema = {};
        if(localListViewProps.orderBy){
            listSchema.orderBy = localListViewProps.orderBy;
        }
        if(localListViewProps.orderDir){
            listSchema.orderDir = localListViewProps.orderDir;
        }
        // if(localListViewProps.perPage){
        //     listSchema.defaultParams = {
        //         perPage: localListViewProps.perPage
        //     }
        // }
        defaults.listSchema = defaultsDeep({}, listSchema, defaults.listSchema || {});
      }
    }
    catch (ex) {
      console.error("本地存储中crud参数解析异常：", ex);
    }

    ctx.defaults = defaults;

    const amisSchema = {
        "type": "steedos-object-table",
        "objectApiName": objectName,
        "columns": listViewColumns,
        "extraColumns": listView.extra_columns,
        "filters": listviewFilter,
        "filtersFunction": listview_filters,
        "sort": sort,
        "ctx": ctx,
        "requestAdaptor": listView.requestAdaptor,  
        "adaptor": listView.adaptor
    };
    return {
        uiSchema,
        amisSchema,
    };
}

// 获取对象表格
export async function getTableSchema(
    appName,
    objectName,
    columns,
    ctx = {}
) {
    const uiSchema = await getUISchema(objectName);

    let sort = ctx.sort;
    if(!sort){
        const sortField = ctx.sortField;
        const sortOrder = ctx.sortOrder;
        if(sortField){
            let sortStr = sortField + ' ' + sortOrder || 'asc';
            sort = sortStr;
        }
    }

    let fields = [];
    each(columns, function (column) {
        if (isString(column) && uiSchema.fields[column]) {
            fields.push(uiSchema.fields[column]);
        } else if (isObject(column) && uiSchema.fields[column.field]) {
            fields.push(
                Object.assign({}, uiSchema.fields[column.field], {
                    width: column.width,
                    wrap: column.wrap,
                })
            );
        }
    });

    const extraColumns = ctx.extraColumns;

    if (extraColumns) {
        each(extraColumns, function (column) {
            if (isString(column)) {
                fields.push({ extra: true, name: column });
            } else if (isObject(column)) {
                fields.push({ extra: true, name: column.field });
            }
        });
    }
    
    const amisSchema = await getObjectCRUD(uiSchema, fields, {
        tabId: objectName,
        appId: appName,
        objectName: objectName,
        ...ctx,
        filter: ctx.filters,
        sort,
        buttons: await getListViewItemButtons(uiSchema, ctx)
    });
    return {
        uiSchema,
        amisSchema,
    };
}

// 获取对象日历
export async function getCalendarSchema(
    appName,
    objectName,
    calendarOptions,
    ctx = {}
) {
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectCalendar(uiSchema, calendarOptions, {
        tabId: objectName,
        appId: appName,
        objectName: objectName,
        ...ctx
    });
    return {
        uiSchema,
        amisSchema
    };
}

export async function getRecordDetailHeaderSchema(objectName,recordId, options){
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectRecordDetailHeader(uiSchema, recordId, options);
    return {
        uiSchema,
        amisSchema,
    };
}

export async function getRecordDetailSchema(objectName, appId){
    const uiSchema = await getUISchema(objectName);
    const relatedLists = await getObjectRelatedList(objectName, null, null);
    const detailed = {
        "title": "详细",
        "className": "px-0 py-4",
        "body": [
            {
                "type": "steedos-object-form",
                "label": "对象表单",
                "objectApiName": "${objectName}",
                "recordId": "${recordId}",
                "id": "u:d4a495811d57",
                appId: appId
            }
        ],
        "id": "u:5d4e7e3f6ecc"
    };
    const related = {
        "title": "相关",
        "className": "px-0 pt-4",
        "body": [
            {
                "type": "steedos-object-related-lists",
                "label": "相关列表",
                "objectApiName": "${objectName}",
                "recordId": "${recordId}",
                "id": "u:3b85b7b7a7f6",
                appId: appId
            }
        ],
        "id": "u:1a0326aeec2b"
    }
    const content = {
        "type": "tabs",
        "className": "sm:mt-3 bg-white sm:shadow sm:rounded sm:border border-slate-300 p-4",
        "tabs": [
            detailed
        ],
        "id": "u:a649e4094a12"
    };
    if(relatedLists.length){
        content.tabs.push(related)
    }
    return {
        uiSchema,
        amisSchema: {
            "type": "service",
            "body": [
              {
                "type": "steedos-record-detail-header",
                "label": "标题面板",
                "objectApiName": "${objectName}",
                "recordId": "${recordId}",
                "id": "u:48d2c28eb755",
                onEvent: {
                    "recordLoaded": {
                        "actions": [
                            {
                                "actionType": "reload",
                                "data": {
                                    "name": `\${record.${uiSchema?.NAME_FIELD_KEY || 'name'}}`,
                                    "record": `\${record}`,
                                    "recordLoaded": true
                                }
                            }
                        ]
                      }
                },
              },
              content
            ],
          }
    }
}

// export async function getRecordDetailRelatedListSchema(objectName,recordId,relatedObjectName){
//     // console.log('b==>',objectName,recordId,relatedObjectName)
//     const relatedObjectUiSchema = await getUISchema(relatedObjectName);
//     const { list_views, label , icon, fields } = relatedObjectUiSchema;
//     const firstListViewName = keys(list_views)[0];
//     const relatedKey = findKey(fields, function(field) { 
//         return ["lookup","master_detail"].indexOf(field.type) > -1 && field.reference_to === objectName; 
//     });
//     const globalFilter = [relatedKey,'=',recordId];
//     const recordRelatedListHeader = await getObjectRecordDetailRelatedListHeader(relatedObjectUiSchema);
//     const options = {
//         globalFilter,
//         defaults: {
//             listSchema: { headerToolbar:[],columnsTogglable:false },
//             headerSchema: recordRelatedListHeader
//         },
//         showHeader: true
//     }
//     const amisSchema= (await getListSchema(null, relatedObjectName, firstListViewName, options)).amisSchema;
//     return {
//         uiSchema: relatedObjectUiSchema,
//         amisSchema: {
//             type: "service",
//             data: {
//                 masterObjectName: objectName,
//                 masterRecordId: "${recordId}",
//                 relatedKey: relatedKey,   
//                 objectName: relatedObjectName,
//                 listViewId: `amis-\${appId}-${relatedObjectName}-listview`,
//             },
//             body:[
//                 {
//                     ...amisSchema,
//                     data: {
//                         filter: ["${relatedKey}", "=", "${masterRecordId}"],
//                         objectName: "${objectName}",
//                         recordId: "${masterRecordId}",
//                         ...{[relatedKey]: getRelatedFieldValue(objectName, "${recordId}", relatedSchema.uiSchema, relatedKey)}
//                     }
//                 }
//             ]
//         }
//     };
// }


// 获取单个相关表
export async function getObjectRelated(
    {appName,
    masterObjectName,
    objectName,
    relatedFieldName,
    recordId,
    formFactor}
) {
    let filter = null;
    const refField = await getField(objectName, relatedFieldName);
    if (
        refField._reference_to ||
        (refField.reference_to && !isString(refField.reference_to))
    ) {
        filter = [
            [`${relatedFieldName}/o`, "=", masterObjectName],
            [`${relatedFieldName}/ids`, "=", recordId],
        ];
    } else {
        filter = [`${relatedFieldName}`, "=", recordId];
    }
    const masterObjectUISchema = await getUISchema(masterObjectName);
    return {
        masterObjectName: masterObjectName,
        object_name: objectName,
        foreign_key: relatedFieldName,
        schema: await getListSchema(appName, objectName, "all", {
            globalFilter: filter,
            formFactor: formFactor,
        }),
        record: await getRecord(masterObjectName, recordId, [
            masterObjectUISchema.NAME_FIELD_KEY,
        ]),
        masterObjectUISchema: masterObjectUISchema,
    };
}

export async function getSearchableFieldsFilterSchema(objectSchema, fields, ctx) {
    return await getObjectFieldsFilterFormSchema(objectSchema, fields, ctx);
}

if(typeof window != 'undefined'){
    window.getUISchema = getUISchema;
    window.getUISchemaSync = getUISchemaSync;
}