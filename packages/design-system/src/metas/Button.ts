const config: any = {
  group: "Salesforce",
  name: "salesforce-button",
  componentName: "SalesforceButton",
  title: "SF Button",
  docUrl: "",
  screenshot: "",
  icon: "fa-fw fa fa-list-alt",
  npm: {
    package: "@steedos-widgets/design-system",
    version: "{{version}}",
    exportName: "Icon",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
    {
      name: "label",
      propType: "string"
    },
  ],
  preview: {
    label: "Hello Button",
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
          name: "label",
          label: "标题"
        },
      ]
    }
  }
};
