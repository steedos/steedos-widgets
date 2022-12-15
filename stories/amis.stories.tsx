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
  title: 'Amis/Steedos Object',
  
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

export const ObjectForm = () => (
  <AmisRender schema={{
    type: 'page',
    title: '表单',
    body: [{
      "type": "panel",
      "title": "只读（默认）",
      "body": [{
        "type": "steedos-object-form",
        "objectApiName": "space_users",
        "mode": 'read',
        "recordId": "S9KrMPys4fKx9Kjtm"
      }]
    },{
      "type": "panel",
      "title": "编辑",
      "body": [{
        "type": "tpl", 
        "tpl":"自定义底部actions"
      },{
        "id": "test",
        "type": "steedos-object-form",
        "objectApiName": "organizations",
        "recordId": "gKfnkfbLWdqCxo8dg",
        // "objectApiName": "abc__c",
        // "recordId": "63453364310c62002c43e3b6",
        "mode": "edit",
        "actions": [
          {
            "type": "button",
            "label": "取消",
            "actionType": "",
            "level": "default",
            "block": false,
            "onClick": "SteedosUI.getRef(props.data.__super.modalName).close();",
            "id": "u:42931eb1700a"
          },
          {
            "type": "button",
            "label": "保存",
            "actionType": "submit",
            "level": "info",
            "id": "u:f76b9dba4b2c"
          }
        ]
      },{
        "type": "tpl", 
        "tpl":"<p> 自定义按钮中触发表单提交事件，通过传入表单Id </p>"
      },{
        "type": "button",
        "label": "提交上面的表单",
        "onEvent": {
          "click": {
            "actions": [
              {
                "componentId": "test",
                "actionType": "submit"
              }
            ]
          }
        },
        "id": "u:c5ce4f94c7cb"
      }]
    },{
      "type": "panel",
      "title": "按钮弹出表单",
      "body": [{
        "type": "button",
        "label": "按钮",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "dialog",
                "dialog": {
                  "type": "dialog",
                  "title": "弹框标题",
                  "body": [
                    {
                      "type": "steedos-object-form",
                      "label": "对象表单",
                      "objectApiName": "organizations",
                      "recordId": "623NR6NCZJP8irB4y",
                      "id": "u:bd6cac6514e2",
                      "mode": "edit"
                    }
                  ],
                  "id": "u:efbdf9ba356f",
                  "closeOnEsc": false,
                  "closeOnOutside": false,
                  "showCloseButton": true,
                  "size": "xl"
                }
              }
            ]
          }
        },
        "id": "u:0ad1781ec67c"
      }]
    }]
  }}
  assetUrls={assetUrls}
  />
)

export const ObjectListview = () => (
  <AmisRender schema={{
    type: 'page',
    title: '列表视图',
    body: [{
      "type": "panel",
      "title": "基本用法",
      "body": [{
        "type": "steedos-object-listview",
        "objectApiName": "space_users",
        "listName": "all"
      }]
    },{
      "type": "panel",
      "title": "不显示 amis headerToolbar",
      "body": [{
        "type": "steedos-object-listview",
        "objectApiName": "space_users",
        "listName": "all",
        "headerToolbar": [],
        "columnsTogglable": false
      }]
    },{
      "type": "panel",
      "title": "显示列表视图头部",
      "body": [{
        "type": "steedos-object-listview",
        "objectApiName": "space_users",
        "listName": "all",
        "headerToolbar": [],
        "columnsTogglable": false,
        "showHeader": true
      }]
    }]
  }}
  assetUrls={process.env.STEEDOS_EXPERIENCE_ASSETURLS}
  />
)


export const ObjectCalendar = () => (
  <AmisRender schema={{
    type: 'page',
    title: '日历视图',
    body: [{
      "type": "steedos-object-listview",
      "objectApiName": "events",
      "listName": "calendar_view",
      "showHeader": true
    }]
  }}
  assetUrls={process.env.STEEDOS_EXPERIENCE_ASSETURLS}
  />
)

export const ObjectTable = () => (
  <AmisRender schema={{
    type: 'page',
    title: '对象表格',
    body: [{
      "type": "panel",
      "title": "基本用法(指定columns)",
      "body": [{
        "type": "steedos-object-table",
        "objectApiName": "space_users",
        "columns": ["name", "mobile"]
      }]
    },{
      "type": "panel",
      "title": "过滤条件",
      "body": [{
        "type": "steedos-object-table",
        "objectApiName": "space_users",
        "columns": ["name", "mobile"],
        "filters": ["name", "contains", "张"]
      }]
    },{
      "type": "panel",
      "title": "排序",
      "body": [{
        "type": "steedos-object-table",
        "objectApiName": "space_users",
        "columns": ["name", "mobile"],
        "sortField": "name",
        "sortOrder": "asc",
      }]
    },{
      "type": "panel",
      "title": "TOP",
      "body": [{
        "type": "steedos-object-table",
        "objectApiName": "space_users",
        "columns": ["name", "mobile"],
        "top": 2
      }]
    },{
      "type": "panel",
      "title": "翻页 perPage(没效果)",
      "body": [{
        "type": "steedos-object-table",
        "objectApiName": "space_users",
        "columns": ["name", "mobile"],
        "perPage": 2
      }]
    },{
      "type": "panel",
      "title": "列宽度",
      "body": [{
        "type": "steedos-object-table",
        "objectApiName": "space_users",
        "columns": [{"field": "name", "width": "120px"}, "mobile"]
      }]
    },{
      "type": "panel",
      "title": "列换行(没效果，始终会换行)",
      "body": [{
        "type": "steedos-object-table",
        "objectApiName": "space_users",
        "columns": ["name", "mobile", {"field": "position", "width": 120, "wrap": false}]
      }]
    },{
      "type": "panel",
      "title": "不显示 amis headerToolbar",
      "body": [{
        "type": "steedos-object-table",
        "objectApiName": "space_users",
        "columns": ["name", "mobile"],
        "headerToolbar": [],
        "columnsTogglable": false
      }]
    }]
  }}
  assetUrls={process.env.STEEDOS_EXPERIENCE_ASSETURLS}
  />
)

export const RecordDetailRelatedList = () => (
  <AmisRender schema={{
    type: 'page',
    title: '相关列表',
    body: {
      "type": "steedos-object-related-listview",
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
      },
      {
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
      }
    ]
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
          "tpl": `没有任何属性任何功能，返回空内容`,
        }
      ]
    },
  }}
  assetUrls={assetUrls}
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