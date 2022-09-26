const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: "华炎魔方",
  componentName: "AmisSelectUser",
  title: "选择用户",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "AmisSelectUser",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
    {
      name: "name",
      propType: "string",
      description: '字段名称',
    },
    {
      name: "label",
      propType: "string",
      description: '标题',
    },
    {
      name: "multiple",
      propType: "boolean",
      description: '多选',
    },
    {
      name: "searchable",
      propType: "boolean",
      description: '可搜索',
    }
  ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-select-user',
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
        name: ""
      },
      previewSchema: {
        type: config.amis.name,
      },
      panelTitle: "设置",
      panelControls: [
        {
          type: "text",
          name: "name",
          label: '字段名称',
        },
        {
          type: "text",
          name: "label",
          label: '标题',
        },
        {
          propType: "checkbox",
          name: "multiple",
          label: '多选',
        },
        {
          propType: "checkbox",
          name: "searchable",
          label: '可搜索',
        }
      ]
    }
  }
};
