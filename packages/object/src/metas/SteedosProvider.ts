const config: any = {
  group: "华炎魔方",
  name: "steedos-provider",
  componentName: "SteedosProvider",
  title: "华炎魔方容器",
  docUrl: "",
  screenshot: "",
  icon: "fa-fw fa fa-square-o",
  npm: {
    package: "@steedos-widgets/steedos-object",
    version: "{{version}}",
    exportName: "SteedosProvider",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
    {
      name: "rootUrl",
      propType: "string"
    },
  ],
  preview: {
    rootUrl: ""
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {}
};

export default {
  ...config,
  snippets: [
    {
      title: config.title,
      screenshot: "",
      schema: {
        componentName: config.name,
        props: config.preview
      }
    }
  ],
  amis: {
    render: {
      type: config.name,
      usage: "renderer",
      weight: 1,
      framework: "react"
    },
    plugin: {
      rendererName: config.name,
      // $schema: '/schemas/UnkownSchema.json',
      name: config.title,
      description: config.title,
      tags: [config.group],
      order: -9999,
      icon: config.icon,
      scaffold: {
        type: config.name,
        label: config.title,
        name: config.name,
        body: [], // 容器类字段
        ...config.preview,
      },
      // 容器类组件必需字段
      regions: [
        {
          key: 'body',
          label: '内容区'
        },
      ],
      previewSchema: {
        type: config.name,
        ...config.preview
      },
      panelTitle: "设置",
      panelControls: [
        {
          type: "text",
          name: "rootUrl",
          label: "标题"
        },
      ]
    }
  }
};
