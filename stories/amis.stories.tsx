/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-09 11:54:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-24 14:49:42
 * @Description: 
 */
import React, {useEffect, useState} from 'react';
import { registerRemoteAssets, amisRender, getSteedosAuth, getRootUrl } from '@steedos-widgets/amis-lib';
import { defaultsDeep } from 'lodash';
import { Builder } from '@steedos-builder/react';

const assetUrls = process.env.STEEDOS_UNPKG_URL + '/@steedos-widgets/amis-object/dist/assets-dev.json'

if (Builder.isBrowser){
  (window as any).Builder = Builder;
  Builder.set({ 
    rootUrl: process.env.STEEDOS_ROOT_URL,
    context: {
      rootUrl: process.env.STEEDOS_ROOT_URL,
      userId: process.env.STEEDOS_USERID || localStorage.getItem('steedos:userId'),
      tenantId: process.env.STEEDOS_TENANTID || localStorage.getItem('steedos:spaceId'),
      authToken: process.env.STEEDOS_AUTHTOKEN || localStorage.getItem('steedos:token'),
    } 
  });
}
const AmisRender = ({schema, data = {}, router = null, assetUrls = null, getModalContainer = null})=> {
  useEffect(()=>{
    const steedosAuth: any = getSteedosAuth();
    const defData = defaultsDeep({}, data , {
        data: {
            context: {
                rootUrl: getRootUrl(null),
                userId: steedosAuth.userId,
                tenantId: steedosAuth.spaceId,
                authToken: steedosAuth.token,
                user: steedosAuth
            }
        }
    });
    registerRemoteAssets(assetUrls).then((assets)=>{
      amisRender(`#amis-root`, defaultsDeep(defData , schema), data, {getModalContainer: getModalContainer}, {router: router, assets: assets});
    })
  }, [])
  return (
  <>
    <div id="amis-root">loading...</div>
  </>
)}

const loadJS = async (src)=>{
  return await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.onload = () => {
      resolve(true);
    };
    script.src = src;
    document.body.appendChild(script);
  })
}
const loadCss = async (href)=>{
  return await new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.setAttribute('href', href);
    link.setAttribute('rel', 'stylesheet');
    document.body.appendChild(link);
    resolve(true);
  })
}


export default {
  title: 'Amis',
  decorators: [(Story)=>{
    const [isLoaded, setIsLoaded] = useState(false);
      useEffect(() => {
        Promise.all([
          loadJS('https://unpkg.steedos.cn/amis/sdk/sdk.js'), 
          loadJS('https://unpkg.steedos.cn/crypto-js@4.1.1/crypto-js.js'), 
          loadJS('https://unpkg.steedos.cn/lodash/lodash.min.js'),
          loadJS('https://unpkg.steedos.cn/@steedos-builder/react@0.2.30/dist/builder-react.unpkg.js'),
          loadCss('https://unpkg.steedos.cn/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css'),
          loadCss('https://unpkg.steedos.cn/amis/lib/themes/antd.css'),
          loadCss('https://unpkg.steedos.cn/amis/lib/helper.css'),
          loadCss('https://unpkg.steedos.cn/amis/sdk/iconfont.css'),
          loadCss('https://unpkg.steedos.cn/@fortawesome/fontawesome-free@6.2.0/css/all.min.css'),
        ]).then(()=>{
          setIsLoaded(true)
        }).catch((error)=>{
          console.error(error)
        })
        return () => {
          // clean up effects of script here
        };
      }, []);

      return isLoaded ? <Story /> : <div>Loading...</div>;
  }]
};

/** 以上为可复用代码 **/

export const Login = () => (
  <AmisRender schema={{
    "type": "form",
    "mode": "horizontal",
    "api": {
      "method": "post",
      "url": "${context.rootUrl}/accounts/password/login",
      "adaptor": `localStorage.setItem("steedos:userId", payload.user.id);\n localStorage.setItem("steedos:spaceId", payload.space);\n localStorage.setItem("steedos:token", payload.token);\n setTimeout(function(){ location.reload()},2000) \n return payload;`,
      "requestAdaptor": `api.data.password = CryptoJS.SHA256(api.data.password).toString();\n const username = api.data.username  ; \n api.data.user = {email: username}; \n return api;`
    },
    "body": [
      {
        "label": "Username",
        "type": "input-text",
        "name": "username",
        "placeholder": "请输入邮箱"
      },
      {
        "label": "Password",
        "type": "input-password",
        "name": "password",
      }
    ],
    "submitText": "Login",
    "title": "Login to Steedos"
  }}
  />
)


