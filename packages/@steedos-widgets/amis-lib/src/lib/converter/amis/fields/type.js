/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-28 14:52:55
 * @LastEditors: liaodaxue
 * @LastEditTime: 2023-07-28 16:16:29
 * @Description: 
 */
import * as _ from 'lodash';

const AmisFormInputs = [
    'text',
    'date',
    'file',
    "avatar",
    'image',
    'datetime',
    'time',
    'number',
    'currency',
    'percent',
    'password',
    'url',
    'email'
]

export function getAmisStaticFieldType(type, readonly, options){
    if(!readonly){
        if(_.includes(AmisFormInputs, type)){
            return `input-${type}`;
        }else if(type === 'location'){
            return "location-picker"
        }
        return type;
    }
    if(_.includes(['text','image'], type)){
        if('text' === type && options && options.amis && options.amis.tpl){
            return 'static';
        }
        if('image' === type && options && options.multiple){
            return `static-images`;
        }
        return `static-${type}`;
    }else if(type === 'url'){
        return "input-url"
    }else{
        return 'static';
    }
};