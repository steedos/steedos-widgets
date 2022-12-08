/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:55:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-08 15:16:03
 * @Description:
 */
import { fetchAPI } from "./steedos.client";
import { getAuthToken , getTenantId, getRootUrl } from './steedos.client.js';
import { getObjectFieldsFilterFormSchema } from './converter/amis/fields_filter';

import {
    getObjectList,
    getObjectDetail,
    getObjectForm,
} from "./converter/amis/index";
import { getObjectListHeader, getObjectRecordDetailHeader, getObjectRecordDetailRelatedListHeader } from './converter/amis/header';
import _, { cloneDeep, slice, isEmpty, each, has, findKey, find, isString, isObject, keys, includes, isArray, isFunction, map, forEach, defaultsDeep } from "lodash";
import { getRecord } from './record';
import { getListViewItemButtons } from './buttons'

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
        setUISchemaCache(objectName, uiSchema);
        // for (const fieldName in uiSchema.fields) {
        //     if (uiSchema.fields) {
        //         const field = uiSchema.fields[fieldName];

        //         if (
        //             (field.type === "lookup" || field.type === "master_detail") &&
        //             field.reference_to
        //         ) {
        //             let refTo = null;
        //             if(isFunction(field.reference_to)){
        //                 try {
        //                     refTo = eval(field.reference_to)();
        //                 } catch (error) {
        //                     console.error(error)
        //                 }
        //             }
        //             if(isString(field.reference_to)){
        //                 refTo = [field.reference_to]
        //             }else if(isArray(field.reference_to)){
        //                 refTo = field.reference_to
        //             }
        //             for (const item of refTo) {
        //                 const refUiSchema = await getUISchema(item);
        //                 if (!refUiSchema) {
        //                     delete uiSchema.fields[fieldName];
        //                 }
        //             }
                   
        //         }
        //     }
        // }
        each(uiSchema.list_views, (v, k)=>{
            v.name = k;
            if(!has(v, 'columns')){
                v.columns = uiSchema.list_views.all.columns;
            }
        })
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
    return {
        uiSchema,
        amisSchema,
    };
}

// 获取只读页面
export async function getViewSchema(objectName, recordId, ctx) {
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectDetail(uiSchema, recordId, ctx);
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
            return name === listViewName;
        }
    );

    if (!listView) {
        return { uiSchema };
    }

    if(listView.enable_amis_schema && listView.amis_schema){
        return {
            uiSchema,
            isCustom: true,
            amisSchema: isString(listView.amis_schema) ? JSON.parse(listView.amis_schema) : listView.amis_schema,
        };
    }

    let listViewColumns = getListViewColumns(listView, ctx.formFactor);
    let sort = getListViewSort(listView);

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
        if(localListViewProps.perPage){
            listSchema.defaultParams = {
                perPage: localListViewProps.perPage
            }
        }
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
        "filters": listView.filters,
        "sort": sort,
        "ctx": ctx
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
    
    const amisSchema = await getObjectList(uiSchema, fields, {
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

export async function getRecordDetailHeaderSchema(objectName,recordId){
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectRecordDetailHeader(uiSchema, recordId);
    return {
        uiSchema,
        amisSchema,
    };
}

export async function getRecordDetailSchema(objectName, appId){
    const uiSchema = await getUISchema(objectName);
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
                                    "name": `\${record.${uiSchema?.NAME_FIELD_KEY || 'name'}}`
                                }
                            }
                        ]
                      }
                },
              },
              {
                "type": "tabs",
                "tabs": [
                  {
                    "title": "详细",
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
                  },
                  {
                    "title": "相关",
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
                ],
                "id": "u:a649e4094a12"
              }
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

// 获取所有相关表
export async function getObjectRelatedList(
    appName,
    objectName,
    recordId,
    formFactor
) {
    const uiSchema = await getUISchema(objectName);

    const related = [];

    const relatedLists = [].concat(uiSchema.related_lists || []);

    if(!isEmpty(relatedLists)){
        for (const relatedList of relatedLists) {
            const arr = relatedList.related_field_fullname.split(".");
            let filter = null;
            const refField = await getField(arr[0], arr[1]);
            if(refField){
                if (
                    refField._reference_to ||
                    (refField.reference_to && !isString(refField.reference_to))
                ) {
                    filter = [
                        [`${arr[1]}/o`, "=", objectName],
                        [`${arr[1]}/ids`, "=", recordId],
                    ];
                } else {
                    filter = [`${arr[1]}`, "=", recordId];
                }
                const relatedUiSchema = await getUISchema(arr[0]);
                if(relatedUiSchema){
                    let fields = [];
                    forEach(relatedList.field_names , (fName)=>{
                        const field = find(relatedUiSchema.fields, (item)=>{
                            return item.name === fName
                        })
                        if(field){
                            fields.push(field);
                        }
                    })
                    related.push({
                        masterObjectName: objectName,
                        object_name: arr[0],
                        foreign_key: arr[1],
                        schema: {
                            uiSchema: relatedUiSchema,
                            amisSchema: await getObjectList(relatedUiSchema, fields, {
                                tabId: objectName,
                                appId: appName,
                                objectName: arr[0],
                                formFactor: formFactor,
                                globalFilter: filter,
                                buttons: await getListViewItemButtons(relatedUiSchema, {isMobile: false})
                            })
                        }
                    });
                }
            }
        }

    }else{
        const details = [].concat(uiSchema.details || []);

        for (const detail of details) {
            const arr = detail.split(".");
            const relatedUiSchema = await getUISchema(arr[0]);
            if(relatedUiSchema){
                let filter = null;
                const refField = await getField(arr[0], arr[1]);
                if (
                    refField._reference_to ||
                    (refField.reference_to && !isString(refField.reference_to))
                ) {
                    filter = [
                        [`${arr[1]}/o`, "=", objectName],
                        [`${arr[1]}/ids`, "=", recordId],
                    ];
                } else {
                    filter = [`${arr[1]}`, "=", recordId];
                }
        
                related.push({
                    masterObjectName: objectName,
                    object_name: arr[0],
                    foreign_key: arr[1],
                    schema: await getListSchema(appName, arr[0], "all", {
                        globalFilter: filter,
                        formFactor: formFactor,
                        buttons: await getListViewItemButtons(relatedUiSchema, {isMobile: false})
                    }),
                });
            }
        }
    }

    return related;
}

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