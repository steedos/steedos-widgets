/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:55:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-08 15:13:58
 * @Description:
 */

import {
    getObjectList
} from "./converter/amis/index";
import { getObjectRecordDetailRelatedListHeader } from './converter/amis/header';
import { isEmpty,  find, isString, forEach, keys, findKey } from "lodash";
import { getListViewItemButtons } from './buttons'
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
export async function getAmisObjectRelatedList(
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
                    // TODO: 也需在amisSchema上再添加一层service
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
                const relatedSchema =  await getListSchema(appName, arr[0], "all", {
                    // globalFilter: filter,
                    formFactor: formFactor,
                    buttons: await getListViewItemButtons(relatedUiSchema, {isMobile: false})
                });

                const relatedAmisSchema = relatedSchema.amisSchema;
                const recordRelatedListHeader = await getObjectRecordDetailRelatedListHeader(relatedUiSchema);
                relatedAmisSchema.headerSchema = recordRelatedListHeader;
                // relatedAmisSchema.listSchema =  { headerToolbar:[],columnsTogglable:false };
                relatedAmisSchema.headerToolbar =  [];
                relatedAmisSchema.columnsTogglable =  false ;
                relatedAmisSchema.globalFilter = relatedAmisSchema.filters;
                delete relatedAmisSchema.ctx;
                relatedSchema.amisSchema = {
                    type: "service",
                    data: {
                        masterObjectName: objectName,
                        masterRecordId: "${recordId}",
                        relatedKey: arr[1],   
                        objectName: arr[0],
                        listViewId: `amis-\${appId}-${arr[0]}-listview`,
                    },
                    body:[
                        {
                            ...relatedAmisSchema,
                            data: {
                                filter: ["${relatedKey}", "=", "${masterRecordId}"],
                                objectName: "${objectName}",
                                recordId: "${masterRecordId}",
                                defaultData: {
                                    ...{[arr[1]]: getRelatedFieldValue(objectName, recordId, relatedSchema.uiSchema, arr[1])}
                                }
                            }
                        }
                    ]
                }

                related.push({
                    masterObjectName: objectName,
                    object_name: arr[0],
                    foreign_key: arr[1],
                    schema: relatedSchema,
                });
            }
        }
    }

    return related;
}

// 获取单个相关表
export async function getRecordDetailRelatedListSchema(objectName, recordId, relatedObjectName, relatedKey, top, hiddenEmptyTable, appId){
    // console.log('b==>',objectName,recordId,relatedObjectName)
    const relatedObjectUiSchema = await getUISchema(relatedObjectName);
    const { list_views, label , icon, fields } = relatedObjectUiSchema;
    const firstListViewName = keys(list_views)[0];
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
    const recordRelatedListHeader = await getObjectRecordDetailRelatedListHeader(relatedObjectUiSchema);
    const componentId = `steedos-record-related-list-${relatedObjectName}`;
    const options = {
        globalFilter,
        defaults: {
            listSchema: { headerToolbar:[],columnsTogglable:false },
            headerSchema: recordRelatedListHeader
        },
        showHeader: true,
        top: top,
        setDataToComponentId: componentId,
        tableHiddenOn: hiddenEmptyTable ? "this.$count === 0" : null,
        appId: appId
    }
    const amisSchema= (await getListSchema(null, relatedObjectName, firstListViewName, options)).amisSchema;
    return {
        uiSchema: relatedObjectUiSchema,
        amisSchema: {
            type: "service",
            id: componentId,
            className: "steedos-record-related-list bg-white mb-1 border",
            data: {
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