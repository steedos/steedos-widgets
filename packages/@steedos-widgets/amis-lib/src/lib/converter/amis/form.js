/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-07 11:02:29
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-01 11:46:15
 * @Description: 
 */
import { getSections } from './fields/sections';

export async function getFormBody(permissionFields, objectConfig, ctx){
    return await getSections(permissionFields, objectConfig, ctx);
}