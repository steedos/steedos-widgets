import { getObjectListHeaderFieldsFilterBar } from './header';

export function getObjectHeaderToolbar(mainObject, formFactor){

  if(formFactor === 'SMALL'){
    return [
      // "bulkActions",
      {
        "type": "tpl",
        "tpl": "${count} 个项目"
      },
      {
        "type": "reload",
        "align": "right",
        "className": "bg-white p-2 rounded border-gray-300 text-gray-500"
      },
  ]
  }else{
    const onFieldsFilterToggleScript = `
      const scope = event.context.scoped;
      const filterForm = scope.getComponents().find(function(n){
        return n.props.type === "form";
      });
      const filterService = filterForm.context.getComponents().find(function(n){
        return n.props.type === "service";
      });
      filterService.setData({showFieldsFilter: !!!filterService.props.data.showFieldsFilter});
    `;
    return [
      // "filter-toggler",
      "bulkActions",
      {
        "type": "columns-toggler",
        "className": "hidden"
      },
      // {
      //     "type": "columns-toggler",
      //     "className": "mr-2"
      // },
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
                "actionType": "custom",
                "script": onFieldsFilterToggleScript
              }
            ]
          }
        }
      }
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
    "className": "",
    // "debug": true,
    "mode": "normal",
    "wrapWithPanel": false,
    "body": [
      fieldsFilterBarSchema
    ]
  }
}
