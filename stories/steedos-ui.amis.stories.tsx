/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-09 11:54:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-14 14:01:19
 * @Description: 
 */
import React, {useEffect, useState} from 'react';
import { registerRemoteAssets, amisRender, getSteedosAuth, getRootUrl, defaultsDeep, getTenantId, getAuthToken } from '@steedos-widgets/amis-lib';
// import { defaultsDeep } from 'lodash';
import { Builder } from '@steedos-builder/react';
import ReactDOM from 'react-dom';
import * as _ from 'lodash';

// window.defaultsDeep = defaultsDeep;

const assetUrls = process.env.STEEDOS_UNPKG_URL + '/@steedos-widgets/amis-object/dist/assets-dev.json'

if (Builder.isBrowser){
  (window as any).Builder = Builder;
  (window as any)._ = _;
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
    const defData = defaultsDeep({}, data , {
        data: {
            context: {
                rootUrl: getRootUrl(null),
                userId: process.env.STEEDOS_USERID || localStorage.getItem('steedos:userId'),
                tenantId: getTenantId(),
                authToken: getAuthToken(),
                user: {
                  name: 'huayan',
                  email: 'huayan@steedos.com'
                }
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
    document.head.appendChild(script);
  })
}
const loadCss = async (href)=>{
  return await new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.setAttribute('href', href);
    link.setAttribute('rel', 'stylesheet');
    document.head.appendChild(link);
    resolve(true);
  })
}


export default {
  title: 'Amis/Steedos UI',
  
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
          (window as any).React = (window as any).amisRequire("react");
          (window as any).ReactDOM = (window as any).amisRequire("react-dom");
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


export const AppHeader = () => (
  <AmisRender schema={{
    "type": "page",
    "title": "Welcome to Steedos",
    "body": [
      {
        "type": "grid",
        "className": "m-t",
        "columns": [
          {
            "columnClassName": "",
            "body": [
              {
                "type": "steedos-logo",
                "src": ""
              }
            ],
            "id": "u:8f98766aa1bc",
            "md": "auto",
            "valign": "middle"
          },
          {
            "columnClassName": "",
            "body": [
              {
                "type": "steedos-app-launcher",
                "id": "u:202de972cb2d"
              }
            ],
            "id": "u:e8a42e96eaf5",
            "md": "auto",
            "valign": "middle"
          },
          {
            "columnClassName": "",
            "body": [
              {
                "type": "steedos-app-menu",
                "stacked": false,
                "id": "u:77851eb4aa89"
              }
            ],
            "id": "u:5367229505d8",
            "md": "",
            "valign": "middle"
          }
        ],
        "id": "u:6cc99950b29c"
      }
    ],
    "regions": [
      "body"
    ],
    "id": "u:53a05f7c471a"
  }}
  assetUrls={assetUrls}
  />
)


export const GlobalHeader = () => (
  <AmisRender schema={{
    "type": "page",
    "title": "Welcome to Steedos",
    "body": [
      {
        "type": "steedos-global-header",
        "id": "u:9c3d279be31a",
      },
    ],
    "regions": [
      "body"
    ],
    "data": {
      "recordId": "",
      "initialValues": {
      },
      "appId": "builder",
      "title": "",
      "context": {
        "rootUrl": "http://127.0.0.1:5300",
        "tenantId": "osjAHnCr7nampKZ9Z",
        "userId": "63044e7529b3b23f86e0c95a",
        "authToken": "32fa980d8a04b9810cb2ff503eb0a3e642b75b533e4c37b8989579a84476fda0c7ebfe9a9722bbfcfc41d7"
      }
    },
    "id": "u:03557e4e0798"
  }}
  assetUrls={assetUrls}
  />
)