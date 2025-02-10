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
export const Gerneral = () => (
  <AmisRender
    data={data}
    env={env}
    schema={{
      "type": "page",
      "body": [
        {
          "type": "steedos-tables-grid",
          "className": "h-96",
          "style": {
            "height": "calc(100vh - 58px)"
          },
          "tableId": "67658ac0cc184d0efc68b752",
          "mode": "admin"
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
          "type": "steedos-tables-grid",
          "className": "h-96",
          "style": {
            "height": "calc(100vh - 58px)"
          },
          "tableId": "67658ac0cc184d0efc68b752",
          "mode": "read",
          "filters": ["int", ">", 100]
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
              "label": "text",
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
            {
              "type": "tpl",
              "tpl": "TableId: ${tableId}"
            },
            {
              "type": "steedos-tables-grid",
              "className": "h-96",
              "style": {
                "height": "calc(100vh - 58px)"
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

export const LicenseKey = () => (
  <AmisRender
    data={data}
    env={env}
    schema={{
      "type": "page",
      "body": [
        {
          "type": "steedos-tables-grid",
          "className": "h-96",
          "style": {
            "height": "calc(100vh - 58px)"
          },
          "tableId": "67658ac0cc184d0efc68b752",
          "mode": "admin",
          "agGridLicenseKey": "1234567890"
        }
      ],
    }}
  />
)