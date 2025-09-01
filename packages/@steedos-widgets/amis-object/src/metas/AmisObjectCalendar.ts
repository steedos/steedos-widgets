/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-01 16:08:49
 * @Description: 
 */
const t = (window as any).steedosI18next.t;

const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: t('widgets-meta:steedos-object-calendar_group', '华炎魔方'),
  componentName: "AmisObjectCalendar",
  title: t('widgets-meta:steedos-object-calendar_title', '对象日历'),
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
      description: t('widgets-meta:steedos-object-calendar_props_objectApiName', '对象名称'),
    },
    {
      name: "startDateExpr",
      propType: "string",
      description: t('widgets-meta:steedos-object-calendar_props_startDateExpr', '开始时间字段'),
    },
    {
      name: "endDateExpr",
      propType: "string",
      description: t('widgets-meta:steedos-object-calendar_props_endDateExpr', '结束时间字段'),
    },
    {
      name: "allDayExpr",
      propType: "string",
      description: t('widgets-meta:steedos-object-calendar_props_allDayExpr', '全天字段'),
    },
    {
      name: "textExpr",
      propType: "string",
      description: t('widgets-meta:steedos-object-calendar_props_textExpr', '标题字段'),
    },
    {
      name: "currentView",
      propType: "string",
      description: t('widgets-meta:steedos-object-calendar_props_currentView', '默认视图'),
    }
  ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
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
      panelTitle: t('widgets-meta:steedos-object-calendar_panelTitle', '设置'),
      panelControls: [
        {
          "type": "select",
          "label": t('widgets-meta:steedos-object-calendar_panelControls_objectApiName', '对象'),
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
                label: "${t('widgets-meta:steedos-object-calendar_panelControls_currentObject', '当前对象')}",
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
          "label": t('widgets-meta:steedos-object-calendar_panelControls_startDateExpr', '开始时间字段')
        },
        {
          "type": "input-text",
          "name": "endDateExpr",
          "label": t('widgets-meta:steedos-object-calendar_panelControls_endDateExpr', '结束时间字段')
        },
        {
          "type": "input-text",
          "name": "allDayExpr",
          "label": t('widgets-meta:steedos-object-calendar_panelControls_allDayExpr', '全天字段')
        },
        {
          "type": "input-text",
          "name": "textExpr",
          "label": t('widgets-meta:steedos-object-calendar_panelControls_textExpr', '标题字段')
        },
        {
          "type": "select",
          "name": "currentView",
          "label": t('widgets-meta:steedos-object-calendar_panelControls_currentView', '默认视图'),
          "value": "timeGridWeek",
          "options": [
            {"label": t('widgets-meta:steedos-object-calendar_options_month', '月'), "value": "dayGridMonth"},
            {"label": t('widgets-meta:steedos-object-calendar_options_week', '周'), "value": "timeGridWeek"},
            {"label": t('widgets-meta:steedos-object-calendar_options_day', '日'), "value": "timeGridDay"},
            {"label": t('widgets-meta:steedos-object-calendar_options_list', '列表'), "value": "listWeek"}
          ]
        }
      ]
    }
  }
};
