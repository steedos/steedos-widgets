/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-02 10:56:25
 * @Description: 
 */
import {getFormSchema, getViewSchema} from '@steedos-widgets/amis-lib'

export const AmisObjectForm = async (props) => {
  // console.log('props==>', props)
  const { $schema, objectApiName, recordId } = props;
  const options = {
    recordId: recordId || $schema.recordId,
    mode: $schema.mode,
    layout: $schema.layout === 'vertical' ? 'normal' : $schema.layout,
    labelAlign:  $schema.labelAlign
  }
  if($schema.mode === 'edit'){
    return (await getFormSchema(objectApiName, options)).amisSchema;
  }else{
    return (await getViewSchema(objectApiName, recordId, options)).amisSchema;
  }
}