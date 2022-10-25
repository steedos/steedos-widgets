/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-21 10:27:43
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-25 11:20:29
 * @Description: 
 */
import React, { useEffect, useState } from 'react'
import { isString } from 'lodash';
import { getButton, executeButton, getUISchema } from '@steedos-widgets/amis-lib';

export const AmisObjectButton = (props) => {
    const { objectName, name, data, render, className, listViewId } = props;
    const [button, setButton] = useState();
    //TODO 处理上下文参数
    const appId = "budget";
    const formFactor = "XXX";
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
                })
            })
        }
        
    }, [objectName, name])
    const buttonClick = () => {
        const { dataComponentId } = data;
        return executeButton(button, Object.assign({}, data , {scope: (window as any).SteedosUI.getRef(dataComponentId)})); //TODO 处理参数
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
                    // 这里的信息会作为 props 传递给子组件，一般情况下都不需要这个
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