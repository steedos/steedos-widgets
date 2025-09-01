const t = (window as any).steedosI18next.t;

const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: t('widgets-meta:steedos-record-detail-header_group', '华炎魔方'),
  componentName: "AmisRecordDetailHeader",
  title: t('widgets-meta:steedos-record-detail-header_title', '标题面板'),
  description: t('widgets-meta:steedos-record-detail-header_description', '显示在记录详情页的标题面板，包括记录按钮。'),
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "AmisRecordDetailHeader",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
    {
      name: "objectApiName",
      propType: "string",
      description: t('widgets-meta:steedos-record-detail-header_props_objectApiName_description', '对象名称')
    },
    {
      name: "recordId",
      propType: "string",
      description: t('widgets-meta:steedos-record-detail-header_props_recordId_description', '记录Id')
    }
  ],
  preview: {},
  targets: ["steedos__RecordPage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-record-detail-header',
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
      description: config.description,
      tags: [config.group],
      order: -9999,
      icon: config.amis.icon,
      scaffold: {
        type: config.amis.name,
        label: config.title,
        objectApiName: "${objectName}",
        recordId: "${recordId}"
      },
      previewSchema: {
        type: config.amis.name,
        objectApiName: 'space_users'
      },
      panelTitle: t('widgets-meta:steedos-record-detail-header_panelTitle', '设置'),
      panelControls: [
        {
          "type": "select",
          "label": t('widgets-meta:steedos-record-detail-header_panelControls_object_label', '对象'),
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
                label: ${t('widgets-meta:steedos-record-detail-header_panelControls_object_source_adaptor_current_object', '当前对象')},
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
          type: "text",
          name: "recordId",
          label: t('widgets-meta:steedos-record-detail-header_panelControls_recordId_label', '记录Id')
        },
        {
          type: "text",
          name: "className",
          label: t('widgets-meta:steedos-record-detail-header_panelControls_className_label', 'CSS类名'),
          value: "bg-gray-100 border-b sm:rounded sm:border border-gray-300 p-4 mb-4"
        }
      ]
    }
  }
};