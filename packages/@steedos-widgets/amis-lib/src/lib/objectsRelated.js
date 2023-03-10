/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:55:39
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-03-10 18:38:55
 * @Description:
 */


import { getObjectRecordDetailRelatedListHeader } from './converter/amis/header';
import { isEmpty,  find, isString, forEach, keys, findKey, isArray } from "lodash";
import { getUISchema, getField, getListViewColumns, getListViewSort, getListViewFilter } from './objects'
import { getRecord } from './record';

function str2function(
    contents,
    ...args
  ) {
    try {
      let fn = new Function(...args, contents);
      return fn;
    } catch (e) {
      console.warn(e);
      return null;
    }
}

export const getRelatedFieldValue = (masterObjectName, record_id, uiSchema, foreign_key) => {
    const relatedField = find(uiSchema.fields, (field) => {
        return foreign_key === field?.name
    });
    // console.log(`getRelatedFieldValue`, relatedField, uiSchema, foreign_key)
    if (!isString(relatedField.reference_to)) {
        return { o: masterObjectName, ids: [record_id] }
    } else if (relatedField.multiple) {
        return [record_id]
    } else {
        return record_id
    }
}

// 获取所有相关表
export async function getObjectRelatedList(
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
            related.push({
                masterObjectName: objectName,
                object_name: arr[0],
                foreign_key: arr[1],
                label: relatedList.label,
                columns: relatedList.field_names,
                sort: relatedList.sort,
                filters: relatedList.filters,
                visible_on: relatedList.visible_on,
                page_size: relatedList.page_size
            }); 
        }
    }else{
        const details = [].concat(uiSchema.details || []);
        for (const detail of details) {
            const arr = detail.split(".");
            related.push({
                masterObjectName: objectName,
                object_name: arr[0],
                foreign_key: arr[1]
            });
        }
    }

    return related;
}

// 获取单个相关表
export async function getRecordDetailRelatedListSchema(objectName, recordId, relatedObjectName, relatedKey, ctx){
    let { top, perPage, hiddenEmptyTable, appId, relatedLabel, className, columns, sort, filters, visible_on } = ctx;
    // console.log('getRecordDetailRelatedListSchema==>',objectName,recordId,relatedObjectName)
    const relatedObjectUiSchema = await getUISchema(relatedObjectName);
    const { label , fields } = relatedObjectUiSchema;
    if(!relatedLabel){
        relatedLabel = label;
    }
    if(!relatedKey){
        relatedKey = findKey(fields, function(field) { 
           return ["lookup","master_detail"].indexOf(field.type) > -1 && field.reference_to === objectName; 
        });
    }
    let globalFilter = null;
    const refField = await getField(relatedObjectName, relatedKey);

    if(!refField){
        return {
            uiSchema: relatedObjectUiSchema,
            amisSchema: {
                "type": "alert",
                "body": `未找到与相关列表对象${relatedObjectName}关联的相关表字段`,
                "level": "warning",
                "showIcon": true,
                "className": "mb-3"
            }
        }
    }

    let relatedValue = recordId;
    if(refField.reference_to_field && refField.reference_to_field != '_id'){
        const masterRecord = await getRecord(objectName, recordId, [refField.reference_to_field]);
        relatedValue = masterRecord[refField.reference_to_field]
    }
    
    if (
        refField._reference_to ||
        (refField.reference_to && !isString(refField.reference_to))
    ) {
        globalFilter = [
            [`${relatedKey}/o`, "=", objectName],
            [`${relatedKey}/ids`, "=", relatedValue],
        ];
    } else {
        globalFilter = [`${relatedKey}`, "=", relatedValue];
    }
    const recordRelatedListHeader = await getObjectRecordDetailRelatedListHeader(relatedObjectUiSchema, relatedLabel);
    const componentId = `steedos-record-related-list-${relatedObjectName}`;
    const options = {
        globalFilter,
        defaults: {
            listSchema: { 
                headerToolbar:[],
                columnsTogglable: false,
                onEvent: {
                    [`@data.changed.${relatedObjectName}`]: {
                        "actions": [
                            {
                                "actionType": "reload"
                            }
                        ]
                    }
                }
            },
            headerSchema: recordRelatedListHeader
        },
        showHeader: true,
        top: top,
        perPage: perPage,
        setDataToComponentId: componentId,
        tableHiddenOn: hiddenEmptyTable ? "this.$count === 0" : null,
        appId: appId,
        crudClassName: 'border-t border-slate-300',
        ...ctx
    }
    const amisSchema= (await getRelatedListSchema(relatedObjectName, 'all', options)).amisSchema;
    if(!amisSchema){
        return;
    }
    return {
        uiSchema: relatedObjectUiSchema,
        amisSchema: {
            type: "service",
            id: componentId,
            className: `steedos-record-related-list rounded border border-slate-300 bg-gray-100 mb-4 ${className}`,
            data: {
                "&": "$$",
                appId: "${appId}",
                app_id: "${appId}",
                masterObjectName: objectName,
                masterRecordId: "${recordId}",
                relatedKey: relatedKey,   
                objectName: relatedObjectName,
                listViewId: `amis-\${appId}-${relatedObjectName}-listview`,
                _isRelated: true
            },
            body:[
                {
                    ...amisSchema,
                    data: {
                        "&": "$$",
                        appId: "${appId}",
                        app_id: "${appId}",
                        relatedKey: relatedKey,
                        objectName: "${objectName}",
                        recordId: "${masterRecordId}",
                        defaultData: {
                            ...{[relatedKey]: getRelatedFieldValue(objectName, relatedValue, relatedObjectUiSchema, relatedKey)}
                        }
                    }
                }
            ]
        }
    };
}

