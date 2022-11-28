import { getFieldSearchable } from "./fields/index";
import { includes } from "lodash";

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
    body: body,
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
    const listViewId = SteedosUI.getRefId({
      type: "listview",
      appId: appId,
      name: objectName,
    });
    const pageId = listViewId + "-page";
    const scope = SteedosUI.getRef(${ctx.isListviewInit ? "listViewId" : "pageId"});
    var filterForm = scope.getComponentById("listview_filter_form_" + objectName);
    var filterFormValues = filterForm.getValues();
    var listView = scope.getComponentById("listview_" + objectName);
    listView.handleFilterSubmit(filterFormValues);
  `;
  const openSearchalbeFieldsSettingScript = `
    const appId = event.data.appId;
    const objectName = event.data.objectName;
    const listName = event.data.listName;
    const listViewId = SteedosUI.getRefId({
      type: "listview",
      appId: appId,
      name: objectName,
    });
    const pageId = listViewId + "-page";
    const scope = SteedosUI.getRef(${ctx.isListviewInit ? "listViewId" : "pageId"});
    var filterFormService = scope.getComponentById("service_listview_filter_form_" + objectName);
    const searchableFields = filterFormService.props.data?.filterFormSearchableFields;
    SteedosUI.Field.showFieldsTransfer({
      objectName: "${objectSchema.name}",
      data: {
        fields: searchableFields,
      },
      onOk: (values) => {
        filterFormService.setData({
          filterFormSearchableFields: values.fields
        });
        const searchableFieldsStoreKey = \`\${objectName}_\${listName}_searchable_fields\`;
        localStorage.setItem(searchableFieldsStoreKey, values.fields)
      },
      onCancel: () => {
      },
      title: '设置搜索项'
    });
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
                "className": "ml-1",
                "level": "link",
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "actionType": "custom",
                        "script": openSearchalbeFieldsSettingScript
                      }
                    ]
                  }
                }
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
