
const config: any = {
  group: "华炎魔方-原子组件",
  componentName: "AmisAgGrid",
  title: "AG-Grid",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/ag-grid",
    version: "{{version}}",
    exportName: "AmisAgGrid",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
  ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'ag-grid',
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
      usage: "renderer",//使用 renderer 会无法监听到onEvent中配置的事件
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
        className: "h-80",
        config: {
          // Row Data: The data to be displayed.
          rowData: [
            { make: "Tesla", model: "Model Y", price: 64950, electric: true },
            { make: "Ford", model: "F-Series", price: 33850, electric: false },
            { make: "Toyota", model: "Corolla", price: 29600, electric: false },
          ],
          // Column Definitions: Defines & controls grid columns.
          columnDefs: [
            { field: "make" },
            { field: "model" },
            { field: "price" },
            { field: "electric" }
          ]
        },
      },
      previewSchema: {
        type: config.amis.name,
      },
      panelTitle: "设置",
      panelControls: [
        {
          type: "text",
          name: "className",
          label: "CSS类名",
          value: "bg-gray-100 border-b sm:rounded sm:border border-gray-300 p-4 mb-4 h-full"
        },
        {
          type: "editor",
          "language": "json",
          name: "config",
          label: "AgGrid 配置",   
          pipeOut: (value) => {
            try {
              return value ? JSON.parse(value) : null;
            } catch (e) {
            }
            return value;
          }
        },
        {
          type: "editor",
          "language": "javascript",
          name: "dataFilter",
          label: "数据加工",
          description: "如果后端没有直接返回 AgGrid 配置，可以自己写一段函数来包装。\
          签名：(config, AgGrid, data) => config \
          "
        },
      ],
      events: [{
        
      }],
    },
  }
};
