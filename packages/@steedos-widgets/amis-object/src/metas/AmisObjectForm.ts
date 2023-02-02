/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-02 09:04:33
 * @Description: 
 */

const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: "华炎魔方",
  componentName: "AmisObjectForm",
  title: "对象表单",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "AmisObjectForm",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
    {
      name: "objectApiName",
      propType: "string",
      description: '对象名',
    },
    {
      name: "recordId",
      propType: "string",
      description: '记录ID',
    },
    {
      name: "mode",
      propType:  {
        "type": "oneOf",
        "value": [
          "read",
          "edit",
        ]
      },
      description: '显示状态',
    },
    {
      name: "layout",
      propType:  {
        "type": "oneOf",
        "value": [
          "vertical",
          "horizontal",
        ]
      },
      description: '表单布局',
    },
  ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-object-form',
    icon: "fa-fw fa fa-list-alt"
  }
};

export default {
  ...config,
  snippets: [
    {
      title: config.title,
      screenshot: "",
      schema: {
        componentName: config.componentName,
        props: config.preview
      }
    }
  ],
  amis: {
    render: {
      type: config.amis.name,
      usage: "renderer",
      weight: 1,
      framework: "react"
    },
    plugin: {
      rendererName: config.amis.name,
      $schema: '/schemas/UnkownSchema.json',
      name: config.title,
      description: config.title,
      tags: [config.group],
      order: -9999,
      icon: config.amis.icon,
      scaffold: {
        type: config.amis.name,
        label: config.title,
        objectApiName: "${objectName}",
        recordId: "${recordId}",
        className: "sm:border sm:shadow sm:rounded sm:border-gray-300"
      },
      previewSchema: {
        type: config.amis.name,
        objectApiName: 'space_users'
      },
      panelTitle: "设置",
      panelControls: [
        {
          "type": "select",
          "label": "对象",
          "name": "objectApiName",
          "searchable": true,
          "multiple": false,
          "source": {
            "method": "get",
            "url": "/service/api/amis-design/objects",
            "requestAdaptor": `
                api.url = Builder.settings.rootUrl  + api.url; 
                if(!api.headers){
                  api.headers = {}
                };
                api.headers.Authorization='Bearer ' + Builder.settings.tenantId + ',' + Builder.settings.authToken  ;
                return api;
            `,
            "adaptor": `
              let data = payload.data;
              payload.unshift({
                label: "\${objectName}",
                name: "\${objectName}"
              });
              return payload;
            `
          },
          "labelField": "label",
          "valueField": "name",
          "menuTpl": ""
        },
        {
          type: "text",
          name: "recordId",
          label: "记录ID"
        },
        {
          type: "button-group-select",
          name: "mode",
          label: "显示状态",
          value: "read",
          options: [
            {
              "label": "只读",
              "value": "read"
            },
            {
              "label": "编辑",
              "value": "edit"
            }
          ]
        },
        {
          type: "button-group-select",
          name: "layout",
          label: "表单项布局",
          options: [
            {
              "label": "纵向",
              "value": "normal"
            },
            {
              "label": "横向",
              "value": "horizontal"
            },
            // {
            //   "label": "内联",
            //   "value": "inline"
            // }
          ]
        },
        /*
        {
          type: "button-group-select",
          name: "labelAlign",
          label: "表单项标签对齐方式",
          hiddenOn: "this.layout !== 'horizontal'",
          options: [
            {
              "label": "左",
              "value": "left"
            },
            {
              "label": "右",
              "value": "right"
            }
          ]
        },
        */
        {
          type: "text",
          name: "className",
          label: "CSS类名",
          value: "my-2"
        }
      ]
    }
  }
};
