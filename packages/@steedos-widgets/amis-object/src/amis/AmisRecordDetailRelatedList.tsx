/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-28 11:35:58
 * @Description: 
 */
import { getRecordDetailRelatedListSchema, i18next } from '@steedos-widgets/amis-lib'
import { has, isEmpty } from 'lodash';

export const AmisRecordDetailRelatedList = async (props: any) => {
  const { $schema, objectApiName, recordId, relatedObjectApiName, data, relatedKey, top, perPage, 
    hiddenEmptyTable, appId, relatedLabel, className = '', columns, sort, filters, visible_on, requestAdaptor, adaptor, visibleOn,
    crud, crudDataFilter, onCrudDataFilter, env, enableHeaderToolbar
  } = props;
  let formFactor = props.formFactor;
  if(!formFactor){
    formFactor = window.innerWidth < 768 ? 'SMALL' : 'LARGE';
  }
  if(!objectApiName || !relatedObjectApiName){
  // if(!objectApiName || !relatedObjectApiName || !recordId){
    return {
      "type": "alert",
      "body": i18next.t('frontend_record_detail_related_list_warning'),
      "level": "warning",
      "showIcon": true,
      "className": "mb-3"
    }
  }
  const formData :any = {};
  if(has(props, "recordId") && $schema.recordId !== "${recordId}"){
    formData.recordId = recordId;
  }
  const schema: any = (await getRecordDetailRelatedListSchema(objectApiName, recordId, relatedObjectApiName, relatedKey, {
    top, perPage, appId, relatedLabel, className, formFactor, columns, sort, 
    filters, visible_on, isRelated: true, hiddenEmptyTable, requestAdaptor, adaptor,
    crud, crudDataFilter, onCrudDataFilter, env, enableHeaderToolbar
  })).amisSchema;
  
  if(isEmpty(schema)){
    return {}
  }
  schema.data = Object.assign(schema.data || {}, formData);

  schema.data = Object.assign(schema.data, {
    objectName: relatedObjectApiName,
    _master: {
      record: data?._master?.record,
      objectName: objectApiName,
      recordId: recordId
    }
    });
  // 因为 visibleOn 的值格式是字符串，所以这里加个判断条件。
  if(visibleOn){
    schema.visibleOn = visibleOn;
  }
  // console.log(`AmisRecordDetailRelatedList props==>`, props, schema)
  return schema
}