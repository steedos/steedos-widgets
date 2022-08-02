/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 16:55:58
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-02 14:52:23
 * @Description: 
 */

import React, { useState, useEffect, Fragment, useRef, useImperativeHandle } from 'react';
import { amisRender, amisRootClick } from '@/lib/amis';
import { getSteedosAuth } from '@/lib/steedos.client'
import { defaultsDeep } from 'lodash';
import { withRouter } from 'next/router'

// export const AmisRender = React.forwardRef(({id, schema, data, router, className}, ref)=>{
//     console.log(`AmisRender`, id)
//     const [amisScope, setAmisScope] = useState(null);
//     useEffect(() => {
//         (function () {
//             let scope = amisRender(`#${id}`, schema, data, {}, {router: router});
//             setAmisScope(scope);
//         })();
//       }, [id, schema, data]);

//     useImperativeHandle(ref, () => ({
//         amisScope: amisScope
//       }));

//     return (
//         <div id={id} className={`app-wrapper ${className}`} onClick={(e)=>{ return amisRootClick(router, e)}}></div>
//     )
// });


export const AmisRender = ({id, schema, data, router, className, })=>{
    useEffect(() => {
        const steedosAuth = getSteedosAuth();
        const defData = defaultsDeep({}, data , {
            data: {
                context: {
                    rootUrl: process.env.NEXT_PUBLIC_STEEDOS_ROOT_URL,
                    userId: steedosAuth.userId,
                    tenantId: steedosAuth.space,
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
        SteedosUI.refs[id] = amisRender(`#${id}`, defaultsDeep(defData , schema), data, {}, {router: router});
      }, [schema]);
    return (
        <div id={`${id}`} className={`app-wrapper ${className}`} onClick={(e)=>{ return amisRootClick(router, e)}}></div>
    )
};