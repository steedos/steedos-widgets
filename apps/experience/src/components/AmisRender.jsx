/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 16:55:58
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-01 09:31:04
 * @Description: 
 */

import React, { useState, useEffect, Fragment, useRef, useImperativeHandle } from 'react';
import { amisRender, amisRootClick } from '@/lib/amis';
import { getSteedosAuth } from '@steedos-widgets/amis-lib'
import { defaultsDeep, concat, compact, filter, map } from 'lodash';
import { getRootUrl } from '@steedos-widgets/amis-lib';

export const AmisRender = ({id, schema, data, router, className, assets, getModalContainer})=>{
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
        const steedosAuth = getSteedosAuth();
        const defData = defaultsDeep({}, {data: data} , {
            data: {
                context: {
                    rootUrl: getRootUrl(),
                    userId: steedosAuth.userId,
                    tenantId: steedosAuth.spaceId,
                    authToken: steedosAuth.token,
                    user: steedosAuth
                },
                global: {
                    userId: steedosAuth.userId,
                    spaceId: steedosAuth.spaceId,
                    user: steedosAuth, 
                    now: new Date(),
                    // mode: mode //由表单提供
                }
            }
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
        SteedosUI.refs[id] = amisRender(`#${id}`, defaultsDeep(defData , schema), {}, {getModalContainer: getModalContainer}, {router: router, assets: compact(concat(globalAssets, assets))});
      }, [globalAssetLoaded, schema]);
    return (
        <div id={`${id}`} className={`app-wrapper ${className}`} onClick={(e)=>{ return amisRootClick(router, e)}}></div>
    )
};