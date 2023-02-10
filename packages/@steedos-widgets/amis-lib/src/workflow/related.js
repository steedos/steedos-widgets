/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-16 17:26:12
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-09 09:48:18
 * @Description: 
 */
import { map, isEmpty } from 'lodash'
import { getSteedosAuth } from '@steedos-widgets/amis-lib';
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

// TODO delete button
export const getRelatedInstances = async (instance)=>{
    // if(!instance.related_instances || isEmpty(instance.related_instances)){
    //     return ;
    // }
    const spaceId = getSteedosAuth().tenantId;
    
    return {
        "type": "list",
        "name": "relatedInstances",
        "source": "${related_instances}",
        title: "相关文件",
        "listItem": {
          "body": [
            {
                type: 'tpl',
                inline: true,
                tpl: `<a href='\${context.rootUrl}/workflow/space/${spaceId}/view/readonly/\${_id}' target='_blank'>\${name}</a>`
            }
          ],
          "actions": [
            {
              "icon": "fa fa-eye",
              "type": "button",
              "id": "u:ef52fa8940a8"
            }
          ],
          "id": "u:550b3fdc8788"
        },
        "id": "related_instances"
    }
}