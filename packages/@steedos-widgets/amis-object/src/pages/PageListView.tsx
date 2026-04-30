/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-20 18:23:50
 * @Description: 
 */
import { getPage, Router } from "@steedos-widgets/amis-lib";
import { defaultsDeep, has } from 'lodash';


function injectServerCss(cssString) {

  // 3. 挂载到 head 中
  // 如果之前已经存在，先移除旧的（避免重复堆叠）
  const oldStyle = document.getElementById('dynamic-page-styles');
  if (oldStyle) {
    oldStyle.remove();
  }

  if (cssString == null || cssString.trim() === '') {
    return;
  }
  
  // 1. 创建 style 标签
  const styleTag = document.createElement('style');
  styleTag.id = 'dynamic-page-styles'; // 设置 ID 以便后续更新或删除
  
  // 2. 填入 CSS 内容
  styleTag.innerHTML = cssString;
  
  document.head.prepend(styleTag);
}


export const PageListView = async (props) => {
  // console.time('PageListView')
  // console.log(`PageListView====>`, props)
  const { formFactor, appId, objectApiName, listviewId, display, $schema = {}, listName, data, _reloadKey } = props
  // 修复 steedos/steedos-platform#8345: SPA 路由切换到新对象时，amis 数据域 data 可能仍是上一对象的残留
  // （含 data.display/data.objectName），需校验 data 与当前 objectApiName 一致才采用 data.display，
  // 否则会把上一对象的 split 状态错误写入新对象的 sessionStorage，造成跨对象污染。
  const isCurrentObjectData = !data.objectName || data.objectName === objectApiName
  const _display = isCurrentObjectData ? (data.display || display) : display
  //TODO  此代码应该在object page template中处理
  if (isCurrentObjectData && _display)
    Router.setTabDisplayAs(objectApiName, _display)

  // const displayAs = (defaultFormFactor === 'SMALL')? 'grid': display? display : Router.getTabDisplayAs(objectApiName);

  // const formFactor = (["split"].indexOf(displayAs) > -1) ? 'SMALL': defaultFormFactor

  const page = await getPage({type: 'list', appId: appId, objectName: objectApiName, formFactor})

  if(page === false){
    return {
      "type": "spinner",
      "show": true
    }
  }

  // const listViewId = SteedosUI.getRefId({
  //   type: "listview",
  //   appId: appId,
  //   name: objectApiName,
  // });
  
  let listSchema = page? page.schema : {
    "type": "steedos-object-listview",
    "objectApiName": objectApiName,
    "columnsTogglable": false,
    "showHeader": true,
    // "showDisplayAs": (formFactor !== 'SMALL'),
    // "formFactor": formFactor,
    // "className": (displayAs === 'split')? 'w-full': 'p-0 flex-1 m-0 sm:border sm:shadow sm:rounded border-gray-300 border-solid bg-gray-100'
  }

  listSchema._reloadKey = _reloadKey;

  if(page && page.schema){
    if(page.schema.data){
      listSchema.data._reloadKey = _reloadKey;
    }else{
      listSchema.data = {
        _reloadKey
      }
    }
    listSchema = JSON.parse(JSON.stringify(listSchema).replaceAll('"type":"steedos-object-listview"', `"type":"steedos-object-listview","_reloadKey":"${_reloadKey}"`))
  }

  // const defData = {
  //   ...$schema.data,
  //   objectName: objectApiName,
  //   listViewId: listViewId,
  //   // listName: listName || listviewId,
  //   appId: appId,
  //   // formFactor: formFactor,
  //   // displayAs: displayAs
  // };

  // if(listName){
  //   defData.listName = listName || listviewId
  // }

  // console.log("defData====>", defData)
  // console.timeEnd('PageListView')

  // const pageGridClassName = listSchema.pageGridClassName || 'h-full sm:p-3'
  // const pageSplitClassName = listSchema.pageSplitClassName || 'p-0 flex flex-1 overflow-hidden h-full'

  if (page) {
    injectServerCss(page.css);
  }

  const schema = {
    type: 'service',
    id: 'u:steedos-page-object-listview',
    className: {
      "h-full" : " true",
      "page-list-grid" : "${display != 'split'}",
      "page-list-split" : "${display == 'split'}",
      [`page-${page?.name}`] : "true"
    },
    body: listSchema
  }
  // console.log(`PageListView=====>`, props, schema)


  return schema;
}
