/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-09 11:54:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-13 15:24:56
 * @Description: 
 */
import React, {useEffect, useState} from 'react';
import { registerRemoteAssets, amisRender, getSteedosAuth, getRootUrl } from '@steedos-widgets/amis-lib';
import { defaultsDeep } from 'lodash';
import { Builder } from '@steedos-builder/react';

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
  title: 'Designer',
  decorators: [(Story)=>{
    const [isLoaded, setIsLoaded] = useState(false);
      useEffect(() => {
        Promise.all([
          loadJS('https://unpkg.steedos.cn/@steedos-builder/fiddle@0.0.5/dist/builder-fiddle.umd.js'), 
          loadJS('https://unpkg.steedos.cn/axios@0.26.1/dist/axios.min.js'),
          loadCss('https://unpkg.steedos.cn/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css'),
          loadCss('https://unpkg.steedos.cn/amis/lib/themes/antd.css'),
          loadCss('https://unpkg.steedos.cn/amis/lib/helper.css'),
          loadCss('https://unpkg.steedos.cn/amis/sdk/iconfont.css'),
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

const settings = {
    assetUrls: process.env.STEEDOS_EXPERIENCE_ASSETURLS,
    rootUrl: process.env.STEEDOS_ROOT_URL,
    userId: process.env.STEEDOS_USERID,
    tenantId: process.env.STEEDOS_TENANTID  || localStorage.getItem('steedos:spaceId'),
    authToken: process.env.STEEDOS_AUTHTOKEN  || localStorage.getItem('steedos:token'),
    messageOnly: true,
  };

  const initialContent = {
    type: "page",
    title: "Welcome to Steedos",
    body: [],
    regions: ["body"],
    data: {
      objectName: "space_users",
      recordId: "",
      initialValues: {},
      appId: "builder",
      title: "",
      context: {
        rootUrl: process.env.STEEDOS_ROOT_URL,
        userId: process.env.STEEDOS_USERID,
        tenantId: process.env.STEEDOS_TENANTID,
        authToken: process.env.STEEDOS_AUTHTOKEN,
      },
    },
  };


/** 以上为可复用代码 **/

export const AmisObject = () => {

    const assetUrl = process.env.STEEDOS_UNPKG_URL + '/@steedos-widgets/amis-object/dist/assets-dev.json'

    window.addEventListener('message', function (event) {
        const comp = document.querySelector("builder-fiddle");
        const { data } = event;
        if (data) {
          if (data.type === 'builder.editorLoaded') {
            comp.settings = settings;
            comp.messageFrame('builder.contentChanged', { AmisSchema : initialContent } )
          }
        }
      })

    return (
        <builder-fiddle 
            host={`https://beta.builder.steedos.com/amis?assetUrl=${assetUrl}`}
        ></builder-fiddle>
    )    
} 

export const Sortable = () => {

  const assetUrl = process.env.STEEDOS_UNPKG_URL + '/@steedos-widgets/sortable/dist/assets-dev.json'

  const defaultValue = {
    A: ['A1', 'B1'],
    B: ['A2', 'B2']
  }
  
  
  const containerSource = [
    {
      id: 'A',
      label: 'Board A',
    },
    {
      id: 'B',
      label: 'Board B'
    }
  ]
  
  const itemSource = [
    {
      id: 'A1',
      label: 'Item A1',
      columnSpan: 2,
      color: 'red'
    },
    {
      id: 'A2',
      label: 'Item A2',
      columnSpan: 1,
      color: 'blue'
    },
    {
      id: 'B1',
      label: 'Item B1',
      color: 'green'
    },,
    {
      id: 'B2',
      label: 'Item B2',
      color: 'silver'
    },
  ]
  
  const sortableInitialContent = {
    type: "page",
    title: "Welcome to Steedos",
    body: [{
      "type": "sortable-multiple-containers",
      "label": "容器排序",
      "name": "board",
      "columns": 1,
      "vertical": false,
      "value": defaultValue,
      "containerSource": containerSource,
      "itemSource": itemSource,
    }],
    regions: ["body"],
    data: {
      objectName: "space_users",
      recordId: "",
      initialValues: {},
      appId: "builder",
      title: "",
      context: {
        rootUrl: process.env.STEEDOS_ROOT_URL,
        userId: process.env.STEEDOS_USERID,
        tenantId: process.env.STEEDOS_TENANTID,
        authToken: process.env.STEEDOS_AUTHTOKEN,
      },
    },
  };
  window.addEventListener('message', function (event) {
      const comp = document.querySelector("builder-fiddle");
      const { data } = event;
      if (data) {
        if (data.type === 'builder.editorLoaded') {
          comp.settings = settings;
          comp.messageFrame('builder.contentChanged', { AmisSchema : sortableInitialContent } )
        }
      }
    })

  return (
      <builder-fiddle 
          host={`https://beta.builder.steedos.com/amis?assetUrl=${assetUrl}`}
      ></builder-fiddle>
  )    
} 
