import { fetchAPI } from "./steedos.client"

export const getNotifications = async () => {
    const query = `
    {
        notifications(filters: ["owner","=","62538e715ab244718b22348b"], sort: "created desc,name", top : 10){
          name,body,related_to,related_name,url,owner,is_read,from,created
        },
        unReadCount: notifications__count(filters: [["owner","=","62538e715ab244718b22348b"], ["is_read", "!=", true]])
    }
    `;
    const result = await fetchAPI('/graphql', {
        method: 'POST',
        body: JSON.stringify({ query })
    })

    return result.data
}