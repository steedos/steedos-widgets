/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-15 15:01:19
 * @Description: 
 */
import { getRecordDetailRelatedListSchema } from '@steedos-widgets/amis-lib'
import { has } from 'lodash';

export const AmisRecordDetailRelatedList = async (props: any) => {
  // console.log(`AmisRecordDetailRelatedList props==>`, props)
  const { $schema, objectApiName, recordId, relatedObjectApiName, data, relatedKey, top, perPage, hiddenEmptyTable, appId, relatedLabel, className = '', columns, sort, filters, visible_on, requestAdaptor, adaptor } = props;
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
  const formData :any = {};
  if(has(props, "recordId") && $schema.recordId !== "${recordId}"){
    formData.recordId = recordId;
  }
  const schema: any = (await getRecordDetailRelatedListSchema(objectApiName, recordId, relatedObjectApiName, relatedKey, {top, perPage, appId, relatedLabel, className, formFactor, columns, sort, filters, visible_on, isRelated: true, hiddenEmptyTable, requestAdaptor, adaptor})).amisSchema;
  
  schema.data = Object.assign(schema.data, formData);

  if(recordId){
    schema.data = Object.assign(schema.data, {
      _master: {
        objectName: objectApiName,
        recordId: recordId
      }
    });
  }
  
  return schema
}