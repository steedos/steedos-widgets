const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: "华炎魔方",
  componentName: "AmisObjectCalendar",
  title: "对象日历",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "AmisObjectCalendar",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
    {
      name: "objectApiName",
      propType: "string",
      description: '对象名称',
    },
    {
      name: "startDateExpr",
      propType: "string",
      description: '开始时间字段',
    },
    {
      name: "endDateExpr",
      propType: "string",
      description: '结束时间字段',
    },
    {
      name: "allDayExpr",
      propType: "string",
      description: '全天字段',
    },
    {
      name: "textExpr",
      propType: "string",
      description: '标题字段',
    },
    {
      name: "currentView",
      propType: "string",
      description: '默认视图',
    }
  ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-object-calendar',
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
        objectApiName: "${objectName}",
        currentView: "timeGridWeek"
      },
      previewSchema: {
        type: config.amis.name,
        objectApiName: 'events',
        currentView: "timeGridWeek"
      },
      panelTitle: "设置",
      panelControls: [
        {
          "type": "select",
          "label": "对象",
          "name": "objectApiName",
          "searchable": true,
          "multiple": false,
          "source": {
            "method": "get",
            "url": "/service/api/amis-design/objects",
            "requestAdaptor": "api.url = Builder.settings.rootUrl  + api.url; if(!api.headers){api.headers = {}};api.headers.Authorization='Bearer ' + Builder.settings.tenantId + ',' + Builder.settings.authToken  ;return api;",
            "adaptor": `
              let data = payload.data;
              payload.unshift({
                label: "当前对象",
                name: "\${objectName}"
              });
              return payload;
            `
          },
          "labelField": "label",
          "valueField": "name",
          "menuTpl": ""
        },
        {
          "type": "input-text",
          "name": "startDateExpr",
          "label": "开始时间字段"
        },
        {
          "type": "input-text",
          "name": "endDateExpr",
          "label": "结束时间字段"
        },
        {
          "type": "input-text",
          "name": "allDayExpr",
          "label": "全天字段"
        },
        {
          "type": "input-text",
          "name": "textExpr",
          "label": "标题字段"
        },
        {
          "type": "select",
          "name": "currentView",
          "label": "默认视图",
          "value": "timeGridWeek",
          "options": [{
            "label": "月",
            "value": "dayGridMonth"
          },{
            "label": "周",
            "value": "timeGridWeek"
          },{
            "label": "日",
            "value": "timeGridDay"
          },{
            "label": "列表",
            "value": "listWeek"
          }]
        }
      ]
    }
  }
};
