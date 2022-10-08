/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-02 10:56:25
 * @Description: 
 */
import {getFormSchema, getViewSchema} from '@steedos-widgets/amis-lib'

export const AmisObjectForm = async (props) => {
  // console.log('AmisObjectForm props==>', props)
  const { objectApiName, recordId, mode, id, layout, labelAlign, actions } = props;
  if(!objectApiName){
    return {}
  }
  const options = {
    recordId,
    mode: mode,
    layout: layout === 'vertical' ? 'normal' : layout,
    labelAlign,
    id, 
    actions
  }
  if(mode === 'edit'){
    return (await getFormSchema(objectApiName, options)).amisSchema;
  }else{
    return (await getViewSchema(objectApiName, recordId, options)).amisSchema;
  }
}