
const config: any = {
  group: "DevExtreme",
  componentName: "AmisGantt",
  title: "Gantt",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/devextreme",
    version: "{{version}}",
    exportName: "AmisGantt",
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
    name: 'devextreme-gantt',
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
        type: config.amis.name,
        className: "",
        config: {
        },
      },
      previewSchema: {
        type: config.amis.name,
        config: {
          
        },
      },
      panelTitle: "设置",
      panelControls: [
        {
          type: "editor",
          "language": "json",
          name: "config",
          label: "Gantt 配置",   
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
