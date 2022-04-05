const config: any = {
  group: "华炎魔方",
  componentName: "ObjectForm",
  title: "对象表单",
  docUrl: "",
  screenshot: "",
  icon: "fa-fw fa fa-list-alt",
  npm: {
    package: "@steedos-ui/builder-widgets",
    version: "{{version}}",
    exportName: "ObjectForm",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
    {
      name: "objectApiName",
      propType: "string"
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
    name: 'steedos-object-form'
  }
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
      $schema: '/schemas/UnkownSchema.json',
      name: config.title,
      description: config.title,
      tags: [config.group],
      order: -9999,
      icon: config.icon,
      scaffold: {
        type: config.name,
        label: config.title,
        name: config.name,
        ...config.preview
      },
      previewSchema: {
        type: config.name,
        ...config.preview
      },
      panelTitle: "设置",
      panelControls: [
        {
          type: "text",
          name: "objectApiName",
          label: "object Api Name"
        },
      ]
    }
  }
};
