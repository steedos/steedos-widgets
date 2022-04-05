const config: any = {
  group: "华炎魔方",
  componentName: "ObjectForm",
  title: "对象表单",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/steedos-object",
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
          label: "object Api Name"
        },
      ]
    }
  }
};
