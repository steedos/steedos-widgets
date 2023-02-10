/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-01-11 14:27:23
 * @Description: 
 */
import { getObjectRelatedList } from '@steedos-widgets/amis-lib'
import { map } from 'lodash';

export const AmisRecordDetailRelatedLists = async (props) => {
  // console.log(`AmisRecordDetailRelatedList props==>`, props)
  const { objectApiName, recordId, appId, data, perPage = 5 } = props;
  if(!objectApiName){
    return {
      "type": "alert",
      "body": "缺少父级对象",
      "level": "warning",
      "showIcon": true,
      "className": "mb-3"
    }
  }
  let formFactor = props.formFactor;
  if(!formFactor){
    formFactor = window.innerWidth < 768 ? 'SMALL' : 'LARGE';
  }
  const relatedLists = await getObjectRelatedList(appId, objectApiName, recordId, formFactor);
  return {
    type: 'service',
    className: "steedos-record-detail-related-lists",
    body: map(relatedLists, (item)=>{
      return {
        type: 'steedos-object-related-listview',
        objectApiName: objectApiName,
        recordId: recordId,
        relatedObjectApiName: item.object_name,
        foreign_key: item.foreign_key,
        relatedKey: item.foreign_key,
        columns: item.columns,
        sort: item.sort,
        filters: item.filters,
        visible_on: item.visible_on,
        perPage: item.page_size || perPage,
        hiddenEmptyTable: true,
        appId: appId,
        relatedLabel: item.label
      }
    })
  }
}