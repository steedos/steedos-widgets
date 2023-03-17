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
  ]
  }else{
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
        "tooltipPlacement": "bottom",
        "className": "bg-white p-2 rounded border-gray-300 text-gray-500"
      },
      {
        "type": "button",
        "label": "",
        "icon": "fa fa-download",
        "align": "right", 
        "className": "bg-white p-2 rounded border-gray-300 text-gray-500",
        "tooltipPlacement": "bottom",
        "visibleOn": "${!isLookup && global.user.is_space_admin}",
        "tooltip": "导出Excel",
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "args": {
                  "api": {
                    "url": "${context.rootUrl}/api/record/export/${objectName}",
                    "method": "get",
                    "messages": {},
                    "requestAdaptor": `
                      console.log(api.url);
                      // 获取列表视图的属性
                      let uiSchema = api.body.uiSchema;
                      let list_views = uiSchema.list_views;
                      let list_views_name = api.body.listName;
                      let col = list_views[list_views_name].columns;
                      let sort_test = list_views[list_views_name].sort;
                      
                      // 获取下载字段
                      let select = [];
                      _.each(col, (col) => {
                          if (col.field == undefined)
                              select.push(col);
                          else select.push(col.field);
                      });
                      
                      // 获取排序字段
                      
                      let sort = [];
                      _.forEach(sort_test, (sortField) => {
                          if (sortField.field_name == undefined)
                              sort.push(sortField);
                          else sort.push([sortField.field_name, sortField.order]);
                      })
                      
                      let orders = [];
                      _.map(sort, (value) => {
                          let order_tmp = [];
                          if (value[1] == "desc")
                              order_tmp = value[0] + ' desc';
                          else
                              order_tmp = value[0];
                          orders.push(order_tmp);
                      });
                      let order = orders.join(',');
                      
                      let filename = uiSchema.label + "-" + list_views[list_views_name].label;
                      
                      url_tmp = api.url.split('?')[0];
                      api.url = url_tmp + "?$select=" + select.toString() + "&filename=" + filename;
                      
                      // 判断sort 和 filters
                      if (sort.length > 0) {
                          api.url += "&$orderby=" + order;
                      }
                      let filters = list_views[list_views_name].filters;
                      if (filters && filters.length > 0) {
                          api.url = api.url + "&filters=" + JSON.stringify(filters);
                      }
                      console.log(api.url);
                      return api;
                      `,
                    "data": {
                      "uiSchema": "${uiSchema}",
                      "listName": "${listName}"
                    },
                    "headers": {
                      "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                    }
                  }
                },
                "actionType": "download"
              }
            ]
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
