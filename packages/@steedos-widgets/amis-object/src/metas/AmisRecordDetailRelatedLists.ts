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
  group: t('widgets-meta:steedos-object-related-lists_group', '华炎魔方'),
  componentName: "AmisRecordDetailRelatedLists",
  title: t('widgets-meta:steedos-object-related-lists_title', '所有相关表'),
  description: t('widgets-meta:steedos-object-related-lists_description', '显示指定对象的相关表，可基于页面布局配置相关表清单。'),
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "AmisRecordDetailRelatedLists",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
    {
      name: "objectApiName",
      propType: "string",
      description: t('widgets-meta:steedos-object-related-lists_props_objectApiName', '父级对象'),
    },
    {
      name: "recordId",
      propType: "string",
      description: t('widgets-meta:steedos-object-related-lists_props_recordId', '父级记录'),
    }
  ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-object-related-lists',
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
        recordId: "${recordId}",
      },
      previewSchema: {
        type: config.amis.name,
        objectApiName: "accounts",
      },
      panelTitle: t('widgets-meta:steedos-object-related-lists_panelTitle', '设置'),
      panelControls: [
        {
          "type": "select",
          "label": t('widgets-meta:steedos-object-related-lists_panelControls_objectApiName', '父级对象'),
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
                label: "${t('widgets-meta:steedos-object-related-lists_currentObject', '当前对象')}",
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
          label: t('widgets-meta:steedos-object-related-lists_panelControls_recordId', '父级记录')
        }
      ]
    }
  }
};
