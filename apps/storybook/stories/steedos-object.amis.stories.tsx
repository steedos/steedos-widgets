import { React, AmisRender } from '../components/AmisRender';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Steedos/Components',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

const data = {};

const env = {
  assetUrls: [
    `${process.env.STEEDOS_UNPKG_URL}/@steedos-widgets/amis-object/dist/assets.json`,
  ],
};



export const RecordDetailHeader = () =>  (
  <AmisRender schema = {{
    type: 'page',
    title: '标题面板',
    body: {
      "type": "steedos-record-detail-header",
      "objectApiName": "space_users",
      "recordId": ""
    },
  }} data ={data} env = {env} />
)


export const AmisSelectUser = () =>  (
  <AmisRender schema = {{
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
  }} data ={data} env = {env} />
)


export const Provider = () =>  (
  <AmisRender schema = {{
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
  }} data ={data} env = {env} />
)
