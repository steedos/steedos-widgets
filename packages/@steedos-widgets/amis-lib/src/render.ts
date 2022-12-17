import { getRootUrl, getSteedosAuth } from "./lib/steedos.client";

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-17 17:03:40
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-17 17:03:42
 * @Description: 
 */
export const getDefaultRenderData = ()=>{
    const steedosAuth = getSteedosAuth();
    return {
      context: {
          rootUrl: getRootUrl(),
          userId: steedosAuth.userId,
          tenantId: steedosAuth.spaceId,
          authToken: steedosAuth.authToken,
          user: steedosAuth
      },
      global: {
          userId: steedosAuth.userId,
          spaceId: steedosAuth.spaceId,
          user: steedosAuth, 
          now: new Date(),
          // mode: mode //由表单提供
      }
    }
  }