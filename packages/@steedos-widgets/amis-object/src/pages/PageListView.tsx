/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-14 09:49:11
 * @Description: 
 */
import { getPage, Router } from "@steedos-widgets/amis-lib";
import { defaultsDeep } from 'lodash';


export const PageListView = async (props) => {
  // console.time('PageListView')
  console.log(`PageListView====>`, props)
  const { formFactor, appId, objectApiName, listviewId, display, $schema = {}, listName } = props

  //TODO  此代码应该在object page template中处理
  if (display)
    Router.setTabDisplayAs(objectApiName, display)

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
  
  const listSchema = page? page.schema : {
    "type": "steedos-object-listview",
    "objectApiName": objectApiName,
    "columnsTogglable": false,
    "showHeader": true,
    // "showDisplayAs": (formFactor !== 'SMALL'),
    // "formFactor": formFactor,
    // "className": (displayAs === 'split')? 'w-full': 'p-0 flex-1 m-0 sm:border sm:shadow sm:rounded border-slate-300 border-solid bg-gray-100'
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

  return {
    type: 'service',
    className: "h-full sm:px-3 sm:pt-3",
    body: listSchema
  }
}
