import { fetchAPI, getSteedosAuth } from "./steedos.client"
import { each } from "lodash";

export const getRelatedsCount = async (masterRecordId, relateds) => {
    const relatedQuery = [];

    each(relateds, (relate)=>{
        relatedQuery.push(`${relate.object_name}: ${relate.object_name}__count(filters: [["${relate.foreign_key}","=","${masterRecordId}"]])`);
    })

    const query = `
    {
        ${relatedQuery.join(',')}
    }
    `;
    const result = await fetchAPI('/graphql', {
        method: 'POST',
        body: JSON.stringify({ query })
    })

    return result.data
}

export const getRecordPermissions = async (objectName, recordId)=>{
    const result = await fetchAPI(`/service/api/@${objectName}/recordPermissions/${recordId}`, {
        method: 'GET'
    })
    console.log('result', result);
    return result;
}