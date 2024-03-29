
const config: any = {
  group: "华炎魔方",
  componentName: "FullCalendar",
  title: "日程",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/fullcalendar",
    version: "{{version}}",
    exportName: "FullCalendar",
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
    name: 'steedos-fullcalendar',
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
    plugin_disabled: {
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
        },
        {
          type: "text",
          name: "content",
          label: "内容"
        }
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
    //   panelBodyCreator: function(context) {
    //     return window['AmisEditorCore'].getSchemaTpl('tabs', [
    //       {
    //         title: '常规',
    //         controls: [
    //           {
    //             name: 'name',
    //             label: '标题',
    //             type: 'text'
    //           }
    //         ]
    //       },
    //     ]);
    //   }
    },
  }
};
