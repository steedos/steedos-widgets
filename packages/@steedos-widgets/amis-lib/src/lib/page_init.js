import { first, keys, map, find } from 'lodash';
import { getUISchema, getRecordDetailHeaderSchema, getFormSchema, getViewSchema, getListViewColumns, getListViewSort, getTableSchema } from './objects';
import { getObjectRelatedList } from './objectsRelated';

import { getObjectListHeader,getObjectRecordDetailRelatedListHeader } from './converter/amis/header';
// import { getListSchema } from './objects';

function getScopeId(objectApiName,type){
    return `page_${objectApiName}_${type}`;
}

// 获取表单初始化amisSchema
export async function getFormPageInitSchema(objectApiName) {
    const schema = await getFormSchema(objectApiName, {recordId: '${recordId}'});
    return {
        type: 'page',
        name: getScopeId(objectApiName,"form"),
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

    // const uiSchema = await getUISchema(objectApiName);
    // const listViewName = first(keys(uiSchema.list_views));
    // const headerSchema = await getObjectListHeader(uiSchema, listViewName);

    return {
        type: 'page',
        name: getScopeId(objectApiName,"list"),
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
            // "headerSchema": headerSchema
            className: "sm:border bg-white sm:shadow sm:rounded border-slate-300 border-solid"
        }]
    }
}

// 获取
export async function getRecordPageInitSchema(objectApiName){
    // console.log('getRecordPageSchema==>', objectApiName, ctx, formFactor, userSession);
    // const detailHeaderAmisSchema = (await getRecordDetailHeaderSchema(objectApiName, "${recordId}")).amisSchema;
    // const objectFormAmisSchema = (await getViewSchema(objectApiName, "${recordId}", {labelAlign:"left"})).amisSchema;
    
    const recordId = '${recordId}';
    const relatedList = await getObjectRelatedList(null, objectApiName, recordId, null);
    const uiSchema = await getUISchema(objectApiName);
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
                            "actionType": "setValue",
                            "args": {
                              "value": {
                                "recordLoaded": true,
                              }
                            }
                        },
                        {
                            "actionType": "reload",
                            "data": {
                                "name": `\${record.${uiSchema?.NAME_FIELD_KEY || 'name'}}`,
                                "record": `\${record}`,
                                "recordLoaded": true,
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
        "className": "sm:mt-3 flex flex-col region-main bg-white sm:shadow sm:rounded sm:border border-slate-300",
        "linksClassName": "pl-4 pt-2"
    };
    if(relatedList.length){
        contentBody.tabs.push({
            "title": "相关",
            "body": {
              "type": "steedos-object-related-lists",
              "label": "所有相关表",
              "objectApiName": "${objectName}",
              "recordId": "${recordId}",
            },
        })
    }
    body.push(contentBody);
    return {
        type: 'page',
        id: `page_${objectApiName}_record_detail`,
        name: getScopeId(objectApiName,"record_detail"),
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
    
        // amisSchema = {
        //     "type": "steedos-object-table",
        //     "objectApiName": objectApiName,
        //     "columns": listViewColumns,
        //     "extraColumns": listView.extra_columns,
        //     "filters": listView.filters,
        //     "sort": sort,
        //     "headerSchema": headerSchema
        // };

        const defaults = ctx.defaults || {};
        if(!defaults.headerSchema){
            //传入isListviewInit是区别于对象列表类型的微页面，即getListPageInitSchema函数中该属性为false
            const headerSchema = await getObjectListHeader(uiSchema, listViewName, {
                onlySecordLine: true,
                isListviewInit: true
            });
            defaults.headerSchema = headerSchema;
        }
        ctx.defaults = defaults;
        let setDataToComponentId = ctx.setDataToComponentId;
        if(!setDataToComponentId){
          setDataToComponentId = `service_listview_${objectApiName}`;
        }
        const schema = await getTableSchema(null, objectApiName, listViewColumns, {
            sort,
            ...ctx,
            setDataToComponentId
        });
        amisSchema = schema.amisSchema;
        // TODO: 下面这些data下的无用属性在底层代码中就不应该加，待底层移除后下面的删除语句就可以去掉了
        delete amisSchema.data.$master;
        delete amisSchema.data._id;
        delete amisSchema.data.recordPermissions;
        delete amisSchema.data.uiSchema;
    }
    // 不可以外面包一层page，否则列表视图渲染时的data无法传入顶部第一行造成按钮显示异常
    return amisSchema;

    // return {
    //     type: 'page',
    //     bodyClassName: 'p-0',
    //     regions: [
    //         "body"
    //     ],
    //     // name: `page_${readonly ? 'readonly':'edit'}_${recordId}`
    //     body: [amisSchema],
    //     data:{
    //         listName: listViewName
    //     }
    // }
}