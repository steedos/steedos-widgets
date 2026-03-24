import { getObjectRelatedListButtons, getButtonVisibleOn } from '../../buttons'
import { getObjectFieldsFilterButtonSchema, getObjectFieldsFilterBarSchema } from './fields_filter';
import { map, each, sortBy, compact, keys } from 'lodash';
import { getNewListviewButtonSchema } from "./toolbars/setting_listview/new"

import { getObjectDetailButtonsSchemas, getObjectListViewButtonsSchemas, getObjectRecordDetailRelatedListButtonsSchemas } from '../../buttons'

/**
 * 列表视图顶部第一行amisSchema
 * @param {*} objectSchema 对象UISchema
 * @returns amisSchema
 */
export function getObjectListHeaderFirstLine(objectSchema, listViewName, ctx) {
  const { icon, label } = objectSchema;
  const disabled_list_views = objectSchema.permissions.disabled_list_views;
  const listViewButtonOptions = [];
  const initApiAdaptor = `
    var data;
    if (recordId) {
      data = payload.data || { _filters_type_controller: 'conditions' };
      //数据格式转换
      if (data) {
        data.sort = lodash.map(data.sort, (item) => {
          return item.field_name + ":" + item.order;
        });
        data.searchable_fields = lodash.map(data.searchable_fields, 'field');
    
        if (data.filters && lodash.isString(data.filters)) {
          try {
            data.filters = JSON.parse(data.filters);
          } catch (e) { }
        }
    
        if (data.filters && lodash.isString(data.filters)) {
          data._filters_type_controller = 'function';
        } else {
          data._filters_type_controller = 'conditions'
        }
    
        if (data._filters_type_controller === 'conditions') {
          data._filters_conditions = window.amisConvert.filtersToConditions(data.filters || []);
        } else {
          data._filters_function = data.filters;
        }
      }
    } else {
    const uiSchema = api.body.uiSchema;
    const contextDefaultData = context && context.data && context.data.defaultData; const defaultData = api.body.defaultData || contextDefaultData;
      let defaultValues = {};
    _.each(uiSchema && uiSchema.fields, function (field) {
        var value = SteedosUI.getFieldDefaultValue(field, api.body.global);
        if (!_.isNil(value)) {
          defaultValues[field.name] = value;
        }
      });
    if (defaultData && _.isObject(defaultData) && !_.isArray(defaultData)) {
        data = Object.assign({}, defaultValues, defaultData); 
      }else{data = Object.assign({}, defaultValues) } 
    }
    for (key in data) {
      if (data[key] === null) {
        delete data[key];
      }
    }
    payload.data = data;
    delete payload.extensions; if (data.is_enable != false) { data.is_enable = true; };
    return payload;
  `;
  const apiRequestAdaptor = `
    delete formData.created;
    delete formData.created_by;
    delete formData.modified;
    delete formData.modified_by;
    delete formData._display;
    
    //数据格式转换
    formData.sort = lodash.map(formData.sort, (item) => {
      const arr = item.split(':');
      return { field_name: arr[0], order: arr[1] };
    });
    
    formData.searchable_fields = lodash.map(formData.searchable_fields, (item) => {
      return { field: item };
    });
    
    if (!formData._filters_type_controller) {
      formData._filters_type_controller = 'conditions';
    }
    
    if (formData._filters_type_controller === 'conditions' && formData._filters_conditions) {
      formData.filters = window.amisConvert.conditionsToFilters(formData._filters_conditions);
      // formData.filters = JSON.stringify(window.amisConvert.conditionsToFilters(formData._filters_conditions), null, 4);
    } else {
      formData.filters = formData._filters_function || null;
    }
    
    delete formData._filters_type_controller;
    delete formData._filters_conditions;
    delete formData._filters_function;
    
    query = \`mutation{record: object_listviews__insert(doc: {__saveData}){_id}}\`;
    if (formData.recordId) {
      query = \`mutation{record: object_listviews__update(id: "\` + formData._id + \`", doc: {__saveData}){_id}}\`;
    };
    __saveData = JSON.stringify(JSON.stringify(formData));
    
    api.data = { query: query.replace('{__saveData}', __saveData) };
    return api;
  `;
  each(
    objectSchema.list_views,
    (listView, name) => {
      if(name === "lookup" || (disabled_list_views && disabled_list_views.indexOf(listView._id)>-1)){
        // 内置lookup为弹出选择专用视图，根据用户权限被禁用的视图，不显示在列表切换区域
        return;
      }
      listViewButtonOptions.push({
        type: "button",
        label: listView.label,
        body: [
          {
            "type": "flex",
            "alignItems": "center",
            "justify": "space-between",
            "items": [
              {
                "type": "tpl",
                "tpl": listView.label 
              },
              {
                "type": "button",
                "className": "steedos-listview-edit-button ml-3",
                "icon": "fa fa-edit",
                "actionType": "dialog",
                "hiddenOn": `!((global.user.is_space_admin || global.userId == '${listView.owner || ""}') && !!'${listView.owner || ""}')`,
                "dialog": {
                  "type": "dialog",
                  "title": "编辑 列表视图",
                  "data": {
                    "object_name": "${objectName}",
                    "recordId": listView._id,
                    "listName": "${listName}",
                    "appId": "${appId}",
                    "context": "${context}",
                    "global": "${global}",
                    "_id": listView._id
                  },
                  "body": [
                    {
                      "type": "steedos-object-form",
                      "label": "对象表单",
                      "objectApiName": "object_listviews",
                      "recordId": "${recordId}",
                      "className": "sm:rounded sm:border-gray-300 bg-white",
                      "layout": "horizontal",
                      "form": {
                        "id": "form_object_listviews"
                      },
                      "mode": "edit",
                      "enableTabs": true,
                      "fields": [
                        "label",
                        "sort_no",
                        "crud_mode",
                        "shared",
                        "shared_to",
                        'shared_to_organizations',
                        "columns",
                        "columns.$",
                        "columns.$.field",
                        "columns.$.width",
                        "columns.$.wrap",
                        "mobile_columns",
                        "mobile_columns.$",
                        "mobile_columns.$.field",
                        "sort",
                        "sort.$",
                        "sort.$.field_name",
                        "sort.$.order",
                        "filters",
                        "searchable_fields",
                        "searchable_fields.$",
                        "searchable_fields.$.field",
                      ],
                      "tabsMode": "line",
                      "fieldsExtend": {
                        "columns": {
                          "amis": {
                            "showIndex": true,
                            "footerToolbar": [
                              {
                                "type": "button",
                                "label": "${'object_listviews.listview_form.field_set' | t}",
                                "actionType": "dialog",
                                "dialog": {
                                  "type": "dialog",
                                  "title": "${'object_listviews.listview_form.displayed_columns' | t}",
                                  "size": "md",
                                  "body": [
                                    {
                                      "type": "transfer",
                                      "options": [
                                      ],
                                      "multiple": true,
                                      "id": "u:92c0b3cccca0",
                                      "required": true,
                                      "placeholder": "-",
                                      "className": "col-span-2 m-0",
                                      "checkAll": false,
                                      "searchable": true,
                                      "sortable": true,
                                      "itemHeight": 40,
                                      "source": {
                                        "method": "get",
                                        "url": "${context.rootUrl}/service/api/amis-metadata-objects/objects/${object_name}/fields/options",
                                        "headers": {
                                          "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                        },
                                        "requestAdaptor": "",
                                        "adaptor": ""
                                      },
                                      "joinValues": false,
                                      "extractValue": true,
                                      "name": "columns_quick_select",
                                      "value": "${columns|pick:field|split}"
                                    }
                                  ],
                                  "onEvent": {
                                    "confirm": {
                                      "actions": [
                                        {
                                          "actionType": "custom",
                                          "script": "const columns = [];\nconst columns_quick_select = _.cloneDeep(event.data.columns_quick_select);\n_.forEach(columns_quick_select, function (field) {\n  const column_field = _.find(event.data.columns, { field });\n  if (column_field) {\n    columns.push(column_field)\n  } else {\n    columns.push({\n      field\n    })\n  }\n});\ndoAction({\n  \"componentId\": \"form_object_listviews\",\n  \"actionType\": \"setValue\",\n  \"args\": {\n    \"value\": {\n      columns\n    }\n  }\n});"
                                        }
                                      ]
                                    }
                                  }
                                }
                              }
                            ],
                            "addable": false,
                            "draggable": false,
                            "columns": [
                              {
                                "name": "field",
                                "inlineEditMode": false
                              },
                              {
                                "name": "width",
                                "width": 100
                              },
                              {
                                "name": "wrap",
                                "width": 50
                              }
                            ],
                            "enableDialog": false
                          }
                        },
                        "sort": {
                          "label": "",
                          "amis": {
                            "type": "tabs-transfer",
                            "options": [
                            ],
                            "id": "u:32f3e4e73115",
                            "strictMode": true,
                            "itemHeight": 40,
                            "source": {
                              "method": "get",
                              "url": "${context.rootUrl}/service/api/amis-metadata-objects/objects/${object_name}/sortFields/options",
                              "headers": {
                                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                              },
                              "data": null,
                              "requestAdaptor": "",
                              "adaptor": "",
                              "sendOn": "!!this.object_name"
                            },
                            "visibleOn": "!!this.object_name",
                            "sortable": true,
                            "className": "col-span-2 m-0",
                            "searchable": true,
                            "checkAll": false,
                            "clearValueOnHidden": false,
                            "joinValues": false,
                            "extractValue": true,
                            "en-US": {
                              "label": "Default Sort Order"
                            },
                            "multiple": true
                          }
                        },
                        "filters": {
                          "label": "",
                          "amis": {
                            "type": "group",
                            "body": [
                              {
                                "type": "radios",
                                "label": "${'object_listviews.listview_form.filter_configuration_method' | t}",
                                "name": "_filters_type_controller",
                                "options": [
                                  {
                                    "label": "${'object_listviews.listview_form.conditions_combination' | t}",
                                    "value": "conditions"
                                  },
                                  {
                                    "label": "${'object_listviews.listview_form.javascript' | t}",
                                    "value": "function"
                                  }
                                ],
                                "id": "u:318671bc196c",
                                "joinValues": true,
                                "className": "col-span-2 m-0",
                                "language": "javascript",
                                "visibleOn": "false",
                                "en-US": {
                                  "label": "Controller"
                                }
                              },
                              {
                                "type": "condition-builder",
                                "label": "",
                                "labelClassName": "none",
                                "name": "_filters_conditions",
                                "description": "",
                                "id": "u:a9f2232e30d7",
                                "source": {
                                  "method": "get",
                                  "url": "${context.rootUrl}/service/api/amis-metadata-listviews/getFilterFields?objectName=${object_name}",
                                  "dataType": "json",
                                  "headers": {
                                    "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                  }
                                },
                                "disabled": false,
                                "className": "col-span-2 m-0",
                                "visibleOn": "!!this.object_name",
                                "en-US": {
                                  "label": "Filters Conditions"
                                }
                              },
                              {
                                "type": "editor",
                                "label": "${'object_listviews.listview_form.javascript' | t}",
                                "name": "_filters_function",
                                "id": "u:84714ec9abba",
                                "visibleOn": "!!this.object_name && !!this._filters_type_controller && _filters_type_controller== 'function'",
                                "className": "col-span-2 m-0",
                                "labelClassName": "hidden"
                              }
                            ]
                          }
                        },
                        "mobile_columns": {
                          "amis": {
                            "showIndex": true,
                            "footerToolbar": [
                              {
                                "type": "button",
                                "label": "${'object_listviews.listview_form.field_set' | t}",
                                "actionType": "dialog",
                                "dialog": {
                                  "type": "dialog",
                                  "title": "${'object_listviews.listview_form.displayed_columns' | t}",
                                  "size": "md",
                                  "body": [
                                    {
                                      "type": "transfer",
                                      "options": [
                                      ],
                                      "multiple": true,
                                      "id": "u:92c0b3cccca0",
                                      "required": true,
                                      "placeholder": "-",
                                      "className": "col-span-2 m-0",
                                      "itemHeight": 40,
                                      "checkAll": false,
                                      "searchable": true,
                                      "sortable": true,
                                      "source": {
                                        "method": "get",
                                        "url": "${context.rootUrl}/service/api/amis-metadata-objects/objects/${object_name}/fields/options",
                                        "headers": {
                                          "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                        },
                                        "requestAdaptor": "",
                                        "adaptor": ""
                                      },
                                      "joinValues": false,
                                      "extractValue": true,
                                      "name": "columns_quick_select",
                                      "value": "${mobile_columns|pick:field|split}"
                                    }
                                  ],
                                  "onEvent": {
                                    "confirm": {
                                      "actions": [
                                        {
                                          "actionType": "custom",
                                          "script": "const mobile_columns = [];\nconst columns_quick_select = _.cloneDeep(event.data.columns_quick_select);\n_.forEach(columns_quick_select, function (field) {\n  const column_field = _.find(event.data.mobile_columns, { field });\n  if (column_field) {\n    mobile_columns.push(column_field)\n  } else {\n    mobile_columns.push({\n      field\n    })\n  }\n});\ndoAction({\n  \"componentId\": \"form_object_listviews\",\n  \"actionType\": \"setValue\",\n  \"args\": {\n    \"value\": {\n      mobile_columns\n    }\n  }\n});"
                                        }
                                      ]
                                    }
                                  }
                                }
                              }
                            ],
                            "columns": [
                              {
                                "name": "field",
                                "inlineEditMode": false
                              }
                            ],
                            "addable": false,
                            "draggable": false,
                            "enableDialog": false
                          }
                        },
                        "searchable_fields": {
                          "label": "",
                          "amis": {
                            "type": "transfer",
                            "options": [
                            ],
                            "selectMode": "list",
                            "searchable": true,
                            "searchApi": "",
                            "sortable": true,
                            "mode": "normal",
                            "searchResultMode": "list",
                            "joinValues": false,
                            "extractValue": true,
                            "itemHeight": 40,
                            "source": {
                              "method": "get",
                              "url": "${context.rootUrl}/service/api/amis-metadata-objects/objects/${object_name}/fields/options",
                              "headers": {
                                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                              },
                              "data": null,
                              "requestAdaptor": "",
                              "adaptor": "",
                              "sendOn": "!!this.object_name"
                            },
                            "visibleOn": "!!this.object_name",
                            "className": "col-span-2 m-0",
                            "multiple": true,
                            "id": "u:adb91066539e"
                          }
                        },
                        "shared_to": {
                          "amis":{
                            "type": "radios",
                            "inline": false
                          },
                          "group": "",
                          "is_wide": true
                        }
                      },
                      initApiAdaptor,
                      apiRequestAdaptor,
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
                            {
                              "actionType": "custom",
                              "script": "window.location.reload();"
                            }
                          ]
                        }
                      },
                      "id": "u:ce9e3fcc411a"
                    }
                  ],
                  "showCloseButton": true,
                  "showErrorMsg": true,
                  "showLoading": true,
                  "closeOnEsc": false,
                  "dataMapSwitch": false,
                  "size": "lg"
                }
              }
            ]
          }
        ],
        actionType: "link",
        link: `/app/\${appId}/${objectSchema.name}/grid/${name}`
      });
    }
  );

  let amisButtonsSchema = getObjectListViewButtonsSchemas(objectSchema, {formFactor: ctx.formFactor})
  const reg = new RegExp('_', 'g');
  const standardIcon = icon && icon.replace(reg, '-');
  const standardNewButton = _.find(amisButtonsSchema, { name: "standard_new" });
  const buttonSchema = [{
    "type": "flex",
    "items": amisButtonsSchema,
  }]
  // if(ctx.formFactor !== 'SMALL'){
  //   const restButtons = Array.isArray(amisButtonsSchema) ? amisButtonsSchema.filter(obj => obj.name !== "standard_new"):[]
  //   buttonSchema.push({
  //     "type": "flex",
  //     "items":[
  //       standardNewButton,
  //       (restButtons.length > 0) && {
  //         "type": "dropdown-button",
  //         "buttons": restButtons,
  //         "className": " ml-1",
  //         "menuClassName": "p-none split-dropdown-buttons",
  //         "align": "right",
  //         "size": "sm"
  //       }
  //     ],
  //     "visibleOn": "${display == 'split'?true:false}"
  //   })
  // }
  const listviewNewButton = getNewListviewButtonSchema();
  listviewNewButton.visibleOn = "global.user.is_space_admin";
  return {
    "type": "grid",
    "columns": [
      {
        "body": [
          {
            "type": "grid",
            "columns": [
              {
                "body": {
                  "type": "tpl",
                  "className": "block",
                  "tpl":`<svg class="slds-icon slds-icon_container slds-icon-standard-${standardIcon} slds-page-header__icon" aria-hidden="true"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#${icon}"></use></svg>`
                },
                "md": "auto",
                "className": "",
                "columnClassName": "flex justify-center items-center",
                "valign": "middle",
              },
              {
                "body": [
                  {
                    "type": "tpl",
                    "tpl": `${label}`,
                    "inline": false,
                    "wrapperComponent": "",
                    "className": "text-md leading-none text-black",
                  },
                  {
                    "type": "dropdown-button",
                    "className": "steedos-listview-change-button", 
                    "label": "\${listName ? uiSchema.list_views[listName].label : uiSchema.list_views[defaultListName].label}",
                    "rightIcon": "fa fa-caret-down",
                    "size": "sm",
                    "hideCaret": true,
                    "closeOnClick": true,
                    "visibleOn": "\${listName && uiSchema.list_views[listName].disableSwitch != true}",
                    "btnClassName": "!bg-transparent !border-none !hover:border-none text-lg h-5 font-bold p-0 text-black leading-none",
                    "buttons": [
                      ...listViewButtonOptions,
                      {
                        "children": [
                          {
                            "type": "divider"
                          }
                        ]
                      },
                      listviewNewButton
                    ]
                  },
                  {
                    "type": "tpl",
                    "className": "steedos-listview-change-button text-lg font-bold", 
                    "tpl": "\${listName ? uiSchema.list_views[listName].label : uiSchema.list_views[defaultListName].label}",
                    "visibleOn": "\${listName && uiSchema.list_views[listName].disableSwitch}",
                  }
                ],
                "md": "",
                "columnClassName": "p-l-xs"
              }
            ],
            "className": "flex justify-between"
          }
        ],
        "md": "auto"
      },
      {
        "body": buttonSchema,
        "md": "auto",
        "valign": "middle",
      }
    ],
    "className": "flex justify-between"
  }
}

