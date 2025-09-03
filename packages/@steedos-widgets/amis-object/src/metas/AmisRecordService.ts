/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-09-03 14:31:30
 * @Description: 
 */
const t = (window as any).steedosI18next.t;

const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: t('widgets-meta:steedos-record-service_group', '华炎魔方'),
  componentName: "AmisRecordService",
  title: t('widgets-meta:steedos-record-service_title', '记录服务'),
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "AmisRecordService",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
    {
      name: "objectApiName",
      propType: "string",
      description: t('widgets-meta:steedos-record-service_props_objectApiName', '对象'),
    },
    {
      name: "recordId",
      propType: "string",
      description: t('widgets-meta:steedos-record-service_props_recordId', '记录ID'),
    },
    {
      name: "initApiRequestAdaptor",
      propType: "string",
      description: t('widgets-meta:steedos-record-service_props_initApiRequestAdaptor', '初始化接口发送适配器'),
    },
    {
      name: "initApiAdaptor",
      propType: "string",
      description: t('widgets-meta:steedos-record-service_props_initApiAdaptor', '初始化接口接收适配器'),
    },
  ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-record-service',
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
        body: [], // 容器类字段
        label: config.title,
        objectApiName: "${objectName}",
        recordId: "${recordId}"
      },
      regions: [
        {
          key: 'body',
          label: t('widgets-meta:steedos-record-service_regions_body', '内容区')
        }
      ],
      previewSchema: {
        type: config.amis.name,
        objectApiName: 'space_users'
      },
      panelTitle: t('widgets-meta:steedos-record-service_panelTitle', '设置'),
      panelControls: [
        {
          "type": "select",
          mode: 'horizontal',
          horizontal: {
            left: 4,
            right: 8,
            justify: true
          },
          "label": t('widgets-meta:steedos-record-service_props_objectApiName', '对象'),
          "name": "objectApiName",
          "searchable": true,
          "multiple": false,
          "source": {
            "method": "get",
            "url": "/service/api/amis-design/objects",
            "requestAdaptor": `
                api.url = Builder.settings.rootUrl  + api.url; 
                if(!api.headers){
                  api.headers = {}
                };
                api.headers.Authorization='Bearer ' + Builder.settings.tenantId + ',' + Builder.settings.authToken  ;
                return api;
            `,
            "adaptor": `
              let data = payload.data;
              payload.unshift({
                label: "${t('widgets-meta:steedos-record-service_props_objectApiName_currentObject', '当前对象')}",
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
          type: "input-text",
          name: "recordId",
          label: t('widgets-meta:steedos-record-service_props_recordId', '记录ID'),
          mode: 'horizontal',
          horizontal: {
            left: 4,
            right: 8,
            justify: true
          },
        },
        {
          type: "editor",
          name: "initApiRequestAdaptor",
          label: t('widgets-meta:steedos-record-service_props_initApiRequestAdaptor', '发送适配器'),
          language: "javascript",
          description: t('widgets-meta:steedos-record-service_props_tip_initApiRequestAdaptor', '函数签名：(api) => api， 数据在 api.data 中，修改后返回 api 对象。')
        },
        {
          type: "editor",
          name: "initApiAdaptor",
          label: t('widgets-meta:steedos-record-service_props_initApiAdaptor', '接收适配器'),
          language: "javascript",
          description: t('widgets-meta:steedos-record-service_props_tip_initApiAdaptor', '函数签名: (payload, response, api) => payload')
        }
      ]
    }
  }
};
