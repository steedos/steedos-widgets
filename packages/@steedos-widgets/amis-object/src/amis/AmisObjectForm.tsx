/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-02-26 18:10:16
 * @Description: 
 */
import { getFormSchema, getViewSchema } from '@steedos-widgets/amis-lib'
import { keys, pick, difference } from 'lodash';

export const AmisObjectForm = async (props) => {
  // console.log("===AmisObjectForm=props==", props);
  const { $schema, recordId, mode, layout, labelAlign, appId,
    className=""
  } = props;
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

  const globalData = props.data.global || {};

  globalData.mode = mode === 'edit' ? 'edit' : 'read'
  let amisSchema: any;
  if (mode === 'edit') {
    amisSchema = (await getFormSchema(objectApiName, options)).amisSchema;
  } else {
    // formInitProps
    if(!recordId){
      // 只读界面只返回一条记录
      options.formInitProps = {
        queryOptions: "top: 1"
      };
    }
    amisSchema =  (await getViewSchema(objectApiName, recordId, options)).amisSchema;
  }
  const formData :any = {};
  formData.recordId = recordId || null;
  if(objectApiName){
    formData.objectName = objectApiName;
  }
  amisSchema.className = `steedos-object-form ${className}`
  amisSchema.data = Object.assign({"&": "$$"}, amisSchema.data, formData, {global: globalData});
  return amisSchema;
}