/**
 * 列表视图顶部第二行amisSchema
 * @param {*} objectSchema 对象UISchema
 * @returns amisSchema
 */
export async function getObjectListHeaderSecordLine(objectSchema, listViewName, ctx) {
  const amisListViewId = `listview_${objectSchema.name}`;
  const fieldsFilterButtonSchema = await getObjectFieldsFilterButtonSchema(objectSchema);
  // const onFilterChangeScript = `
  //   const eventData = event.data;
  //   const uiSchema = eventData.uiSchema;
  //   const listName = eventData.listName;
  //   const listViewId = eventData.listViewId;
  //   var selectedListView = uiSchema.list_views[listName]
  //   var filter = eventData.filter;
  //   SteedosUI.ListView.showFilter(uiSchema.name, {
  //     listView: selectedListView,
  //     data: {
  //       filters: SteedosUI.ListView.getVisibleFilter(selectedListView, filter, { listViewId }),
  //     },
  //     onFilterChange: (filter) => {
  //       doAction({
  //         componentId: \`service_listview_\${uiSchema.name}\`,
  //         actionType: 'setValue',
  //         "args": {
  //           "value": {
  //             filter: filter
  //           }
  //         }
  //       });
  //       doAction({
  //         componentId: \`listview_\${uiSchema.name}\`,
  //         actionType: 'reload',
  //         "args": {
  //           filter: filter
  //         }
  //       });
  //     }
  //   });
  // `;
  let secordLineSchema = {
    "type": "grid",
    "columns": [
      {
        "body": [
          {
            "type": "tpl",
            "tpl": "${$count} 个项目",
            "visibleOn": "this.$count >= 0",
            "inline": false,
            "wrapperComponent": "",
            "className": "leading-none",
            "style": {
              "fontFamily": "",
              "fontSize": 14
            },
            "id": "u:1661f8471235"
          }
        ],
        "md": "auto",
        "columnClassName": "flex items-center"
      },
      {
        "body": [
          {
            "type": "button",
            "label": "",
            "icon": "fa fa-refresh",
            "actionType": "reload",
            "target": amisListViewId,
            "className": "bg-white p-2 rounded text-gray-500"
          },
          fieldsFilterButtonSchema,
          // {
          //   "type": "button",
          //   "label": "",
          //   "icon": "fa fa-filter",
          //   "actionType": "custom",
          //   "className": "bg-transparent p-2 rounded text-gray-500",
          //   "id": "u:c20cb87d96c9",
          //   "onEvent": {
          //     "click": {
          //       "actions": [
          //         {
          //           "actionType": "custom",
          //           "script": onFilterChangeScript
          //         }
          //       ],
          //       "weight": 0
          //     }
          //   }
          // }
        ],
        "md": "auto"
      }
    ],
    "className": "flex justify-between"
  };
  return secordLineSchema;
}


