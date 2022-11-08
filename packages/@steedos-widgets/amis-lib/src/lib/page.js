/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 15:18:03
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-08 09:35:03
 * @Description: 
 */
import { fetchAPI } from './steedos.client';

export async function getPage({type, pageId, appId, objectName = '', recordId, formFactor = 'LARGE'}){
    if(!objectName){
        objectName = ''
    }
    if(!recordId){
        recordId = ''
    }
    if(!pageId){
        pageId = ''
    }
    const api = `/api/pageSchema/${type}?app=${appId}&objectApiName=${objectName}&recordId=${recordId}&pageId=${pageId}&formFactor=${formFactor}`;
    const page = await fetchAPI(api);
    if (page && page.schema) {
        return page;
    }
}