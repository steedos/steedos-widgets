/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-26 18:07:37
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-01-07 14:38:34
 * @Description: 
 */
import { Field } from '@steedos-widgets/amis-lib';
import { isString } from 'lodash';

export const AmisSteedosField = async (props)=>{
    let { field, readonly = false, ctx = {} } = props;
    // console.log(`AmisSteedosField`, props)
    if(isString(field)){
        field = JSON.parse(field);
    }
    if(isString(ctx)){
        ctx = JSON.parse(ctx);
    }
    try {
        const schema = await Field.convertSFieldToAmisField(field, readonly, ctx);
        console.log(`schema`, schema)
        return schema
    } catch (error) {
        console.log(`error`, error)
    }
    return null;
}