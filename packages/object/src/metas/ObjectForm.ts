const config: any = {
  group: "华炎魔方",
  componentName: "ObjectForm",
  title: "对象表单",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-ui/builder-community",
    version: "{{version}}",
    exportName: "ObjectForm",
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
          "inline"
        ]
      },
      description: '表单布局',
    },
    // {
    //   name: "fields",
    //   propType:  {
    //     "type": "arrayOf",
    //     "value": "string"
    //   },
    //   description: '表单中显示的字段',
    // },
    {
      name: "onValuesChange",
      propType: "func",
      description: '字段值更新时触发回调事件',
    },
    {
      name: "onFinish",
      propType: "func",
      description: '提交表单且数据验证成功后回调事件',
    },
  ],
  preview: {
    text: "Submit",
    link: "https://www.steedos.cn"
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
        name: config.amis.name,
        ...config.preview
      },
      previewSchema: {
        type: config.amis.name,
        ...config.preview
      },
      panelTitle: "设置",
      panelControls: [
        {
          type: "text",
          name: "objectApiName",
          label: "对象名",
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
              "label": "read",
              "value": "read"
            },
            {
              "label": "edit",
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
              "label": "vertical",
              "value": "vertical"
            },
            {
              "label": "horizontal",
              "value": "horizontal"
            },
            {
              "label": "inline",
              "value": "inline"
            },
          ]
        },
      ]
    }
  }
};
