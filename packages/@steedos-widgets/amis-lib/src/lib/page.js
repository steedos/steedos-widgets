/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 15:18:03
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-08-15 12:12:08
 * @Description: 
 */
import { fetchAPI } from './steedos.client';
import { has } from 'lodash';
let pageCache = {};

export async function getPage({type, pageId = '', appId, objectName = '', recordId = '', formFactor = 'LARGE'}){
    const api = `/api/pageSchema/${type}?app=${appId}&objectApiName=${objectName}&recordId=${recordId}&pageId=${pageId}&formFactor=${formFactor}`;

    if(has(pageCache, api)) {
        return pageCache[api];
    }

    const page = await fetchAPI(api);
    if (page && page.schema) {
        page.schema = JSON.parse(page.schema)
        if(page.schema.data){
            delete page.schema.data.recordId;
            delete page.schema.data.objectName;
            delete page.schema.data.context;
            delete page.schema.data.global
        }
        pageCache[api] = page;
        return JSON.parse(JSON.stringify(page)); //clone page;
    }
    pageCache[api] = null;
}