import { getObjectListHeaderFieldsFilterBar } from './header';
import { Router } from "@steedos-widgets/amis-lib";

const getDisplayAsButton = function(objectName, showDisplayAs){
  let displayAs = Router.getTabDisplayAs(objectName);
  let buttons = [
    {
      "type": "button",
      "label": "表格",
      "onClick": "let url = document.location.pathname; var urlSearch = new URLSearchParams(document.location.search); if(urlSearch.get(\"side_object\") && urlSearch.get(\"side_listview_id\")){url=`/app/${props.data.appId}/${urlSearch.get(\"side_object\")}/grid/${urlSearch.get(\"side_listview_id\")}`;}; props.env.jumpTo(url + '?display=grid');",
      "rightIcon": displayAs != 'split' ? "fa fa-check" : null,
      "rightIconClassName": "m-l-sm"
    },
    {
      "type": "button",
      "label": "分栏视图",
      "onClick": "const url = document.location.pathname + '?display=split'; props.env.jumpTo(url);",
      "rightIcon": displayAs === 'split' ? "fa fa-check" : null,
      "rightIconClassName": "m-l-sm"
    }
  ];
  return {
    "type": "dropdown-button",
    "icon": "fa fa-table-columns",
    "btnClassName": "antd-Button--iconOnly bg-white p-2 rounded border-gray-300 text-gray-500",
    "align": "right",
    "visibleOn": "${window:innerWidth > 768 && !!!isLookup}",
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
// filterService.setData({showFieldsFilter: !!!filterService.props.data.showFieldsFilter});
let resizeWindow = function(){
  //触发amis crud 高度重算
  setTimeout(()=>{
    window.dispatchEvent(new Event("resize"))
  }, 100)
}
if(filterService.props.data.showFieldsFilter){
  let buttonCancel = SteedosUI.getClosestAmisComponentByType(filterForm.context, "button", { 
    direction: "down", 
    name: "btn_filter_form_cancel" 
  });
  buttonCancel.props.dispatchEvent('click', {}).then(function(){
    resizeWindow();
  });
}
else{
  filterService.setData({showFieldsFilter: true});
  resizeWindow();
}
`;

function getExportApiRequestAdaptorScript(){
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

export function getObjectHeaderToolbar(mainObject, formFactor, {showDisplayAs = false, hiddenCount = false, headerToolbarItems, filterVisible = true} = {}){
  // console.log(`getObjectHeaderToolbar====>`, filterVisible)
  const isMobile = window.innerWidth < 768;
  if(isMobile){
    showDisplayAs = false;
  }
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
      ...(headerToolbarItems || []),
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
      filterVisible ? {
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
      } : {},
      getDisplayAsButton(mainObject?.name, showDisplayAs)
  ]
  }else{
    return [
      // "filter-toggler",
      ...(headerToolbarItems || []),
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
      filterVisible ? {
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
      } : {},
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
                            "list_view": "${uiSchema.list_views[listName]}",
                            "appId": "${appId}",
                            "global": "${global}",
                            "targetObjectName": "${objectName}",
                          },
                          "body": [
                            {
                              "type": "steedos-object-form",
                              "label": "对象表单",
                              "objectApiName": "object_listviews",
                              "recordId": "",
                              "mode": "edit",
                              "defaultData": {
                                "&": "${list_view}",
                                "name":"",
                                "label":"",
                                "filters":"",
                                "shared":false
                              },
                              "fieldsExtend": "{\n  \"label\": {\n    \"is_wide\": true\n  },\n  \"name\": {\n    \"is_wide\": true,\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"object_name\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"filter_scope\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"columns\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"filter_fields\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"scrolling_mode\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"sort\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"show_count\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"type\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"shared\":{\n    \"amis\":{\n      \"visibleOn\":\"${global.user.is_space_admin}\"\n  }\n}\n}",
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
                                        "url": "${context.rootUrl}/app/${appId}/${targetObjectName}/grid/listview_${result.data.recordId|lowerCase}",
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
                            "targetObjectName": "${objectName}",
                            "list_view": "${uiSchema.list_views[listName]}",
                            "appId": "${appId}",
                            "global": "${global}"
                          },
                          "body": [
                            {
                              "type": "steedos-object-form",
                              "label": "对象表单",
                              "objectApiName": "object_listviews",
                              "recordId": "",
                              "mode": "edit",
                              "fields": [
                              ],
                              "defaultData": {
                                "&": "${list_view}",
                                "name":"",
                                "label": "${list_view.label}的副本",
                                "shared":false
                              },
                              "fieldsExtend": "{\n  \"label\": {\n    \"is_wide\": true\n  },\n  \"name\": {\n    \"is_wide\": true,\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"object_name\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"filter_scope\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"columns\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"filter_fields\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"scrolling_mode\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"sort\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"show_count\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"type\": {\n    \"amis\": {\n      \"hidden\": true\n    }\n  },\n  \"shared\":{\n    \"amis\":{\n      \"visibleOn\":\"${global.user.is_space_admin}\"\n  }\n}\n}",
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
                                        "url": "${context.rootUrl}/app/${appId}/${targetObjectName}/grid/listview_${result.data.recordId|lowerCase}",
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
                "disabledOn": "!((global.user.is_space_admin || global.userId == uiSchema.list_views[listName].owner) && !!uiSchema.list_views[listName].owner)",
                "onEvent": {
                  "click": {
                    "weight": 0,
                    "actions": [
                      {
                        "dialog": {
                          "type": "dialog",
                          "title": "重命名 列表视图",
                          "data": {
                            "targetObjectName": "${objectName}",
                            "recordId": "${uiSchema.list_views[listName]._id}",
                            "appId": "${appId}"
                          },
                          "body": [
                            {
                              "type": "steedos-object-form",
                              "label": "对象表单",
                              "objectApiName": "object_listviews",
                              "recordId": "${recordId}",
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
                                        "url": "${context.rootUrl}/app/${appId}/${targetObjectName}/grid/${name}",
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
                "disabledOn": "!(global.user.is_space_admin && !!uiSchema.list_views[listName].owner)",
                "onEvent": {
                  "click": {
                    "weight": 0,
                    "actions": [
                      {
                        "dialog": {
                          "type": "dialog",
                          "title": "共享设置",
                          "data": {
                            "recordId": "${uiSchema.list_views[listName]._id}",
                          },
                          "body": [
                            {
                              "type": "steedos-object-form",
                              "label": "对象表单",
                              "objectApiName": "object_listviews",
                              "recordId": "${recordId}",
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
                "label": "过滤设置",
                "disabledOn": "!((global.user.is_space_admin || global.userId == uiSchema.list_views[listName].owner) && !!uiSchema.list_views[listName].owner)",
                "onEvent": {
                  "click": {
                    "weight": 0,
                    "actions": [
                      {
                        "dialog": {
                          "type": "dialog",
                          "title": "过滤设置",
                          "data": {
                            "targetObjectName": "${objectName}",
                            "objectName": "${objectName}",
                            "recordId": "${uiSchema.list_views[listName]._id}",
                            "listName": "${listName}",
                            "appId": "${appId}"
                          },
                          "body": [
                            {
                              "type": "steedos-object-form",
                              "label": "对象表单",
                              "objectApiName": "object_listviews",
                              "recordId": "${recordId}",
                              "mode": "edit",
                              "fields": [
                                "filters"
                              ],
                              "initApiRequestAdaptor": "",
                              "initApiAdaptor": "const recordId_tmp = api.body.recordId;\nlet data_tmp;\nif (recordId_tmp) {\n  data_tmp = payload.data;\n  // 数据格式转换\n  if (data_tmp) {\n    if (data_tmp.filters && lodash.isString(data_tmp.filters)) {\n      try {\n        data_tmp.filters = JSON.parse(data_tmp.filters);\n      } catch (e) { }\n    }\n\n    if (data_tmp.filters && lodash.isString(data_tmp.filters)) {\n      data_tmp._filters_type_controller = 'function';\n    } else {\n      data_tmp._filters_type_controller = 'conditions'\n    }\n\n    if (data_tmp._filters_type_controller === 'conditions') {\n      data_tmp._filters_conditions = window.amisConvert.filtersToConditions(data_tmp.filters || []);\n      data_tmp.filters = data_tmp._filters_conditions;\n    } else {\n      data_tmp._filters_function = data_tmp.filters;\n    }\n  }\n}\nfor (key in data_tmp) {\n  if (data_tmp[key] === null) {\n    delete data_tmp[key];\n  }\n}\npayload.data = Object.assign(payload.data, data_tmp);\ndelete payload.extensions;",
                              "apiRequestAdaptor": "const recordId = api.body.recordId;\nif (formData._filters_type_controller === 'conditions' && formData._filters_conditions) {\n  formData.filters = window.amisConvert.conditionsToFilters(formData.filters);\n} else {\n  formData.filters = formData._filters_function || null;\n}\n\ndelete formData._filters_type_controller;\ndelete formData._filters_conditions;\ndelete formData._filters_function;\n// 字符串拼接（不支持ES6``语法）\nquery = 'mutation{record: ' + objectName + '__insert(doc: {__saveData}){_id}}';\nif (api.body.recordId) {\n  query = 'mutation{record: ' + objectName + '__update(id: \"' + recordId + '\", doc: {__saveData}){_id}}';\n};\n__saveData = JSON.stringify(JSON.stringify(formData));\napi.data = { query: query.replace('{__saveData}', __saveData) };\n",
                              "fieldsExtend": "{\"filters\": {\n    \"visible_on\": \"true\",\n   \"amis\": {\n      \"type\": \"condition-builder\",\n      \"label\": \"条件组件\",\n      \"source\": {\n        \"method\": \"get\",\n        \"url\": \"${context.rootUrl}/service/api/amis-metadata-listviews/getFilterFields?objectName=${objectName}\",\n        \"dataType\": \"json\",\n        \"headers\": {\n          \"Authorization\": \"Bearer ${context.tenantId},${context.authToken}\"\n        }\n      }\n    }\n  }\n}",
                              "onEvent": {
                                "submitSucc": {
                                  "weight": 0,
                                  "actions": [
                                    {
                                      "args": {
                                        "url": "${context.rootUrl}/app/${appId}/${targetObjectName}/grid/${listName}",
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
                "label": "显示的列",
                "disabledOn": "!((global.user.is_space_admin || global.userId == uiSchema.list_views[listName].owner) && !!uiSchema.list_views[listName].owner)",
                "onEvent": {
                  "click": {
                    "weight": 0,
                    "actions": [
                      {
                        "args": {},
                        "dialog": {
                          "type": "dialog",
                          "title": "显示的列",
                          "data": {
                            "&": "$$",
                            "targetObjectName": "${objectName}",
                            "objectName": "${objectName}",
                            "recordId": "${uiSchema.list_views[listName]._id}",
                            "listName": "${listName}",
                            "appId": "${appId}"
                          },
                          "body": [
                            {
                              "type": "steedos-object-form",
                              "label": "对象表单",
                              "objectApiName": "object_listviews",
                              "recordId": "${recordId}",
                              "mode": "edit",
                              "fieldsExtend": "{\n  \"columns\": {\n    \"amis\": {\n      \"type\": \"transfer\",\n      \"sortable\": true,\n      \"searchable\": true,\n      \"source\": {\n        \"method\": \"get\",\n        \"url\": \"${context.rootUrl}/service/api/amis-metadata-objects/objects/${objectName}/fields/options\",\n        \"headers\": {\n          \"Authorization\": \"Bearer ${context.tenantId},${context.authToken}\"\n        }\n      }\n    }\n  },\n  \"mobile_columns\": {\n    \"group\": \"手机端\",\n    \"amis\": {\n      \"type\": \"transfer\",\n      \"sortable\": true,\n      \"searchable\": true,\n      \"source\": {\n        \"method\": \"get\",\n        \"url\": \"${context.rootUrl}/service/api/amis-metadata-objects/objects/${objectName}/fields/options\",\n        \"headers\": {\n          \"Authorization\": \"Bearer ${context.tenantId},${context.authToken}\"\n        }\n      }\n    }\n  }\n}",
                              "initApiAdaptor": "const recordId_tmp = api.body.recordId;\nlet columns_tmp = {}, mobile_columns_tmp = {};\nif (recordId_tmp) {\n  columns_tmp = payload.data.columns;\n  mobile_columns_tmp = payload.data.mobile_columns;\n  if (columns_tmp) {\n    columns_tmp = lodash.map(columns_tmp, 'field');\n  }\n  if (mobile_columns_tmp) {\n    mobile_columns_tmp = lodash.map(mobile_columns_tmp, 'field');\n  }\n}\npayload.data.columns = columns_tmp;\npayload.data.mobile_columns = mobile_columns_tmp;\n\ndelete payload.extensions;\nreturn payload;",
                              "apiRequestAdaptor": "const formData_tmp = api.body.$;\nconst objectName_tmp = api.body.objectName;\nconst recordId_tmp = api.body.recordId;\n\nif (typeof formData_tmp.columns == 'string') {\n  formData_tmp.columns = formData_tmp.columns?.split(',');\n}\nif (typeof formData_tmp.mobile_columns == 'string') {\n  formData_tmp.mobile_columns = formData_tmp.mobile_columns?.split(',');\n}\n\n// 数据格式转换\nformData_tmp.columns = lodash.map(formData_tmp.columns, (item) => {\n  return { field: item };\n});\nformData.mobile_columns = lodash.map(formData.mobile_columns, (item) => {\n  return { field: item };\n});\n\n// 字符串拼接（不支持ES6语法）\nlet query_tmp = 'mutation{record: ' + objectName_tmp + '__insert(doc: {__saveData}){_id}}';\nif (api.body.recordId) {\n  query_tmp = 'mutation{record: ' + objectName_tmp + '__update(id: \"' + recordId_tmp +'\", doc: {__saveData}){_id}}';\n};\ndelete formData_tmp._id;\nlet __saveData_tmp = JSON.stringify(JSON.stringify(formData_tmp));\napi.data = { query: query_tmp.replace('{__saveData}', __saveData_tmp) };\n\nreturn api;",
                              "fields": [
                                "columns",
                                "mobile_columns"
                              ],
                              "onEvent": {
                                "submitSucc": {
                                  "weight": 0,
                                  "actions": [
                                    {
                                      "args": {
                                        "url": "${context.rootUrl}/app/${appId}/${targetObjectName}/grid/${listName}",
                                        "blank": false
                                      },
                                      "actionType": "url"
                                    }
                                  ]
                                }
                              }
                            }
                          ],
                          "searchable": true,
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
                "label": "默认排序规则",
                "disabledOn": "!((global.user.is_space_admin || global.userId == uiSchema.list_views[listName].owner) && !!uiSchema.list_views[listName].owner)",
                "onEvent": {
                  "click": {
                    "weight": 0,
                    "actions": [
                      {
                        "dialog": {
                          "type": "dialog",
                          "title": "弹框标题",
                          "data": {
                            "&": "$$",
                            "targetObjectName": "${objectName}",
                            "objectName": "${objectName}",
                            "recordId": "${uiSchema.list_views[listName]._id}",
                            "listName": "${listName}",
                            "appId": "${appId}"
                          },
                          "body": [
                            {
                              "type": "steedos-object-form",
                              "label": "对象表单",
                              "objectApiName": "object_listviews",
                              "recordId": "${recordId}",
                              "className": "",
                              "id": "u:061f158b4c5a",
                              "mode": "edit",
                              "fields": [
                                "sort",
                                "sort.$.field_name",
                                "sort.$.order"
                              ],
                              "onEvent": {
                                "submitSucc": {
                                  "weight": 0,
                                  "actions": [
                                    {
                                      "args": {
                                        "url": "${context.rootUrl}/app/${appId}/${targetObjectName}/grid/${listName}",
                                        "blank": false
                                      },
                                      "actionType": "url"
                                    }
                                  ]
                                }
                              },
                              "fieldsExtend": "{\n  \"sort\": {\n    \"amis\": {\n      \"type\": \"tabs-transfer\",\n      \"sortable\": true,\n      \"searchable\": true,\n      \"source\": {\n        \"method\": \"get\",\n        \"url\": \"${context.rootUrl}/service/api/amis-metadata-objects/objects/${objectName}/sortFields/options\",\n        \"headers\": {\n          \"Authorization\": \"Bearer ${context.tenantId},${context.authToken}\"\n        }\n      }\n    }\n  }\n}",
                              "initApiAdaptor": "let sort;\nif (recordId) {\n  sort = payload.data.sort;\n  //数据格式转换\n  if (sort instanceof Array) {\n    sort = lodash.map(sort, (item) => {\n      return item.field_name + ':' + (item.order || 'asc')\n    });\n  }\n}\npayload.data.sort = sort;\ndelete payload.extensions;",
                              "apiRequestAdaptor": "const recordId = api.body.recordId;\n//数据格式转换\nif (typeof formData.sort == 'string') {\n  formData.sort = formData.sort?.split(',');\n}\nformData.sort = lodash.map(formData.sort, (item) => {\n  const arr = item.split(':');\n  return { field_name: arr[0], order: arr[1] };\n});\nif (recordId) {\n  query = 'mutation{record: ' + objectName + '__update(id: \"' + recordId + '\", doc: {__saveData}){_id}}';\n}\n__saveData = JSON.stringify(JSON.stringify(formData));\napi.data = { query: query.replace('{__saveData}', __saveData) };\n"
                            }
                          ],
                          "showCloseButton": true,
                          "showErrorMsg": true,
                          "showLoading": true,
                          "id": "u:d3f6947b6acf",
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
                "disabledOn": "!((global.user.is_space_admin || global.userId == uiSchema.list_views[listName].owner) && !!uiSchema.list_views[listName].owner)",
                "confirmText": "如果您删除此列表视图，该视图将为所有具备访问权限的用户永久删除。是否确定要删除？",
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "actionType": "ajax",
                        "args": {
                          "api": {
                            "url": "${context.rootUrl}/graphql",
                            "method": "post",
                            "headers": {
                              "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                            },
                            "data": {
                              "&": "$$",
                              "uiSchema": "${uiSchema}",
                              "recordId": "${uiSchema.list_views[listName]._id}"
                            },
                            "messages": {
                              "success": "删除成功"
                            },
                            "requestAdaptor": "const { recordId } = api.body;\nvar deleteArray = [];\nif (recordId) { deleteArray.push(`delete:object_listviews__delete(id: \"${recordId}\")`); }\napi.data = { query: `mutation{${deleteArray.join(',')}}` };\n  return api;\n",
                            "adaptor": "if (payload.errors) {\n  payload.status = 2;\n  payload.msg = payload.errors[0].message;\n}\nreturn payload;",
                          }
                        }
                      },
                      {
                        "actionType": "url",
                        "args": {
                          "url": "${context.rootUrl}/app/${appId}/${objectName}/grid/all",
                          "blank": false
                        },
                        "expression": "data.delete == 1"
                      }
                    ]
                  }
                }
              },
              {
                "type": "button",
                "visibleOn": "${false}",
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
      getDisplayAsButton(showDisplayAs)
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
      "switch-per-page",
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
