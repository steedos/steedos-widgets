/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 16:55:58
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-09 13:59:07
 * @Description: 
 */

import React, { useState, useEffect, Fragment, useRef, useImperativeHandle } from 'react';
import { amisRender, amisRootClick, getDefaultRenderData } from '@/lib/amis';
import { defaultsDeep, concat, compact, filter, map, isEmpty } from 'lodash';

export const AmisRender = ({id, schema, data, router, className, assets, getModalContainer, updateProps, session})=>{
    const [globalAssetLoaded, setGlobalAssetLoaded] = useState(false);
    const [globalAssets, setGlobalAssets] = useState(null);
    useEffect(()=>{
        const globalAssetUrl =  Builder.settings.env?.STEEDOS_EXPERIENCE_ASSETURLS
        if(globalAssetUrl){
            const globalAssetUrls = globalAssetUrl.split(',');
            Builder.registerRemoteAssets(globalAssetUrls).then(()=>{
                const amisComps = filter(Builder.registry['meta-components'], function(item){ return item.componentName && item.amis?.render});
                setGlobalAssets(map(amisComps, (item)=>{
                    return { componentType: item.componentType, componentName: item.componentName, ...item.amis.render}
                }));
                setGlobalAssetLoaded(true)
            })
        }else{
            setGlobalAssetLoaded(true)
        }
    }, [])

    useEffect(() => {
        if(!globalAssetLoaded){
            return ;
        }
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
        // console.log(`defData`, defData, defaultsDeep(defData , schema))
        // console.log(`globalAssets`, globalAssets)


        const env = {};

        if(getModalContainer){
            env.getModalContainer = getModalContainer;
        }
        if(session){
            env.session = session;
        }
        SteedosUI.refs[id] = amisRender(`#${id}`, defaultsDeep(defData , schema), {
            // location: router
        }, env, {router: router, assets: compact(concat(globalAssets, assets))});
      }, [globalAssetLoaded, JSON.stringify(schema), JSON.stringify(data)]);

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