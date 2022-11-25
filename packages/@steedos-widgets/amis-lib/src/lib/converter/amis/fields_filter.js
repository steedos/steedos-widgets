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

export async function getObjectFieldsFilterFormSchema(fields, cols) {
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
  return {
    title: "",
    type: "form",
    name: "listview-filter-form",
    id: "listview-filter-form",
    mode: "normal",
    wrapWithPanel: false,
    className: `sm:grid sm:gap-2 sm:grid-cols-4 mb-2`,
    body: body,
  };
}

export async function getObjectFieldsFilterBarSchema(fields, cols) {
  const filterFormSchema = await getObjectFieldsFilterFormSchema(fields, cols);
  const onSearchScript = `
    const appId = event.data.appId;
    const objectName = event.data.objectName;
    const listViewId = SteedosUI.getRefId({
      type: "listview",
      appId: appId,
      name: objectName,
    });
    const pageId = listViewId + "-page";
    var filterFormValues = SteedosUI.getRef(pageId).getComponentById("listview-filter-form").getValues();
    SteedosUI.getRef(pageId).getComponentById("listview_" + objectName).handleFilterSubmit(filterFormValues);
  `;
  return {
    "type": "wrapper",
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
    "size": "xs",
    "className": "px-1 py-1 bg-white b-b"
  };
}
