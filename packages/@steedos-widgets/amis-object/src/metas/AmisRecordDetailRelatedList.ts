/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-15 10:40:37
 * @Description: 
 */
const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: "华炎魔方",
  componentName: "AmisRecordDetailRelatedList",
  title: "相关列表",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "AmisRecordDetailRelatedList",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
    {
      name: "objectApiName",
      propType: "string",
      description: '父级对象',
    },
    {
      name: "recordId",
      propType: "string",
      description: '父级记录',
    },
    {
      name: "relatedObjectApiName",
      propType: "string",
      description: '相关列表对象',
    }
  ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-object-related-listview',
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
        recordId: "${recordId}",
        // relatedObjectApiName: "contacts"
      },
      previewSchema: {
        type: config.amis.name,
        objectApiName: "accounts",
        // relatedObjectApiName: "contacts"
      },
      panelTitle: "设置",
      panelControls: [
        {
          "type": "select",
          "label": "父级对象",
          "name": "objectApiName",
          "searchable": true,
          "multiple": false,
          "source": {
            "method": "get",
            "url": "/service/api/amis-design/objects",
            "requestAdaptor": "console.log('api', api);api.url = Builder.settings.rootUrl  + api.url; if(!api.headers){api.headers = {}};api.headers.Authorization='Bearer ' + Builder.settings.tenantId + ',' + Builder.settings.authToken  ;return api;",
            "adaptor": `
              let data = payload.data;
              payload.unshift({
                label: "\${objectName}",
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
          label: "父级记录"
        },
        {
          "type": "text",
          "label": "相关列表对象",
          "name": "relatedObjectApiName",
          // "searchable": true,
          // "multiple": false,
          // "source": {
          //   "method": "get",
          //   "url": "/service/api/amis-design/related_objects/${objectApiName}",
          //   "requestAdaptor": "console.log('xiang==>',api); api.url = Builder.settings.rootUrl  + api.url; if(!api.headers){api.headers = {}};api.headers.Authorization='Bearer ' + Builder.settings.tenantId + ',' + Builder.settings.authToken  ;return api;",
          //   "sendOn": "this.objectApiName"
          // },
          // "labelField": "label",
          // "valueField": "name",
          // "menuTpl": ""
        }
      ]
    }
  }
};
