import { first, keys, map } from 'lodash';
import { getUISchema, getObjectRelatedList,getRecordDetailHeaderSchema, getFormSchema, getViewSchema } from './objects';
import { getAmisObjectRelatedList } from './objectsRelated';

import { getObjectListHeader,getObjectRecordDetailRelatedListHeader } from './converter/amis/header';
// import { getListSchema } from './objects';

// 获取表单初始化amisSchema
export async function getFormPageInitSchema(objectApiName) {
    const schema = await getFormSchema(objectApiName, {recordId: '${recordId}'});
    return {
        type: 'page',
        bodyClassName: '',
        regions: [
            "body"
        ],
        body:[
            schema.amisSchema
        ]
    }
}

// 获取列表页面初始化amisSchema
export async function getListPageInitSchema(objectApiName, formFactor, userSession) {
    // let schema = await getListSchema(null, objectApiName, null, { showHeader: true });
    // let amisSchema = schema && schema.amisSchema;
    // if (amisSchema) {
    //     return {
    //         type: 'page',
    //         bodyClassName: 'p-0',
    //         regions: [
    //             "body"
    //         ],
    //         // name: `page_${readonly ? 'readonly':'edit'}_${recordId}`
    //         body: amisSchema
    //     }
    // }

    const uiSchema = await getUISchema(objectApiName);
    const listViewName = first(keys(uiSchema.list_views))
    const ctx = {};
    const defaults = {};
    defaults.headerSchema = await getObjectListHeader(uiSchema, listViewName);

    ctx.defaults = defaults;

    return {
        type: 'page',
        bodyClassName: 'p-0',
        regions: [
            "body"
        ],
        // name: `page_${readonly ? 'readonly':'edit'}_${recordId}`
        body: [{
            "type": "steedos-object-listview",
            "objectApiName": objectApiName,
            // "listName": "${listName}",
            // "headerToolbar": [],
            "columnsTogglable": false,
            "showHeader": true,
            "ctx": ctx
        }]
    }
}

// 获取
export async function getRecordPageInitSchema(objectApiName, ctx, formFactor, userSession){
    console.log('getRecordPageSchema==>', objectApiName, ctx, formFactor, userSession);
    // const detailHeaderAmisSchema = (await getRecordDetailHeaderSchema(objectApiName, "${recordId}")).amisSchema;
    // const objectFormAmisSchema = (await getViewSchema(objectApiName, "${recordId}", {labelAlign:"left"})).amisSchema;

    const relatedList = await getAmisObjectRelatedList(null, objectApiName, ctx.recordId, null);
    let body = [
        // detailHeaderAmisSchema,
        {
            "type": "steedos-record-detail-header",
            "label": "标题面板",
            "objectApiName": "${objectName}",
            "recordId": "${recordId}",
        },
        {
            "type": "tabs",
            "tabs": [
                {
                    "title": "详情",
                    "body": [
                        // objectFormAmisSchema
                        {
                            "type": "steedos-object-form",
                            "label": "对象表单",
                            "mode": "read",
                            "objectApiName": "${objectName}",
                            "recordId": "${recordId}",
                            "labelAlign": "left"
                        }
                    ],
                }
            ],
            "className": "bg-white mb-4"
        },
        
    ]

    const relatedListSchema = map(relatedList,(item)=>{
        return item.schema.amisSchema;
    })
    body = body.concat(relatedListSchema);
    return {
        type: 'page',
        bodyClassName: '',
        regions: [
            "body"
        ],
        body
    }
}