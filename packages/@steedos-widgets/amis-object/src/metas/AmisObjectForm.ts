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
  group: t('widgets-meta:steedos-object-form_group', '华炎魔方'),
  componentName: "AmisObjectForm",
  title: t('widgets-meta:steedos-object-form_title', '对象表单'),
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
      description: t('widgets-meta:steedos-object-form_props_objectApiName', '对象名'),
    },
    {
      name: "recordId",
      propType: "string",
      description: t('widgets-meta:steedos-object-form_props_recordId', '记录ID'),
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
      description: t('widgets-meta:steedos-object-form_props_mode', '显示状态'),
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
      description: t('widgets-meta:steedos-object-form_props_enableInitApi', '初始化接口'),
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
      description: t('widgets-meta:steedos-object-form_props_layout', '表单布局'),
    },
    {
      name: "initApiRequestAdaptor",
      propType: "string",
      description: t('widgets-meta:steedos-object-form_props_initApiRequestAdaptor', '初始化接口发送适配器'),
    },
    {
      name: "initApiAdaptor",
      propType: "string",
      description: t('widgets-meta:steedos-object-form_props_initApiAdaptor', '初始化接口接收适配器'),
    },
    {
      name: "apiRequestAdaptor",
      propType: "string",
      description: t('widgets-meta:steedos-object-form_props_apiRequestAdaptor', '保存接口发送适配器'),
    },
    {
      name: "apiAdaptor",
      propType: "string",
      description: t('widgets-meta:steedos-object-form_props_apiAdaptor', '保存接口接收适配器'),
    }
  ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
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
      panelTitle: t('widgets-meta:steedos-object-form_panelTitle', '设置'),
      panelControls: [
        {
          "type": "tabs",
          tabsMode: 'line',
          className: 'editor-prop-config-tabs',
          linksClassName: 'editor-prop-config-tabs-links',
          contentClassName: 'no-border editor-prop-config-tabs-cont',
          "tabs": [
            {
              "title": t('widgets-meta:steedos-object-form_tab_props', '属性'),
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
                      "header": t('widgets-meta:steedos-object-form_section_basic', '基本'),
                      "body": [
                        {
                          "type": "select",
                          mode: 'horizontal',
                          horizontal: {
                            left: 4,
                            right: 8,
                            justify: true
                          },
                          "label": t('widgets-meta:steedos-object-form_field_objectApiName', '对象'),
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
                                label: "${t('widgets-meta:steedos-object-form_field_currentObject', '当前对象')}",
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
                          label: t('widgets-meta:steedos-object-form_field_recordId', '记录ID'),
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
                          label: t('widgets-meta:steedos-object-form_field_mode', '显示状态'),
                          value: "edit",
                          options: [
                            {
                              "label": t('widgets-meta:steedos-object-form_field_mode_read', '只读'),
                              "value": "read"
                            },
                            {
                              "label": t('widgets-meta:steedos-object-form_field_mode_edit', '编辑'),
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
                          label: t('widgets-meta:steedos-object-form_field_enableInitApi', '初始化接口'),
                          value: false,
                          visibleOn: "${mode === 'read'}",
                          options: [
                            {
                              "label": t('widgets-meta:steedos-object-form_field_enable', '启用'),
                              "value": true
                            },
                            {
                              "label": t('widgets-meta:steedos-object-form_field_disable', '禁用'),
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
                          label: t('widgets-meta:steedos-object-form_field_layout', '表单项布局'),
                          options: [
                            {
                              "label": t('widgets-meta:steedos-object-form_field_layout_vertical', '纵向'),
                              "value": "normal"
                            },
                            {
                              "label": t('widgets-meta:steedos-object-form_field_layout_horizontal', '横向'),
                              "value": "horizontal"
                            }
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
                          label: t('widgets-meta:steedos-object-form_field_enableTabs', '是否启用选项卡模式')
                        },
                        {
                          "type": "select",
                          mode: 'horizontal',
                          horizontal: {
                            left: 4,
                            right: 8,
                            justify: true
                          },
                          "label": t('widgets-meta:steedos-object-form_field_tabsMode', '展示模式'),
                          "name": "tabsMode",
                          "multiple": false,
                          value: "",
                          "options":[
                            { "label": t('widgets-meta:steedos-object-form_tabsMode_default', '默认'), "value": "" },
                            { "label": t('widgets-meta:steedos-object-form_tabsMode_line', '线型'), "value": "line" },
                            { "label": t('widgets-meta:steedos-object-form_tabsMode_card', '卡片'), "value": "card" },
                            { "label": t('widgets-meta:steedos-object-form_tabsMode_radio', '选择器'), "value": "radio" },
                            { "label": t('widgets-meta:steedos-object-form_tabsMode_vertical', '垂直'), "value": "vertical" },
                            { "label": t('widgets-meta:steedos-object-form_tabsMode_chrome', '仿 Chrome'), "value": "chrome" },
                            { "label": t('widgets-meta:steedos-object-form_tabsMode_simple', '简约'), "value": "simple" },
                            { "label": t('widgets-meta:steedos-object-form_tabsMode_strong', '加强'), "value": "strong" },
                            { "label": t('widgets-meta:steedos-object-form_tabsMode_tiled', '水平铺满'), "value": "tiled" },
                            { "label": t('widgets-meta:steedos-object-form_tabsMode_sidebar', '侧边栏'), "value": "sidebar" }
                          ],
                          "labelField": "label",
                          "valueField": "value",
                          "visibleOn": "${enableTabs}"
                        }
                      ]
                    },
                    {
                      "type": "collapse",
                      headingClassName: 'ae-formItemControl-header',
                      bodyClassName: 'ae-formItemControl-body',
                      "key": "2",
                      "header": t('widgets-meta:steedos-object-form_section_fields', '字段'),
                      "body": [
                        {
                          type: "transfer-picker",
                          name: "fields",
                          label: t('widgets-meta:steedos-object-form_field_fields', '显示的字段'),
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
                          label: t('widgets-meta:steedos-object-form_field_excludedFields', '排除的字段'),
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
                          label: t('widgets-meta:steedos-object-form_field_fieldsExtend', '重写字段配置'),
                          "options": {
                            "lineNumbers": "off"
                          },
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
                        },
                        {
                          type: "markdown",
                          value: t('widgets-meta:steedos-object-form_tip_fieldsExtend', '重写字段配置. 例如\n```\n{\n    "name": {\n        "is_wide": true,  //设置为宽字段\n        "required": true, //设置为必填\n        "amis": { // 设置渲染属性\n            "type": "input-color" //将字段重写为 颜色选择器\n            ...\n        } \n    }, \n    "title": {\n        "group": "分组1" // 设置分组\n        ...\n    }\n}\n```')
                        }
                      ]
                    },
                    {
                      "type": "collapse",
                      headingClassName: 'ae-formItemControl-header',
                      bodyClassName: 'ae-formItemControl-body',
                      "key": "4",
                      "header": t('widgets-meta:steedos-object-form_section_advanced', '高级'),
                      "body": [
                        {
                          type: "editor",
                          name: "defaultData",
                          label: t('widgets-meta:steedos-object-form_field_defaultData', '初始化静态数据'),
                          "options": {
                            "lineNumbers": "off"
                          },
                          language: "json",
                        },
                        {
                          type: "editor",
                          name: "formDataFilter",
                          label: t('widgets-meta:steedos-object-form_field_formDataFilter', 'FORM'),
                          description: ""
                        },
                        {
                          "type": "markdown",
                          "value": t('widgets-meta:steedos-object-form_tip_formDataFilter', '如果需要对组件原始返回的form进行加工，可以自己写一段函数脚本来实现。\n\n函数签名：(form, env, data) => form\n\n参数说明：\n\nform 组件原始返回的form schema\n\nenv amis env，可以调用env.fetcher函数实现异步请求\n\ndata 数据域中的data\n\n返回值：\n\n最后需要返回加工后的form schema\n\n示例：\n\n```\nconsole.log(\'data===>\', data);\nconst api = ...;\nreturn env.fetcher(api, {}).then((result) => {\n  console.log(result);\n  form.body[0].tabs[0].title=\'基础信息\';\n  return form;\n});\n\n```\n'),
                          "className": "text-gray-500"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "title": t('widgets-meta:steedos-object-form_tab_appearance', '外观'),
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
                      "header": t('widgets-meta:steedos-object-form_section_css', 'CSS 类名'),
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
                          label: t('widgets-meta:steedos-object-form_field_className', '表单'),
                          value: "mb-4"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "title": t('widgets-meta:steedos-object-form_tab_api', '接口'),
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
                      "header": t('widgets-meta:steedos-object-form_section_initApi', '初始化数据接口'),
                      "body": [
                        {
                          type: "editor",
                          name: "initApiRequestAdaptor",
                          label: t('widgets-meta:steedos-object-form_field_initApiRequestAdaptor', '发送适配器'),
                          language: "javascript",
                          description: t('widgets-meta:steedos-object-form_tip_initApiRequestAdaptor', '函数签名：(api) => api， 数据在 api.data 中，修改后返回 api 对象。')
                        },
                        {
                          type: "editor",
                          name: "initApiAdaptor",
                          label: t('widgets-meta:steedos-object-form_field_initApiAdaptor', '接收适配器'),
                          language: "javascript",
                          description: t('widgets-meta:steedos-object-form_tip_initApiAdaptor', '函数签名: (payload, response, api) => payload')
                        }
                      ]
                    },
                    {
                      "type": "collapse",
                      headingClassName: 'ae-formItemControl-header',
                      bodyClassName: 'ae-formItemControl-body',
                      "key": "4",
                      "header": t('widgets-meta:steedos-object-form_section_saveApi', '保存数据接口'),
                      "visibleOn": "${mode == 'edit'}",
                      "body": [
                        {
                          type: "editor",
                          name: "apiRequestAdaptor",
                          label: t('widgets-meta:steedos-object-form_field_apiRequestAdaptor', '发送适配器'),
                          language: "javascript",
                          description: t('widgets-meta:steedos-object-form_tip_apiRequestAdaptor', '函数签名：(api) => api， 数据在 api.data 中，修改后返回 api 对象。')
                        },
                        {
                          type: "editor",
                          name: "apiAdaptor",
                          label: t('widgets-meta:steedos-object-form_field_apiAdaptor', '接收适配器'),
                          language: "javascript",
                          description: t('widgets-meta:steedos-object-form_tip_apiAdaptor', '函数签名: (payload, response, api) => payload')
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