/**
* 
* @param {*} uiSchema 
* @param {*} ctx 
* @returns 
* 1 对象uiSchema
* 2 列表视图名称: （排除日历视图）当无视图传入，取is_name为true的字段显示。
* 3 options
*/
function getDefaultRelatedListProps(uiSchema, listName, ctx) {
    // console.log('getDefaultRelatedListProps==>', uiSchema, listName, ctx)
    const listView = find(
        uiSchema.list_views,
        (listView, name) => {
            // 日历视图不在相关子表中出现
            if(listView.type === 'calendar'){
                return false;
            }
            // 传入listViewName空值则取第一个
            if (!listName) {
                listName = name;
            }
            return name === listName;
        }
    );
    let columns = [];
    let sort = '';
    let filter = null;
    let filtersFunction = null;
    if(listView){
        columns = getListViewColumns(listView, ctx.formFactor);
        sort = getListViewSort(listView);
        filter = getListViewFilter(listView);
        if(isArray(ctx.globalFilter) && ctx.globalFilter.length && isArray(filter) && filter.length){
            // 都有值
            filter = [ctx.globalFilter, 'and', filter]
        }else if(ctx.globalFilter && (!filter || !filter.length)){
            // globalFilter有值，filter无值
            filter = ctx.globalFilter;
        }
        filtersFunction = listView && listView._filters;
    }else{
        const isNameField = find(
            uiSchema.fields,
            (field,name)=>{
                return field.is_name;
            }
        )
        columns = isNameField ? [isNameField.name] : ['name'];
        if(ctx.globalFilter){
            filter = ctx.globalFilter;
        }
    }

    return {
        columns,
        sort,
        filter,
        filtersFunction
    }
};
  
function getRelatedListProps(uiSchema, listViewName, ctx) {
    if (ctx.columns) {
        const sort = getListViewSort(ctx.sort);
        let { filters , filtersFunction} = ctx;
        if(!filtersFunction && filters){
            filtersFunction = str2function(
                filters,
                'filters',
                'data'
            ) 
        }
        return {
            columns: ctx.columns,
            sort,
            filter: ctx.globalFilter,
            filtersFunction: filtersFunction
        }
    } else {
        return getDefaultRelatedListProps(uiSchema, listViewName, ctx);
    }
}

// 仅提供给单个相关子表内部使用
export async function getRelatedListSchema(
    objectName,
    listViewName,
    ctx
  ) {
    const uiSchema = await getUISchema(objectName);
    const listView = uiSchema.list_views;
    const listViewProps = getRelatedListProps(uiSchema,listViewName, ctx);
    // console.log('listViewProps==>', listViewProps)
    const {columns: listViewColumns, sort: listViewSort, filter: listviewFilter, filtersFunction } = listViewProps;
  
    const defaults = ctx.defaults || {};
  
    if(!defaults.headerSchema && ctx.showHeader){
        defaults.headerSchema = await getObjectListHeader(uiSchema, listViewName);
    }
  
    if(!ctx.showHeader){
        defaults.headerSchema = null;
    }
  
    ctx.defaults = defaults;

    // 由于steedos-object-table组件的上下文覆盖规则异常,此处手动删除无需的ctx参数
    delete ctx.filtersFunction;
    delete ctx.sort;
    delete ctx.extraColumns;
    delete ctx.filters;

    delete ctx.globalFilter;
    const amisSchema = {
        "type": "steedos-object-table",
        "objectApiName": objectName,
        "columns": listViewColumns,
        "extraColumns": listView.extra_columns,
        "filters": listviewFilter,
        "filtersFunction": filtersFunction,
        "sort": listViewSort,
        "ctx": ctx
    };
    // console.log(`getRelatedListSchema amisSchema`, amisSchema);
    return {
        uiSchema,
        amisSchema,
    };
  }