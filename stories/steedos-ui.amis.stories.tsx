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
      // userId: process.env.STEEDOS_USERID || localStorage.getItem('steedos:userId'),
      // tenantId: process.env.STEEDOS_TENANTID || localStorage.getItem('steedos:spaceId'),
      // authToken: process.env.STEEDOS_AUTHTOKEN || localStorage.getItem('steedos:token'),
    } 
  });
}
const AmisRender = ({schema, data = {}, router = null, getModalContainer = null})=> {
  useEffect(()=>{
    const defaultSchema = defaultsDeep({}, data , {
        "initApi": {
          "url": "${context.rootUrl}/api/v4/users/validate",
          "method": "post",
          "adaptor": "var context = {rootUrl: api.data.context.rootUrl, userId: payload.userId, authToken: payload.authToken, tenantId: payload.spaceId}; Builder.set({context: context}); var result = {status: 0, msg:'',  data: { context: {...context, user: payload} } };  console.log(result); return result;"
        },
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
      amisRender(`#amis-root`, defaultsDeep(defaultSchema , schema), data, {getModalContainer: getModalContainer}, {router: router, assets: assets});
    })
  }, [schema])
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
          loadJS(`https://unpkg.steedos.cn/amis@${process.env.STEEDOS_EXPERIENCE_AMIS_VERSION}/sdk/sdk.js`), 
          loadJS('https://unpkg.steedos.cn/crypto-js@4.1.1/crypto-js.js'), 
          loadJS('https://unpkg.steedos.cn/lodash/lodash.min.js'),
          loadJS('https://unpkg.steedos.cn/@steedos-builder/react@0.2.30/dist/builder-react.unpkg.js'),
          loadCss('/tailwind-base.css'),
          loadCss('https://unpkg.steedos.cn/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css'),
          loadCss(`https://unpkg.steedos.cn/amis@${process.env.STEEDOS_EXPERIENCE_AMIS_VERSION}/lib/themes/antd.css`),
          loadCss(`https://unpkg.steedos.cn/amis@${process.env.STEEDOS_EXPERIENCE_AMIS_VERSION}/lib/helper.css`),
          loadCss(`https://unpkg.steedos.cn/amis@${process.env.STEEDOS_EXPERIENCE_AMIS_VERSION}/sdk/iconfont.css`),
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
    "type": "page",
    "body": [{
      "type": "form",
      "mode": "horizontal",
      "api": {
        "method": "post",
        "url": "${context.rootUrl}/accounts/password/login",
        "adaptor": `localStorage.setItem("steedos:userId", payload.user.id);\n localStorage.setItem("steedos:spaceId", payload.space);\n localStorage.setItem("steedos:token", payload.token);\n localStorage.setItem("steedos:user", JSON.stringify(payload.user))\nsetTimeout(function(){ location.reload()},2000) \n return payload;`,
        "requestAdaptor": `api.data.password = CryptoJS.SHA256(api.data.password).toString();\n const username = api.data.username  ; \n api.data.user = {email: username}; \n return api;`
      },
      "body": [
        {
          "label": "Root URL",
          "type": "static",
          "name": "rootUrl",
          "value": "${context.rootUrl}"
        },
        {
          "label": "Current User Id",
          "type": "static",
          "name": "context.user.userId",
          "value": "${context.user.userId}"
        },
        {
          "label": "Current User Name",
          "type": "static",
          "name": "context.user.name",
          "value": "${context.user.name}"
        },
        {
          "label": "Current User Email",
          "type": "static",
          "name": "context.user.email",
          "value": "${context.user.email}"
        },
        {
          "label": "Email",
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
    }]
  }}
  />
)


export const UserSession = () => (
  <AmisRender schema={{
    "type": "page",
    "body": [
      {
        "label": "Context",
        "type": "json",
        "name": "context",
        "value": "${context}"
      },
      {
        "label": "User",
        "type": "json",
        "name": "context.user",
        "value": "${context.user}"
      }
    ],
  }}
  />
)


export const AppHeader = () => (
  <AmisRender schema={{
    "type": "page",
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
  />
)


export const GlobalHeader = () => (
  <AmisRender schema={{
    "type": "page",
    "body": [
      {
        "type": "steedos-global-header",
        "id": "u:9c3d279be31a",
      }
    ],
  }}
  />
)



export const AppMenuLeft = () => (
  <AmisRender schema={{
    "type": "page",
    "body": [
              {
                "type": "steedos-app-menu",
                "stacked": true,
                "id": "u:77851eb4aa89"
              }
            ],
    }}
  />
)


export const AppMenuTop = () => (
  <AmisRender schema={{
    "type": "page",
    "body": [
              {
                "type": "steedos-app-menu",
                "stacked": false,
                "id": "u:77851eb4aa89"
              }
            ],
    }}
  />
)



const PageListViewTemplate = (args) => {
  console.log(args);
  return (
    <AmisRender schema={{
      "type": "page",
      "body": [
          {
            "type": "steedos-page-listview",
            ...args
          }
        ],
      }}
    />
  )
}

export const PageListView = PageListViewTemplate.bind({});
PageListView.args = {
  app_id: 'admin',
  tab_id: 'space_users',
  display: 'grid',
};
PageListView.argTypes = {
  display: {
    options: [
      'grid', 'split'
    ],
    control: { type: 'radio' },
  },
}