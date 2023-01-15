/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-01-13 10:46:56
 * @Description: 
 */
import { getFormSchema, getViewSchema } from '@steedos-widgets/amis-lib'
import { keys, pick, difference } from 'lodash';

export const AmisObjectForm = async (props) => {
  const { $schema, recordId, mode, layout, labelAlign, appId } = props;
  let objectApiName = props.objectApiName || "space_users";
  // amis中的mode属性是表单布局,没有layout属性。defaults的变量会覆盖mode属性值。
  const schemaKeys = difference(keys($schema), ["type","mode","layout"]);
  const formSchema = pick(props, schemaKeys);
  const defaults = {
    formSchema
  };
  const options: any = {
    recordId,
    mode: mode,
    layout: layout === 'vertical' ? 'normal' : layout,
    labelAlign,
    defaults,
    appId
  }

  const globalData = props.data.global;

  globalData.mode = mode === 'edit' ? 'edit' : 'read'

  if (mode === 'edit') {
    const amisSchema: any = (await getFormSchema(objectApiName, options)).amisSchema;
    // 当全局作用域中无recordId，表单接口sendOn始终为false。
    const formData :any = {};
    if(recordId){
      formData.recordId = recordId;
    }
    if(objectApiName){
      formData.objectName = objectApiName;
    }
    amisSchema.data = Object.assign({"&": "$$"}, amisSchema.data, formData, {global: globalData});
    return amisSchema;
  } else {
    // formInitProps
    if(!recordId){
      options.formInitProps = {
        queryOptions: "top: 1"
      };
    }
    const amisSchema: any =  (await getViewSchema(objectApiName, recordId, options)).amisSchema;
    amisSchema.data = Object.assign({"&": "$$"}, amisSchema.data,  {global: globalData});
    return amisSchema;
  }
}