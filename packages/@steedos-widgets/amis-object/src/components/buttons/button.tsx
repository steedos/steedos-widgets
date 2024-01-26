/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-21 10:27:43
 * @LastEditors: liaodaxue
 * @LastEditTime: 2024-01-26 18:09:26
 * @Description: 
 */
import React, { useEffect, useState } from 'react'
import { isString, defaultsDeep } from 'lodash';
import { getButton, executeButton, getUISchema, getDefaultRenderData } from '@steedos-widgets/amis-lib';

export const AmisObjectButton = (props) => {
    // console.log(`AmisObjectButton=====》`, props)
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
    // console.log('AmisObjectButton===>', button, className);
    if ((button as any).type === "amis_button") {
        const amisSchema = (button as any).amis_schema;
        const schema = isString(amisSchema) ? JSON.parse(amisSchema) : amisSchema;
        if(schema && schema.body.length > 0){
            delete schema.body[0]['visibleOn']
        }

        if(schema && className){
            schema.className = schema.className + ' steedos-object-button ' + className;
        }
        
        const renderData: any = Object.assign(data, {objectName: objectName, app_id: appId, className: className});
        if(data._id){
            renderData.recordId = data._id
        }
        if(data.listViewId){
            renderData.listViewId = data.listViewId
        }
        if(schema){
            //3.6版本的schema.data内多了event变量，影响了组件渲染
            if(schema.data){
                delete schema.data.event;
            }
            if(renderData){
                delete renderData.event;
                delete renderData.record?.event;
            }
            schema.data = defaultsDeep({}, renderData, getDefaultRenderData(), schema.data);

            delete schema.data.event;
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
              className={`antd-Button antd-Button--default antd-Button--size-default steedos-object-button ${className ? className : ''}`}
            >
              {(button as any).label}
            </button>
          );
    }
}