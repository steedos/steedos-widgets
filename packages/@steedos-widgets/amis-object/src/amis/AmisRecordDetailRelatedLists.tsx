/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-07 09:33:14
 * @Description: 
 */
import { getObjectRelatedList } from '@steedos-widgets/amis-lib'
import { map } from 'lodash';

export const AmisRecordDetailRelatedLists = async (props) => {
  // console.log(`AmisRecordDetailRelatedList props==>`, props)
  const { objectApiName, recordId, appId, data, formFactor, top = 5 } = props;
  if(!objectApiName){
    return {
      "type": "alert",
      "body": "缺少父级对象",
      "level": "warning",
      "showIcon": true,
      "className": "mb-3"
    }
  }
  const relatedLists = await getObjectRelatedList(appId, objectApiName, recordId, formFactor);
  return {
    type: 'service',
    body: map(relatedLists, (item)=>{
      return {
        type: 'steedos-object-related-listview',
        objectApiName: objectApiName,
        recordId: recordId,
        relatedObjectApiName: item.object_name,
        foreign_key: item.foreign_key,
        relatedKey: item.foreign_key,
        top: top,
        hiddenEmptyTable: true
      }
    })
  }
}