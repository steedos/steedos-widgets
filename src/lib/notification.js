/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-15 11:53:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-27 16:54:21
 * @Description: 
 */
import { fetchAPI, getSteedosAuth } from "./steedos.client"

export const getNotifications = async () => {
    const auth = getSteedosAuth();
    const query = `
    {
        notifications(filters: ["owner","=","${auth.userId}"], sort: "created desc,name", top : 10){
          _id,name,body,related_to,related_name,url,owner,is_read,from,created
        },
        unReadCount: notifications__count(filters: [["owner","=","${auth.userId}"], ["is_read", "!=", true]])
    }
    `;
    const result = await fetchAPI('/graphql', {
        method: 'POST',
        body: JSON.stringify({ query })
    })

    return result.data
}

export const markReadAll = async ()=>{
    return await fetchAPI('/api/v4/notifications/all/markReadAll', {
        method: 'POST'
    });
}