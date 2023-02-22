import { getRootUrl, getSteedosAuth } from "./lib/steedos.client";

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-17 17:03:40
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-22 18:19:44
 * @Description: 
 */
export const getDefaultRenderData = ()=>{
    const steedosAuth = getSteedosAuth();
    return {
      context: {
          rootUrl: getRootUrl(),
          userId: steedosAuth.userId,
          tenantId: steedosAuth.tenantId,
          authToken: steedosAuth.authToken,
          user: steedosAuth
      },
      global: {
          userId: steedosAuth.userId,
          spaceId: steedosAuth.tenantId,
          user: steedosAuth, 
          now: new Date(),
          // mode: mode //由表单提供
      }
    }
  }