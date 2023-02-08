/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:55:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-03 13:17:56
 * @Description:
 */


import { getObjectRecordDetailRelatedListHeader } from './converter/amis/header';
import { isEmpty,  find, isString, forEach, keys, findKey } from "lodash";
import { getUISchema, getListSchema, getField } from './objects'
import { getRecord } from './record';

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
                foreign_key: arr[1],
                label: uiSchema.label
            });
        }
    }

    return related;
}

// 获取单个相关表
export async function getRecordDetailRelatedListSchema(objectName, recordId, relatedObjectName, relatedKey, ctx){
    let { top, perPage, hiddenEmptyTable, appId, relatedLabel, className } = ctx;
    // console.log('getRecordDetailRelatedListSchema==>',objectName,recordId,relatedObjectName)
    const relatedObjectUiSchema = await getUISchema(relatedObjectName);
    const { list_views, label , icon, fields } = relatedObjectUiSchema;
    if(!relatedLabel){
        relatedLabel = label;
    }
    const firstListViewName = keys(list_views).includes('all') ? 'all' : keys(list_views)[0];
    if(!relatedKey){
        relatedKey = findKey(fields, function(field) { 
           return ["lookup","master_detail"].indexOf(field.type) > -1 && field.reference_to === objectName; 
       });
    }
    let globalFilter = null;
    const refField = await getField(relatedObjectName, relatedKey);

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
            listSchema: { headerToolbar:[],columnsTogglable:false },
            headerSchema: recordRelatedListHeader
        },
        showHeader: true,
        top: top,
        perPage: perPage,
        setDataToComponentId: componentId,
        tableHiddenOn: hiddenEmptyTable ? "this.$count === 0" : null,
        appId: appId,
        ...ctx
    }
    const amisSchema= (await getListSchema(null, relatedObjectName, firstListViewName, options)).amisSchema;
    if(!amisSchema){
        return;
    }
    return {
        uiSchema: relatedObjectUiSchema,
        amisSchema: {
            type: "service",
            id: componentId,
            className: `steedos-record-related-list sm:rounded sm:border border-slate-300 bg-gray-100 mb-4 ${className}`,
            data: {
                "&": "$$",
                appId: "${appId}",
                app_id: "${appId}",
                masterObjectName: objectName,
                masterRecordId: "${recordId}",
                relatedKey: relatedKey,   
                objectName: relatedObjectName,
                listViewId: `amis-\${appId}-${relatedObjectName}-listview`,
            },
            body:[
                {
                    ...amisSchema,
                    data: {
                        "&": "$$",
                        appId: "${appId}",
                        app_id: "${appId}",
                        // filter: ["${relatedKey}", "=", "${masterRecordId}"], 此语法不符合amis 数据映射规范
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