/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-16 17:26:12
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-08-31 09:46:58
 * @Description: 
 */
import { map, isEmpty } from 'lodash'
import { getSteedosAuth } from '@steedos-widgets/amis-lib';
import { i18next } from "@steedos-widgets/amis-lib";
export const getRelatedRecords = async (instance)=>{
    if(!instance.record_ids || isEmpty(instance.record_ids)){
        return ;
    }
    return map(instance.record_ids, (item)=>{
        return {
            type: 'tpl',
            tpl: `<a href='/app/-/${item.o}/view/${item.ids[0]}' target='_blank'>${i18next.t('frontend_workflow_related_records_link_title')}</a>`
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
        title: i18next.t('frontend_workflow_related_file'),
        "listItem": {
          "body": [
            {
                type: 'tpl',
                inline: true,
                tpl: `<a href='\${context.rootUrl}/workflow/space/${spaceId}/view/readonly/\${_id}' target='_blank'>\${name}</a>`
            }
          ],
          "actions": [
          ],
          "id": "u:550b3fdc8788"
        },
        "id": "related_instances"
    }
}