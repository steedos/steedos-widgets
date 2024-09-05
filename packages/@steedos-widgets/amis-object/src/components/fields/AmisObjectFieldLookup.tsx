/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-12 13:18:55
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-08-28 16:04:44
 * @Description: 
 */
import './AmisObjectFieldLookup.less';
import React, { useEffect, useState } from 'react'
import { getUISchema, lookupToAmisPicker, lookupToAmisSelect, createObject } from '@steedos-widgets/amis-lib'

import { compact, isString, isFunction, has, isArray } from 'lodash';


const getSchema = async (field, value, ctx)=>{
  let refTo = field.reference_to;
  if(refTo && isFunction(refTo)){
    refTo = refTo();
  }
  const leftName = `${field.name}__left`
  // const options = [];
  // for (const item of refTo) {
  //   const refObject = await getUISchema(item, false);
  //   options.push({
  //       label: refObject.label,
  //       value: item,
  //       icon: refObject.icon
  //   });
  // }
  // console.log(`getSchema refTo`, refTo);
  // console.log(`getSchema options`, options);
  // console.log(`getSchema value=========>`, value);
  if(!value || !value.o){
    value = {
      o: refTo[0],
      ids: []
    }
  }
  const refObject = await getUISchema(value.o, false);
  let rightSchema = null;
  if(refObject.enable_enhanced_lookup == true){
      rightSchema = await lookupToAmisPicker(Object.assign({}, field, {reference_to: value.o}), false, ctx);
  }else{
      if(!ctx){
        ctx = {}
      }
      ctx.isRefToMutiple = isArray(refTo);
      rightSchema = await lookupToAmisSelect(Object.assign({}, field, {reference_to: value.o}), false, ctx);
  }

  return {
    "type": "input-group",
    "label": false,
    "body": [
      {
        "type": "select",
        "inputClassName": "lookup-left",
        "name": leftName,
        // "options": options,
        "source": {
          "method": "post",
          "url": "${context.rootUrl}/graphql",
          "data": {
            "query": "{options:objects(filters: {__filters}, top: {__top}, sort: \"{__sort}\"){_id label:label value:name icon},count:objects__count(filters:{__filters})}"
          },
          "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
          },
          "requestAdaptor": `\nvar filters = [\"name\",\"in\", ${JSON.stringify(refTo)}]; \nvar top = ${JSON.stringify(refTo)}.length;\n\nvar sort = \"\";\napi.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', top).replace('{__sort}', sort.trim());\nreturn api;`,    
        },
        "value": `${value.o}`
      },
      Object.assign({}, rightSchema, {
        name: `${field.name}__right`,
        id: `right:${field.name}`,
        "inputClassName": "w-full",
        "value": `${value.ids}`
      })
    ]
  }
}

export const AmisObjectFieldLookup = (props) => {
  // console.log(`AmisObjectFieldLookup`, props)
  
  let { field, readonly = false, ctx, dispatchEvent: amisDispatchEvent, render, renderFormItems, onChange, data, formItemValue, value: fValue} = props;
  // console.log(`${field.name}=====>`, data[field.name], formItemValue, has(data, 'recordId'))
  // if(!data[field.name] && data.recordId && formItemValue === undefined){
  //   return ;
  // }
  if(!field){
    return ;
  }
  const [schema, setSchema] = useState();
  if(formItemValue === undefined){
    formItemValue = data[field.name]
  }
  const [value, setValue] = useState(formItemValue);

  useEffect(()=>{
    setValue(formItemValue)
  }, [JSON.stringify(formItemValue)])

  useEffect(()=>{
    getSchema(field, value, ctx).then((result)=>{
      setSchema(result as any)
    })
    
  }, [JSON.stringify(value)])
  
  const handleChange = async (values, fieldName)=>{
    // 因为记录新建时右侧的选项中useEffect中获取的formItemValue中的o为undefined,而且不易解决， 所以在此检查一下，没有值就取当前左侧选项的value ｜ 左侧第一个选项的value。
    let value_o = (value as any)?.o;
    if(fieldName.endsWith("_right") && !value_o && schema){
      value_o = (schema as any).body[0].value || (schema as any).body[0].options[0].value;
    }
    const fieldValue = Object.assign({
      o: fieldName.endsWith("_left") ? values : value_o,
      ids: fieldName.endsWith("_right") ? values : (value as any)?.ids
    })

    if(fieldName.endsWith("_left")){
      fieldValue.ids = []
    }

    if(isString(fieldValue.ids)){
      fieldValue.ids = compact(fieldValue.ids.split(','))
    }

    const rendererEvent = await amisDispatchEvent(
      'change',
      createObject(data, {
        fieldValue
      })
    );
    if (rendererEvent?.prevented) {
      return;
    }
    return onChange(fieldValue)
  }
  return (
  <div className='amis-object-field-lookup'>
    {schema ? (
      <div className="container p-0">
        {render('body', schema, {
          // 这里的信息会作为 props 传递给子组件，一般情况下都不需要这个
          onChange: handleChange
        })}
      </div>
    ) : null}
  </div>)
  // return <div>AmisObjectFieldLookup</div>
}