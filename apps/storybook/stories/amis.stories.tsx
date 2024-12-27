/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-09 11:54:45
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-12-27 12:19:34
 * @Description: 
 */
import React, {useEffect, useState} from 'react';
import { registerRemoteAssets, amisRender, getSteedosAuth, getRootUrl, defaultsDeep } from '@steedos-widgets/amis-lib';
// import { defaultsDeep } from 'lodash';
// import { Builder } from '@steedos-builder/react';
import ReactDOM from 'react-dom';
import * as _ from 'lodash';

// window.defaultsDeep = defaultsDeep;

const assetUrls = []

// if (Builder.isBrowser){
//   (window as any).Builder = Builder;
//   (window as any)._ = _;
//   Builder.set({ 
//     rootUrl: process.env.STEEDOS_ROOT_URL,
//     context: {
//       rootUrl: process.env.STEEDOS_ROOT_URL,
//       userId: process.env.STEEDOS_USERID || localStorage.getItem('steedos:userId'),
//       tenantId: process.env.STEEDOS_TENANTID || localStorage.getItem('steedos:spaceId'),
//       authToken: process.env.STEEDOS_AUTHTOKEN || localStorage.getItem('steedos:token'),
//     } 
//   });
// }
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
  title: 'Amis/Amis Test',
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

export const AmisDialog = () => (
  <AmisRender
    assetUrls={assetUrls}
    schema={{
      "type": "page",
      "body": [
        {
          "type": "button",
          "className": "ml-2",
          "label": "打开弹窗（模态）",
          "level": "primary",
          "onEvent": {
            "click": {
              "actions": [
                {
                  "actionType": "dialog",
                  "dialog": {
                    "type": "dialog",
                    "title": "模态弹窗",
                    "id": "dialog_001",
                    "data": {
                      "myage": "22"
                    },
                    "body": [
                      {
                        "type": "tpl",
                        "tpl": "<p>对，你打开了模态弹窗</p>",
                        "inline": false
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      ]
    }}
  />
)