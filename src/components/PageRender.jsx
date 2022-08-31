/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-30 10:03:56
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-31 14:01:16
 * @Description: 
 */
import React, { useState, useEffect, Fragment, useRef, useImperativeHandle } from 'react';
import { AmisRender } from '@/components/AmisRender';
import { filter, map, isString } from 'lodash';
import { Loading } from '@/components/Loading'
import { getEnv } from '@/lib/public.env'

export const PageRender = (props)=>{
    const {id, schema, data, router, className, assetUrls} = props;
    const [assetsLoaded, setAssetLoaded] = useState(false);
    const [assets, setAssets] = useState(null);

    useEffect(()=>{
        if(assetUrls && assetUrls.length > 0){
            let assetUrlsArray = assetUrls;
            if(isString(assetUrlsArray)){
                assetUrlsArray = assetUrlsArray.split(',');
            }
            Builder.registerRemoteAssets(assetUrlsArray).then(()=>{
                const amisComps = filter(Builder.registry['meta-components'], function(item){ return item.componentName && item.amis?.render});
                setAssets(map(amisComps, (item)=>{
                    return { componentName: item.componentName, ...item.amis.render}
                }));
                setAssetLoaded(true)
            })
        }else{
            setAssetLoaded(true)
        }

    }, [assetUrls])

    return <>
        {assetsLoaded && <AmisRender {...props} assets={assets}></AmisRender>}
        {!assetsLoaded && <Loading></Loading>}
    </>
}