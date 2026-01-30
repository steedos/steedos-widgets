/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 16:55:58
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-13 11:40:59
 * @Description: 
 */

import React, { useState, useEffect, Fragment, useRef, useImperativeHandle, useMemo } from 'react';
import { amisRender, amisRootClick, getDefaultRenderData } from '@/lib/amis';
import { defaultsDeep, concat, compact, filter, map, isEmpty, isEqual } from 'lodash';
import { useRouter } from 'next/router'


export const AmisRender = ({id, schema, data, className, assets, getModalContainer, updateProps, session})=>{
    const router = useRouter()
    const prevSchemaRef = useRef();
    const prevDataRef = useRef();
    const isInitialMountRef = useRef(true);

    // 使用 useMemo 缓存合并后的数据，避免不必要的重新计算
    const mergedData = useMemo(() => {
        return defaultsDeep({data: {$scopeId : id ,scopeId : id }}, {data: data} , {
            data: getDefaultRenderData()
        });
    }, [id, data]);

    useEffect(() => {
        const schemaChanged = !isEqual(prevSchemaRef.current, schema);
        const dataChanged = !isEqual(prevDataRef.current, data);
        
        // 如果是首次挂载，或者 schema 发生了变化，才执行完整的重新渲染
        if (isInitialMountRef.current || schemaChanged) {
            const defData = defaultsDeep({data: {$scopeId : id ,scopeId : id }}, {data: data} , {
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

            prevSchemaRef.current = schema;
            prevDataRef.current = data;
            isInitialMountRef.current = false;
        } 
        // 如果只是数据变化，使用 updateProps 来更新，避免完全重新挂载
        else if (dataChanged) {
            const amisScope = SteedosUI.getRef(id);
            if(amisScope){
                const updatedData = defaultsDeep({$scopeId : id ,scopeId : id }, data, getDefaultRenderData());
                amisScope.updateProps({ data: updatedData });
                prevDataRef.current = data;
            }
        }

        return ()=>{
            if(SteedosUI.refs[id] && isInitialMountRef.current === false){
                try {
                    SteedosUI.refs[id].unmount();
                    SteedosUI.refs[id] = null;
                } catch (error) {
                    console.error(`error`, id)
                }
            }
        }

      }, [schema, data, id, getModalContainer, session, router, assets]);

    useEffect(()=>{
        const amisScope = SteedosUI.getRef(id);
        if(amisScope && !isEmpty(updateProps)){
            if(updateProps.data){
                updateProps.data = defaultsDeep(updateProps.data, data, getDefaultRenderData());
            }
            amisScope.updateProps( updateProps, ()=>{
                console.log(`amisScope.updateProps callback.......`)
            });
        }
    }, [updateProps, id, data])
    return (
        <div id={`${id}`} className={`app-wrapper ${className}`} onClick={(e)=>{ return amisRootClick(router, e)}}></div>
    )
};