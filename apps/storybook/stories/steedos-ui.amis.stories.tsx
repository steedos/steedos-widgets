/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-09 11:54:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-14 14:01:19
 * @Description: 
 */
import { React, AmisRender } from '../components/AmisRender';

import * as _ from 'lodash';

const data = {};

const env = {
  assetUrls: [
    `${process.env.STEEDOS_UNPKG_URL}/@steedos-widgets/amis-object/dist/assets.json`,
  ],
};

export default {
  title: 'Steedos/Steedos UI',
};


export const UserSession = () => (
  <AmisRender schema={{
    "type": "page",
    "body": [
      {
        "label": "Context",
        "type": "json",
        "name": "context",
        "value": "${context}"
      },
      {
        "label": "User",
        "type": "json",
        "name": "context.user",
        "value": "${context.user}"
      }
    ],
  }}
  data={data} env={env}/>
)


export const AppHeader = () => (
  <AmisRender schema={{
    "type": "page",
    "body": [
      {
        "type": "grid",
        "className": "m-t",
        "columns": [
          {
            "columnClassName": "",
            "body": [
              {
                "type": "steedos-logo",
                "src": ""
              }
            ],
            "id": "u:8f98766aa1bc",
            "md": "auto",
            "valign": "middle"
          },
          {
            "columnClassName": "",
            "body": [
              {
                "type": "steedos-app-launcher",
                "id": "u:202de972cb2d"
              }
            ],
            "id": "u:e8a42e96eaf5",
            "md": "auto",
            "valign": "middle"
          },
          {
            "columnClassName": "",
            "body": [
              {
                "type": "steedos-app-menu",
                "stacked": false,
                "id": "u:77851eb4aa89"
              }
            ],
            "id": "u:5367229505d8",
            "md": "",
            "valign": "middle"
          }
        ],
        "id": "u:6cc99950b29c"
      }
    ],
    "regions": [
      "body"
    ],
    "id": "u:53a05f7c471a"
  }}
  data={data} env={env}/>
)


export const GlobalHeader = () => (
  <AmisRender schema={{
    "type": "page",
    "body": [
      {
        "type": "steedos-global-header",
        "id": "u:9c3d279be31a",
      }
    ],
  }}
  data={data} env={env}/>
)



export const AppMenuLeft = () => (
  <AmisRender schema={{
    "type": "page",
    "body": [
              {
                "type": "steedos-app-menu",
                "stacked": true,
                "id": "u:77851eb4aa89"
              }
            ],
    }}
    data={data} env={env}/>
)


export const AppMenuTop = () => (
  <AmisRender schema={{
    "type": "page",
    "body": [
              {
                "type": "steedos-app-menu",
                "stacked": false,
                "id": "u:77851eb4aa89"
              }
            ],
    }}
    data={data} env={env}/>
)



const PageListViewTemplate = (args) => {
  console.log(args);
  return (
    <AmisRender schema={{
      "type": "page",
      "body": [
          {
            "type": "steedos-page-listview",
            ...args
          }
        ],
      }}
    data={data} env={env}/>
  )
}

export const PageListView = PageListViewTemplate.bind({});
PageListView.args = {
  app_id: 'admin',
  tab_id: 'space_users',
  display: 'grid',
};
PageListView.argTypes = {
  display: {
    options: [
      'grid', 'split'
    ],
    control: { type: 'radio' },
  },
}