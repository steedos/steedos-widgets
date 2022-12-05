import { getFieldSearchable } from "./fields/index";
import { includes, map } from "lodash";

export async function getObjectFieldsFilterButtonSchema(objectSchema) {
  const amisListViewId = `listview_${objectSchema.name}`;
  return {
    "type": "button",
    "label": "",
    "icon": "fa fa-search",
    "className": "bg-transparent p-0 ml-1",
    "onEvent": {
      "click": {
        "actions": [
          {
            "actionType": "setValue",
            "args": {
              "value": {
                "showFieldsFilter": "${!showFieldsFilter}"
              }
            },
            "componentId": `service_${amisListViewId}`
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
    });
  }

  return {
    title: "",
    type: "form",
    name: "listview-filter-form",
    id: `listview_filter_form_${objectSchema.name}`,
    mode: "normal",
    wrapWithPanel: false,
    className: `sm:grid sm:gap-2 sm:grid-cols-4 mb-2`,
    persistData: "crud:${id}",
    persistDataKeys: persistDataKeys,
    body: body
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
      // "filterFormSearchableFields": ["name"]
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
      "className": "border-gray slds-grid slds-grid_vertical slds-nowrap"
    },
    "visibleOn": "this.showFieldsFilter",
    "className": "px-1 py-1 bg-white b-b"
  };
}
