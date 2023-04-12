/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-04-07 18:31:31
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-12 14:25:02
 * @Description: 
 */
import React from 'react'
import { Skeleton } from 'antd';
import { isString,isBoolean } from 'lodash';

export const SteedosSkeleton = (props) => {
    let { body, render, bodyClassName="", config = {}} = props;  
    if(isString(config)){
        config = JSON.parse(config);
    }
    let { active, avatar, loading, paragraph, round, title } = config; 
    loading = isBoolean(loading) ? loading : loading === 'true'
    // console.log("SteedosSkeleton====>", loading, config, typeof loading)
    return <>
        <Skeleton active={active} avatar={avatar} loading={loading} paragraph={paragraph} round={round} title={title} ></Skeleton>
        <div className={loading ? 'hidden w-full h-full' : 'w-full h-full'}>
        {body ? (
          <div className={`steedos-skeleton-body ${bodyClassName}`}>
            {render('body', body, {
              // 这里的信息会作为 props 传递给子组件，一般情况下都不需要这个
            })}
          </div>
        ) : null}
        </div>
    </> 
}
