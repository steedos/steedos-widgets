import { React, AmisRender } from '../components/AmisRender';
import { useEffect, useState, useRef } from 'react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Enterprise/Tables',
};

const data = {};

const env = {
  assetUrls: [
    process.env.STEEDOS_UNPKG_URL + '/@steedos-widgets/amis-object/dist/assets.json',
    process.env.STEEDOS_UNPKG_URL + '/@steedos-widgets/ag-grid/dist/assets.json',
  ],
};

/** 以上为可复用代码 **/
export const AdminEditRead = () => (
  <AmisRender
    data={data}
    env={env}
    schema={{
      "type": "page",
      "body": [
        {
          "type": "service",
          "id": "service_wrap",
          "body": [
            {
              "name": "text",
              "type": "input-text",
              "label": "TableId",
              "value": "${tableId}",
              "onEvent": {
                "change": {
                  "actions": [
                    {
                      "actionType": "setValue",
                      "componentId": "service_wrap",
                      "args": {
                        "value": {
                          "tableVisible": "${false}"
                        }
                      }
                    },
                    {
                      "actionType": "setValue",
                      "componentId": "service_wrap",
                      "args": {
                        "value": {
                          "tableVisible": "${true}",
                          "tableId": "${event.data.value}"
                        }
                      }
                    }
                  ]
                }
              }
            },
            {
              "type": "button-group-select",
              "label": "Mode",
              "name": "type",
              "options": [
                {
                  "label": "Admin",
                  "value": "admin"
                },
                {
                  "label": "Edit",
                  "value": "edit"
                },
                {
                  "label": "Read",
                  "value": "read"
                },
                {
                  "label": "Unset",
                  "value": null
                }
              ],
              "onEvent": {
                "change": {
                  "actions": [
                    {
                      "actionType": "setValue",
                      "componentId": "service_wrap",
                      "args": {
                        "value": {
                          "tableVisible": "${false}"
                        }
                      }
                    },
                    {
                      "actionType": "setValue",
                      "componentId": "service_wrap",
                      "args": {
                        "value": {
                          "tableVisible": "${true}",
                          "tableMode": "${event.data.value}"
                        }
                      }
                    }
                  ]
                }
              }
            },
            {
              "type": "steedos-tables-grid",
              "className": "h-96",
              "style": {
                "height": "calc(100vh - 178px)"
              },
              "tableId": "${tableId}",
              "mode": "${tableMode}",
              "visibleOn": "${tableVisible}"
            }
          ],
          "data": {
            "tableId": "67658ac0cc184d0efc68b752",
            "tableVisible": "${true}"
          }
        }
      ],
    }}
  />
)

export const Filters = () => (
  <AmisRender
    data={data}
    env={env}
    schema={{
      "type": "page",
      "body": [
        {
          "type": "service",
          "id": "service_wrap",
          "body": [
            {
              "name": "tableId",
              "type": "input-text",
              "label": "TableId",
              "value": "${tableId}",
              "onEvent": {
                "change": {
                  "actions": [
                    {
                      "actionType": "setValue",
                      "componentId": "service_wrap",
                      "args": {
                        "value": {
                          "tableVisible": "${false}"
                        }
                      }
                    },
                    {
                      "actionType": "setValue",
                      "componentId": "service_wrap",
                      "args": {
                        "value": {
                          "tableVisible": "${true}",
                          "tableId": "${event.data.value}"
                        }
                      }
                    }
                  ]
                }
              }
            },
            {
              "name": "filters",
              "type": "input-text",
              "label": "Filters",
              "value": "${tableFilters}",
              "onEvent": {
                "change": {
                  "actions": [
                    {
                      "actionType": "setValue",
                      "componentId": "service_wrap",
                      "args": {
                        "value": {
                          "tableVisible": "${false}"
                        }
                      }
                    },
                    {
                      "actionType": "setValue",
                      "componentId": "service_wrap",
                      "args": {
                        "value": {
                          "tableVisible": "${true}",
                          "tableFilters": "${event.data.value|toJson}"
                        }
                      }
                    }
                  ]
                }
              }
            },
            {
              "type": "steedos-tables-grid",
              "className": "h-96",
              "style": {
                "height": "calc(100vh - 178px)"
              },
              "tableId": "${tableId}",
              "mode": "read",
              "filters": "${tableFilters}",
              "visibleOn": "${tableVisible}"
            }
          ],
          "data": {
            "tableId": "67658ac0cc184d0efc68b752",
            "tableVisible": "${true}",
            "tableFilters": '${["int", ">", 100]}'
          }
        }
      ],
    }}
  />
)

