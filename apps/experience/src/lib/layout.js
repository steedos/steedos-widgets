/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-19 16:00:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-19 16:01:31
 * @Description: 
 */


export const getNavStacked = ()=>{
    return process.env.NEXT_PUBLIC_STEEDOS_LAYOUT_NAV_STACKED === 'true'
}