/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-25 09:16:09
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-17 10:25:43
 * @Description: 
 */

import { StandardObjects } from './standard_objects'
import { authRequest } from './authRequest'
import { SteedosUI } from './ui';
import { sldsIcons } from './icon';
import * as Expression from './expression';
import { organizationsTree } from './organization/organizations_tree'

declare var Builder;

const getBuilderContext = ()=>{
    if(typeof window === "undefined"){
        return {};
    }
    return Builder.settings.context ? Builder.settings.context : Builder.settings
}

export const Steedos = {
    resources: {
        sldsIcons
    },
    organizationsTree,
    getRootUrl: (defaultRootUrl?)=>{
        const context: any = getBuilderContext()
        if(context.rootUrl){
            return context.rootUrl;
        }
        const rootUrl = typeof window != 'undefined' ? window.localStorage.getItem("steedos:rootUrl") : '';
        if(rootUrl){
            return rootUrl
        }
        return defaultRootUrl;
    },
    absoluteUrl: (url = "")=>{
        return `${Steedos.getRootUrl()}${url}`
    },
    getTenantId: ()=>{
        try {
            let spaceId = getBuilderContext().tenantId
    
            if (window.location.search && !spaceId) {
                var searchParams = new URLSearchParams(window.location.search);
                spaceId = searchParams.get('X-Space-Id');
            }
            if (!spaceId) {
                return null;
            }
            return spaceId;
        } catch (error) {
            console.error(error)
        }
    },
    getAuthorization: ()=>{
        try {
            const context = getBuilderContext()
            let spaceId = context.tenantId;
            let token = context.authToken;
            
            if (!spaceId || !token) {
                return null;
            }
            return `Bearer ${spaceId},${token}`;
        } catch (error) {
            console.error(error)
        }
    },
    authRequest,
    StandardObjects,
    ...Expression
}

if(typeof window != 'undefined'){
    if((window as any).Steedos){
        (window as any).Steedos = Object.assign(Steedos, (window as any).Steedos);
    }else{
        (window as any).Steedos = Steedos;
    }
}

if(typeof window != 'undefined'){
    if((window as any).SteedosUI){
        (window as any).SteedosUI = Object.assign(SteedosUI, (window as any).SteedosUI);
    }else{
        (window as any).SteedosUI = SteedosUI;
    }
}
// else if(typeof window != 'undefined'){
//     (window as any).SteedosUI = Object.assign((window as any).SteedosUI, SteedosUI);
// }

export { SteedosUI } from './ui';
