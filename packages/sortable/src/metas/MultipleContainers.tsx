const config: any = {
    group: "华炎魔方",
    componentName: "MultipleContainers",
    title: "容器排序",
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
    // props: [
    //   {
    //     name: "title",
    //     propType: "string",
    //     description: '标题',
    //   }
    // ],
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
        usage: "formitem",
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
          name: 'board',
          columns: 1,
          vertical: false,
          value: {
            A: ["A1", "A2"],
            B: ["B1", "B2"]
          },
        },
        previewSchema: {
          type: config.amis.name,
        },
        panelTitle: "设置",
        panelControls: [,
          {
            "name": "columns",
            "type": "input-number",
            "label": "列数",
          },
          {
            "name": "vertical",
            "type": "checkbox",
            "label": "布局",
            "option": "纵向"
          }
        ]
      }
    }
  };
  