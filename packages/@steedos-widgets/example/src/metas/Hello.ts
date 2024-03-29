const config: any = {
  group: "华炎魔方",
  componentName: "Hello",
  title: "哈喽",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/example",
    version: "{{version}}",
    exportName: "Hello",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
    {
      name: "title",
      propType: "string",
      description: '标题',
    },
    {
      name: "content",
      propType: "string",
      description: '内容',
    }
  ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'example-hello',
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
        title: "",
        content: ""
      },
      previewSchema: {
        type: config.amis.name,
      },
      panelTitle: "设置",
      panelControls: [
        {
          type: "text",
          name: "title",
          label: "标题",
        },
        {
          type: "text",
          name: "content",
          label: "内容"
        }
      ]
    }
  }
};
