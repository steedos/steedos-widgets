/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-21 10:27:43
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-04 15:17:40
 * @Description: 
 */
import React, { useEffect, useState } from 'react'
import { isString, defaultsDeep } from 'lodash';
import { getButton, executeButton, getUISchema, getDefaultRenderData } from '@steedos-widgets/amis-lib';

export const AmisObjectButton = (props) => {
    // console.log(`AmisObjectButton`, props)
    const { objectName, name, data, render, className,  listViewId} = props;
    const [button, setButton] = useState();
    const [uiSchema, setUiSchema] = useState();
    //TODO 处理上下文参数
    const appId = data.appId;
    const formFactor = data.formFactor;
    useEffect(()=>{
        if(objectName){
            getUISchema(objectName, false).then((uiSchema)=>{
                getButton(objectName, name, {
                    objectName: objectName,
                    recordId: data._id,
                    appId: appId,
                    uiSchema: uiSchema,
                    formFactor: formFactor,
                    router: null,
                    listViewId: data.listViewId,
                    props: {
                        className: `antd-Button antd-Button--link`
                    }
                }).then((result)=>{
                    setButton(result)
                    setUiSchema(uiSchema);
                })
            })
        }
        
    }, [objectName, name])
    const buttonClick = () => {
        const { dataComponentId, scopeId } = data;
        //Object.assign({}, data , {scope: (window as any).SteedosUI.getRef(dataComponentId)})
        return executeButton(button, {
            objectName: objectName,
            listViewId: listViewId || data.listViewId,
            uiSchema: uiSchema,
            record: data,
            recordId: data._id,
            appId: appId,
            formFactor: formFactor,
            scope: (window as any).SteedosUI.getRef(dataComponentId),
            scopeId: scopeId || dataComponentId
        });
    };
    if(!button){
        return (<><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="animate-spin w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
      </>)
    }
    if ((button as any).type === "amis_button") {
        const amisSchema = (button as any).amis_schema;
        const schema = isString(amisSchema) ? JSON.parse(amisSchema) : amisSchema;
        if(schema && schema.body.length > 0){
            delete schema.body[0]['visibleOn']
        }
        // if(className){
        //     schema.className = schema.className + ' ' + className;
        // }
        const renderData = Object.assign(data, {recordId: data._id, objectName: objectName, listViewId: data.listViewId, app_id: appId, className: className})
        if(schema){
            schema.data = defaultsDeep({}, renderData, getDefaultRenderData(), schema.data);
        }
        return (
            <>
            {button && amisSchema? (
                <>
                {render('body', schema, {
                    // 这里的信息会作为 props 传递给子组件，一般情况下都不需要这个,
                    data: renderData,
                    onChange: ()=>{
                        console.log(`change....`)
                    }
                })}
                </>
            ) : null}
            </>)
    }else{
        return (
            <button
              onClick={buttonClick}
              className={`antd-Button antd-Button--default antd-Button--size-default ${className ? className : ''}`}
            >
              {(button as any).label}
            </button>
          );
    }
}