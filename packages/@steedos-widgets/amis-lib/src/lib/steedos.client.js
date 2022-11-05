/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-01 16:00:48
 * @Description: 
 */
import { endsWith, isEmpty, cloneDeep } from "lodash";

const STEEDOS_AUTH = {};

const getBuilderContext = ()=>{
    if(typeof window === "undefined"){
        return {};
    }
    return Builder.settings.context ? Builder.settings.context : Builder.settings
}

export const setSteedosAuth = (steedosSession) => {
    Object.assign(STEEDOS_AUTH, steedosSession);
}

export async function fetchAPI(api, options = { credentials: 'include' }) {
    const headers = { 'Content-Type': 'application/json' }
    const AUTHORIZATION = getAuthorization()
    if (AUTHORIZATION) {
        headers[
            'Authorization'
        ] = AUTHORIZATION
    // } else {
    //     throw new Error(401)
    }

    options.headers = Object.assign({}, headers, options.headers);
    options.credentials = 'include'

    const res = await fetch(`${getRootUrl()}${api}`, options)
    
    if(res.status === 401){
        throw new Error(401)
    }

    const json = await res.json()
    if (json.errors) {
        console.error(json.errors)
        throw new Error('Failed to fetch API')
    }
    return json
}

export function getFileSrc(fileId){
    return `${getRootUrl()}/api/files/files/${fileId}`
}

export function getImageSrc(fileId){
    return `${getRootUrl()}/api/files/images/${fileId}`
}


export function getTenantId(){
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
}

export function getAuthToken(){
    try {
        const context = getBuilderContext()
        let token = context.authToken;
        if (!token) {
            return null;
        }
        return token;
    } catch (error) {
        console.error(error)
    }
}

export function getAuthorization(){
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
}

export function absoluteUrl(url){
    return `${getRootUrl()}${url}`
}

export function getRootUrl(defaultRootUrl){
    const context = getBuilderContext()
    if(context.rootUrl){
        return context.rootUrl;
    }
    const rootUrl = typeof window != 'undefined' ? window.localStorage.getItem("steedos:rootUrl") : '';
    if(rootUrl){
        return rootUrl
    }
    return defaultRootUrl;
}

export function setRootUrl(rootUrl){
    if(endsWith(rootUrl, '/')){
        rootUrl = rootUrl.substring(0, rootUrl.length-1)
    }
    localStorage.setItem("steedos:rootUrl", rootUrl)
}

export const getSteedosAuth = () => {
    // if(isEmpty(STEEDOS_AUTH)){
    //     return {
    //         space: localStorage.getItem("steedos:spaceId"),
    //         token: localStorage.getItem("steedos:token"), 
    //         userId: localStorage.getItem("steedos:userId"),
    //         name: Meteor.user().name  //TODO: 使用steedos 函数. 此属性在上传附件时使用
    //     }
    // }
    return cloneDeep(STEEDOS_AUTH);
}