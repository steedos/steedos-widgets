import { getAuthToken, getTenantId, getRootUrl } from '../../steedos.client.js';
import { getListViewButtons, getObjectDetailButtons, getObjectDetailMoreButtons, getObjectRelatedListButtons, getButtonVisibleOn } from '../../buttons'
import { getObjectFieldsFilterButtonSchema, getObjectFieldsFilterBarSchema } from './fields_filter';
import { map, each, sortBy, compact, keys } from 'lodash';

/**
 * 列表视图顶部第一行amisSchema
 * @param {*} objectSchema 对象UISchema
 * @returns amisSchema
 */
export function getObjectListHeaderFirstLine(objectSchema, listViewName, ctx) {
  if (!ctx) {
    ctx = {};
  }
  const { icon, label } = objectSchema;
  const listViewButtonOptions = [];
  // let currentListView;
  each(
    objectSchema.list_views,
    (listView, name) => {
      listViewButtonOptions.push({
        type: "button",
        label: listView.label,
        actionType: "link",
        // icon: "fa fa-plus",
        link: `/app/\${appId}/${objectSchema.name}/grid/${name}`
      });
      // if(name === listViewName){
      //   currentListView = listView;
      // }
    }
  );

  // if(!currentListView){
  //   return {};
  // }

  const buttons = getListViewButtons(objectSchema, {});
  let amisButtonsSchema = map(buttons, (button) => {
    return {
      type: 'steedos-object-button',
      name: button.name,
      objectName: button.objectName,
      visibleOn: getButtonVisibleOn(button),
      className: `button_${button.name} border-gray-200 inline-block ml-1`
    }
  });
  // if(objectSchema.permissions?.allowDelete){
  //   const bulkDeleteScript = `
  //     const data = event.data;
  //     const listViewId = data.listViewId;
  //     const uiSchema = data.uiSchema;
  //     const scopeId = data.scopeId;
  //     BuilderAmisObject.AmisLib.standardButtonsTodo.standard_delete_many.call({
  //       listViewId, 
  //       uiSchema, 
  //       scopeId
  //     })
  //   `;
  //   amisButtonsSchema.push({
  //     type: 'button',
  //     label: "删除",
  //     className: `antd-Button antd-Button--default antd-Button--size-default`,
  //     "onEvent": {
  //       "click": {
  //         "actions": [
  //           {
  //             "actionType": "custom",
  //             "script": bulkDeleteScript
  //           }
  //         ]
  //       }
  //     }
  //   });
  // }
  const reg = new RegExp('_', 'g');
  const standardIcon = icon && icon.replace(reg, '-');
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
                  "tpl": `<img class=\"slds-icon slds-icon_container slds-icon-standard-${standardIcon} slds-page-header__icon\" src=\"\${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${icon}.svg\" />`
                },
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
                    "className": "leading-none",
                    "style": {
                      "fontFamily": "",
                      "fontSize": 13,
                      "fontWeight": "bold"
                    }
                  },
                  {
                    "type": "dropdown-button",
                    "className": "leading-none",
                    "label": "\${uiSchema.list_views[listName].label}",
                    "rightIcon": "fa fa-caret-down",
                    "size": "sm",
                    "hideCaret": true,
                    "btnClassName": "bg-transparent border-none text-base font-bold p-0 text-black leading-5",
                    "buttons": listViewButtonOptions
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
        "body":  {
          "type": "flex",
          "items": amisButtonsSchema,
        },
        "md": "auto"
      }
    ],
    "align": "between"
  }
}

/**
 * 列表视图顶部amisSchema
 * @param {*} objectSchema 对象UISchema
 * @returns amisSchema
 */
