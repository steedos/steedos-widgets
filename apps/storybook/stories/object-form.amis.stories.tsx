import { React, AmisRender } from '../components/AmisRender';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Steedos/Object Form',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

const data = {};

const env = {
  assetUrls: [
    `${process.env.STEEDOS_UNPKG_URL}/@steedos-widgets/amis-object/dist/assets.json`,
  ],
};


export const Simple = () =>  (
  <AmisRender schema = {{
    type: 'steedos-object-form',
    objectApiName: 'space_users',
    "mode": "edit",
    "enableInitApi": false,
    "className": "",
    recordId: 'zT7rgJNvjeqHCk6n4',
  
  }} data ={data} env = {env} />
);


export const ObjectForm = () =>  (
  <AmisRender schema = {{
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
  }} data ={data} env = {env} />
);