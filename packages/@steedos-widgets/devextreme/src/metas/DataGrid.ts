
const config: any = {
  group: "DevExtreme",
  componentName: "AmisDataGrid",
  title: "DataGrid",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/devextreme",
    version: "{{version}}",
    exportName: "AmisDataGrid",
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
    name: 'devextreme-datagrid',
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
      usage: "formitem",//使用 renderer 会无法监听到onEvent中配置的事件
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
        "type": "service",
        "api": {
          "url": "${context.rootUrl}/api/v1/space_users",
          "method": "get"
        },
        "body": [
          {
            type: config.amis.name,
            dataSource: "${items}",
            config: {
              keyExpr: "_id",
              // Column Definitions: Defines & controls grid columns.
              columns: [
                { dataField: "_id", caption: "ID" },
                { dataField: "name" },
              ],        
              columnChooser: { enabled: true },
              searchPanel: {
                visible: true,
                  highlightCaseSensitive: true,
                },
              groupPanel: { visible: true },
              grouping: {
                autoExpandAll: false,
              },
              allowColumnReordering: true,
              rowAlternationEnabled: true,
            },
          }
        ]
      },
      previewSchema: {
        "type": "service",
        "api": {
          "url": "${context.rootUrl}/api/v1/space_users",
          "method": "get"
        },
        "body": [
          {
            type: config.amis.name,
            dataSource: "${items}",
            config: {
              keyExpr: "_id",
              // Column Definitions: Defines & controls grid columns.
              columns: [
                { dataField: "_id", caption: "ID" },
                { dataField: "name" },
              ]
            },
          }
        ]
      },
      panelTitle: "设置",
      panelControls: [
        {
          type: "editor",
          "language": "json",
          name: "config",
          label: "DataGrid 配置",   
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
          name: "configAdaptor",
          label: "配置适配器",
          description: "通过函数扩展配置。\
          签名：(config, data) => config \
          "
        },
        {
          type: "text",
          name: "className",
          label: "CSS类名",
          value: "bg-gray-100 border-b sm:rounded sm:border border-gray-300 p-4 mb-4"
        },
      ],
      events: [{
        
      }],
    },
  }
};
