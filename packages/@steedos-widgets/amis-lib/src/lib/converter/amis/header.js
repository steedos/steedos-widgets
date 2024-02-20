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
  const disabled_list_views = objectSchema.permissions.disabled_list_views;
  const listViewButtonOptions = [];
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
    const restButtons = Array.isArray(amisButtonsSchema) ? amisButtonsSchema.filter(obj => obj.name !== "standard_new"):[]
    buttonSchema.push({
      "type": "flex",
      "items":[
        standardNewButton,
        (restButtons.length > 0) && {
          "type": "dropdown-button",
          "buttons": restButtons,
          "className": " ml-1",
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
    "className": `sm:rounded-tl sm:rounded-tr p-4 -mb-4`
  }];
  return headerSchema;
}

function getBackButtonSchema(){
  return {
    "type": "service",
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
  const { showRecordTitle = true } = options || {}
  // console.log('getObjectRecordDetailHeader==>', objectSchema, recordId)
  const { name, label, icon, NAME_FIELD_KEY } = objectSchema;
  
  let amisButtonsSchema = []
  if(options.showButtons != false){
    amisButtonsSchema = getObjectDetailButtonsSchemas(objectSchema, recordId, options);
  }

  let backButtonsSchema = null;

  if(options.showBackButton != false){
    backButtonsSchema = getBackButtonSchema();
  }

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
      "className": "p-4 border-b",
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

    // 根据屏幕宽度计算显示数量, 使高亮字段只占1行
    max = Math.trunc(divWidth / 200 )
    if(max > 10){
      max = 10
    }
  }

  // console.log('=======================max=========================', max)

  if(objectSchema.compactLayouts){
    const details = [];
    _.each(_.slice(_.difference(objectSchema.compactLayouts, [objectSchema.NAME_FIELD_KEY]), 0, max), (fieldName)=>{
      const field = objectSchema.fields[fieldName];
      if(field){
        details.push({
          type: 'steedos-field',
          static: true,
          config: field,
        })
      }
    });

    // 注意: 以下注释不能删除. tailwind css 动态编译时会识别以下注释, 生成对应的样式
    // lg:grid-cols-1
    // lg:grid-cols-2
    // lg:grid-cols-3
    // lg:grid-cols-4
    // lg:grid-cols-5
    // lg:grid-cols-6
    // lg:grid-cols-7
    // lg:grid-cols-8
    // lg:grid-cols-9
    // lg:grid-cols-10
    // lg:grid-cols-11
    // lg:grid-cols-12

    body.push({
      "type": "wrapper",
      "body": {
        "type": "form",
        // "className": "gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 3xl:grid-cols-8 4xl:grid-cols-8 5xl:grid-cols-10", //max-h-12 overflow-hidden 
        "className": `gap-2 grid grid-cols-1 lg:grid-cols-${max}`,
        "wrapWithPanel": false,
        "actions": [],
        "body": details,
        "hiddenOn": "${recordLoaded != true}"
      },
      "className": "steedos-record-compact-layouts p-4 bg-white compact-layouts border-b"
    })
  }

  return {
    type: 'service',
    id: `page_readonly_${name}_header`,
    name: `page`,
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
                        "tpl": `<a class="text-black text-base font-bold hover:font-bold" href="/app/\${appId}/\${_master.objectName}/\${_master.recordId}/\${objectName}/grid?related_field_name=\${relatedKey}">${relatedLabel}(\${$count})</a>`,
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
    "className": "steedos-record-related-header py-2 px-3 bg-gray-50 border"
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