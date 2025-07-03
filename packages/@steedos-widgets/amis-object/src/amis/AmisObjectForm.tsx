/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-06-09 19:42:12
 * @Description: 
 */
import './AmisObjectForm.less';
import './AmisObjectFormMobile.less';
import { getFormSchema, getViewSchema, createObject } from '@steedos-widgets/amis-lib'
import { keys, pick, difference, isString, has } from 'lodash';

// md:border-b
export const AmisObjectForm = async (props) => {
  console.log("===AmisObjectForm=props==", props);
  const { $schema, recordId, mode, layout = "horizontal", labelAlign, appId, fieldsExtend, excludedFields = null, fields = null, form = {},
    className="", enableInitApi, initApiRequestAdaptor, initApiAdaptor, apiRequestAdaptor, apiAdaptor, enableTabs, tabsMode, submitSuccActions, data,
    formDataFilter, onFormDataFilter, env
  } = props;
  let defaultData = props.defaultData;
  let objectApiName = props.objectApiName || "space_users";
  // amis中的mode属性是表单布局,没有layout属性。defaults的变量会覆盖mode属性值。
  const schemaKeys = difference(keys($schema), ["id","form","type","mode","layout","defaultData", "formDataFilter", "onFormDataFilter", "env"]);
  const formSchema = pick(props, schemaKeys);
  const defaults = {
    formSchema: Object.assign( {}, formSchema, form )
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

  globalData.mode = mode === 'edit' ? 'edit' : 'read';
  let amisSchema: any;
  let uiSchema: any;
  const allData: any = createObject(data, {}); 
  if (mode === 'edit') {//这里不把defaultData传入createObject是因为此处defaultData是表单字段默认值，不属于上下文data
    if(defaultData){
      try {
        defaultData = isString(defaultData) ? JSON.parse(defaultData) : defaultData
      } catch (error) {
        console.warn(error)
        defaultData = {}
      }
      // 让ObjectForm支持props中的dafaultData属性与上层组件配置的defaultData混合
      // 为了解决相关表新建时如果是表单类型微页面，因为找不到ObjectForm在哪层而造成无法设置ObjectForm的defaultData的问题
      allData.defaultData = {
        "&": "${defaultData}",//这里的defaultData是上层的data中的defaultData变量值
        ...defaultData//这里的defaultData是form组件的defaultData属性值
      }
    }
    const schema = await getFormSchema(objectApiName, Object.assign({}, options, {
      initApiRequestAdaptor, initApiAdaptor, apiRequestAdaptor, apiAdaptor, enableTabs, tabsMode, submitSuccActions,
      formDataFilter, onFormDataFilter, amisData: allData, env
    }));
    amisSchema = schema.amisSchema;
    uiSchema = schema.uiSchema;
  } else {
    if(props.$$editor){
      options.isEditor = true;
    }
    const schema =  await getViewSchema(objectApiName, recordId, Object.assign({}, options, {
      enableInitApi, initApiRequestAdaptor, initApiAdaptor, enableTabs, tabsMode: tabsMode || "vertical",
      formDataFilter, onFormDataFilter, amisData: allData, env
    }));
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
  
  amisSchema.data = Object.assign({},  amisSchema.data || {}, formData, {global: globalData, uiSchema:uiSchema});
  if(has(props, 'objectApiName')){
    amisSchema.data.objectName = objectApiName;
  }
  console.log('AmisObjectForm amisSchema======>', amisSchema)
  return amisSchema;
}