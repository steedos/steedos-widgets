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
    const prevSchemaRef = useRef(schema);
    const prevDataRef = useRef(data);
    const isInitializedRef = useRef(false);

    // Memoize the stringified values to avoid recreating them on every render
    const schemaString = useMemo(() => JSON.stringify(schema), [schema]);
    const dataString = useMemo(() => JSON.stringify(data), [data]);

    useEffect(() => {
        // Check if schema or data actually changed using deep equality
        const schemaChanged = !isEqual(prevSchemaRef.current, schema);
        const dataChanged = !isEqual(prevDataRef.current, data);
        
        // Only update if schema changed or it's the initial render
        // For data changes, use updateProps instead of recreating the whole component
        if (!isInitializedRef.current || schemaChanged) {
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

            isInitializedRef.current = true;
            prevSchemaRef.current = schema;
            prevDataRef.current = data;
        } else if (dataChanged && SteedosUI.refs[id]) {
            // If only data changed, use updateProps to avoid re-creating the component
            const amisScope = SteedosUI.refs[id];
            const updatedData = defaultsDeep({$scopeId : id ,scopeId : id }, data, getDefaultRenderData());
            amisScope.updateProps({ data: updatedData }, () => {
                // Update completed
            });
            prevDataRef.current = data;
        }

        return ()=>{
            if(SteedosUI.refs[id] && !isInitializedRef.current){
                try {
                    SteedosUI.refs[id].unmount();
                    SteedosUI.refs[id] = null;
                } catch (error) {
                    console.error(`error`, id)
                }
            }
        }

      }, [schemaString, dataString, id, router, assets, getModalContainer, session]);

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
    }, [JSON.stringify(updateProps), data, id])
    return (
        <div id={`${id}`} className={`app-wrapper ${className}`} onClick={(e)=>{ return amisRootClick(router, e)}}></div>
    )
};