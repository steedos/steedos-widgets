import { getObjectListHeaderFieldsFilterBar } from './header';

const getDisplayAsButton = function(showDisplayAs){
  let buttons = [
    {
      "type": "button",
      "label": "表格",
      "onClick": "const url = document.location.pathname + '?display=grid'; props.env.jumpTo(url);"
    },
    {
      "type": "button",
      "label": "分栏视图",
      "onClick": "const url = document.location.pathname + '?display=split'; props.env.jumpTo(url);"
    },{
      "type": "button",
      "label": "三栏视图",
      "onClick": "const url = document.location.pathname + '?display=split_three'; props.env.jumpTo(url);"
    }
  ];
  return {
    "type": "dropdown-button",
    "icon": "fa fa-table-columns",
    "btnClassName": "antd-Button--iconOnly bg-white p-2 rounded border-gray-300 text-gray-500",
    "align": "right",
    "buttons": [
      {
        "label": "显示为",
        "children": buttons
      }
    ]
  };
}



let x = `return {
  
  api,
  data: {
    api.data,    
    foo: 'bar'
  }
}`


export function getObjectHeaderToolbar(mainObject, formFactor, {showDisplayAs = false, hiddenCount = false} = {}){

  if(formFactor === 'SMALL'){
    const onReloadScript = `
      const scope = event.context.scoped;
      var listView = scope.parent.getComponents().find(function(n){
        return n.props.type === "crud";
      });
      listView.handleChangePage(1);
    `;
    return [
      // "bulkActions",
      hiddenCount ? {} :{
        "type": "tpl",
        "tpl": "${count} 个项目"
      },
      {
        // "type": "reload",//不可以直接使用reload，因为它不会设置页码到第一页
        "type": "button",
        "align": "right",
        "className": "bg-white p-2 rounded border-gray-300 text-gray-500",
        "label": "",
        "icon": "fa fa-sync",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "custom",
                "script": onReloadScript
              }
            ]
          }
        },
      },
      showDisplayAs? getDisplayAsButton(showDisplayAs) : {}
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
      hiddenCount ? {} : {
        "type": "tpl",
        "tpl":  "${count} 个项目"
      },
      {
        "type": "reload",
        "align": "right",
        "className": "bg-white p-2 rounded border-gray-300 text-gray-500"
      },
      {
        "type": "button",
        "label": "",
        "align": "right", 
        "className": "fa fa-download",
        "tooltipPlacement": "top",
        "tooltip": "点击下载文件",
        "onEvent": {
          "click": {
            "actions": {
                  "args": {
                      "api": {
                          "url": "/api/record/export/${object_name}",
                          "method": "get",
                          "responseType": "blob",
                          "requestAdaptor": "\nselect = [];\nlet list_view = Creator.getObject().list_views.all.columns;\nfor (let i = 0; i < list_view.length; i++) {\n  select.push(list_view[i].field);\n}\nlet str = select.toString();\n\nlet filename = Creator.getObject('project').label + \"-\" + Creator.getListView(\"project\", \"all\")?.label;\napi.url += '?$select=' + str + '&filename=' + filename;\n\nreturn api;"
                        }
                    },
                  "actionType": "download"
              }
          }
        }
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
      },
      showDisplayAs? getDisplayAsButton(showDisplayAs) : {}
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

export function getObjectFooterToolbar(mainObject, formFactor) {
  if (formFactor === 'SMALL') {
    return [
      "load-more",
    ]
  }
  else {
    return [
      "statistics",
      // "switch-per-page",
      "pagination"
    ]
  }
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
