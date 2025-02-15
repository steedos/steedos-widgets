import { React, AmisRender } from '../components/AmisRender';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Steedos/Object Table',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

const data = {};

const env = {
  assetUrls: [
    `${process.env.STEEDOS_UNPKG_URL}/@steedos-widgets/amis-object/dist/assets.json`,
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
