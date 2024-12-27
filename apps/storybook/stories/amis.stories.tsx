/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-12-27 12:42:39
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-12-27 13:03:13
 */
import React from 'react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Amis/Amis',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export const Dialog = () => {
  const schema = {
    "type": "page",
    "body": [
      {
        "type": "button",
        "className": "ml-2",
        "label": "打开弹窗（模态）",
        "level": "primary",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "dialog",
                "dialog": {
                  "type": "dialog",
                  "title": "模态弹窗",
                  "id": "dialog_001",
                  "data": {
                    "myage": "22"
                  },
                  "body": [
                    {
                      "type": "tpl",
                      "tpl": "<p>对，你打开了模态弹窗</p>",
                      "inline": false
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    ]
  };
  const data = {};
  const env = {
    assetUrls: [
      `https://unpkg.com/@steedos-widgets/liveblocks@6.3.12-beta.6/dist/assets.json`,
    ],
  };
  return renderAmisSchema(schema, data, env)
};