/**
 * 列表视图顶部放大镜过滤条件栏amisSchema
 * @param {*} objectSchema 对象UISchema
 * @returns amisSchema
 */
export async function getObjectListHeaderFieldsFilterBar(objectSchema, listViewName, ctx) {
  const fieldsFilterBarSchema = await getObjectFieldsFilterBarSchema(objectSchema, ctx);
  return fieldsFilterBarSchema;
}

/**
 * 列表视图顶部amisSchema
 * @param {*} objectSchema 对象UISchema
 * @returns amisSchema
 */
export function getObjectListHeader(objectSchema, listViewName, ctx) {
  if (!ctx) {
    ctx = {};
  }
  let firstLineSchema = getObjectListHeaderFirstLine(objectSchema, listViewName, ctx);
  let body = [firstLineSchema];
  let headerSchema = [{
    "type": "wrapper",
    "body": body,
    "className": `px-3 pt-3 pb-0 m-1 bg-white`
  }];
  // console.log(`getObjectListHeader`, objectSchema, listViewName, ctx)
  return headerSchema;
}

function getBackButtonSchema(options){
  const { showRecordTitle = true } = options || {}
  return {
    "type": "service",
    "className": "steedos-object-record-detail-header-back-button",
    "visibleOn": "${(window:innerWidth > 768 && display !== 'split') || window:innerWidth <= 768}",
    "onEvent": {
        "@history_paths.changed": {
            "actions": [
                {
                    "actionType": "reload",
                    // amis 3.6需要传入data来触发下面的window:historyPaths重新计算，此问题随机偶发，加上data后正常
                    "data": {
                    }
                }
            ]
        }
    },
    "body":[{
      "type": "button",
      "className":`flex ${showRecordTitle ? 'mr-4' : ''}`,
      "onEvent": {
          "click": {
              "actions": [
                  {
                      "actionType": "custom",
                      "script": "window.goBack()"
                  }
              ]
          }
      },
      "body": [
          {
              "type": "steedos-icon",
              "category": "utility",
              "name": "back",
              "colorVariant": "default",
              "className": "slds-button_icon slds-global-header__icon w-4"
          }
      ]
    }]
  }
}