export const BeforeUpdateData = () => (
  <AmisRender
    data={data}
    env={env}
    schema={{
      "type": "page",
      "body": [
        {
          "type": "service",
          "id": "service_wrap",
          "body": [
            {
              "name": "tableId",
              "type": "input-text",
              "label": "TableId",
              "value": "${tableId}",
              "onEvent": {
                "change": {
                  "actions": [
                    {
                      "actionType": "setValue",
                      "componentId": "service_wrap",
                      "args": {
                        "value": {
                          "tableVisible": "${false}"
                        }
                      }
                    },
                    {
                      "actionType": "setValue",
                      "componentId": "service_wrap",
                      "args": {
                        "value": {
                          "tableVisible": "${true}",
                          "tableId": "${event.data.value}"
                        }
                      }
                    }
                  ]
                }
              }
            },
            {
              "name": "beforeUpdateData",
              "type": "textarea",
              "label": "BeforeUpdateData",
              "value": "${tableBeforeUpdateData}",
              "onEvent": {
                "change": {
                  "actions": [
                    {
                      "actionType": "setValue",
                      "componentId": "service_wrap",
                      "args": {
                        "value": {
                          "tableVisible": "${false}"
                        }
                      }
                    },
                    {
                      "actionType": "setValue",
                      "componentId": "service_wrap",
                      "args": {
                        "value": {
                          "tableVisible": "${true}",
                          "tableBeforeUpdateData": "${event.data.value}"
                        }
                      }
                    }
                  ]
                }
              }
            },
            {
              "type": "steedos-tables-grid",
              "className": "h-96",
              "style": {
                "height": "calc(100vh - 178px)"
              },
              "tableId": "${tableId}",
              "mode": "admin",
              "beforeUpdateData": "${tableBeforeUpdateData}",
              "visibleOn": "${tableVisible}"
            }
          ],
          "data": {
            "tableId": "67658ac0cc184d0efc68b752",
            "tableVisible": "${true}",
            "tableBeforeUpdateData": `const { isInsert, isUpdate } = options;
if (isInsert) {
  rowData.collectId = "111";
}
else if (isUpdate) {
  rowData.collectId = "222";
}`
          }
        }
      ],
    }}
  />
)

export const LicenseKey = () => (
  <AmisRender
    data={data}
    env={env}
    schema={{
      "type": "page",
      "body": [
        {
          "type": "service",
          "id": "service_wrap",
          "body": [
            {
              "name": "text",
              "type": "input-text",
              "label": "TableId",
              "value": "${tableId}",
              "onEvent": {
                "change": {
                  "actions": [
                    {
                      "actionType": "setValue",
                      "componentId": "service_wrap",
                      "args": {
                        "value": {
                          "tableId": "${false}"
                        }
                      }
                    },
                    {
                      "actionType": "setValue",
                      "componentId": "service_wrap",
                      "args": {
                        "value": {
                          "tableId": "${event.data.value}"
                        }
                      }
                    }
                  ]
                }
              }
            },
            {
              "type": "steedos-tables-grid",
              "className": "h-96",
              "style": {
                "height": "calc(100vh - 108px)"
              },
              "tableId": "${tableId}",
              "mode": "read",
              "agGridLicenseKey": "1234567890",
              "visibleOn": "${tableId}"
            }
          ],
          "data": {
            "tableId": "67658ac0cc184d0efc68b752"
          }
        }
      ],
    }}
  />
)

export const SwitchTableId = () => {
  // const [tableId, setTableId] = useState('675ce746f7d71010aaeb3fe6');
  return (<>
    {/* <input type='input' onChange={(e) => {
      setTableId(e.target.value)
    }} /> */}
    <AmisRender
      data={data}
      env={env}
      schema={{
        "type": "page",
        "body": [{
          "type": "service",
          "id": "service_wrap",
          "body": [
            {
              "name": "text",
              "type": "input-text",
              "label": "TableId（tableId变化时自动重新加载组件，未实现）",
              "value": "${tableId}",
              "onEvent": {
                "change": {
                  "actions": [
                    {
                      "actionType": "setValue",
                      "componentId": "service_wrap",
                      "args": {
                        "value": {
                          "tableId": "${event.data.value}"
                        }
                      }
                    }
                  ]
                }
              }
            },
            // {
            //   "type": "tpl",
            //   "tpl": "TableId: ${tableId}"
            // },
            {
              "type": "steedos-tables-grid",
              "className": "h-96",
              "style": {
                "height": "calc(100vh - 108px)"
              },
              "tableId": "${tableId}",
              "mode": "admin"
            }
          ],
          "data": {
            "tableId": "675ce746f7d71010aaeb3fe6"
          }
        }],
      }}
    />
  </>)
}
