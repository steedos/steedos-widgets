/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 09:00:26
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-03 13:21:38
 * @Description: 
 */
import { fetchAPI, getSteedosAuth } from "./steedos.client"
import { each } from "lodash";

const getGraphqlFieldsQuery = (fields)=>{
    const fieldsName = ['_id'];
    fields.push('record_permissions');
    //TODO 此处需要考虑相关对象查询
    each(fields, (fieldName)=>{
        if(fieldName.indexOf('.') > -1){
            fieldName = fieldName.split('.')[0]
        }
        fieldsName.push(`${fieldName}`)
    })
    return `${fieldsName.join(' ')}`;
}

const getFindOneQuery = (objectName, id, fields)=>{
    objectName = objectName.replace(/\./g, '_');
    const queryFields = getGraphqlFieldsQuery(fields);
    let queryOptions = ''
    let alias = "record";
    
    const queryOptionsArray = [`id: "${id}"`];
    
    if(queryOptionsArray.length > 0){
        queryOptions = `(${queryOptionsArray.join(',')})`
    }

    return `{${alias}:${objectName}__findOne${queryOptions}{${queryFields}}}`
}

export const getRecord = async (objectName, recordId, fields)=>{
    const result = await fetchAPI('/graphql', {
        method: 'post',
        body: JSON.stringify({
            query: getFindOneQuery(objectName, recordId, fields)
        })
    })
    return result.data.record;
}

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
    return result;
}