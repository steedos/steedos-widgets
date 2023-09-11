import { getObjectRelatedListButtons, getButtonVisibleOn } from '../../buttons'
import { getObjectFieldsFilterButtonSchema, getObjectFieldsFilterBarSchema } from './fields_filter';
import { map, each, sortBy, compact, keys } from 'lodash';

import { getObjectDetailButtonsSchemas, getObjectListViewButtonsSchemas, getObjectRecordDetailRelatedListButtonsSchemas } from '../../buttons'

/**
 * 列表视图顶部第一行amisSchema
 * @param {*} objectSchema 对象UISchema
 * @returns amisSchema
 */
export function getObjectListHeaderFirstLine(objectSchema, listViewName, ctx) {
  const { icon, label } = objectSchema;
  const listViewButtonOptions = [];
  each(
    objectSchema.list_views,
    (listView, name) => {
      if(name === "lookup"){
        // 内置lookup为弹出选择专用视图，不显示在列表切换区域
        return;
      }
      listViewButtonOptions.push({
        type: "button",
        label: listView.label,
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
    "visibleOn": "${display == 'split'?false:true}"
  }]
  if(ctx.formFactor !== 'SMALL'){
    buttonSchema.push({
      "type": "flex",
      "items":[
        standardNewButton,
        {
          "type": "dropdown-button",
          "buttons": Array.isArray(amisButtonsSchema) ? amisButtonsSchema.filter(obj => obj.name !== "standard_new"):{},
          "menuClassName": "p-none split-dropdown-buttons",
          "align": "right",
          "size": "sm"
        }
      ],
      "visibleOn": "${display == 'split'?true:false}"
    })
  }
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
                    "className": "", 
                    "label": "\${listName ? uiSchema.list_views[listName].label : uiSchema.list_views[defaultListName].label}",
                    "rightIcon": "fa fa-caret-down",
                    "size": "sm",
                    "hideCaret": true,
                    "closeOnClick": true,
                    "btnClassName": "!bg-transparent !border-none !hover:border-none text-lg h-5 font-bold p-0 text-black leading-none",
                    "buttons": listViewButtonOptions
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
    "className": `bg-gray-100 sm:rounded-tl sm:rounded-tr p-4 -mb-4`
  }];
  return headerSchema;
}

/**
 * 记录详细界面顶部头amisSchema，也是标题面板组件的amisSchema
 * @param {*} objectSchema 对象UISchema
 * @param {*} recordId 记录id
 * @param {*} optioins: {showRecordTitle: true}
 * @returns amisSchema
 */
export async function getObjectRecordDetailHeader(objectSchema, recordId, options) {
  const { showRecordTitle = true } = options || {}
  // console.log('getObjectRecordDetailHeader==>', objectSchema, recordId)
  const { name, label, icon, NAME_FIELD_KEY } = objectSchema;
  
  let amisButtonsSchema = getObjectDetailButtonsSchemas(objectSchema, recordId, options);

  // console.log(`getObjectRecordDetailHeader==>`, amisButtonsSchema)
  
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
              "body": [{
                "type": "service",
                "onEvent": {
                    "@history_paths.changed": {
                        "actions": [
                            {
                                "actionType": "reload"
                            }
                        ]
                    }
                },
                "body":[{
                  "type": "button",
                  "visibleOn": "${window:innerWidth > 768 && (window:historyPaths.length > 1 || window:historyPaths[0].params.record_id) && display !== 'split'}",
                  "className":"flex mr-4",
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
              },{
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
                  "tpl": "${name}",
                  // "tpl": "${(record && uiSchema && record[uiSchema.NAME_FIELD_KEY]) || name}",
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
  };

  gridBody.push({
    "body":  {
      "type": "flex",
      "items": amisButtonsSchema,
    },
    "md": "auto",
    // "hiddenOn": "${recordLoaded != true}"
  })

  let body = [
    {
      "type": "wrapper",
      "className": "p-0",
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
      "className": "p-0",
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

  return {
    type: 'service',
    id: `page_readonly_${name}_header`,
    name: `page`,
    data: { objectName: name, _id: recordId, recordPermissions: objectSchema.permissions, uiSchema: objectSchema, record: "${record}" },
    body: body, 
    className: ''
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
                        "tpl": `<a class="text-black text-base font-bold" href="/app/\${appId}/\${_master.objectName}/\${_master.recordId}/\${objectName}/grid?related_field_name=\${relatedKey}">${relatedLabel}(\${$count})</a>`,
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
        "className": "flex justify-between"
      }
    ],
    "className": "p-3"
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