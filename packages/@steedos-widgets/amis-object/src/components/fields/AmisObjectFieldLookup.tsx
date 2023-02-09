/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-12 13:18:55
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-06 15:28:02
 * @Description: 
 */
import React, { useEffect, useState } from 'react'
import { getUISchema, lookupToAmisPicker, lookupToAmisSelect, createObject } from '@steedos-widgets/amis-lib'

import { compact, isString, isFunction, has, isArray } from 'lodash';


const getSchema = async (field, value, ctx)=>{
  let refTo = field.reference_to;
  if(refTo && isFunction(refTo)){
    refTo = refTo();
  }
  const leftName = `${field.name}__left`
  const options = [];
  for (const item of refTo) {
    const refObject = await getUISchema(item, false);
    options.push({
        label: refObject.label,
        value: item,
        icon: refObject.icon
    });
  }
  // console.log(`getSchema refTo`, refTo);
  // console.log(`getSchema options`, options);
  // console.log(`getSchema value=========>`, value);
  if(!value || !value.o){
    value = {
      o: options[0].value,
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
        "name": leftName,
        "options": options,
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
  if(!data[field.name] && data.recordId && formItemValue === undefined){
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
    const fieldValue = Object.assign({
      o: fieldName.endsWith("_left") ? values : (value as any)?.o,
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