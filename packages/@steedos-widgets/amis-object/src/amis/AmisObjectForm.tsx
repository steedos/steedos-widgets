/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-01-15 15:51:15
 * @Description: 
 */
import './AmisObjectForm.less';
import './AmisObjectFormMobile.less';
import { getFormSchema, getViewSchema, createObject } from '@steedos-widgets/amis-lib'
import { keys, pick, difference, isString, has } from 'lodash';

export const AmisObjectForm = async (props) => {
  // console.log("===AmisObjectForm=props==", props);
  const { $schema, recordId, defaultData, mode, layout = "horizontal", labelAlign, appId, fieldsExtend, excludedFields = null, fields = null, form = {},
    className="", initApiRequestAdaptor, initApiAdaptor, apiRequestAdaptor, apiAdaptor, enableTabs, tabsMode, submitSuccActions, data,
    formDataFilter, onFormDataFilter, env
  } = props;
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
      initApiRequestAdaptor, initApiAdaptor, enableTabs, tabsMode,
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
  // console.log('AmisObjectForm amisSchema======>', amisSchema)
  amisSchema.data = Object.assign({},  amisSchema.data || {}, formData, {global: globalData, uiSchema:uiSchema});
  if(has(props, 'objectApiName')){
    amisSchema.data.objectName = objectApiName;
  }

  if(props.$$editor){
    const fieldsArray = fields || [];
    const excludedFieldsArray = excludedFields || [];
    const InitApiResendOn = fieldsArray.concat(excludedFieldsArray).join('');
    if(InitApiResendOn){
      amisSchema.data.InitApiResendOn = InitApiResendOn;
      amisSchema.api.url += "&InitApiResendOn=${InitApiResendOn}";
      // amisSchema.api.InitApiResendOn = "${InitApiResendOn}"; 这种写法有bug，当多选几个显示的字段/排除的字段时，表单一直loding。
    }
  }

  return amisSchema;
}