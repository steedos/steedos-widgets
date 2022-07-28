/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 16:55:58
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-28 15:26:45
 * @Description: 
 */

import React, { useState, useEffect, Fragment, useRef, useImperativeHandle } from 'react';
import { amisRender, amisRootClick } from '@/lib/amis';

export const AmisRender = React.forwardRef(({id, schema, data, router, className}, ref)=>{
    const [amisScope, setAmisScope] = useState(null);
    useEffect(() => {
        (function () {
            let scope = amisRender(`#${id}`, schema, data, {}, {router: router});
            setAmisScope(scope);
        })();
      }, [id, schema, data]);

    useImperativeHandle(ref, () => ({
        amisScope: amisScope
      }));

    return (
        <div id={id} className={`app-wrapper ${className}`} onClick={(e)=>{ return amisRootClick(router, e)}}></div>
    )
});