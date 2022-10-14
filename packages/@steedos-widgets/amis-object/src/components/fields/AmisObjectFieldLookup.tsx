/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-12 13:18:55
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-14 16:04:55
 * @Description: 
 */
import React, { useEffect, useState } from 'react'
import { getUISchema, lookupToAmisPicker, lookupToAmisSelect } from '@steedos-widgets/amis-lib'
import {
  createObject,
} from 'amis-core/esm/utils/object';
import { compact, isString } from 'lodash';


const getSchema = async (field, value, ctx)=>{
  const refTo = field.reference_to;
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
  const { field, readonly = false, ctx, dispatchEvent: amisDispatchEvent, render, renderFormItems, onChange, data, formItemValue} = props;
  const [schema, setSchema] = useState();
  
  const [value, setValue] = useState(formItemValue);

  useEffect(()=>{
    setValue(formItemValue)
  }, [formItemValue])

  useEffect(()=>{
    getSchema(field, value, ctx).then((result)=>{
      setSchema(result as any)
    })
    
  }, [value])
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
      <div className="container">
        {render('body', schema, {
          // 这里的信息会作为 props 传递给子组件，一般情况下都不需要这个
          onChange: handleChange
        })}
      </div>
    ) : null}
  </div>)
}