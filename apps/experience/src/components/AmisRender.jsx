/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 16:55:58
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-14 11:59:04
 * @Description: 
 */

import React, { useState, useEffect, Fragment, useRef, useImperativeHandle } from 'react';
import { amisRender, amisRootClick } from '@/lib/amis';
import { getSteedosAuth } from '@steedos-widgets/amis-lib'
import { defaultsDeep } from 'lodash';
import { getRootUrl } from '@steedos-widgets/amis-lib';

export const AmisRender = ({id, schema, data, router, className, assets, getModalContainer})=>{
    useEffect(() => {
        const steedosAuth = getSteedosAuth();
        const defData = defaultsDeep({}, {data: data} , {
            data: {
                context: {
                    rootUrl: getRootUrl(),
                    userId: steedosAuth.userId,
                    tenantId: steedosAuth.spaceId,
                    authToken: steedosAuth.token
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
        SteedosUI.refs[id] = amisRender(`#${id}`, defaultsDeep(defData , schema), {}, {getModalContainer: getModalContainer}, {router: router, assets: assets});
      }, [schema]);
    return (
        <div id={`${id}`} className={`app-wrapper ${className}`} onClick={(e)=>{ return amisRootClick(router, e)}}></div>
    )
};