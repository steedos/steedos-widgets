/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-09 11:54:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-13 15:13:53
 * @Description: 
 */
import React, {useEffect, useState} from 'react';
import { registerRemoteAssets, amisRender, getSteedosAuth, getRootUrl } from '@steedos-widgets/amis-lib';
import { defaultsDeep } from 'lodash';
import { Builder } from '@steedos-builder/react';
if (Builder.isBrowser){
  (window as any).Builder = Builder;
  const rootUlr = "http://127.0.0.1:5000"
  Builder.set({ 
    rootUrl: rootUlr,
    context: {
      rootUrl: rootUlr,
      userId: "63044e7529b3b23f86e0c95a",
      tenantId: "osjAHnCr7nampKZ9Z",
      authToken: "cfe37ba9fca8c9b6b777537117e3a3a2e60ab9eab68e6b6367bbc21858d0b15e162488b4ee40be6c1139c8"
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
  title: 'Amis Object',
  decorators: [(Story)=>{
    const [isLoaded, setIsLoaded] = useState(false);
      useEffect(() => {
        Promise.all([
          loadJS('https://unpkg.com/amis/sdk/sdk.js'), 
          loadJS('https://unpkg.com/lodash/lodash.min.js'),
          loadJS('https://unpkg.com/@steedos-builder/react@0.2.30/dist/builder-react.unpkg.js'),
          loadCss('https://unpkg.com/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css'),
          loadCss('https://unpkg.com/amis/lib/themes/antd.css'),
          loadCss('https://unpkg.com/amis/lib/helper.css'),
          loadCss('https://unpkg.com/amis/sdk/iconfont.css'),
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

export const Simple = () => (
  <AmisRender schema={{
    type: 'page',
    title: '表单页面',
    body: {
      type: 'form',
      mode: 'horizontal',
      api: '/saveForm',
      body: [
        {
          label: 'Name',
          type: 'input-text',
          name: 'name'
        },
        {
          label: 'Email',
          type: 'input-email',
          name: 'email'
        }
      ]
    }
  }}
  />
)


export const AssetsSimple = () => (
  <AmisRender schema={{
    type: 'page',
    title: '表单页面',
    body: {
      type: 'form',
      mode: 'horizontal',
      api: '/saveForm',
      body: [
        {
          "type": "amis-steedos-object-listview",
          "objectName": "account_banks",
          "listviewName": "all"
        }
      ]
    }
  }}
  assetUrls="http://127.0.0.1:8080/@steedos-widgets/amis-object/dist/assets-dev.json"
  />
)