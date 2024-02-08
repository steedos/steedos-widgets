/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-02-08 16:06:28
 * @Description: 
 */
import { getRecordDetailRelatedListSchema, i18next } from '@steedos-widgets/amis-lib'
import { has, isEmpty } from 'lodash';

export const AmisRecordDetailRelatedList = async (props: any) => {
  // console.log(`AmisRecordDetailRelatedList props==>`, props)
  const { $schema, objectApiName, recordId, relatedObjectApiName, data, relatedKey, top, perPage, 
    hiddenEmptyTable, appId, relatedLabel, className = '', columns, sort, filters, visible_on, requestAdaptor, adaptor, visibleOn,
    crud, crudDataFilter, onCrudDataFilter, env
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
    crud, crudDataFilter, onCrudDataFilter, env
  })).amisSchema;
  
  if(isEmpty(schema)){
    return {}
  }
  schema.data = Object.assign(schema.data || {}, formData);

  if(has(props, "recordId") && ( $schema.recordId !== "${recordId}" || (props.$$editor && props.recordId !== "${recordId}") )){
    schema.data = Object.assign(schema.data, {
      _master: {
        record: data?._master?.record,
        objectName: objectApiName,
        recordId: recordId
      }
    });
  }
  // 因为 visibleOn 的值格式是字符串，所以这里加个判断条件。
  if(visibleOn){
    schema.visibleOn = visibleOn;
  }
  return schema
}