export async function getObjectListHeader(objectSchema, listViewName, ctx) {
  if (!ctx) {
    ctx = {};
  }
  const amisListViewId = `listview_${objectSchema.name}`;
  let firstLineSchema = getObjectListHeaderFirstLine(objectSchema, listViewName, ctx);
  const fieldsFilterButtonSchema = await getObjectFieldsFilterButtonSchema(objectSchema);
  const onFilterChangeScript = `
    const eventData = event.data;
    const uiSchema = eventData.uiSchema;
    const listName = eventData.listName;
    const listViewId = eventData.listViewId;
    var selectedListView = uiSchema.list_views[listName]
    var filter = eventData.filter;
    SteedosUI.ListView.showFilter(uiSchema.name, {
      listView: selectedListView,
      data: {
        filters: SteedosUI.ListView.getVisibleFilter(selectedListView, filter, { listViewId }),
      },
      onFilterChange: (filter) => {
        doAction({
          componentId: \`service_listview_\${uiSchema.name}\`,
          actionType: 'setValue',
          "args": {
            "value": {
              filter: filter
            }
          }
        });
        doAction({
          componentId: \`listview_\${uiSchema.name}\`,
          actionType: 'reload',
          "args": {
            filter: filter
          }
        });
      }
    });
  `;
  let secordLineSchema = {
    "type": "grid",
    "align": "between",
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
        "valign": "middle"
      },
      {
        "body": [
          fieldsFilterButtonSchema,
          {
            "type": "button",
            "label": "",
            "icon": "fa fa-refresh",
            "actionType": "reload",
            "target": amisListViewId,
            "className": "bg-white p-2 rounded border-gray-300 text-gray-500"
          },
          // {
          //   "type": "button",
          //   "label": "",
          //   "icon": "fa fa-filter",
          //   "actionType": "custom",
          //   "className": "bg-transparent p-2 rounded border-gray-300 text-gray-500",
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
    "className": ""
  };
  let body = [firstLineSchema, secordLineSchema];
  if (ctx.onlyFirstLine) {
    body = [firstLineSchema];
  }
  else if (ctx.onlySecordLine) {
    body = [secordLineSchema];
  }
  let headerSchema = [{
    "type": "wrapper",
    "body": body,
    "className": "p-4 border-b sm:rounded-tl sm:rounded-tr bg-gray-100"
  }];
  const searchableFields = keys(objectSchema.fields);
  const fields = sortBy(
    compact(
      map(searchableFields, (fieldName) => {
        return objectSchema.fields[fieldName];
      })
    ),
    "sort_no"
  );
  const fieldsFilterBarSchema = await getObjectFieldsFilterBarSchema(objectSchema, fields, {
    isListviewInit: ctx.isListviewInit
  });
  headerSchema.push(fieldsFilterBarSchema);
  return headerSchema;
}

/**
 * 记录详细界面顶部头amisSchema，也是标题面板组件的amisSchema
 * @param {*} objectSchema 对象UISchema
 * @param {*} recordId 记录id
 * @returns amisSchema
 */
export async function getObjectRecordDetailHeader(objectSchema, recordId) {
  // console.log('amis==>', objectSchema, recordId)
  const { name, label, icon, NAME_FIELD_KEY } = objectSchema;
  const buttons = getObjectDetailButtons(objectSchema, {});
  const moreButtons = getObjectDetailMoreButtons(objectSchema, {
    recordId: recordId,
    objectName: name
  })
  let amisButtonsSchema = map(buttons, (button) => {
    return {
      type: 'steedos-object-button',
      name: button.name,
      objectName: button.objectName,
      visibleOn: getButtonVisibleOn(button),
      className: `button_${button.name} border-gray-200 inline-block ml-1`
    }
  })
  let dropdownButtons = map(moreButtons, (button) => {
    return {
      type: 'steedos-object-button',
      name: button.name,
      objectName: button.objectName,
      visibleOn: getButtonVisibleOn(button),
      // className: `button_${button.name} border-gray-200 inline-block ml-1`
    }
  })
  const dropdownButtonsSchema = {
    type: "steedos-dropdown-button",
    label: "",
    buttons: dropdownButtons,
    className: 'slds-icon ml-1 border-gray-200 rounded-none'
  }
  amisButtonsSchema.push(dropdownButtonsSchema);
  const reg = new RegExp('_', 'g');
  const standardIcon = icon && icon.replace(reg, '-');
  let body = [
    {
      "type": "service",
      "body": [
        {
          "type": "panel",
          "title": "标题",
          "body": [],
          "header": {
            "type": "wrapper",
            "body": [
              {
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
                              "tpl": `<img class='slds-icon slds-icon_container slds-icon-standard-${standardIcon}' src='\${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${icon}.svg'>`
                            },
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
                                "style": {
                                  "fontFamily": "",
                                  "fontSize": 13
                                },
                                "className": "leading-none"
                              },
                              {
                                "type": "tpl",
                                "tpl": "${name}",
                                // "tpl": "${(record && uiSchema && record[uiSchema.NAME_FIELD_KEY]) || name}",
                                "inline": false,
                                "wrapperComponent": "",
                                "style": {
                                  "fontFamily": "",
                                  "fontSize": 20,
                                  "fontWeight": "bold",
                                  "textAlign": "left"
                                },
                                "className": "leading-none"
                              }
                            ],
                          }
                        ]
                      }
                    ],
                    "md": "auto"
                  },
                  {
                    "body":  {
                      "type": "flex",
                      "items": amisButtonsSchema,
                    },
                    "md": "auto"
                  }
                ],
                "align": "between"
              }
            ],
            "size": "xs"
          },
          "affixFooter": false,
          "headerClassName": "",
          "bodyClassName": "p-none"
        }
      ],
      "messages": {},
      // "api": {
      //   "method": "post",
      //   "url": "${context.rootUrl}/graphql",
      //   "headers": {
      //     "Authorization": "Bearer ${context.tenantId},${context.authToken}"
      //   },
      //   "data": {
      //     "query": `{rows:${name}(filters: ["_id","=","${recordId}"]){_id, name: ${NAME_FIELD_KEY || 'name'}} }`
      //   },
      //   "sendOn": `${!!recordId}`,
      //   "requestAdaptor": "",
      //   "adaptor": `
      //     const rows = payload.data.rows;
      //     let label = null;
      //     if (rows.length) {
      //       const objectInfo = rows[0];
      //       label = objectInfo.name;
      //     }
      //     delete payload.rows;
      //     payload.data = {
      //       name: label
      //     }
      //     return payload;
      //   `
      // }
    }
  ];

  return {
    type: 'service',
    bodyClassName: '',
    name: `page`,
    data: { context: { rootUrl: getRootUrl(), tenantId: getTenantId(), authToken: getAuthToken() }, objectName: name, _id: recordId, recordPermissions: objectSchema.permissions, uiSchema: objectSchema },
    body: body
  }

}

