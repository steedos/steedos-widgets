/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-26 18:07:37
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-27 18:55:29
 * @Description: 
 */
import { Field } from '@steedos-widgets/amis-lib';
import { isString } from 'lodash';

export const AmisSteedosField = async (props)=>{

    let steedosField = null;

    let { field, readonly = false, ctx = {}, config, $schema } = props;
    // console.log(`AmisSteedosField`, props)

    if($schema.config && isString($schema.config)){
        $schema.config = JSON.parse($schema.config)
        props.config = $schema.config
    }

    if(isString(ctx)){
        ctx = JSON.parse(ctx);
    }

    if(config){
        steedosField = config;
        if(isString(steedosField)){
            steedosField = JSON.parse(config);
        }
    }else{
        steedosField = field;
        if(isString(field)){
            steedosField = JSON.parse(field);
        }
    }
    try {
        const schema = await Field.convertSFieldToAmisField(steedosField, readonly, ctx);
        // console.log(`schema`, schema)
        return schema
    } catch (error) {
        console.log(`error`, error)
    }
    return null;
}