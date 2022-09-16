/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-16 17:26:12
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-16 17:36:59
 * @Description: 
 */
import { map, isEmpty } from 'lodash'

export const getRelatedRecords = async (instance)=>{
    if(!instance.record_ids || isEmpty(instance.record_ids)){
        return ;
    }
    return map(instance.record_ids, (item)=>{
        return {
            type: 'tpl',
            tpl: `<a href='/app/-/${item.o}/view/${item.ids[0]}' target='_blank'>相关台账信息</a>`
        }
    })
}

// TODO 
export const getRelatedInstances = async ()=>{

}