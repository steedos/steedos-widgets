import { getFieldSearchable } from "./fields/index";
import { includes, map } from "lodash";

export async function getObjectFieldsFilterButtonSchema(objectSchema) {
  const amisListViewId = `listview_${objectSchema.name}`;
  return {
    "type": "button",
    "label": "",
    "icon": "fa fa-search",
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
  }
}

export async function getObjectFieldsFilterFormSchema(objectSchema, fields, ctx) {
  if(!ctx){
    ctx = {};
  }
  const body = [];
  for (let field of fields) {
    if (
      !includes(
        [
          "grid",
          "avatar",
          "image",
          "object",
          "[object]",
          "[Object]",
          "[grid]",
          "[text]",
          "audio",
          "file",
        ],
        field.type
      )
    ) {
      delete field.defaultValue
      delete field.required
      delete field.is_wide
      delete field.readonly
      delete field.hidden
      delete field.omit
      const amisField = await getFieldSearchable(field, fields, {});
      if (amisField) {
        body.push(amisField);
      }
    }
  }
  let persistDataKeys = map(body, "name");
  if(ctx.enableSearchableFieldsVisibleOn){
    body.forEach(function(fieldItem){
      fieldItem.visibleOn = `this.filterFormSearchableFields && this.filterFormSearchableFields.indexOf("${fieldItem.fieldName}") > -1`;
      // fieldItem.clearValueOnHidden = true;//这个属性会把form字段值删除，但是点击搜索时crud还是把值给传递到过滤条件(api.requestAdaptor的data.$self)中了，应该是crud的bug
    });
  }

  const onBroadcastSearchableFieldsChangeScript = `
    const data = event.data;
    const listViewId = data.listViewId;
    const searchableFields = data.fields;
    const preSearchableFields = data.__super.__super.fields;
    const removedFields = _.difference(preSearchableFields, searchableFields);
    const listViewPropsStoreKey = location.pathname + "/crud/" + listViewId ;
    let localListViewProps = localStorage.getItem(listViewPropsStoreKey);
    if(localListViewProps){
      localListViewProps = JSON.parse(localListViewProps);
      let removedKeys = [];
      _.each(localListViewProps, function(n,k){
        // __searchable__开头的不在searchableFields范围则清除其值
        let isRemoved = !!removedFields.find(function(fieldName){
          return new RegExp("__searchable__\.*" + fieldName + "$").test(k);
        });
        if(isRemoved){
          removedKeys.push(k);
        }
      });
      const removedValues = {};
      removedKeys.forEach(function(key){
        delete localListViewProps[key];
        removedValues[key] = "";
      });
      doAction({
        actionType: 'setValue',
        args: {
          value: removedValues
        }
      });
      localStorage.setItem(listViewPropsStoreKey, JSON.stringify(localListViewProps));
    }
  `;

  return {
    title: "",
    type: "form",
    // debug: true,
    name: "listview-filter-form",
    id: `listview_filter_form_${objectSchema.name}`,
    mode: "normal",
    wrapWithPanel: false,
    className: `sm:grid sm:gap-2 sm:grid-cols-4 mb-2`,
    data: {
      "&": "${filterFormValues || {}}",
      ...ctx.initData
    },
    // persistData: "crud:${id}",
    // persistDataKeys: persistDataKeys,
    body: body,
    "onEvent": {
      "broadcastSearchableFieldsChange": {
        "actions": [
          {
            "actionType": "custom",
            "script": onBroadcastSearchableFieldsChangeScript
          }
        ]
      }
    }
  };
}

