import { first, keys, map, find } from 'lodash';
import { getUISchema, getObjectRelatedList,getRecordDetailHeaderSchema, getFormSchema, getViewSchema, getListViewColumns, getListViewSort } from './objects';
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
    const listViewName = first(keys(uiSchema.list_views));
    const headerSchema = await getObjectListHeader(uiSchema, listViewName);

    return {
        type: 'page',
        bodyClassName: '',
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
            "headerSchema": headerSchema
        }]
    }
}

// 获取
export async function getRecordPageInitSchema(objectApiName){
    // console.log('getRecordPageSchema==>', objectApiName, ctx, formFactor, userSession);
    // const detailHeaderAmisSchema = (await getRecordDetailHeaderSchema(objectApiName, "${recordId}")).amisSchema;
    // const objectFormAmisSchema = (await getViewSchema(objectApiName, "${recordId}", {labelAlign:"left"})).amisSchema;
    
    const recordId = '${recordId}';
    const relatedList = await getAmisObjectRelatedList(null, objectApiName, recordId, null);
    let body = [
        // detailHeaderAmisSchema,
        {
            "type": "steedos-record-detail-header",
            "label": "标题面板",
            "objectApiName": "${objectName}",
            "recordId": "${recordId}",
            "onEvent": {
                "recordLoaded": {
                    "actions": [
                        {
                            "actionType": "reload",
                            "data": {
                                "name": "${record.name}"
                            }
                        }
                    ]
                }
            }
        }
    ];
    let contentBody = {
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
                ]
            }
        ],
        "className": "bg-white mb-4",
        "linksClassName": "pl-4 pt-2"
    };
    const relatedListSchema = map(relatedList,(item)=>{
        return item.schema.amisSchema;
    })
    if(relatedListSchema.length){
        contentBody.tabs.push({
            "title": "相关",
            "body": relatedListSchema
        })
    }
    body.push(contentBody);
    return {
        type: 'page',
        id: `page_${objectApiName}_record_detail`,
        bodyClassName: '',
        regions: [
            "body"
        ],
        body
    }
}

// 获取对象的某个列表视图初始化amisSchema
export async function getListviewInitSchema(objectApiName, listViewName, ctx) {
    if(!ctx){
        ctx = {};
    }
    const uiSchema = await getUISchema(objectApiName);
    const listView =  find(
        uiSchema.list_views,
        (listView, name) => {
            return name === listViewName;
        }
    );

    let amisSchema = {};

    if (listView) {
        const listViewColumns = getListViewColumns(listView, ctx.formFactor);
        const sort = getListViewSort(listView);
        //传入isListviewInit是区别于对象列表类型的微页面，即getListPageInitSchema函数中该属性为false
        const headerSchema = await getObjectListHeader(uiSchema, listViewName, {
            onlySecordLine: true,
            isListviewInit: true
        });
    
        amisSchema = {
            "type": "steedos-object-table",
            "objectApiName": objectApiName,
            "columns": listViewColumns,
            "extraColumns": listView.extra_columns,
            "filters": listView.filters,
            "sort": sort,
            "headerSchema": headerSchema
        };
    }

    return {
        type: 'page',
        bodyClassName: 'p-0',
        regions: [
            "body"
        ],
        // name: `page_${readonly ? 'readonly':'edit'}_${recordId}`
        body: [amisSchema],
        data:{
            listName: listViewName
        }
    }
}