
const config: any = {
  group: "华炎魔方-原子组件",
  componentName: "AmisReactFlow",
  title: "流程图",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/reactflow",
    version: "{{version}}",
    exportName: "AmisReactFlow",
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
    name: 'steedos-react-flow',
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
        name: "flow_chart",
        wrapperClassName: "w-full h-full",
        config: JSON.stringify({
          nodes: [
            {
              id: 'start',
              data: { label: '开始' },
              position: { x: 0, y: 0 },
              type: 'input',
            },
            {
              id: 'end',
              data: { label: '结束' },
              position: { x: 100, y: 100 },
            },
          ],
          "edges": [
            {
              "id": "start-end",
              "source": "start",
              "target": "end",
              "label": "",
              "type": "step"
            }
          ]
        })
      },
      previewSchema: {
        type: config.amis.name,
      },
      panelTitle: "设置",
      panelControls: [
        {
          type: "editor",
          "language": "json",
          name: "config",
          label: "ReactFlow 配置",   
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
          description: "如果后端没有直接返回 ReactFlow 配置，可以自己写一段函数来包装。\
          签名：(config, ReactFlow, data) => config \
          "
        },
        {
          type: "text",
          name: "wrapperClassName",
          label: "CSS类名"
        },
      ],
      events: [{
        eventName: "eventClick",
        eventLabel: 'eventClick',
        description: 'Click on an event.',
        dataSchema: [{
          type: "object",
          properties: {
            "event.data.name": {
              type: "string",
              title: "name"
            },
          }
        }]
      }],
    },
  }
};
