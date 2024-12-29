/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-04-18 17:03:48
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-12-29 17:55:55
 */
import * as _ from 'lodash';
import { SteedosUI } from '@steedos-widgets/steedos-lib';

// TODO: storybook中会报错没有SteedosUI变量，临时处理
if(typeof window != 'undefined' && !(window as any).SteedosUI){
    (window as any).SteedosUI = SteedosUI;
}else if(typeof window != 'undefined'){
    (window as any).SteedosUI = Object.assign((window as any).SteedosUI, SteedosUI);
}


const rootUrl = process.env.ROOT_URL;
const userId = process.env.STEEDOS_USERID;
const tenantId = process.env.STEEDOS_TENANTID;
const authToken = process.env.STEEDOS_AUTHTOKEN;
setTimeout(function(){
  if (Builder.isBrowser){
    Builder.set({ 
      rootUrl: rootUrl,
      context: {
        rootUrl: rootUrl,
        userId: userId,
        tenantId: tenantId,
        authToken: authToken
      }
    });
  }
}, 200);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Amis/Steedos Object New',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export const Badge = () => {
  const schema = {
    type: 'page',
    title: 'Badge',
    body: {
      "type": "steedos-badge",
      "count": 10
    }
  };
  const data = {};
  const env = {
    assetUrls: [
      `${process.env.STEEDOS_UNPKG_URL}/@steedos-widgets/amis-object/dist/assets-dev.json`,
      // `https://unpkg.steedos.cn/@steedos-widgets/amis-object@6.3.5/dist/assets.json`,
    ]
  };
  return renderAmisSchema(schema, data, env)
};


export const Logo = () => {
  const schema = {
    type: 'page',
    title: 'Logo',
    body: {
      "type": "steedos-logo"
    }
  };
  const data = {};
  const env = {
    assetUrls: [
      `${process.env.STEEDOS_UNPKG_URL}/@steedos-widgets/amis-object/dist/assets-dev.json`,
      // `https://unpkg.steedos.cn/@steedos-widgets/amis-object@6.3.5/dist/assets.json`,
    ]
  };
  return renderAmisSchema(schema, data, env)
};

export const Field = () => {
  const schema = {
    type: 'page',
    title: 'Field',
    body: {
      "type": "steedos-field",
      "config":{
        "type": "datetime",
        "label": "datetime"
      }
    }
  };
  const data = {};
  const env = {
    assetUrls: [
      `${process.env.STEEDOS_UNPKG_URL}/@steedos-widgets/amis-object/dist/assets-dev.json`
    ]
  };
  return renderAmisSchema(schema, data, env)
};

export const RecordDetailHeader = () => {
  const schema = {
    type: 'page',
    title: '标题面板',
    body: {
      "type": "steedos-record-detail-header",
      "objectApiName": "space_users",
      "recordId": "kDrtGu7aZPwYdyFpe"
    }
  };
  const data = {};
  const env = {
    assetUrls: [
      `${process.env.STEEDOS_UNPKG_URL}/@steedos-widgets/amis-object/dist/assets-dev.json`,
      // `https://unpkg.steedos.cn/@steedos-widgets/amis-object@6.3.5/dist/assets.json`,
    ]
  };
  return renderAmisSchema(schema, data, env)
};
