/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 16:55:58
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-13 11:40:59
 * @Description: 
 */

import React, { useState, useEffect, Fragment, useRef, useImperativeHandle } from 'react';
import { amisRender, amisRootClick, getDefaultRenderData } from '@/lib/amis';
import { defaultsDeep, concat, compact, filter, map, isEmpty, isEqual } from 'lodash';
import { useRouter } from 'next/router'


export const AmisRender = ({id, schema, data, className, assets, getModalContainer, updateProps, session})=>{
    const router = useRouter()
    const prevIdRef = useRef(id);
    const prevSchemaRef = useRef(null);
    const prevDataRef = useRef(null);
    const prevUpdatePropsRef = useRef(null);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        // Check if schema or data actually changed using deep equality
        const schemaChanged = !isEqual(prevSchemaRef.current, schema);
        const dataChanged = !isEqual(prevDataRef.current, data);
        const idChanged = prevIdRef.current !== id;
        
        // Only update if schema changed or it's the initial render
        // For data changes, use updateProps instead of recreating the whole component
        if (!isInitializedRef.current || schemaChanged || idChanged) {
            // Clean up old component if id changed
            if (idChanged && SteedosUI.refs[prevIdRef.current]) {
                try {
                    SteedosUI.refs[prevIdRef.current].unmount();
                    SteedosUI.refs[prevIdRef.current] = null;
                } catch (error) {
                    console.error(`error cleaning up old id`, prevIdRef.current, error);
                }
            }
            
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
            prevIdRef.current = id;
            prevSchemaRef.current = schema;
            prevDataRef.current = data;
        } else if (dataChanged && SteedosUI.refs[id]) {
            // If only data changed, use updateProps to avoid re-creating the component
            const amisScope = SteedosUI.refs[id];
            const updatedData = {$scopeId : id ,scopeId : id, ...data, ...getDefaultRenderData()};
            amisScope.updateProps({ data: updatedData }, () => {
                // Update completed
            });
            prevDataRef.current = data;
        }

        return ()=>{
            // Clean up when component unmounts
            if(SteedosUI.refs[id]){
                try {
                    SteedosUI.refs[id].unmount();
                    SteedosUI.refs[id] = null;
                    isInitializedRef.current = false;
                } catch (error) {
                    console.error(`error during cleanup`, id, error)
                }
            }
        }

      }, [schema, data, id]);

    useEffect(()=>{
        const amisScope = SteedosUI.getRef(id);
        const updatePropsChanged = !isEqual(prevUpdatePropsRef.current, updateProps);
        
        if(amisScope && !isEmpty(updateProps) && updatePropsChanged){
            const propsToUpdate = {...updateProps};
            if(propsToUpdate.data){
                propsToUpdate.data = defaultsDeep(propsToUpdate.data, data, getDefaultRenderData());
            }
            amisScope.updateProps(propsToUpdate, ()=>{
                console.log(`amisScope.updateProps callback.......`)
            });
            prevUpdatePropsRef.current = updateProps;
        }
    }, [updateProps, data, id])
    return (
        <div id={`${id}`} className={`app-wrapper ${className}`} onClick={(e)=>{ return amisRootClick(router, e)}}></div>
    )
};