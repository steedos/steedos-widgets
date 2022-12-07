/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 15:04:42
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-29 18:43:12
 * @Description: 
 */
import { each } from 'lodash';
import { fetchAPI, getUISchema } from '@steedos-widgets/amis-lib';

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

export const SObject = {
    getRecord: async (objectName, recordId, fields)=>{
        const result = await fetchAPI('/graphql', {
            method: 'post',
            body: JSON.stringify({
                query: getFindOneQuery(objectName, recordId, fields)
            })
        })
        return result.data.record;
    },
    getUISchema: async (objectName, force)=>{
        return await getUISchema(objectName, force)
    }
}