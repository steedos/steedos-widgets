/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:55:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-14 16:04:34
 * @Description:
 */
import { fetchAPI } from "./steedos.client";
import { getAuthToken , getTenantId, getRootUrl } from './steedos.client.js';

import {
    getObjectList,
    getRecordDetailHeaderAmisSchema,
    getObjectDetail,
    getObjectForm,
} from "./converter/amis/index";
import _, { cloneDeep, slice, isEmpty, each, has, findKey, find, isString, isObject, keys, includes, isArray, isFunction } from "lodash";
import { getFieldSearchable } from "./converter/amis/fields/index";
import { getRecord } from './record';

const UI_SCHEMA_CACHE = {};

const setUISchemaCache = (key, value) => {
    UI_SCHEMA_CACHE[key] = value;
};

const getUISchemaCache = (key) => {
    return cloneDeep(UI_SCHEMA_CACHE[key]);
};

const hasUISchemaCache = (key) => {
    return has(UI_SCHEMA_CACHE, key);
};

const getListViewColumns = (listView, formFactor) => {
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

export async function getUISchema(objectName, force) {
    if (!objectName) {
        return;
    }
    if (hasUISchemaCache(objectName) && !force) {
        return getUISchemaCache(objectName);
    }
    const url = `/service/api/@${objectName.replace(/\./g, "_")}/uiSchema`;
    let uiSchema = null;
    try {
        uiSchema = await fetchAPI(url, { method: "get" });
        setUISchemaCache(objectName, uiSchema);
        for (const fieldName in uiSchema.fields) {
            if (uiSchema.fields) {
                const field = uiSchema.fields[fieldName];

                if (
                    (field.type === "lookup" || field.type === "master_detail") &&
                    field.reference_to
                ) {
                    let refTo = null;
                    if(isFunction(field.reference_to)){
                        try {
                            refTo = eval(field.reference_to)();
                        } catch (error) {
                            console.error(error)
                        }
                    }
                    if(isString(field.reference_to)){
                        refTo = [field.reference_to]
                    }else if(isArray(field.reference_to)){
                        refTo = field.reference_to
                    }
                    for (const item of refTo) {
                        const refUiSchema = await getUISchema(item);
                        if (!refUiSchema) {
                            delete uiSchema.fields[fieldName];
                        }
                    }
                   
                }
            }
        }
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
    const listView = find(
        uiSchema.list_views,
        (listView, name) => name === listViewName
    );

    if (!listView) {
        return { uiSchema };
    }
    let fields = uiSchema.fields;
    const listViewFields = [];

    let listViewColumns = getListViewColumns(listView, ctx.formFactor);

    if (listView && listViewColumns) {
        each(listViewColumns, function (column) {
            if (isString(column) && uiSchema.fields[column]) {
                listViewFields.push(uiSchema.fields[column]);
            } else if (isObject(column) && uiSchema.fields[column.field]) {
                listViewFields.push(
                    Object.assign({}, uiSchema.fields[column.field], {
                        width: column.width,
                        wrap: column.wrap,
                    })
                );
            }
        });
    }

    if (listView && listView.extra_columns) {
        each(listView.extra_columns, function (column) {
            if (isString(column)) {
                listViewFields.push({ extra: true, name: column });
            } else if (isObject(column)) {
                listViewFields.push({ extra: true, name: column.field });
            }
        });
    }

    fields = listViewFields;
    const amisSchema = await getObjectList(uiSchema, fields, {
        tabId: objectName,
        appId: appName,
        objectName: objectName,
        listViewName: listViewName,
        ...ctx,
        filter: listView.filters
    });

    return {
        uiSchema,
        amisSchema,
    };
}

export async function getRecordDetailHeaderSchema(objectName,recordId){
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getRecordDetailHeaderAmisSchema(uiSchema, recordId);
    return {
        uiSchema,
        amisSchema,
    };
}

export async function getRecordDetailRelatedListSchema(objectName,recordId,relatedObjectName){
    // console.log('b==>',objectName,recordId,relatedObjectName)
    // if(!objectName || !recordId || !relatedObjectName){
    // if(!objectName || !relatedObjectName){
    //     const amisAlert = {
    //       "type": "alert",
    //       "body": "缺少父级对象、父级记录或相关列表对象",
    //       "level": "warning",
    //       "showIcon": true,
    //       "className": "mb-3"
    //     }
    //     return {
    //         amisSchema: amisAlert
    //     }
    // }
    const relatedObjectUiSchema = await getUISchema(relatedObjectName);
    const { list_views, label , icon, fields } = relatedObjectUiSchema;
    const firstListViewName = keys(list_views)[0];
    const filterFieldName = findKey(fields, function(field) { 
        return ["lookup","master_detail"].indexOf(field.type) > -1 && field.reference_to === objectName; 
    });
    const globalFilter = [filterFieldName,'=',recordId];

    const listViewAmisSchema= (await getListSchema(null, relatedObjectName, firstListViewName, {globalFilter})).amisSchema;
    const listViewAmisSchemaBody = listViewAmisSchema.body;

    const recordRelatedListBody = Object.assign({},listViewAmisSchemaBody,{
        bulkActions: [],
        headerToolbar: [],
        columnsTogglable: false,
        source: "${rows}"
    });
    const recordRelatedListHeader = {
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
                                            "tpl": `<p><img class=\"slds-icon_small slds-icon_container slds-icon-standard-${icon}\" src=\"\${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${icon}.svg\" /></p>`
                                        },
                                        "md": "auto",
                                        "className": "",
                                        "columnClassName": "flex justify-center items-center"
                                    },
                                    {
                                        "body": [
                                            {
                                                "type": "tpl",
                                                "tpl": `${label}(\${count ? count : 0})`,
                                                "inline": false,
                                                "wrapperComponent": "",
                                                "className": "leading-none",
                                                "style": {
                                                    "fontFamily": "",
                                                    "fontSize": 13,
                                                    "fontWeight": "bold"
                                                }
                                            }
                                        ],
                                        "md": "",
                                        "valign": "middle",
                                        "columnClassName": "p-l-xs"
                                    }
                                ]
                            }
                        ],
                        "md": 9
                    },
                    {
                        "body": [
                            // 头部内容区
                        ]
                    }
                ]
            }
        ],
        "size": "xs"
    };
    const  body = [
        {
            "type": "panel",
            "title": "子表标题",
            "header": recordRelatedListHeader,
            "body": recordRelatedListBody,
            "affixFooter": false,
            "headerClassName": "",
            "bodyClassName": "p-none"
        }
    ];
    const amisSchema =  {
          type: 'service',
          bodyClassName: '',
          name: `relatedObject`,
          data: {context: {rootUrl: getRootUrl(), tenantId: getTenantId(), authToken: getAuthToken()}},
          body: body
    }

    return {
        uiSchema: relatedObjectUiSchema,
        amisSchema
    };
}

