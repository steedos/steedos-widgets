import { fetchAPI, getSteedosAuth } from "./steedos.client"

export const getNotifications = async () => {
    const auth = getSteedosAuth();
    const query = `
    {
        notifications(filters: ["owner","=","${auth.userId}"], sort: "created desc,name", top : 10){
          name,body,related_to,related_name,url,owner,is_read,from,created
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