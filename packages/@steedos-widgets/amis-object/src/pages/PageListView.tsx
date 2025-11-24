/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-20 18:23:50
 * @Description: 
 */
import { getPage, Router } from "@steedos-widgets/amis-lib";
import { defaultsDeep, has } from 'lodash';


export const PageListView = async (props) => {
  // console.time('PageListView')
  // console.log(`PageListView====>`, props)
  const { formFactor, appId, objectApiName, listviewId, display, $schema = {}, listName, data, _reloadKey } = props
  const _display = data.display || display
  //TODO  此代码应该在object page template中处理
  if (_display)
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

  const schema = {
    type: 'service',
    id: 'u:steedos-page-object-listview',
    className: {
      "h-full" : " true",
      "page-list-grid" : "${display != 'split'}",
      "page-list-split" : "${display == 'split'}"
    },
    body: listSchema
  }
  // console.log(`PageListView=====>`, props, schema)
  return schema;
}
