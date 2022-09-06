const config: any = {
    group: "Steedos",
    componentName: "MultipleContainers",
    title: "分组排序",
    docUrl: "",
    screenshot: "",
    npm: {
      package: "@steedos-widgets/sortable",
      version: "{{version}}",
      exportName: "MultipleContainers",
      main: "",
      destructuring: true,
      subName: ""
    },
    props: [
      {
        name: "title",
        propType: "string",
        description: '标题',
      }
    ],
    preview: {
    },
    targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
    engines: ["amis"],
    // settings for amis.
    amis: {
      name: 'sortable-multiple-containers',
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
          }
        ]
      }
    }
  };
  