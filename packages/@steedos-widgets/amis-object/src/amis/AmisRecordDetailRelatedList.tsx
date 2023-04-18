/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-18 16:34:05
 * @Description: 
 */
import { getRecordDetailRelatedListSchema } from '@steedos-widgets/amis-lib'


export const AmisRecordDetailRelatedList = async (props: any) => {
  // console.log(`AmisRecordDetailRelatedList props==>`, props)
  const { objectApiName, recordId, relatedObjectApiName, data, relatedKey, top, perPage, hiddenEmptyTable, appId, relatedLabel, className = '', columns, sort, filters, visible_on, requestAdaptor, adaptor } = props;
  let formFactor = props.formFactor;
  if(!formFactor){
    formFactor = window.innerWidth < 768 ? 'SMALL' : 'LARGE';
  }
  if(!objectApiName || !relatedObjectApiName){
  // if(!objectApiName || !relatedObjectApiName || !recordId){
    return {
      "type": "alert",
      "body": "缺少父级对象、父级记录或相关列表对象属性",
      "level": "warning",
      "showIcon": true,
      "className": "mb-3"
    }
  }
  const schema: any = (await getRecordDetailRelatedListSchema(objectApiName, recordId, relatedObjectApiName, relatedKey, {top, perPage, appId, relatedLabel, className, formFactor, columns, sort, filters, visible_on, isRelated: true, hiddenEmptyTable, requestAdaptor, adaptor})).amisSchema;
  return schema
}