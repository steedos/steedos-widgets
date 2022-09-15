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
        objectApiName: "space_users",
      },
      previewSchema: {
        type: config.amis.name,
      },
      panelTitle: "设置",
      panelControls: [
        {
          type: "text",
          name: "objectApiName",
          label: "对象Api名称",
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
          label: "表单布局",
          options: [
            {
              "label": "纵向",
              "value": "vertical"
            },
            {
              "label": "横向",
              "value": "horizontal"
            },
          ]
        },
      ]
    }
  }
};
