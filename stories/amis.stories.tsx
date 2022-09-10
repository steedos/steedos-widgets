/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-09 11:54:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-09 13:38:19
 * @Description: 
 */
import React, {useEffect, useState} from 'react';

const AmisRender = ({json})=> {
  useEffect(()=>{
    const amis = (window as any).amisRequire('amis/embed');
    let amisScoped = (amis as any).embed('#amis-root', json);
    console.log('amisScoped', amisScoped)
  }, [])
  return (
  <>
    <div id="amis-root">111</div>
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
  title: 'Amis/Baidu',
  decorators: [(Story)=>{
    const [isLoaded, setIsLoaded] = useState(false);
      useEffect(() => {
        Promise.all([
          loadJS('https://unpkg.com/amis/sdk/sdk.js'), 
          loadJS('https://unpkg.com/lodash/lodash.min.js'),
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


export const Simple = () => (
  <AmisRender json={{
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
  }}/>
)
