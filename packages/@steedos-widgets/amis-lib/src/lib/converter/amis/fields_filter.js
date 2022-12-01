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
  let events = {};
  if(ctx.enableSearchableFieldsVisibleOn){
    body.forEach(function(fieldItem){
      fieldItem.visibleOn = `this.filterFormSearchableFields && this.filterFormSearchableFields.indexOf("${fieldItem.fieldName}") > -1`;
    });
    // TODO:不应该走事件来手动写本地缓存，而是走amis form默认写本地存储的功能，保持使用的当前组件的path作为key
    const onValueChangeScript = `
      // form的persistData存的路径太深了，比如/app/test/tets__c/grid/all/page/body/0/.../0/form/filters，这里手动存下
      const data = event.data;
      const superServiceData = data.__super.__super;
      const filterFormSearchableFields = superServiceData.filterFormSearchableFields;
      const superPageData = superServiceData.__super;
      const appId = superPageData.appId;
      const objectName = superPageData.objectName;
      const listName = superPageData.listName;
      const searchableFilterStoreKey = "/app/" + appId + "/" + objectName + "/grid/" + listName + "/form/filters";
      const searchableFilter = _.pickBy(data, function(value, key){
        // __searchable开头的就是过滤条件
        return /^__searchable/.test(key);
      });
      localStorage.setItem(searchableFilterStoreKey, JSON.stringify(searchableFilter));
    `;
    events = {
      "onEvent": {
        "change": {
          "actions": [
            {
              "actionType": "custom",
              "script": onValueChangeScript
            }
          ]
        }
      }
    }
  }

  return {
    title: "",
    type: "form",
    name: "listview-filter-form",
    id: `listview_filter_form_${objectSchema.name}`,
    mode: "normal",
    wrapWithPanel: false,
    className: `sm:grid sm:gap-2 sm:grid-cols-4 mb-2`,
    persistData: "filters",
    persistDataKeys: persistDataKeys,
    body: body,
    ...events
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
    const supperData = data.__super;
    const searchableFieldsStoreKey = \`\${supperData.objectName}_\${supperData.listName}_searchable_fields\`;
    let defaultSearchableFields = localStorage.getItem(searchableFieldsStoreKey);
    setData({ filterFormSearchableFields: defaultSearchableFields });
  `;
  return {
    "type": "service",
    // "data": {
    //   "filterFormSearchableFields": ["name"]
    // },
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
                              "label": "按钮",
                              "onEvent": {
                                "click": {
                                  "actions": [
                                    {
                                      "actionType": "custom",
                                      "script": "debugger;const listName = context.props.data.listName;const objectName = context.props.data.objectName;\ndoAction({\n  actionType: 'setValue',\n  args: {\n    value: {filterFormSearchableFields: context.props.data.fields}\n  },\n  componentId: \"service_listview_filter_form_\" + objectName,\n})\n; const searchableFieldsStoreKey = `${objectName}_${listName}_searchable_fields`; localStorage.setItem(searchableFieldsStoreKey, context.props.data.fields);"
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