/**
 * 记录详细界面顶部头amisSchema，也是标题面板组件的amisSchema
 * @param {*} objectSchema 对象UISchema
 * @param {*} recordId 记录id
 * @param {*} optioins: {showRecordTitle: true}
 * @returns amisSchema
 */
export async function getObjectRecordDetailHeader(objectSchema, recordId, options) {
  // console.log(`getObjectRecordDetailHeader====>`, options)
  if(options && !options.formFactor && typeof window !== 'undefined' && window.innerWidth <= 768){
    options.formFactor = 'SMALL';
  }
  const { showRecordTitle = true } = options || {}
  // console.log('getObjectRecordDetailHeader==>', objectSchema, recordId)
  const { name, label, icon, NAME_FIELD_KEY } = objectSchema;
  
  let amisButtonsSchema = []
  if(options.showButtons != false){
    // 只对审批页（showRecordTitle: false）在 PC 端做 maxButtons 限制
    // 普通详情页保持原有逻辑（只有 on=record_more 才进 dropdown），零回归
    if (options.showRecordTitle === false && (!options.formFactor || options.formFactor !== 'SMALL')) {

      // 第一步：获取审批单内容区真实宽度
      // 审批页是分栏布局，左侧有审批列表 panel，右侧才是内容区
      // 优先通过 DOM 查询真实宽度，回退到估算
      // 注意：初次加载时元素可能尚未渲染，offsetWidth 为 0，此时走估算分支；
      // 二次进入（导航切换审批单）时元素已存在，可读到真实宽度
      let contentAreaWidth;
      const instanceWrapper = typeof document !== 'undefined'
        ? document.querySelector('.steedos-instance-detail-wrapper')
        : null;

      if (instanceWrapper && instanceWrapper.offsetWidth > 0) {
        // 使用真实的内容区宽度，最准确
        contentAreaWidth = instanceWrapper.offsetWidth;
      } else {
        // DOM 不可用时估算：
        // window.innerWidth 减去左侧全局导航栏(sidebar ~210px) 减去审批列表左侧面板(约260px)
        let fallbackWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
        if (typeof document !== 'undefined' && document.body.classList.contains('sidebar')) {
          fallbackWidth -= 210;
        }
        // 审批中心左侧列表 panel 约 260px（包含列表项和内边距）
        fallbackWidth -= 260;
        // 最小保留 300px：审批内容区在极窄布局下仍需要足够宽度显示至少一个按钮
        contentAreaWidth = Math.max(300, fallbackWidth);
      }

      // 第二步：计算按钮区域可用宽度
      // 审批页 showRecordTitle=false，左侧只有返回按钮/小图标，约 56px
      const buttonAreaWidth = Math.max(160, contentAreaWidth - 56);

      // 第三步：从 objectSchema.actions 中读取 on=record/record_only 的按钮 label
      // uiSchema 已按当前语言返回（包含 i18n 后的 label），可直接用于估算宽度
      const detailButtonLabels = Object.values(objectSchema.actions || {})
        .filter(btn => btn.on === 'record' || btn.on === 'record_only')
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
        .map(btn => btn.label || btn.name || '');

      // 第四步：按文字估算每个按钮宽度（支持中英文及其他语言）
      const estimateButtonWidth = (label) => {
        const PADDING = 32;
        let charWidth = 0;
        for (const char of label) {
          const code = char.codePointAt(0);
          if ((code >= 0x4e00 && code <= 0x9fff) ||
              (code >= 0x3000 && code <= 0x303f) ||
              (code >= 0xac00 && code <= 0xd7af)) {
            charWidth += 14; // CJK 汉字、符号、韩文
          } else if ((code >= 0x41 && code <= 0x5a) ||
                     (code >= 0x61 && code <= 0x7a) ||
                     (code >= 0x30 && code <= 0x39)) {
            charWidth += 8;  // ASCII 字母和数字
          } else if (code < 0x0100) {
            charWidth += 7;  // 其他 ASCII（空格、标点等）
          } else {
            charWidth += 12; // 其他 Unicode（西里尔、阿拉伯等）
          }
        }
        return Math.max(60, PADDING + charWidth);
      };

      if (detailButtonLabels.length === 0) {
        // 无法获取按钮信息时，不限制（保持原有行为）
        options.maxButtons = undefined;
      } else {
        // 第五步：贪心算法计算能放几个按钮
        // 非最后一个按钮放入后还需为 dropdown 图标保留空间(44px)
        const BUTTON_GAP = 8;
        const DROPDOWN_BTN_WIDTH = 44; // 无 label 的 dropdown 图标按钮宽度
        let usedWidth = 0;
        let maxVisible = 0;

        for (let i = 0; i < detailButtonLabels.length; i++) {
          const btnWidth = estimateButtonWidth(detailButtonLabels[i]) + BUTTON_GAP;
          const isLast = i === detailButtonLabels.length - 1;

          if (isLast) {
            // 最后一个按钮：放下就不需要 dropdown
            if (usedWidth + btnWidth <= buttonAreaWidth) {
              maxVisible++;
            }
          } else {
            // 非最后一个：放下后还需留 dropdown 图标的位置
            if (usedWidth + btnWidth + DROPDOWN_BTN_WIDTH <= buttonAreaWidth) {
              usedWidth += btnWidth;
              maxVisible++;
            } else {
              break;
            }
          }
        }

        // 若所有按钮都能放下，不限制（走原有逻辑，零回归风险）
        if (maxVisible >= detailButtonLabels.length) {
          options.maxButtons = undefined;
        } else {
          options.maxButtons = Math.max(1, maxVisible);
        }
      }
    }
    // 注意：showRecordTitle=true（普通详情页）不设置 maxButtons，
    // 保持原有逻辑：只有 on=record_more 的按钮进 dropdown，零回归
    amisButtonsSchema = getObjectDetailButtonsSchemas(objectSchema, recordId, options);
  }

  amisButtonsSchema.push(
    {
      "type": "button",
      "visibleOn": "${_inDrawer === true || _inRecordMini ===  true}",
      "className":"ant-dropdown-trigger slds-button slds-button_icon slds-button_icon-border-filled slds-button_icon-x-small slds-icon ml-1 flex",
      "onEvent": {
          "click": {
              "actions": [
                {
                  "actionType": "custom",
                  "script": "const data = event.data; window.open(`/app/${data.app_id || '-'}/${data.objectName}/view/${data.recordId}?side_object=${data.side_object}&side_listview_id=${data.side_listview_id}`)"
                }
              ]
          }
      },
      "body": [
          {
              "type": "steedos-icon",
              "category": "utility",
              "name": "new_window",
              "colorVariant": "default",
              "className": "slds-button_icon slds-global-header__icon w-4"
          }
      ]
    }
  )

  let backButtonsSchema = null;
  
  if(options.showBackButton != false){
    backButtonsSchema = getBackButtonSchema(options);
  }

  // console.log(`getObjectRecordDetailHeader==> backButtonsSchema`, backButtonsSchema)
  
  const reg = new RegExp('_', 'g');
  const standardIcon = icon && icon.replace(reg, '-');

  const gridBody = [];
  if(showRecordTitle){
    gridBody.push({
      "body": [
        {
          "type": "grid",
          "columns": [
            {
              "body": [
                backButtonsSchema,
                {
                  "type": "button",
                  "visibleOn": "${_inDrawer === true}",
                  "className":"flex mr-4",
                  "onEvent": {
                      "click": {
                          "actions": [
                            {
                              "componentId": "",
                              "args": {},
                              "actionType": "closeDrawer"
                            }
                          ]
                      }
                  },
                  "body": [
                      {
                          "type": "steedos-icon",
                          "category": "utility",
                          "name": "close",
                          "colorVariant": "default",
                          "className": "slds-button_icon slds-global-header__icon w-4"
                      }
                  ]
                }
              ,{
                "type": "tpl",
                "className": "block",
                // "tpl": `<img class='slds-icon slds-icon_container slds-icon-standard-${standardIcon}' src='\${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${icon}.svg'>`
                "tpl":`<svg class="slds-icon slds-icon_container slds-icon-standard-${standardIcon} slds-page-header__icon" aria-hidden="true"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#${icon}"></use></svg>`
              }],
              "md": "auto",
              "className": "",
              "columnClassName": "flex justify-center items-center"
            },
            {
              "body": [
                {
                  "type": "tpl",
                  "tpl": `${label}`,
                  "inline": false,
                  "wrapperComponent": "",
                  "className": "leading-4 text-md"
                },
                {
                  "type": "tpl",
                  "tpl": "${NAME_FIELD_VALUE}",
                  "inline": false,
                  "wrapperComponent": "",
                  "className": "record-detail-header-name leading-5 text-xl font-bold"
                }
              ],
              "columnClassName": "p-l-xs"
            }
          ],
          "className": "flex justify-between"
        }
      ],
      "columnClassName": "flex-initial",
      "md": "auto",
    })
  }

  if (!showRecordTitle && backButtonsSchema) {
    backButtonsSchema.className += " antd-Button antd-Button--size-default border-none pl-0";
    amisButtonsSchema.unshift(backButtonsSchema);
  }

  gridBody.push({
    "body":  {
      "type": "flex",
      "items": amisButtonsSchema,
    },
    "md": "auto",
    "columnClassName": "flex justify-center items-center"
    // "hiddenOn": "${recordLoaded != true}"
  })

  let body = [
    {
      "type": "wrapper",
      "className": "p-4",
      "body": [
        {
          "type": "grid",
          "columns": gridBody,
          "className": "flex justify-between flex-nowrap"
        }
      ],
      "hiddenOn": "${recordLoaded != true}"
    }
  ];

  if(showRecordTitle){
    body.push({
      "type": "wrapper",
      "className": "p-4",
      "body": [
        {
          "type": "grid",
          "columns": [gridBody[0]],
          "className": "flex justify-between"
        }
      ],
      "hiddenOn": "${recordLoaded == true}"
    })
  }

  let max = 10;
  if(options.formFactor === 'SMALL'){
    max = 4;
  }else{

    let divWidth = window.innerWidth;

    if(options.display === 'split'){
      divWidth = divWidth - 388;
    }

    if(document.body.classList.contains('sidebar')){
      divWidth = divWidth - 210;
    }

    if(options._inDrawer){
      try {
        divWidth = new Number($("html").css("font-size").replace('px', '')) * 60;
      } catch (error) {
        console.error(error)
        divWidth = 16 * 60;
      }
    }

    // 根据屏幕宽度计算显示数量, 使高亮字段只占1行
    max = Math.trunc(divWidth / 200 )
    if(max > 10){
      max = 10
    }
  }


  if(objectSchema.compactLayouts && objectSchema.compactLayouts.length > 0){
    const details = [];
    _.each(_.slice(_.difference(objectSchema.compactLayouts, [objectSchema.NAME_FIELD_KEY]), 0, max), (fieldName)=>{
      const field = objectSchema.fields[fieldName];
      if(field){
        details.push({
          type: 'steedos-field',
          static: true,
          config: Object.assign({}, field, {
            description: null
          })
        })
      }
    });

    body.push({
      "type": "wrapper",
      "body": {
        "type": "form",
        "className-for-build": "sm:grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 sm:grid-cols-4 sm:grid-cols-5 sm:grid-cols-6 sm:grid-cols-7 sm:grid-cols-8 sm:grid-cols-9 sm:grid-cols-10 sm:grid-cols-11 sm:grid-cols-12",
        "className": `gap-2 grid grid-cols-1 sm:grid-cols-${max}`,
        "wrapWithPanel": false,
        "actions": [],
        "body": details,
        "hiddenOn": "${recordLoaded != true}"
      },
      "className": "steedos-record-compact-layouts p-4 pb-2 border-t compact-layouts"
    })
  }

  return {
    type: 'service',
    id: `page_readonly_${name}_header`,
    name: `page`,
    body: body, 
    className: "steedos-object-record-detail-header"
  }

}

