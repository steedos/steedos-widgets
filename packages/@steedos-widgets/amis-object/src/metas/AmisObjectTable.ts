/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-06-20 10:55:46
 * @Description: 
 */
const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: "华炎魔方",
  componentName: "AmisObjectTable",
  title: "对象表格",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "AmisObjectTable",
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
      name: "columns",
      propType: "array",
      description: '显示列',
    },
    {
      name: "amisCondition",
      propType: "object",
      description: '过滤条件',
    },
    {
      name: "sortField",
      propType: "string",
      description: '排序字段',
    },
    {
      name: "sortOrder",
      propType: "string",
      description: '排序顺序',
    },
    {
      name: "top",
      propType: "number",
      description: '显示的记录数量',
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
    name: 'steedos-object-table',
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
        fields: [ "name"],
        className: "sm:border sm:shadow sm:rounded sm:border-gray-300"
      },
      previewSchema: {
        type: config.amis.name,
        objectApiName: 'space_users',
        fields: [ "name"]
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
                      "header": "基本",
                      "body": [
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
                          type: "transfer-picker",
                          name: "fields",
                          label: "显示的字段",
                          // mode: 'horizontal',
                          // horizontal: {
                          //   left: 4,
                          //   right: 8,
                          //   justify: true
                          // },
                          // visibleOn: "this.fieldsControl === 'excluded'",
                          "options": [],
                          "multiple": true,
                          "source": {
                              "method": "get",
                              "url": "${context.rootUrl}/service/api/amis-metadata-objects/objects/${objectApiName}/fields/options",
                              "headers": {
                                  "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                              },
                              "data": {
                                "objectName": "${objectName || 'space_users'}"
                              },
                              "requestAdaptor": "api.url = api.url.replaceAll('${objectName}',api.body.objectName); return api;",
                              "adaptor": "",
                              "sendOn": "this.objectApiName"
                          },
                          "className": "col-span-2 m-0",
                          "checkAll": true,
                          "searchable": true,
                          "sortable": true,
                          "joinValues": false,
                          "extractValue": true,
                        },
                        {
                          type: "editor",
                          name: "fieldsExtend",
                          label: "重写字段配置",
                          "options": {
                            "lineNumbers": "off"
                          },
                          // mode: 'horizontal',
                          // horizontal: {
                          //   left: 4,
                          //   right: 8,
                          //   justify: true
                          // },
                          language: "json",
                          // visibleOn: "this.fieldsControl === 'included'"
                        }
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
            },
            {
              "title": "外观",
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
                    "1"
                  ],
                  "body": [
                    {
                      "type": "collapse",
                      headingClassName: 'ae-formItemControl-header',
                      bodyClassName: 'ae-formItemControl-body',
                      "key": "1",
                      "header": "CSS 类名",
                      "body": [
                        {
                          type: "input-text",
                          name: "className",
                          mode: 'horizontal',
                          horizontal: {
                            left: 4,
                            right: 8,
                            justify: true
                          },
                          label: "表格",
                          value: "my-2"
                        }
                      ]
                    },
                  ]
                }
              ]
            },
            {
              "title": "过滤",
              className: '',
              "body": [
                {
                  "type": "condition-builder",
                  "name": "amisCondition",
                  "label": "过滤条件",
                  "source": {
                    "method": "get",
                    "url": "/service/api/amis-metadata-listviews/getFilterFields?objectName=${objectApiName === '${objectName}' ? 'space_users' : objectApiName}",
                    "requestAdaptor": "api.url = Builder.settings.rootUrl  + api.url; if(!api.headers){api.headers = {}};api.headers.Authorization='Bearer ' + Builder.settings.tenantId + ',' + Builder.settings.authToken  ;return api;",
                    "dataType": "json"
                  },
                  "en-US": {
                    "label": "Filters Conditions"
                  }
                }
              ]
            },
            {
              "title": "其他",
              className: '',
              "body": [
                {
                  "type": "select",
                  "label": "排序字段",
                  "name": "sortField",
                  "searchable": true,
                  "multiple": false,
                  "source": {
                    "method": "get",
                    "data": {
                      "objectName": "${objectName || 'space_users'}",
                    },
                    "sendOn": "this.objectApiName",
                    "url": "/service/api/amis-metadata-objects/objects/${objectApiName}/fields/options",
                    "requestAdaptor": "api.url = Builder.settings.rootUrl  + api.url.replaceAll('${objectName}',api.body.objectName); if(!api.headers){api.headers = {}};api.headers.Authorization='Bearer ' + Builder.settings.tenantId + ',' + Builder.settings.authToken  ;return api;"
                  },
                  "labelField": "label",
                  "valueField": "value",
                  "menuTpl": ""
                },
                {
                  "type": "select",
                  "name": "sortOrder",
                  "label": "排序顺序",
                  "options": [{
                    "label": "升级",
                    "value": "asc"
                  },{
                    "label": "倒序",
                    "value": "desc"
                  }]
                },
                {
                  "type": "input-number",
                  "name": "top",
                  "label": "显示的记录数量",
                  "labelRemark": "即TOP，配置该属性后不再支持翻页，始终显示该属性值配置的记录数"
                }
              ]
            }
          ]
        }
      ]
    }
  }
};
