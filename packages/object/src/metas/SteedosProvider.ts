const config: any = {
  group: "华炎魔方",
  componentName: "SteedosProvider",
  title: "华炎魔方容器",
  docUrl: "",
  screenshot: "",
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
    {
      name: "tenantId",
      propType: "string"
    },
    {
      name: "userId",
      propType: "string"
    },
    {
      name: "authToken",
      propType: "string"
    },
  ],
  // preview: {
  //   rootUrl: ""
  // },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  configure: {
      component: {
          isContainer: true
      }
  },
  // settings for amis.
  amis: {
    name: 'steedos-provider',
    icon: "fa-fw fa fa-square-o"
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
        type: config.amis.name,
        ...config.preview
      },
      panelTitle: "设置",
      panelControls: [
        {
          type: "text",
          name: "rootUrl",
          label: "rootUrl",
        },
        {
          type: "text",
          name: 'tenantId',
          label: 'tenantId',
        },
        {
          type: "text",
          name: 'userId',
          label: 'userId',
        },
        {
          type: "text",
          name: 'authToken',
          label: 'authToken',
        }
      ]
    }
  }
};
