/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 16:55:58
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-02 16:01:49
 * @Description: 
 */

import React, { useState, useEffect, Fragment, useRef, useImperativeHandle } from 'react';
import { amisRender, amisRootClick, getDefaultRenderData } from '@/lib/amis';
import { defaultsDeep, concat, compact, filter, map, isEmpty } from 'lodash';
import { useRouter } from 'next/router'


export const AmisRender = ({id, schema, data, className, assets, getModalContainer, updateProps, session})=>{
    const router = useRouter()

    useEffect(() => {
        
        const defData = defaultsDeep({data: {$scopeId : id }}, {data: data} , {
            data: getDefaultRenderData()
        });
        // 如果已存在,则先销毁, 再创建新实例
        if(SteedosUI.refs[id]){
            try {
                SteedosUI.refs[id].unmount()
            } catch (error) {
                console.error(`error`, id)
            }
        }

        const env = {};

        if(getModalContainer){
            env.getModalContainer = getModalContainer;
        }
        if(session){
            env.session = session;
        }
        SteedosUI.refs[id] = amisRender(`#${id}`, defaultsDeep(defData , schema), {
            // location: router
        }, env, {router: router, assets:assets});

        return ()=>{
            if(SteedosUI.refs[id]){
                try {
                    SteedosUI.refs[id].unmount();
                    SteedosUI.refs[id] = null;
                } catch (error) {
                    console.error(`error`, id)
                }
            }
        }

      }, [JSON.stringify(schema), JSON.stringify(data)]);

    useEffect(()=>{
        const amisScope = SteedosUI.getRef(id);
        if(amisScope && !isEmpty(updateProps)){
            if(updateProps.data){
                updateProps.data = defaultsDeep(data , getDefaultRenderData());
            }
            // const newProps = defaultsDeep({location: router}, {data: data} , {
            //     data: getDefaultRenderData()
            // });
            amisScope.updateProps( updateProps, ()=>{
                console.log(`amisScope.updateProps callback.......`)
            });
        }
    }, [JSON.stringify(updateProps)])
    return (
        <div id={`${id}`} className={`app-wrapper ${className}`} onClick={(e)=>{ return amisRootClick(router, e)}}></div>
    )
};