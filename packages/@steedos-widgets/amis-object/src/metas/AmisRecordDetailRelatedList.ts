/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-06-26 11:52:53
 * @Description: 
 */
const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: "华炎魔方",
  componentName: "AmisRecordDetailRelatedList",
  title: "相关表",
  description: "显示指定对象的相关某一个相关表。",
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
    },
    {
      name: "requestAdaptor",
      propType: "string",
      description: '发送适配器',
    },
    {
      name: "adaptor",
      propType: "string",
      description: '接收适配器',
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
        objectApiName: "accounts"
      },
      panelTitle: "设置",
      panelControls: [
        {
          "type": "tabs",
          tabsMode: 'line',
          className: 'editor-prop-config-tabs',
          linksClassName: 'editor-prop-config-tabs-links',
          contentClassName: 'no-border editor-prop-config-tabs-cont',
          tabs: [
            {
              "title": "属性",
              className: 'p-none',
              "body": [
                {
                  "type": "collapse-group",
                  expandIconPosition: 'right',
                  expandIcon: {
                    type: 'icon',
                    icon: 'chevron-right'
                  },
                  className: 'ae-formItemControl',
                  "activeKey": [
                    "1",
                  ],
                  "body": [
                    {
                      "type": "collapse",
                      headingClassName: 'ae-formItemControl-header',
                      bodyClassName: 'ae-formItemControl-body',
                      "key": "1",
                      "header": "基本属性",
                      body: [
                        {
                          "type": "select",
                          "label": "父级对象",
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
                          type: "input-text",
                          name: "recordId",
                          label: "父级记录"
                        },
                        {
                          "type": "select",
                          "label": "相关列表对象",
                          "name": "relatedObjectApiName",
                          "searchable": true,
                          "multiple": false,
                          "source": {
                            "method": "get",
                            "data": {
                              "objectName": "${objectName || 'space_users'}"
                            },
                            "url": "/service/api/amis-design/related_objects/${objectApiName}",
                            "requestAdaptor": "api.url = Builder.settings.rootUrl  + api.url.replaceAll('${objectName}',api.body.objectName); if(!api.headers){api.headers = {}};api.headers.Authorization='Bearer ' + Builder.settings.tenantId + ',' + Builder.settings.authToken  ;return api;",
                            "sendOn": "this.objectApiName"
                          },
                          "labelField": "label",
                          "valueField": "name",
                          "menuTpl": ""
                        },
                        {
                          "type": "input-number",
                          "name": "top",
                          "label": "显示的记录数量",
                          "labelRemark": "即TOP，配置该属性后不再支持翻页，始终显示该属性值配置的记录数"
                        },
                        {
                          "type": "input-number",
                          "name": "perPage",
                          "label": "每页显示记录数量",
                        },
                      ]
                    },
                    {
                      "type": "collapse",
                      headingClassName: 'ae-formItemControl-header',
                      bodyClassName: 'ae-formItemControl-body',
                      "key": "2",
                      "header": "数据接口",
                      "body": [
                        {
                          type: "editor",
                          name: "requestAdaptor",
                          label: "发送适配器",
                          language: "javascript",
                          description: "函数签名：(api) => api， 数据在 api.data 中，修改后返回 api 对象。"
                        },
                        {
                          type: "editor",
                          name: "adaptor",
                          label: "接收适配器",
                          language: "javascript",
                          description: "函数签名: (payload, response, api) => payload"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }
};
