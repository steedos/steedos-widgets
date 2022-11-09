export async function getObjectListHeader(objectSchema, type, options) {
  return {
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
                      "tpl": `<p><img class=\"slds-icon_small slds-icon_container slds-icon-standard-${objectSchema.icon}\" src=\"\${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${objectSchema.icon}.svg\" /></p>`
                    },
                    "md": "auto",
                    "className": "",
                    "columnClassName": "flex justify-center items-center"
                  },
                  {
                    "body": [
                      {
                        "type": "tpl",
                        "tpl": `${objectSchema.label}(\${count ? count : 0})`,
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
}

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
      className: `button_${button.name} border-gray-200 inline-block`
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
                              "tpl": `<img class='slds-icon slds-icon_container slds-icon-standard-${icon}' src='\${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${icon}.svg'>`
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

export async function getObjectRecordDetailRelatedListHeader(relatedObjectSchema) {
  const { icon, label } = relatedObjectSchema;
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
                      "tpl": `<p><img class=\"slds-icon_small slds-icon_container slds-icon-standard-${icon}\" src=\"\${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${icon}.svg\" /></p>`
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
  return recordRelatedListHeader;
}

export async function getObjectRelatedListHeader(objectSchema, recordId, relatedObjectName) {
}