export async function getObjectFieldsFilterBarSchema(objectSchema, fields, ctx) {
  if(!ctx){
    ctx = {};
  }
  const filterFormSchema = await getObjectFieldsFilterFormSchema(objectSchema, fields, Object.assign({}, {
    enableSearchableFieldsVisibleOn: true
  }, ctx));
  const onSearchScript = `
    const appId = event.data.appId;
    const objectName = event.data.objectName;
    const scopeId = event.data.scopeId;
    const scope = SteedosUI.getRef(scopeId);
    var filterForm = scope.getComponentById("listview_filter_form_" + objectName);
    var filterFormValues = filterForm.getValues();
    var listView = scope.getComponentById("listview_" + objectName);
    listView.handleFilterSubmit(filterFormValues);
  `;
  const dataProviderInited = `
    const searchableFieldsStoreKey = location.pathname + "/searchable_fields/" + data.listViewId ;
    let defaultSearchableFields = localStorage.getItem(searchableFieldsStoreKey);
    if(!defaultSearchableFields && data.uiSchema){
      let listView = data.uiSchema.list_views[data.listName];
      defaultSearchableFields = listView && listView.searchable_fields;
      if(defaultSearchableFields && defaultSearchableFields.length){
        defaultSearchableFields = _.map(defaultSearchableFields, 'field');
      }
    }
    if(_.isEmpty(defaultSearchableFields) && data.uiSchema){
      defaultSearchableFields = _.map(
        _.filter(_.values(data.uiSchema.fields), (field) => {
          return field.searchable;
        }),
        "name"
      );
    }
    setData({ filterFormSearchableFields: defaultSearchableFields });

    const listViewPropsStoreKey = location.pathname + "/crud/" + data.listViewId ;
    let localListViewProps = localStorage.getItem(listViewPropsStoreKey);
    if(localListViewProps){
      localListViewProps = JSON.parse(localListViewProps);
      let filterFormValues = _.pickBy(localListViewProps, function(n,k){
        return /^__searchable__/g.test(k);
      });
      if(!_.isEmpty(filterFormValues)){
        setData({ filterFormValues });
        const omitedEmptyFormValue = _.omitBy(filterFormValues, function(n){
          return _.isNil(n) 
            || (_.isObject(n) && _.isEmpty(n)) 
            || (_.isArray(n) && _.isEmpty(n.filter(function(item){return !_.isNil(item)})))
            || (_.isString(n) && n.length === 0);
        });
        // 有过滤条件时自动展开搜索栏
        if(!_.isEmpty(omitedEmptyFormValue)){
          setData({ showFieldsFilter: true });
        }
      }
    }
  `;
  const onSearchableFieldsChangeScript = `
    const data = context.props.data;
    const listName = data.listName;
    const objectName = data.objectName;
    const value = data.fields;
    doAction({
      actionType: 'setValue',
      args: {
        value: { filterFormSearchableFields: value }
      },
      componentId: "service_listview_filter_form_" + objectName,
    });
    const searchableFieldsStoreKey = location.pathname + "/searchable_fields/" + data.listViewId;
    localStorage.setItem(searchableFieldsStoreKey, value);
  `;
  return {
    "type": "service",
    "data": {
      // "filterFormSearchableFields": ["name"],//默认可搜索项
      // "filterFormValues": {"__searchable__name": "xxx"},//搜索项表单值
      "listViewId": "${listViewId}"
    },
    "id": `service_listview_filter_form_${objectSchema.name}`,
    "dataProvider": {
      "inited": dataProviderInited
    },
    "body": {
      "type": "wrapper",
      "body": {
        "type": "wrapper",
        "body": [{
          "type": "wrapper",
          "body": [
            filterFormSchema
          ],
          "size": "xs",
          "visibleOn": "this.filterFormSearchableFields && this.filterFormSearchableFields.length",
          "className": "slds-filters__body p-0"
        }, {
          "type": "wrapper",
          "body": {
            "type": "wrapper",
            "body": [
              {
                "type": "button",
                "label": "搜索",
                "icon": "fa fa-search",
                "visibleOn": "this.filterFormSearchableFields && this.filterFormSearchableFields.length",
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "actionType": "custom",
                        "script": onSearchScript
                      }
                    ]
                  }
                }
              },
              {
                "type": "button",
                "label": "设置搜索项",
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "actionType": "dialog",
                        "dialog": {
                          "type": "dialog",
                          "size": "md",
                          "title": "设置搜索项",
                          "body": [
                            {
                              "type": "form",
                              "title": "",
                              "body": [
                                {
                                  "label": "",
                                  "type": "transfer",
                                  "name": "fields",
                                  "id": "u:92c0b3cccca0",
                                  "source": {
                                    "method": "get",
                                    "url": "${context.rootUrl}/service/api/amis-metadata-objects/objects/${objectName}/fields/options",
                                    "dataType": "json",
                                    "headers": {
                                      "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                    },
                                    "data": null,
                                    "requestAdaptor": "",
                                    "adaptor": ""
                                  },
                                  "options": [],
                                  "required": true,
                                  "placeholder": "-",
                                  "className": "col-span-2 m-0",
                                  "checkAll": false,
                                  "searchable": true,
                                  "sortable": true,
                                  "joinValues": false,
                                  "extractValue": true,
                                  "multiple": true
                                }
                              ],
                              "id": "u:e5ac506d5683",
                              "mode": "normal",
                              "persistData": false,
                              "promptPageLeave": true,
                              "name": "form",
                              "debug": false,
                              "actions": [],
                              "panelClassName": "m-0",
                              "bodyClassName": "p-4",
                              "className": "steedos-amis-form"
                            }
                          ],
                          "id": "u:ca99fa9fe1b1",
                          "actions": [
                            {
                              "type": "button",
                              "label": "取消",
                              "onEvent": {
                                "click": {
                                  "actions": [
                                    {
                                      "componentId": "",
                                      "args": {},
                                      "actionType": "closeDialog"
                                    }
                                  ]
                                }
                              },
                              "id": "u:4e447b5ca72a"
                            },
                            {
                              "type": "button",
                              "label": "确认",
                              "onEvent": {
                                "click": {
                                  "actions": [
                                    {
                                      "actionType": "custom",
                                      "script": onSearchableFieldsChangeScript
                                    },
                                    {
                                      "actionType": "broadcast",
                                      "eventName": "broadcastSearchableFieldsChange",
                                      "args": {
                                        "eventName": "broadcastSearchableFieldsChange"
                                      },
                                      "data": {
                                        "fields": "${event.data.fields}"
                                      }
                                    },
                                    {
                                      "componentId": "",
                                      "args": {},
                                      "actionType": "closeDrawer"
                                    }
                                  ]
                                }
                              },
                              "id": "u:14e7388fecd3",
                              "level": "primary"
                            }
                          ],
                          "closeOnEsc": false,
                          "closeOnOutside": false,
                          "showCloseButton": true,
                          "data": {
                            "&": "$$",
                            "objectName": "${objectName}",
                            "listName": "${listName}",
                            "context": "${context}",
                            "fields": "${filterFormSearchableFields}"
                          }
                        }
                      }
                    ]
                  }
                },
                "id": "u:b96d84868a5a",
                "level": "link"
              }
            ],
            "size": "xs",
            "className": "space-x-4"
          },
          "size": "xs",
          "className": "slds-filters__footer slds-grid slds-shrink-none flex justify-between p-0"
        }],
        "size": "xs",
        "className": "slds-filters"
      },
      "size": "xs",
      "className": "border-gray slds-grid slds-grid_vertical slds-nowrap px-1 py-1",
      "visibleOn": "this.showFieldsFilter",
    },
    "className": "bg-white b-b",
    "onEvent": {
      "broadcast_toggle_fields_filter": {
        "actions": [
          {
            "actionType": "setValue",
            "args": {
              "value": {
                "showFieldsFilter": "${!showFieldsFilter}"
              }
            },
          }
        ]
      }
    }
  };
}

export function resetLocalListViewPropsWithSearchableFields(listViewId, searchableFields){
  // 清除本地缓存中被删除字段的值
  if(typeof searchableFields === "string"){
    searchableFields = searchableFields.split(",");
  }
  const listViewPropsStoreKey = location.pathname + "/crud/" + listViewId ;
  let localListViewProps = localStorage.getItem(listViewPropsStoreKey);
  if(localListViewProps){
    localListViewProps = JSON.parse(localListViewProps);
    let removedKeys = [];
    for(var k in localListViewProps){
      let isField = new RegExp("__searchable__\.*").test(k);
      // __searchable__开头的不在searchableFields范围则清除其值
      let needRemoved = isField && !!!searchableFields.find(function(fieldName){
        return new RegExp("__searchable__\.*" + fieldName + "$").test(k);
      });
      if(needRemoved){
        removedKeys.push(k);
      }
    }
    removedKeys.forEach(function(key){
      delete localListViewProps[key];
    });
    localStorage.setItem(listViewPropsStoreKey, JSON.stringify(localListViewProps));
  }
}

