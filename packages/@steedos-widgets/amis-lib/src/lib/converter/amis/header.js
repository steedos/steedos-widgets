import { getAuthToken, getTenantId, getRootUrl } from '../../steedos.client.js';
import { getObjectDetailButtons, getObjectDetailMoreButtons,getObjectRelatedListButtons, getButtonVisibleOn } from '../../buttons'
import { map, each } from 'lodash';

/**
 * 列表视图顶部amisSchema
 * @param {*} objectSchema 对象UISchema
 * @returns amisSchema
 */
export async function getObjectListHeader(objectSchema, listViewName) {
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

  let headerSchema = {
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
                      "tpl": `<p><img class=\"slds-icon_small slds-icon_container slds-icon-standard-${icon.indexOf('_') > -1 ? icon.replace(/_/g,'-') : icon}\" src=\"\${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${icon}.svg\" /></p>`
                    },
                    "md": "auto",
                    "className": "",
                    "columnClassName": "flex justify-center items-center"
                  },
                  {
                    "body": [
                      {
                        "type": "tpl",
                        "tpl": `${label}(\${count ? count : 0})`,
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
                        "hideCaret": true,
                        "btnClassName": "bg-transparent border-none text-lg font-bold p-0",
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
            "md": 9
          },
          {
            "body": [
              // 头部内容区
            ]
          }
        ]
      }
    ],
    "size": "xs",
    "className": "bg-white p-t-sm p-b-sm p-l"
  };
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
  const { name, label, icon } = objectSchema;
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
      className: `button_${button.name} border-gray-200 inline-block`
    }
  })
  let dropdownButtons = map(moreButtons, (button) => {
    return {
      type: 'steedos-object-button',
      name: button.name,
      objectName: button.objectName,
      visibleOn: getButtonVisibleOn(button),
      // className: `button_${button.name} border-gray-200 inline-block`
    }
  })
  const dropdownButtonsSchema = {
    type: "steedos-dropdown-button",
    label: "",
    buttons: dropdownButtons,
    className: 'slds-icon'
  }
  amisButtonsSchema.push(dropdownButtonsSchema);

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
                              "tpl": `<img class='slds-icon slds-icon_container slds-icon-standard-${icon.indexOf('_') > -1 ? icon.replace(/_/g, '-') : icon}' src='\${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${icon}.svg'>`
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
                    "body": amisButtonsSchema,
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
      "api": {
        "method": "post",
        "url": "${context.rootUrl}/graphql",
        "headers": {
          "Authorization": "Bearer ${context.tenantId},${context.authToken}"
        },
        "data": {
          "query": `{rows:${name}(filters: ["_id","=","${recordId}"]){_id, name} }`
        },
        "sendOn": `${!!recordId}`,
        "requestAdaptor": "",
        "adaptor": `
          const rows = payload.data.rows;
          let label = null;
          if (rows.length) {
            const objectInfo = rows[0];
            label = objectInfo.name;
          }
          delete payload.rows;
          payload.data = {
            name: label
          }
          return payload;
        `
      }
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
      className: `button_${button.name} border-gray-200 inline-block`
    }
  })
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
                      "tpl": `<img class=\"slds-icon_small slds-icon_container slds-icon-standard-${icon.indexOf('_') > -1 ? icon.replace(/_/g, '-') : icon}\" src=\"\${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${icon}.svg\" />`
                    },
                    "md": "auto",
                    "className": "",
                    "columnClassName": "flex justify-center items-center"
                  },
                  {
                    "body": [
                      {
                        "type": "tpl",
                        "tpl": `${label}(\${count ? count : 0})`,
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
            "body": amisButtonsSchema,
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