const config: any = {
  group: "Salesforce",
  name: "salesforce-icon",
  componentName: "SalesforceIcon",
  title: "SF Icon",
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
      name: "category",
      propType: "string"
    },
    {
      name: "name",
      propType: "string"
    },
    {
      name: "size",
      propType: "string"
    },
  ],
  preview: {
    category: "standard",
    name: "address",
    size: "large",
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
          name: "category",
          label: "Category"
        },
        {
          type: "text",
          name: "name",
          label: "Name"
        },
        {
          type: "text",
          name: "size",
          label: "Size"
        },
      ]
    }
  }
};
