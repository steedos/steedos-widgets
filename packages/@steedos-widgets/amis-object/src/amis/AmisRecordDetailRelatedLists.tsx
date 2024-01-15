/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-01-15 15:52:34
 * @Description: 
 */
import { getObjectRelatedList, i18next } from '@steedos-widgets/amis-lib'
import { map, has } from 'lodash';

export const AmisRecordDetailRelatedLists = async (props) => {
  // console.log(`AmisRecordDetailRelatedLists props==>`, props)
  const {$schema, objectApiName, recordId, data, perPage = 5 } = props;
  if(!objectApiName){
  // if(!objectApiName || !recordId){
    return {
      "type": "alert",
      "body": i18next.t('frontend_record_detail_related_lists_warning'),
      "level": "warning",
      "showIcon": true,
      "className": "mb-3"
    }
  }
  let formFactor = props.formFactor;
  if(!formFactor){
    formFactor = window.innerWidth < 768 ? 'SMALL' : 'LARGE';
  }
  // console.log(`getObjectRelatedList====>`,objectApiName, recordId, formFactor)
  const relatedLists = await getObjectRelatedList(objectApiName, recordId, formFactor);
  if(!relatedLists || !relatedLists.length){
    return {
      "type": "alert",
      "body": i18next.t('frontend_record_detail_related_lists_info'),
      "level": "info",
      "showIcon": true,
      "className": "mb-3"
    }
  }
  let staticRecordId = props.staticRecordId;
  // 在设计器中的设计状态，当上层有recordId具体值，相关表组件的$schema.recordId的默认值就是 "${recordId}"； 会导致获取不到 _master, 进而导致组件显示不了数据。
  if(has(props, "recordId") && ( $schema.recordId !== "${recordId}" || (props.$$editor && props.recordId !== "${recordId}") )){
    staticRecordId = recordId;
  }
  // console.log('relatedLists======>', relatedLists, staticRecordId)
  return {
    type: 'service',
    className: "steedos-record-detail-related-lists",
    body: map(relatedLists, (item)=>{
      let relatedList: any = {
        type: 'steedos-object-related-listview',
        objectApiName: objectApiName,
        // recordId: recordId,
        formFactor: formFactor,
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
      // console.log('relatedList=====>', relatedList)
      return relatedList;
    })
  }
}