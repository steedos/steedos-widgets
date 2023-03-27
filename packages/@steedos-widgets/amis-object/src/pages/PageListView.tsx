/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-27 18:27:16
 * @Description: 
 */
import { getPage, Router } from "@steedos-widgets/amis-lib";
import { defaultsDeep } from 'lodash';


export const PageListView = async (props) => {
  // console.log(`PageListView====>`, props)
  const { formFactor: defaultFormFactor, appId, objectApiName, listviewId, display, $schema = {}, listName } = props

  if (display)
    Router.setTabDisplayAs(objectApiName, display)

  const displayAs = (defaultFormFactor === 'SMALL')? 'grid': display? display : Router.getTabDisplayAs(objectApiName);

  const formFactor = (["split"].indexOf(displayAs) > -1) ? 'SMALL': defaultFormFactor

  const page = await getPage({type: 'list', appId: appId, objectName: objectApiName, formFactor})

  if(page === false){
    return {
      "type": "spinner",
      "show": true
    }
  }

  const listViewId = SteedosUI.getRefId({
    type: "listview",
    appId: appId,
    name: objectApiName,
  });
  
  const listSchema = page? JSON.parse(page.schema) : {
    "type": "steedos-object-listview",
    "objectApiName": objectApiName,
    "columnsTogglable": false,
    "showHeader": true,
    "showDisplayAs": (defaultFormFactor !== 'SMALL'),
    "formFactor": formFactor,
    "className": (displayAs === 'split')? 'w-full': 'p-0 flex-1 sm:m-3 sm:mb-0 sm:border sm:shadow sm:rounded border-slate-300 border-solid bg-gray-100'
  }

  const defData = {
    ...$schema.data,
    objectName: objectApiName,
    listViewId: listViewId,
    listName: listName,
    appId: appId,
    formFactor: formFactor,
    displayAs: displayAs
  }

  // console.log("defData====>", defData)

  return {
    type: 'service',
    data: defData,
    "className": (displayAs === 'grid') ? 'h-full' : 'p-0 flex flex-1 overflow-hidden h-full',
    body: (displayAs === 'grid') ? defaultsDeep({data: defData} , listSchema) : [
      {
        "type": "wrapper",
        "className": `p-0 flex-shrink-0 min-w-[388px] overflow-y-auto border-r border-gray-300 bg-gray-100 shadow lg:order-first lg:flex lg:flex-col`,
        "body": defaultsDeep({data: defData} , listSchema)
      },
      {
        "type": "wrapper",
        "className": 'p-0 flex-1 overflow-y-auto focus:outline-none xl:order-last',
        "body": []
      }
    ]
  }
}
