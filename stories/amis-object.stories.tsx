import React, {useEffect} from 'react';

const AmisRender = ({json})=> {
  useEffect({
    amis = amisRequire('amis/embed');
    let amisScoped = amis.embed('#amis-root', json);
  })
  return (
  <>
    <head>
      <script src="https://unpkg.com/amis/sdk/sdk.js"></script>
      <script src="https://unpkg.com/lodash/lodash.min.js"></script>
      <link rel="stylesheet" href="https://unpkg.com/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css" />
      <link rel="stylesheet" href="https://unpkg.com/amis/lib/themes/antd.css" />
      <link rel="stylesheet" href="https://unpkg.com/amis/lib/helper.css" />
      <link rel="stylesheet" href="https://unpkg.com/amis/sdk/iconfont.css" />
      <link rel="stylesheet" href="https://unpkg.com/fontawesome/fontawesome.css" />
    </head>
    <div id="#amis-root"/>
  </>
)}

export default {
  title: 'Amis Object'
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
