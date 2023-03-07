/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-07 11:02:29
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-07 17:19:34
 * @Description: 
 */
import { getSections } from './fields/sections';

export async function getFormBody(permissionFields, formFields, ctx){
    return await getSections(permissionFields, formFields, ctx);
}