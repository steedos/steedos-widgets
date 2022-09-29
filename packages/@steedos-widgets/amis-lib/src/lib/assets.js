/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-13 14:34:18
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-13 14:59:00
 * @Description: 加载资产包,并返回所有可用资产
 */
import { isString, filter, map } from 'lodash';

export const registerRemoteAssets = async (assetUrls)=>{
    if(assetUrls && assetUrls.length > 0){
        let assetUrlsArray = assetUrls;
        if(isString(assetUrlsArray)){
            assetUrlsArray = assetUrlsArray.split(',');
        }
        await Builder.registerRemoteAssets(assetUrlsArray);
        const amisComps = filter(Builder.registry['meta-components'], function(item){ return item.componentName && item.amis?.render});
        return map(amisComps, (item)=>{
            return { componentType: item.componentType, componentName: item.componentName, ...item.amis.render}
        })
    }else{
        return []
    }
}