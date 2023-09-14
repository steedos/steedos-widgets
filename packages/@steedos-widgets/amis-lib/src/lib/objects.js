/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:55:39
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-09-14 10:19:56
 * @Description:
 */
import { fetchAPI, getUserId } from "./steedos.client";
import { getObjectCalendar } from './converter/amis/calendar';
import { i18next } from '../i18n'

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
    try {
        const userId = getUserId();
        let filters = listView.filters;
        if(listView.filter_scope === 'mine'){
            if(_.isEmpty(filters)){
                filters = [["owner", "=", userId]]
            }else{
                if(_.isString(filters) && _.startsWith(_.trim(filters), "function")){
                    filters = new Function(`return ${filters}`);
                    filters = filters();
                }
                if(_.isArray(filters)){
                    filters.push(["owner", "=", userId])
                }else{
                    console.debug(`listView filters is not array`, listView)
                    throw new Error('filters is not array')
                }
            }
        };
        return filters;
    } catch (error) {
        console.error(error)
    }
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
    console.log(`getFormSchema====>`, amisSchema)
    return {
        uiSchema,
        amisSchema,
    };
}

// 获取只读页面 recordId 已废弃, 函数签名保持不变, 但recordId变量不可再使用, 请使用运行时的${recordId}
export async function getViewSchema(objectName, recordId, ctx) {
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectDetail(uiSchema, recordId, ctx);
    // console.log(`getViewSchema amisSchema`, amisSchema)
    return {
        uiSchema,
        amisSchema
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
    if(!uiSchema){
        return {}
    }
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

    // 直接返回自定义的列表视图schema
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
    // 返回 calendar 组件
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

    // // 未自定义header 且显示header的时候, 使用系统header
    // if(!defaults.headerSchema && ctx.showHeader){
    //     defaults.headerSchema = getObjectListHeader(uiSchema, listViewName);
    // }
    
    // // 如果不显示header,则清理掉
    // if(!ctx.showHeader){
    //     defaults.headerSchema = null;
    // }

    defaults.headerSchema = null;

    /**
     * 本次存储代码段
     */
    try {
      const listViewPropsStoreKey = location.pathname + "/crud";
      let localListViewProps = sessionStorage.getItem(listViewPropsStoreKey);
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

    if (listViewName == "recent") {
        listview_filters = `
            function(filters, data) {
                var result = Steedos.authRequest('/graphql', {
                    type: 'POST',
                    async: false,
                    data: JSON.stringify({
                        query: '{object_recent_viewed(filters: [["record.o","=","' + data.objectName + '"],["space","=","' + data.context.tenantId + '"],["owner","=","' + data.context.userId + '"]],sort:"modified desc",top:50){ _id,record}  }'
                    }),
                });
                var _ids = []
                result.data.object_recent_viewed.forEach(function (item) {
                    _ids = _ids.concat(item.record.ids)
                })
                return ["_id", "=", _ids];
            }
        `
    }
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
        "adaptor": listView.adaptor,
        "headerToolbarItems": ctx.headerToolbarItems,
        "filterVisible": ctx.filterVisible,
        "rowClassNameExpr": ctx.rowClassNameExpr
    };
    // console.log(`getListSchema===>`,amisSchema)
    return {
        uiSchema,
        amisSchema,
    };
}

async function convertColumnsToTableFields(columns, uiSchema, ctx = {}) {
    let fields = [];
    for (const column of columns) {
        if (isString(column)) {
            if (column.indexOf('.') > 0) {
                const fieldName = column.split('.')[0];
                const displayName = column.split('.')[1];
                const filedInfo = uiSchema.fields[fieldName];
                if (filedInfo && (filedInfo.type === 'lookup' || filedInfo.type === 'master_detail') && isString(filedInfo.reference_to)) {
                    const rfUiSchema = await getUISchema(filedInfo.reference_to);
                    const rfFieldInfo = rfUiSchema.fields[displayName];
                    fields.push(Object.assign({}, rfFieldInfo, { name: `${fieldName}__expand.${displayName}`, expand: true, expandInfo: { fieldName, displayName } }, ctx));
                }
            } else {
                if (uiSchema.fields[column]) {
                    fields.push(Object.assign({}, uiSchema.fields[column], ctx));
                }
                else if(ctx.extra){
                    fields.push({
                        name: column
                    });
                }
            }
        } else if (isObject(column)) {
            if (column.field.indexOf('.') > 0) {
                const fieldName = column.field.split('.')[0];
                const displayName = column.field.split('.')[1];
                const filedInfo = uiSchema.fields[fieldName];
                if (filedInfo && (filedInfo.type === 'lookup' || filedInfo.type === 'master_detail') && isString(filedInfo.reference_to)) {
                    const rfUiSchema = await getUISchema(filedInfo.reference_to);
                    const rfFieldInfo = rfUiSchema.fields[displayName];
                    fields.push(Object.assign({}, rfFieldInfo, ctx,
                        { name: `${fieldName}__expand.${displayName}`, expand: true, expandInfo: { fieldName, displayName } },
                        {
                            width: column.width,
                            wrap: column.wrap, // wrap = true 是没效果的
                            amis: column.amis
                        }
                    ));
                }
            } else {
                if (uiSchema.fields[column.field]) {
                    fields.push(
                        Object.assign({}, uiSchema.fields[column.field], ctx, {
                            width: column.width,
                            wrap: column.wrap, // wrap = true 是没效果的
                            amis: column.amis
                        })
                    );
                }
            }
        }
    }
    return fields;
}

// 获取对象表格
export async function getTableSchema(
    appName,
    objectName,
    columns,
    ctx = {}
) {
    // console.time('getTableSchema', columns);
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

    let fields = await convertColumnsToTableFields(columns, uiSchema);

    const extraColumns = ctx.extraColumns;

    if (extraColumns) {
        let extraFields = await convertColumnsToTableFields(extraColumns, uiSchema, {extra: true});
        fields = fields.concat(extraFields);
    }
    
    const amisSchema = await getObjectCRUD(uiSchema, fields, {
        tabId: objectName,
        appId: appName,
        objectName: objectName,
        ...ctx,
        filter: ctx.filters,
        sort,
        headerToolbarItems: ctx.headerToolbarItems,
        buttons: await getListViewItemButtons(uiSchema, ctx)
    });
    console.log('getTableSchema====>amisSchema', amisSchema)
    // console.timeEnd('getTableSchema');
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

export async function getRecordDetailSchema(objectName, appId, props = {}){
    const uiSchema = await getUISchema(objectName);
    const relatedLists = await getObjectRelatedList(objectName, null, null);
    const detailed = {
        "title": i18next.t('frontend_record_detail_tab_detailed'),
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
        "title": i18next.t('frontend_record_detail_tab_related'),
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
                    "id": "u:48d2c28eb755"
                },
                content
            ],
            data: {
                "_master.objectName": "${objectName}",  
                "_master.recordId": "${recordId}"
            },
            onEvent: {
                "recordLoaded": {
                    "actions": [
                        {
                            "actionType": "reload",
                            "data": {
                                "name": `\${record.${uiSchema.NAME_FIELD_KEY || 'name'}}`,
                                "_master.record": `\${record}`, 
                                // 不清楚reload 如何给对象下的某个key复制, 所以此处重复设置_master的objectName、recordId
                                "_master.objectName": "${objectName}", 
                                "_master.recordId": "${recordId}"
                            }
                        }
                    ]
                },
                ...props.onEvent
            },
          }
    }
}

export async function getRecordServiceSchema(objectName, appId, props = {}) {
    const uiSchema = await getUISchema(objectName);
    return {
        uiSchema,
        amisSchema: {
            "type": "service",
            "body": [],
            data: {
                "_master.objectName": "${objectName}",
                "_master.recordId": "${recordId}"
            },
            "style": {
                "padding": "var(--Page-body-padding)",
                ...props.style
            },
            onEvent: {
                "recordLoaded": {
                    "actions": [
                        {
                            "actionType": "reload",
                            "data": {
                                "name": `\${record.${uiSchema.NAME_FIELD_KEY || 'name'}}`,
                                "_master.record": `\${record}`,
                                // 不清楚reload 如何给对象下的某个key复制, 所以此处重复设置_master的objectName、recordId
                                "_master.objectName": "${objectName}",
                                "_master.recordId": "${recordId}"
                            }
                        }
                    ]
                },
                ...props.onEvent
            }
        }
    }
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


if(typeof window != 'undefined'){
    window.getUISchema = getUISchema;
    window.getUISchemaSync = getUISchemaSync;
    window.getListSchema = getListSchema;
}