/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-09 11:54:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-13 15:24:56
 * @Description: 
 */
import React, {useEffect, useState} from 'react';
import { registerRemoteAssets, amisRender, getSteedosAuth, getRootUrl, getSelectUserSchema } from '@steedos-widgets/amis-lib';
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
                authToken: steedosAuth.token
            }
        }
    });
    console.log(`assetUrls`, assetUrls)
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
          loadJS('https://unpkg.com/amis/sdk/sdk.js'), 
          loadJS('https://unpkg.com/crypto-js@4.1.1/crypto-js.js'), 
          loadJS('https://unpkg.com/lodash/lodash.min.js'),
          loadJS('https://unpkg.com/@steedos-builder/react@0.2.30/dist/builder-react.unpkg.js'),
          loadCss('https://unpkg.com/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css'),
          loadCss('https://unpkg.com/amis/lib/themes/antd.css'),
          loadCss('https://unpkg.com/amis/lib/helper.css'),
          loadCss('https://unpkg.com/amis/sdk/iconfont.css'),
          loadCss('https://unpkg.com/@fortawesome/fontawesome-free@6.2.0/css/all.min.css'),
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
      "listviewName": "all"
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
      "objectApiName": "space_users",
      "recordId": "kDrtGu7aZPwYdyFpe",
      "relatedObjectApiName": "instances"
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

export const AmisSpaceUsersPicker = () => (
  <AmisRender schema={{
      "type": "form",
      "mode": "horizontal",
      "body": [
        {
          "label": "Owner",
          "type": "steedos-user-picker",
          "name": "owner",
        }
      ],
      "title": "AmisSpaceUsersPicker"
    }}
    assetUrls={assetUrls}
  />
)

// export const AmisSelectUsers = () => {
//   const userAmisSchema = getSelectUserSchema()
//   const amisSchema = {
//     "type": "form",
//     "mode": "horizontal",
//     "body": [
//     ],
//     "title": "AmisSelectUsers"
//   };
//   amisSchema.body.push(userAmisSchema);

//   return (<AmisRender schema={amisSchema}
//     assetUrls={process.env.STEEDOS_EXPERIENCE_ASSETURLS}
//   />
//   )
// }