export const ObjectListview = () => (
  <AmisRender schema={{
    type: 'page',
    title: '列表视图',
    body: {
      "type": "steedos-object-listview",
      "objectApiName": "space_users",
      "listName": "all"
    },
  }}
  assetUrls={process.env.STEEDOS_EXPERIENCE_ASSETURLS}
  />
)


export const ObjectForm = () => (
  <AmisRender schema={{
    type: 'page',
    title: '表单',
    body: {
      "type": "steedos-object-form",
      "objectApiName": "organizations",
      "recordId": "623NR6NCZJP8irB4y"
    },
  }}
  assetUrls={assetUrls}
  />
)

export const RecordDetailRelatedList = () => (
  <AmisRender schema={{
    type: 'page',
    title: '相关列表',
    body: {
      "type": "steedos-record-related-list",
      "objectApiName": "accounts",
      "recordId": "AKEQtKsWvNDF6MitJ",
      "relatedObjectApiName": "contacts"
    },
  }}
  assetUrls={assetUrls}
  />
)

export const RecordDetailHeader = () => (
  <AmisRender schema={{
    type: 'page',
    title: '标题面板',
    body: {
      "type": "steedos-record-detail-header",
      "objectApiName": "space_users",
      "recordId": "kDrtGu7aZPwYdyFpe"
    },
  }}
  assetUrls={process.env.STEEDOS_EXPERIENCE_ASSETURLS}
  />
)

export const AmisSelectUser = () => (
    <AmisRender schema={{
      type: 'page',
      title: '选人组件',
      body: [{
        "type": "form",
        "mode": "horizontal",
        "debug": false,
        "title": "单选/多选（默认单选）",
        "body": [
          {
            "label": "人员单选",
            "type": "steedos-select-user",
            "name": "owner",
          },
          {
            "label": "人员多选",
            "type": "steedos-select-user",
            "name": "admins",
            "multiple": true
          }
        ]
      },{
        "type": "form",
        "mode": "horizontal",
        "debug": false,
        "title": "触发事件",
        "body": [
          {
            "type": "tpl",
            "tpl": "说明：可以配置onEvent属性，触发比如change事件，不支持在设计器中配置",
          },
          {
            "label": "change事件",
            "type": "steedos-select-user",
            "name": "admins",
            "multiple": true,
            "onEvent": {
              "change": {
                "weight": 0,
                "actions": [
                  {
                    "actionType": "custom",
                    "script": "console.log(\"onEvent change, context.props\", context.props);alert(\"onEvent change\");"
                  }
                ]
              }
            }
          }
        ]
      },{
        "type": "form",
        "mode": "horizontal",
        "debug": false,
        "title": "过滤条件",
        "body": [
          {
            "type": "tpl",
            "tpl": `<div>说明：可以配置filters属性作为选人组件的基本过滤条件，支持传入数组、函数和字符串。</div>
              <div>当传入函数时，函数参数为field，返回数组格式的过滤条件即可。</div>
              <div>当传入字符串时，要求字符串格式为:function(field){return [[\"name\", \"contains\", \"三\"]]}。</div>
              <div>设计器中右侧面板显示为多行文本。</div>
              `,
          },
          {
            "label": "数组",
            "type": "steedos-select-user",
            "name": "admins",
            "multiple": true,
            "filters": [["name", "contains", "王"]],
          },
          {
            "label": "函数",
            "type": "steedos-select-user",
            "name": "admins",
            "multiple": true,
            "filters": function(field: any){
              return [["name", "contains", "王"]];
            },
          },
          {
            "label": "字符串",
            "type": "steedos-select-user",
            "name": "admins",
            "multiple": true,
            "filters": `function(field){
              return [["name", "contains", "王"]];
            }`,
          }
        ]
      }]
    }}
    assetUrls={assetUrls}
  />
)

export const Provider = () => (
  <AmisRender schema={{
    type: 'page',
    title: '华炎魔方容器',
    body: {
      "type": "steedos-provider",
      "body":[
        {
          "type": "tpl",
          "tpl": `没有任何属性任何功能，只是一个不带边距的wrapper容器`,
        }
      ]
    },
  }}
  assetUrls={assetUrls}
  />
)