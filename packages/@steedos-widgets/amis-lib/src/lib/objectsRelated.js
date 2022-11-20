/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:55:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-07 15:18:27
 * @Description:
 */

import {
    getObjectList
} from "./converter/amis/index";
import { getObjectRecordDetailRelatedListHeader } from './converter/amis/header';
import { isEmpty,  find, isString, forEach } from "lodash";
import { getListViewItemButtons } from './buttons'
import { getUISchema, getListSchema, getField } from './objects'


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
                relatedAmisSchema.ctx.defaults = Object.assign(relatedAmisSchema.ctx.defaults, {
                    listSchema: { headerToolbar:[],columnsTogglable:false },
                    headerSchema: recordRelatedListHeader
                })
                relatedAmisSchema.ctx.globalFilter = relatedAmisSchema.filters;
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
                                recordId: "${masterRecordId}"
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