// 获取所有相关表
export async function getObjectRelatedList(
    appName,
    objectName,
    recordId,
    formFactor
) {
    const uiSchema = await getUISchema(objectName);

    const related = [];

    const details = [].concat(uiSchema.details || []);

    if (uiSchema.enable_files) {
        details.push(`cms_files.parent`);
    }

    for (const detail of details) {
        const arr = detail.split(".");

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
            }),
        });
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
    const masterObjectUISchema = await getUISchema(masterObjectName, formFactor);
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

export async function getSearchableFieldsFilterSchema(fields, cols) {
    const body = [];
    for (let field of fields) {
        if (
            !includes(
                [
                    "grid",
                    "avatar",
                    "image",
                    "object",
                    "[object]",
                    "[Object]",
                    "[grid]",
                    "[text]",
                    "audio",
                    "file",
                ],
                field.type
            )
        ) {
            delete field.defaultValue
            delete field.required
            delete field.is_wide
            delete field.readonly
            delete field.hidden
            delete field.omit
            const amisField = await getFieldSearchable(field, fields, {});
            if (amisField) {
                body.push(amisField);
            }
        }
    }
    return {
        title: "",
        type: "form",
        name: "listview-filter-form",
        mode: "normal",
        wrapWithPanel: false,
        className: `grid gap-2 grid-cols-${cols || 4} mb-2`,
        body: body,
    };
}
