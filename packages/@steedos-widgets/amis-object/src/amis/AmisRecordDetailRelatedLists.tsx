/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-08 12:01:04
 * @Description: 
 */
import { getObjectRelatedList } from '@steedos-widgets/amis-lib'
import { map, has } from 'lodash';

export const AmisRecordDetailRelatedLists = async (props) => {
  // console.log(`AmisRecordDetailRelatedLists props==>`, props)
  const {$schema, objectApiName, recordId, data, perPage = 5 } = props;
  if(!objectApiName){
  // if(!objectApiName || !recordId){
    return {
      "type": "alert",
      "body": "缺少父级对象或父级记录属性",
      "level": "warning",
      "showIcon": true,
      "className": "mb-3"
    }
  }
  let formFactor = props.formFactor;
  if(!formFactor){
    formFactor = window.innerWidth < 768 ? 'SMALL' : 'LARGE';
  }
  const relatedLists = await getObjectRelatedList(objectApiName, recordId, formFactor);
  if(!relatedLists || !relatedLists.length){
    return {
      "type": "alert",
      "body": "没有相关子表",
      "level": "info",
      "showIcon": true,
      "className": "mb-3"
    }
  }
  let staticRecordId = '';
  if(has(props, "recordId") && $schema.recordId !== "${recordId}"){
    staticRecordId = recordId;
  }

  return {
    type: 'service',
    className: "steedos-record-detail-related-lists",
    body: map(relatedLists, (item)=>{
      let relatedList: any = {
        type: 'steedos-object-related-listview',
        objectApiName: objectApiName,
        // recordId: recordId,
        relatedObjectApiName: item.object_name,
        foreign_key: item.foreign_key,
        relatedKey: item.foreign_key,
        columns: item.columns,
        sort: item.sort,
        filters: item.filters,
        visible_on: item.visible_on,
        perPage: item.page_size || perPage,
        hiddenEmptyTable: true,
        relatedLabel: item.label
      }
      if(staticRecordId){
        relatedList.recordId = staticRecordId;
      }
      return relatedList;
    })
  }
}