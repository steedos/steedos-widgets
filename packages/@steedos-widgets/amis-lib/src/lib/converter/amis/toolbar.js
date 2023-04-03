import { getObjectListHeaderFieldsFilterBar } from './header';

const getDisplayAsButton = function (showDisplayAs) {
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

function getExportApiRequestAdaptorScript() {
  return `
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
    return api;
  `
}

export function getObjectHeaderToolbar(mainObject, formFactor, { showDisplayAs = false, hiddenCount = false } = {}) {
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    showDisplayAs = false;
  }
  if (formFactor === 'SMALL') {
    const onReloadScript = `
      const scope = event.context.scoped;
      var listView = scope.parent.getComponents().find(function(n){
        return n.props.type === "crud";
      });
      listView.handleChangePage(1);
    `;
    return [
      // "bulkActions",
      hiddenCount ? {} : {
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
      showDisplayAs ? getDisplayAsButton(showDisplayAs) : {}
    ]
  } else {
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
      hiddenCount ? {} : {
        "type": "tpl",
        "tpl": "${count} 个项目"
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
        "className": "bg-white rounded border-gray-300 text-gray-500",
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
                    "requestAdaptor": `${getExportApiRequestAdaptorScript()}`,
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
      {
        "type": "dropdown-button",
        "trigger": "click",
        "icon": "fa fa-cog",
        "btnClassName": "antd-Button--iconOnly bg-white p-2 rounded border-gray-300 text-gray-500",
        "align": "right",
        "visibleOn": "${!isLookup}",
        "buttons": [
          {
            "label": "列表视图操作",
            "children": [
              {
                "type": "button",
                "label": "新建",
                "onEvent": {
                  "click": {
                    "weight": 0,
                    "actions": [
                      {
                        "dialog": {
                          "type": "dialog",
                          "title": "新建 列表视图",
                          "data": {
                            "&": "$$",
                            "all": "${uiSchema.list_views.all}",
                            "appId": "${appId}"
                          },
                          "body": [
                            {
                              "type": "steedos-object-form",
                              "label": "对象表单",
                              "objectApiName": "object_listviews",
                              "recordId": "",
                              "className": "sm:border sm:shadow sm:rounded sm:border-gray-300 bg-white p-4",
                              "mode": "edit",
                              "defaultData": {
                                "object_name": "${all.object_name}",
                                "filter_scope": "${all.filter_scope}",
                                "columns": "${all.columns}",
                                "filter_fields": "${all.filter_fields}",
                                "scrolling_mode": "${all.scrolling_mode}",
                                "shared": "${all.shared}",
                                "sort": "${all.sort}",
                                "show_count": "${all.show_count}",
                                "type": "${all.type}"
                              },
                              "fieldsExtend": "{\n  \"label\": {\n    \"is_wide\": true\n  },\n  \"name\": {\n    \"is_wide\": true,\n    \"amis\":{\n      \"hidden\": true\n    }\n  },\n  \"object_name\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"filter_scope\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"columns\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"filter_fields\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"scrolling_mode\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"sort\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"show_count\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"type\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  }\n}",
                              "fields": [
                                "label",
                                "name",
                                "object_name",
                                "filter_scope",
                                "show_count",
                                "columns.$.field",
                                "columns.$.width",
                                "sort.$.field_name",
                                "sort.$.order",
                                "filters",
                                "mobile_columns.$.field",
                                "searchable_fields.$.field",
                                "is_system",
                                "shared"
                              ],
                              "onEvent": {
                                "submitSucc": {
                                  "weight": 0,
                                  "actions": [
                                    {
                                      "args": {
                                        // 直接使用recordId不能拿到数据，只能通过result里面拿数据
                                        "url": "${context.rootUrl}/app/${appId}/${object_name}/grid/listview_${result.data.recordId|lowerCase}",
                                        "blank": false
                                      },
                                      "actionType": "url",
                                    }
                                  ]
                                }
                              },
                              "messages": {
                                "success": "成功",
                                "failed": "失败"
                              },
                            }
                          ],
                          "showCloseButton": true,
                          "showErrorMsg": true,
                          "showLoading": true,
                          "closeOnEsc": false,
                          "dataMapSwitch": false,
                          "size": "lg"
                        },
                        "actionType": "dialog"
                      }
                    ]
                  }
                }
              },
              {
                "type": "button",
                "label": "复制",
                "onEvent": {
                  "click": {
                    "weight": 0,
                    "actions": [
                      {
                        "dialog": {
                          "type": "dialog",
                          "title": "复制 列表视图",
                          "data": {
                            "&": "$$",
                            "listName": "${listName}",
                            "list_view": "${uiSchema.list_views[listName]}",
                            "appId": "${appId}"
                          },
                          "body": [
                            {
                              "type": "steedos-object-form",
                              "label": "对象表单",
                              "objectApiName": "object_listviews",
                              "recordId": "",
                              "className": "sm:border sm:shadow sm:rounded sm:border-gray-300 bg-white p-4",
                              "mode": "edit",
                              "fields": [
                              ],
                              "defaultData": {
                                "object_name": "${list_view.object_name}",
                                "filter_scope": "${list_view.filter_scope}",
                                "columns": "${list_view.columns}",
                                "filter_fields": "${list_view.filter_fields}",
                                "scrolling_mode": "${list_view.scrolling_mode}",
                                "shared": "${list_view.shared}",
                                "sort": "${list_view.sort}",
                                "show_count": "${list_view.show_count}",
                                "type": "${list_view.type}"
                              },
                              "fieldsExtend": "{\n  \"label\": {\n    \"is_wide\": true\n  },\n  \"name\": {\n    \"is_wide\": true,\n    \"amis\":{\n      \"hidden\": true\n    }\n  },\n  \"object_name\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"filter_scope\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"columns\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"filter_fields\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"scrolling_mode\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"sort\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"show_count\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"type\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  }\n}",
                              "fields": [
                                "label",
                                "name",
                                "object_name",
                                "filter_scope",
                                "show_count",
                                "columns.$.field",
                                "columns.$.width",
                                "sort.$.field_name",
                                "sort.$.order",
                                "filters",
                                "mobile_columns.$.field",
                                "searchable_fields.$.field",
                                "is_system",
                                "shared"
                              ],
                              "onEvent": {
                                "submitSucc": {
                                  "weight": 0,
                                  "actions": [
                                    {
                                      "args": {
                                        // 直接使用recordId不能拿到数据，只能通过result里面拿数据
                                        "url": "${context.rootUrl}/app/${appId}/${object_name}/grid/listview_${result.data.recordId|lowerCase}",
                                        "blank": false
                                      },
                                      "actionType": "url",
                                    }
                                  ]
                                }
                              }
                            }
                          ],
                          "showCloseButton": true,
                          "showErrorMsg": true,
                          "showLoading": true,
                          "closeOnEsc": false,
                          "dataMapSwitch": false,
                          "size": "lg"
                        },
                        "actionType": "dialog"
                      }
                    ]
                  }
                }
              },
              {
                "type": "button",
                "label": "重命名",
                "onEvent": {
                  "click": {
                    "weight": 0,
                    "actions": [
                      {
                        "dialog": {
                          "type": "dialog",
                          "title": "重命名 列表视图",
                          "body": [
                            {
                              "type": "steedos-object-form",
                              "label": "对象表单",
                              "objectApiName": "object_listviews",
                              "recordId": "${uiSchema.list_views[listName]._id}",
                              "className": "sm:border sm:shadow sm:rounded sm:border-gray-300 bg-white p-4",
                              "mode": "edit",
                              "fields": [
                                "label"
                              ],
                              "fieldsExtend": "{\n  \"label\":{\n    \"is_wide\": true\n  }\n}",
                              "onEvent": {
                                "submitSucc": {
                                  "weight": 0,
                                  "actions": [
                                    {
                                      "args": {
                                        "url": "${context.rootUrl}/app/${appId}/${object_name}/grid/${name}",
                                        "blank": false
                                      },
                                      "actionType": "url",
                                    },
                                  ]
                                }
                              }
                            }
                          ],
                          "showCloseButton": true,
                          "showErrorMsg": true,
                          "showLoading": true,
                          "size": "lg"
                        },
                        "actionType": "dialog"
                      }
                    ]
                  }
                }
              },
              {
                "type": "button",
                "label": "共享设置",
                "onEvent": {
                  "click": {
                    "weight": 0,
                    "actions": [
                      {
                        "dialog": {
                          "type": "dialog",
                          "title": "共享设置 列表视图",
                          "body": [
                            {
                              "type": "steedos-object-form",
                              "label": "对象表单",
                              "objectApiName": "object_listviews",
                              "recordId": "${uiSchema.list_views[listName]._id}",
                              "className": "sm:border sm:shadow sm:rounded sm:border-gray-300 bg-white p-4",
                              "mode": "edit",
                              "fields": [
                                "shared"
                              ]
                            }
                          ],
                          "showCloseButton": true,
                          "showErrorMsg": true,
                          "showLoading": true,
                          "closeOnEsc": false,
                          "dataMapSwitch": false,
                          "size": "md"
                        },
                        "actionType": "dialog"
                      }
                    ]
                  }
                }
              },
              {
                "type": "button",
                "label": "过滤设置(todo)",
                "onEvent": {
                  "click": {
                    "weight": 0,
                    "actions": [
                      {
                        "dialog": {
                          "type": "dialog",
                          "title": "过滤设置 列表视图",
                          "body": [
                            {
                              "type": "steedos-object-form",
                              "label": "对象表单",
                              "objectApiName": "object_listviews",
                              "recordId": "${uiSchema.list_views[listName]._id}",
                              "className": "sm:border sm:shadow sm:rounded sm:border-gray-300 bg-white p-4",
                              "mode": "read",

                              "fields": [
                                "filters"
                              ]
                            }
                          ],
                          "showCloseButton": true,
                          "showErrorMsg": true,
                          "showLoading": true,
                          "closeOnEsc": false,
                          "dataMapSwitch": false,
                          "size": "lg"
                        },
                        "actionType": "dialog"
                      }
                    ]
                  }
                }
              },
              {
                "type": "button",
                "label": "显示的列(todo)",
                "onEvent": {
                  "click": {
                    "weight": 0,
                    "actions": [
                      {
                        "args": {},
                        "dialog": {
                          "type": "dialog",
                          "title": "显示的列 列表视图",
                          "body": [
                            {
                              "type": "steedos-object-form",
                              "label": "对象表单",
                              "objectApiName": "object_listviews",
                              "recordId": "${uiSchema.list_views[listName]._id}",
                              "className": "sm:border sm:shadow sm:rounded sm:border-gray-300 bg-white p-4",
                              "mode": "edit",
                              "excludedFields": [
                                "label",
                                "name",
                                "object_name",
                                "filter_scope",
                                "shared",
                                "show_count",
                                "filter_fields",
                                "sort.$.field_name",
                                "sort.$.order",
                                "filters",
                                "mobile_columns.$.field",
                                "searchable_fields.$.field",
                                "sort_no",
                                "is_system",
                                "enable_amis_schema",
                                "amis_schema",
                                "requestAdaptor",
                                "adaptor",
                                "instance_state",
                                "created",
                                "created_by",
                                "modified",
                                "modified_by",
                                "instances.$._id",
                                "instances.$.state"
                              ],
                            }
                          ],
                          "showCloseButton": true,
                          "showErrorMsg": true,
                          "showLoading": true,
                          "size": "lg"
                        },
                        "actionType": "dialog"
                      }
                    ]
                  }
                }
              },
              {
                "type": "button",
                "label": "删除",
                "confirmText": "如果您删除此列表视图，该视图将为所有具备访问权限的用户永久删除。是否确定要删除？",
                "api": {
                  "url": "${context.rootUrl}/graphql",
                  "method": "post",
                  "headers": {
                    "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                  },
                  "data": {
                    "&": "$$",
                    "recordId": "${uiSchema.list_views[listName]._id}",
                    "objectName": "${objectName}",
                    "appId": "${appId}"
                  },
                  "messages": {
                    "success": "删除成功",
                    "failed": "删除失败"
                  },
                  "requestAdaptor": "const { recordId } = api.body;\nvar deleteArray = [];\nif (recordId) { deleteArray.push(`delete:object_listviews__delete(id: \"${recordId}\")`); }\napi.data = { query: `mutation{${deleteArray.join(',')}}` };\n  return api;\n",
                  "adaptor": "if (payload.errors) {\n  payload.status = 2;\n  payload.msg = payload.errors[0].message;\n}\nreturn payload;",
                },
                "redirect": "./all",
                "actionType": "ajax",
                "outputVar": "responseResult",
              },
              {
                "type": "button",
                "label": "保存宽度(todo)"
              },
              // {
              //   type: 'steedos-object-button',
              //   name: 'standard_delete',
              //   objectName: 'test0321__c',
              //   // visibleOn: getButtonVisibleOn(button),
              //   className: 'antd-Button--default'
              // }
            ]
          }
        ]
      },
      showDisplayAs ? getDisplayAsButton(showDisplayAs) : {}
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
