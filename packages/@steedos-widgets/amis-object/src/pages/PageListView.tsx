/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-02 12:43:07
 * @Description: 
 */
import { getPage, Router } from "@steedos-widgets/amis-lib";


export const PageListView = async (props) => {
  const { formFactor: defaultFormFactor, app_id, tab_id, listview_id, display, $schema = {} } = props

  if (display)
    Router.setTabDisplayAs(tab_id, display)

  const displayAs = (defaultFormFactor === 'SMALL')? 'grid': display? display : Router.getTabDisplayAs(tab_id);

  const formFactor = (["split"].indexOf(displayAs) > -1) ? 'SMALL': defaultFormFactor

  const page = await getPage({type: 'list', appId: app_id, objectName: tab_id, formFactor})

  if(page === false){
    return {
      "type": "spinner",
      "show": true
    }
  }

  const listViewId = SteedosUI.getRefId({
    type: "listview",
    appId: app_id,
    name: tab_id,
  });
  
  const listSchema = page? JSON.parse(page.schema) : {
    "type": "steedos-object-listview",
    "className": "w-full",
    "objectApiName": tab_id,
    "columnsTogglable": false,
    "showHeader": true,
    "showDisplayAs": (defaultFormFactor !== 'SMALL'),
    "formFactor": formFactor,
  }

  return {
    type: 'service',
    data: {
      ...$schema.data,
      objectName: tab_id,
      listViewId: listViewId,
      listName: listview_id,
      appId: app_id,
      formFactor: formFactor,
      displayAs: displayAs,
      scopeId: listViewId,
    },
    "className": 'p-0 flex flex-1 overflow-hidden h-full sm:m-3 sm:mb-0 sm:border sm:shadow sm:rounded border-slate-300 border-solid bg-gray-100',
    body: (displayAs === 'grid') ? listSchema : [
      {
        "type": "wrapper",
        "className": `p-0 flex-shrink-0 min-w-32 overflow-y-auto border-r border-gray-200 lg:order-first lg:flex lg:flex-col`,
        "body": listSchema
      },
      {
        "type": "wrapper",
        "className": 'p-0 flex-1 overflow-y-auto focus:outline-none xl:order-last',
        "body": []
      }
    ]
  }
}