/**
 * 记录详细界面中相关表顶部头amisSchema
 * @param {*} relatedObjectSchema 相关对象UISchema
 * @returns amisSchema
 */
export async function getObjectRecordDetailRelatedListHeader(relatedObjectSchema, relatedLabel, ctx) {
  const { icon, label } = relatedObjectSchema;
  let amisButtonsSchema = getObjectRecordDetailRelatedListButtonsSchemas(relatedObjectSchema, {formFactor: ctx.formFactor});
  const reg = new RegExp('_', 'g');
  const standardIcon = icon && icon.replace(reg, '-');
  const recordRelatedListHeader = {
    "type": "wrapper",
    "body": [
      {
        "type": "grid",
        "valign": "middle",
        "columns": [
          {
            "body": [
              {
                "type": "grid",
                "valign": "middle",
                "className": "flex justify-between",
                "columns": [
                  {
                    "body": {
                      "type": "tpl",
                      "className": "block",
                      // "tpl": `<img class=\"slds-icon_small slds-icon_container slds-icon-standard-${standardIcon}\" src=\"\${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${icon}.svg\" />`
                      "tpl":`<svg class="w-6 h-6 slds-icon slds-icon_container slds-icon-standard-${standardIcon}" aria-hidden="true"><use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#${icon}"></use></svg>`
                    },
                    "md": "auto",
                    "className": "",
                    "columnClassName": "flex justify-center items-center"
                  },
                  {
                    "body": [
                      {
                        "type": "tpl",
                        "tpl": `<a class="text-black text-base font-bold hover:font-bold" href="/app/\${appId}/\${_master.objectName}/\${_master.record._id}/\${objectName}/grid?related_field_name=\${relatedKey}">${relatedLabel}(\${$count})</a>`,
                        "inline": false,
                        "wrapperComponent": "",
                        "className": "",
                      }
                    ],
                    "md": "",
                    "valign": "middle",
                    "columnClassName": "p-l-xs"
                  }
                ]
              }
            ],
            "md": "auto"
          },
          {
            "body": {
              "type": "flex",
              "items": amisButtonsSchema,
            },
            "md": "auto"
          }
        ],
        "className": "flex justify-between min-h-8 items-center"
      }
    ],
    "className": "steedos-record-related-header py-2 px-3 bg-gray-50 border rounded"
  };
  return recordRelatedListHeader;
}

/**
 * 点击记录详细界面相关表顶部标题进入的相关表页面的顶部amisSchema
 * @param {*} objectSchema 
 * @param {*} recordId 
 * @param {*} relatedObjectName 
 * @returns amisSchema
 */
export async function getObjectRelatedListHeader(objectSchema, recordId, relatedObjectName) {
}