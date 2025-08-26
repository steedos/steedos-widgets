/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-08-26 10:25:59
 * @Description: 
 */
const t = (window as any).steedosI18next.t;
const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: "华炎魔方",
  componentName: "AmisObjectForm",
  title: t('metas-amis-object:object_form_title'),//"对象表单",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "AmisObjectForm",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
    {
      name: "objectApiName",
      propType: "string",
      description: '对象名',
    },
    {
      name: "recordId",
      propType: "string",
      description: '记录ID',
    },
    {
      name: "mode",
      propType:  {
        "type": "oneOf",
        "value": [
          "read",
          "edit",
        ]
      },
      description: '显示状态',
    },
    {
      name: "enableInitApi",
      propType:  {
        "type": "oneOf",
        "value": [
          true,
          false,
        ]
      },
      description: '初始化接口',
    },
    {
      name: "layout",
      propType:  {
        "type": "oneOf",
        "value": [
          "vertical",
          "horizontal",
        ]
      },
      description: '表单布局',
    },
    {
      name: "initApiRequestAdaptor",
      propType: "string",
      description: '初始化接口发送适配器',
    },
    {
      name: "initApiAdaptor",
      propType: "string",
      description: '初始化接口接收适配器',
    },
    {
      name: "apiRequestAdaptor",
      propType: "string",
      description: '保存接口发送适配器',
    },
    {
      name: "apiAdaptor",
      propType: "string",
      description: '保存接口接收适配器',
    }
  ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-object-form',
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
        "mode": "edit",
        enableInitApi: false,
        className: ""
      },
      previewSchema: {
        type: config.amis.name,
        objectApiName: 'space_users'
      },
      panelTitle: "设置",
      panelControls: [
        {
          "type": "tabs",
          tabsMode: 'line',
          className: 'editor-prop-config-tabs',
          linksClassName: 'editor-prop-config-tabs-links',
          contentClassName: 'no-border editor-prop-config-tabs-cont',
          "tabs": [
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
                    "2"
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
                          mode: 'horizontal',
                          horizontal: {
                            left: 4,
                            right: 8,
                            justify: true
                          },
                          "label": "对象",
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
                          label: "记录ID",
                          mode: 'horizontal',
                          horizontal: {
                            left: 4,
                            right: 8,
                            justify: true
                          },
                        },
                        {
                          type: "button-group-select",
                          mode: 'horizontal',
                          horizontal: {
                            left: 4,
                            right: 8,
                            justify: true
                          },
                          name: "mode",
                          label: "显示状态",
                          value: "edit",
                          options: [
                            {
                              "label": "只读",
                              "value": "read"
                            },
                            {
                              "label": "编辑",
                              "value": "edit"
                            }
                          ]
                        },
                        {
                          type: "button-group-select",
                          name: "enableInitApi",
                          mode: 'horizontal',
                          horizontal: {
                            left: 4,
                            right: 8,
                            justify: true
                          },
                          label: "初始化接口",
                          value: false,
                          visibleOn: "${mode === 'read'}",
                          options: [
                            {
                              "label": "启用",
                              "value": true
                            },
                            {
                              "label": "禁用",
                              "value": false
                            }
                          ]
                        },
                        {
                          type: "button-group-select",
                          name: "layout",
                          mode: 'horizontal',
                          horizontal: {
                            left: 4,
                            right: 8,
                            justify: true
                          },
                          label: "表单项布局",
                          options: [
                            {
                              "label": "纵向",
                              "value": "normal"
                            },
                            {
                              "label": "横向",
                              "value": "horizontal"
                            },
                            // {
                            //   "label": "内联",
                            //   "value": "inline"
                            // }
                          ]
                        },
                        {
                          name: "enableTabs",
                          type: "checkbox",
                          mode: "horizontal",
                          horizontal: {
                            left: 10,
                            right: 4,
                            justify: true
                          },
                          label: "是否启用选项卡模式"
                        },
                        {
                          "type": "select",
                          mode: 'horizontal',
                          horizontal: {
                            left: 4,
                            right: 8,
                            justify: true
                          },
                          "label": "展示模式",
                          "name": "tabsMode",
                          "multiple": false,
                          value: "",
                          "options":[
                            {
                              "label":"默认",
                              "value":""
                            },
                            {
                              "label":"线型",
                              "value":"line"
                            },
                            {
                              "label":"卡片",
                              "value":"card"
                            },
                            {
                              "label":"选择器",
                              "value":"radio"
                            },
                            {
                              "label":"垂直",
                              "value":"vertical"
                            },
                            {
                              "label":"仿 Chrome",
                              "value":"chrome"
                            },
                            {
                              "label":"简约",
                              "value":"simple"
                            },
                            {
                              "label":"加强",
                              "value":"strong"
                            },
                            {
                              "label":"水平铺满",
                              "value":"tiled"
                            },
                            {
                              "label":"侧边栏",
                              "value":"sidebar"
                            }
                          ],
                          "labelField": "label",
                          "valueField": "value",
                          "visibleOn": "${enableTabs}"
                        }
                        /*
                        {
                          type: "button-group-select",
                          name: "labelAlign",
                          label: "表单项标签对齐方式",
                          hiddenOn: "this.layout !== 'horizontal'",
                          options: [
                            {
                              "label": "左",
                              "value": "left"
                            },
                            {
                              "label": "右",
                              "value": "right"
                            }
                          ]
                        },
                        */
                        
                      ]
                    },
                    {
                      "type": "collapse",
                      headingClassName: 'ae-formItemControl-header',
                      bodyClassName: 'ae-formItemControl-body',
                      "key": "2",
                      "header": "字段",
                      "body": [
                        
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
                          type: "transfer-picker",
                          name: "excludedFields",
                          label: "排除的字段",
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
                          "pipeIn": (value, data) => {
                            if(value){
                              return value;
                            }
                            return "";
                          },
                          "pipeOut": (value, data) => {
                            if(value){
                              const v = JSON.parse(value);
                              if(JSON.stringify(v) === '{}'){
                                return ""
                              }else{
                                return v;
                              }
                            }
                            return "";
                          },
                          language: "json",
                          // visibleOn: "this.fieldsControl === 'included'"
                        },
                        {
                          type: "markdown",
                          value: '重写字段配置. 例如\n```\n{\n    "name": {\n        "is_wide": true,  //设置为宽字段\n        "required": true, //设置为必填\n        "amis": { // 设置渲染属性\n            "type": "input-color" //将字段重写为 颜色选择器\n            ...\n        } \n    }, \n    "title": {\n        "group": "分组1" // 设置分组\n        ...\n    }\n}\n```'
                        }
                      ]
                    },
                    {
                      "type": "collapse",
                      headingClassName: 'ae-formItemControl-header',
                      bodyClassName: 'ae-formItemControl-body',
                      "key": "4",
                      "header": "高级",
                      "body": [
                        {
                          type: "editor",
                          name: "defaultData",
                          label: "初始化静态数据",
                          "options": {
                            "lineNumbers": "off"
                          },
                          language: "json",
                        },
                        {
                          type: "editor",
                          name: "formDataFilter",
                          label: "FORM",
                          description: ""
                        },
                        {
                          "type": "markdown",
                          "value": "如果需要对组件原始返回的form进行加工，可以自己写一段函数脚本来实现。\n\n函数签名：(form, env, data) => form\n\n参数说明：\n\nform 组件原始返回的form schema\n\nenv amis env，可以调用env.fetcher函数实现异步请求\n\ndata 数据域中的data\n\n返回值：\n\n最后需要返回加工后的form schema\n\n示例：\n\n```\nconsole.log('data===>', data);\nconst api = ...;\nreturn env.fetcher(api, {}).then((result) => {\n  console.log(result);\n  form.body[0].tabs[0].title='基础信息';\n  return form;\n});\n\n```\n",
                          "className": "text-gray-500"
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
                      "key": "5",
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
                          label: "表单",
                          value: "mb-4"
                        }
                      ]
                    },
                  ]
                }
              ]
            },
            {
              "title": "接口",
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
                    "2"
                  ],
                  "body": [
                    {
                      "type": "collapse",
                      headingClassName: 'ae-formItemControl-header',
                      bodyClassName: 'ae-formItemControl-body',
                      "key": "3",
                      "header": "初始化数据接口",
                      "body": [
                        {
                          type: "editor",
                          name: "initApiRequestAdaptor",
                          label: "发送适配器",
                          language: "javascript",
                          description: "函数签名：(api) => api， 数据在 api.data 中，修改后返回 api 对象。"
                        },
                        {
                          type: "editor",
                          name: "initApiAdaptor",
                          label: "接收适配器",
                          language: "javascript",
                          description: "函数签名: (payload, response, api) => payload"
                        }
                      ]
                    },
                    {
                      "type": "collapse",
                      headingClassName: 'ae-formItemControl-header',
                      bodyClassName: 'ae-formItemControl-body',
                      "key": "4",
                      "header": "保存数据接口",
                      "visibleOn": "${mode == 'edit'}",
                      "body": [
                        {
                          type: "editor",
                          name: "apiRequestAdaptor",
                          label: "发送适配器",
                          language: "javascript",
                          description: "函数签名：(api) => api， 数据在 api.data 中，修改后返回 api 对象。"
                        },
                        {
                          type: "editor",
                          name: "apiAdaptor",
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
