/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-06-01 18:05:21
 * @Description: 
 */
import './AmisObjectForm.less';
import './AmisObjectFormMobile.less';
import { getFormSchema, getViewSchema } from '@steedos-widgets/amis-lib'
import { keys, pick, difference, isString, has } from 'lodash';

export const AmisObjectForm = async (props) => {
  // console.log("===AmisObjectForm=props==", props);
  const { $schema, recordId, defaultData, mode, layout, labelAlign, appId, fieldsExtend, excludedFields = null, fields = null,
    className="", initApiRequestAdaptor, initApiAdaptor, apiRequestAdaptor, apiAdaptor, enableTabs, tabsMode
  } = props;
  let objectApiName = props.objectApiName || "space_users";
  // amis中的mode属性是表单布局,没有layout属性。defaults的变量会覆盖mode属性值。
  const schemaKeys = difference(keys($schema), ["type","mode","layout","defaultData"]);
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
    appId,
    excludedFields,
    fields
  }

  try {
    options.fieldsExtend = isString(fieldsExtend) ? JSON.parse(fieldsExtend) : fieldsExtend
  } catch (error) {
    console.warn(error)
  }

  const globalData = props.data.global || {};

  globalData.mode = mode === 'edit' ? 'edit' : 'read'
  let amisSchema: any;
  let uiSchema: any;
  if (mode === 'edit') {
    const schema = await getFormSchema(objectApiName, Object.assign({}, options, {
      initApiRequestAdaptor, initApiAdaptor, apiRequestAdaptor, apiAdaptor, enableTabs, tabsMode
    }));
    amisSchema = schema.amisSchema;
    if(defaultData){
      // 让ObjectForm支持props中的dafaultData属性与上层组件配置的defaultData混合
      // 为了解决相关表新建时如果是表单类型微页面，因为找不到ObjectForm在哪层而造成无法设置ObjectForm的defaultData的问题
      amisSchema.data.defaultData = {
        "&": "${defaultData}",
        ...defaultData
      }
    }
    uiSchema = schema.uiSchema;
  } else {
    // formInitProps
    // if(!recordId){
    //   // 只读界面只返回一条记录
    //   options.formInitProps = {
    //     queryOptions: "top: 1"
    //   };
    // }
    const schema =  await getViewSchema(objectApiName, recordId, options);
    amisSchema =  schema.amisSchema;
    uiSchema =  schema.uiSchema;
  }
  const formData :any = {};
  // formData.recordId = recordId || null;
  // if(objectApiName){
  //   formData.objectName = objectApiName;
  // }

  if(has(props, "recordId") && $schema.recordId !== "${recordId}"){
    formData.recordId = props.recordId;
  }
  amisSchema.className = `steedos-object-form ${className}`
  amisSchema.data = Object.assign( amisSchema.data, formData, {global: globalData, uiSchema:uiSchema});
  if(has(props, 'objectApiName')){
    amisSchema.data.objectName = objectApiName;
  }
  return amisSchema;
}