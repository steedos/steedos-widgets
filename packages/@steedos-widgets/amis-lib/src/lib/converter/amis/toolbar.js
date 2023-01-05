import { getObjectListHeaderFieldsFilterBar } from './header';

export function getObjectHeaderToolbar(mainObject, formFactor){

  if(formFactor === 'SMALL'){
    return [
      "bulkActions",
      {
          "type": "reload",
          "align": "right"
      },
      {
        "type": "search-box",
        "align": "right",
        "name": "__keywords",
        "placeholder": "请输入关键字",
        "mini": true
      }
  ]
  }else{
    return [
      // "filter-toggler",
      "bulkActions",
      // {
      //     "type": "export-excel",
      //     "align": "right"
      // },
      {
        "type": "tpl",
        "tpl": "${count} 个项目"
      },
      {
        "type": "reload",
        "align": "right",
        "className": "bg-white p-2 rounded border-gray-300 text-gray-500"
      },
      {
        "label": "",
        "icon": "fa fa-search",
        "type": "button",
        "align": "right",
        "className": "bg-white p-2 rounded border-gray-300 text-gray-500",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "broadcast",
                "args": {
                  "eventName": "broadcast_toggle_fields_filter"
                }
              }
            ]
          }
        }
      },
      // {
      //     "type": "columns-toggler",
      //     "align": "right"
      // },
      // {
      //   "type": "search-box",
      //   "align": "right",
      //   "name": "__keywords",
      //   "placeholder": "请输入关键字",
      //   "mini": true
      // },
      // {
      //     "type": "drag-toggler",
      //     "align": "right"
      // },
      // {
      //     "type": "pagination",
      //     "align": "right"
      // }
    ]
  }


    
}

export function getObjectFooterToolbar(){
    return [
        "statistics",
        // "switch-per-page",
        "pagination"
      ]
}

export async function getObjectFilter(objectSchema, fields, options) {
  const fieldsFilterBarSchema = await getObjectListHeaderFieldsFilterBar(objectSchema, null, options);
  return {
    "title": "",
    "submitText": "",
    "className": "b-b",
    // "debug": true,
    "mode": "normal",
    "wrapWithPanel": false,
    "body": [
      fieldsFilterBarSchema
    ]
  }
}
