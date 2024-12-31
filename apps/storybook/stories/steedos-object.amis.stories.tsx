import { React, AmisRender } from '../components/AmisRender';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Amis/Steedos Objects',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

const data = {};

const env = {
  assetUrls: [
    `http://localhost:8080/@steedos-widgets/amis-object/dist/assets-dev.json`,
  ],
};




export const ObjectListview = () =>  (
  <AmisRender schema = {{
    type: 'page',
    title: '列表视图',
    body: [{
      "type": "panel",
      "title": "基本用法",
      "body": [{
        "type": "steedos-object-listview",
        "objectApiName": "space_users",
        "listName": "all",
        "showHeader": true,
        "columnsTogglable": false,
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
      "title": "日历视图",
      "body": [{
        "type": "steedos-object-listview",
        "objectApiName": "events",
        "listName": "calendar_view",
        "showHeader": true
      }]
    }]
  }} data ={data} env = {env} />
)


export const ObjectCalendar = () =>  (
  <AmisRender schema = {{
    type: 'page',
    title: '日历视图',
    body: [{
      "type": "steedos-object-calendar",
      "objectApiName": "events"
    }]
  }} data ={data} env = {env} />
)


export const ObjectTable = () =>  (
  <AmisRender schema = {{
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
  }} data ={data} env = {env} />
)


export const RecordDetailRelatedList = () =>  (
  <AmisRender schema = {{
    type: 'page',
    title: '相关列表',
    body: {
      "type": "steedos-object-related-listview",
      "objectApiName": "accounts",
      "recordId": "AKEQtKsWvNDF6MitJ",
      "relatedObjectApiName": "contacts"
    },
  }} data ={data} env = {env} />
)


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
