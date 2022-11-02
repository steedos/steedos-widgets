/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-21 10:27:43
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-02 17:23:02
 * @Description: 
 */
import React, { useEffect, useState } from 'react'
import { isString } from 'lodash';
import { getButton, executeButton, getUISchema } from '@steedos-widgets/amis-lib';

export const AmisObjectButton = (props) => {
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
        const { dataComponentId } = data;
        //Object.assign({}, data , {scope: (window as any).SteedosUI.getRef(dataComponentId)})
        return executeButton(button, {
            objectName: objectName,
            listViewId: listViewId || data.listViewId,
            uiSchema: uiSchema,
            record: data,
            recordId: data._id,
            appId: appId,
            formFactor: formFactor,
            scope: (window as any).SteedosUI.getRef(dataComponentId)
        });
    };
    if(!button){
        return (<>loading...</>)
    }
    if ((button as any).type === "amis_button") {
        const amisSchema = (button as any).amis_schema;
        const schema = isString(amisSchema) ? JSON.parse(amisSchema) : amisSchema;
        if(schema && schema.body.length > 0){
            delete schema.body[0]['visibleOn']
        }
        return (
            <div className={className}>
            {button && amisSchema? (
                <div className="container">
                {render('body', schema, {
                    // 这里的信息会作为 props 传递给子组件，一般情况下都不需要这个,
                    data: Object.assign(data, {recordId: data._id, objectName: objectName, listViewId: data.listViewId, app_id: appId}),
                    onChange: ()=>{
                        console.log(`change....`)
                    }
                })}
                </div>
            ) : null}
            </div>)
    }else{
        return (
            <button
              onClick={buttonClick}
              className={`antd-Button ${className ? className : ''}`}
            >
              {(button as any).label}
            </button>
          );
    }
}