/**
 * 记录详细界面中相关表顶部头amisSchema
 * @param {*} relatedObjectSchema 相关对象UISchema
 * @returns amisSchema
 */
export async function getObjectRecordDetailRelatedListHeader(relatedObjectSchema) {
  const { icon, label } = relatedObjectSchema;
  const buttons = await getObjectRelatedListButtons(relatedObjectSchema, {});
  let amisButtonsSchema = map(buttons, (button) => {
    return {
      type: 'steedos-object-button',
      name: button.name,
      objectName: button.objectName,
      visibleOn: getButtonVisibleOn(button),
      className: `button_${button.name} border-gray-200 inline-block ml-1`
    }
  })
  const reg = new RegExp('_', 'g');
  const standardIcon = icon && icon.replace(reg, '-');
  const recordRelatedListHeader = {
    "type": "wrapper",
    "body": [
      {
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
                      "tpl": `<img class=\"slds-icon_small slds-icon_container slds-icon-standard-${standardIcon}\" src=\"\${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${icon}.svg\" />`
                    },
                    "md": "auto",
                    "className": "",
                    "columnClassName": "flex justify-center items-center"
                  },
                  {
                    "body": [
                      {
                        "type": "tpl",
                        "tpl": `<a href="/app/\${appId}/\${masterObjectName}/\${masterRecordId}/\${objectName}/grid?related_field_name=\${relatedKey}">${label}(\${$count})</a>`,
                        "inline": false,
                        "wrapperComponent": "",
                        "className": "leading-none",
                        "style": {
                          "fontFamily": "",
                          "fontSize": 13,
                          "fontWeight": "bold"
                        }
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
        "align": "between"
      }
    ],
    "size": "xs",
    "className": "bg-white p-t-sm p-b-sm px-4 border-b"
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