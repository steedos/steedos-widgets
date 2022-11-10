import { first, keys } from 'lodash';
// import { getListSchema } from './objects';

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
            "objectApiName": "space_users",
            // "listName": "${listName}",
            // "headerToolbar": [],
            "columnsTogglable": false,
            "showHeader": true,
            "ctx": ctx
        }]
    }
}