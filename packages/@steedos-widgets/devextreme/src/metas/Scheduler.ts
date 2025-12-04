
const config: any = {
  group: "DevExtreme",
  componentName: "AmisScheduler",
  title: "Scheduler",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/devextreme",
    version: "{{version}}",
    exportName: "AmisScheduler",
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
    name: 'devextreme-scheduler',
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
        config: {
          views: ['week', 'month'],
          currentView: 'week',
          currentDate: new Date(2021, 2, 28),
          startDayHour: 9,
          height: 730,
        },
      },
      previewSchema: {
        "type": "service",
        "api": {
          "url": "${context.rootUrl}/api/v1/events",
          "method": "get"
        },
        "body": [{
          type: config.amis.name,
          config: {
            views: ['week', 'month'],
            currentView: 'week',
            currentDate: new Date(2021, 2, 28),
            startDayHour: 9,
            height: 730,
          },
        }]
      },
      panelTitle: "设置",
      panelControls: [
        {
          type: "editor",
          "language": "json",
          name: "config",
          label: "Scheduler 配置",   
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
