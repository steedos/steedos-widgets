/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: liaodaxue
 * @LastEditTime: 2023-11-27 15:19:03
 * @Description: 
 */
const t = (window as any).steedosI18next.t;

const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: t('widgets-meta:steedos-object-table_group', '华炎魔方'),
  componentName: "AmisObjectTable",
  title: t('widgets-meta:steedos-object-table_title', '对象表格'),
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
      description: t('widgets-meta:steedos-object-table_props_objectApiName', '对象名称'),
    },
    {
      name: "columns",
      propType: "array",
      description: t('widgets-meta:steedos-object-table_props_columns', '显示列'),
    },
    {
      name: "amisCondition",
      propType: "object",
      description: t('widgets-meta:steedos-object-table_props_amisCondition', '过滤条件'),
    },
    {
      name: "sortField",
      propType: "string",
      description: t('widgets-meta:steedos-object-table_props_sortField', '排序字段'),
    },
    {
      name: "sortOrder",
      propType: "string",
      description: t('widgets-meta:steedos-object-table_props_sortOrder', '排序顺序'),
    },
    {
      name: "top",
      propType: "number",
      description: t('widgets-meta:steedos-object-table_props_top', '显示的记录数量'),
    },
    {
      name: "requestAdaptor",
      propType: "string",
      description: t('widgets-meta:steedos-object-table_props_requestAdaptor', '发送适配器'),
    },
    {
      name: "adaptor",
      propType: "string",
      description: t('widgets-meta:steedos-object-table_props_adaptor', '接收适配器'),
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
        // className: "sm:border sm:rounded sm:border-gray-300"
      },
      previewSchema: {
        type: config.amis.name,
        objectApiName: 'space_users',
        fields: [ "name"]
      },
      panelTitle: t('widgets-meta:steedos-object-table_panelTitle', '设置'),
      panelControls: [
        {
          "type": "tabs",
          tabsMode: 'line',
          className: 'editor-prop-config-tabs',
          linksClassName: 'editor-prop-config-tabs-links',
          contentClassName: 'no-border editor-prop-config-tabs-cont',
          tabs: [
            {
              "title": t('widgets-meta:steedos-object-table_tabs_props', '属性'),
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
                      "header": t('widgets-meta:steedos-object-table_collapse_basic', '基本'),
                      "body": [
                        {
                          "type": "select",
                          "label": t('widgets-meta:steedos-object-table_object', '对象'),
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
                                label: "${t('widgets-meta:steedos-object-table_currentObject', '当前对象')}",
                                name: "\${objectName}",
                                NAME_FIELD_KEY: "name"
                              });
                              return payload;
                            `
                          },
                          "labelField": "label",
                          "valueField": "name",
                          "menuTpl": "",
                          "onEvent": {
                            "change": {
                              "actions": [
                                {
                                  "componentId": "transfer-picker-fields",
                                  "actionType": "setValue",
                                  "args": {
                                    "value": "${(NAME_FIELD_KEY || 'name')|asArray}"
                                  }
                                }
                              ]
                            }
                          }
                        },
                        {
                          type: "transfer-picker",
                          name: "fields",
                          label: t('widgets-meta:steedos-object-table_fields', '显示的字段'),
                          id: "transfer-picker-fields",
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
                          label: t('widgets-meta:steedos-object-table_fieldsExtend', '重写字段配置'),
                          "options": {
                            "lineNumbers": "off"
                          },
                          language: "json",
                        },
                        {
                          type: "button-group-select",
                          name: "crudMode",
                          label: t('widgets-meta:steedos-object-table_crudMode', '显示模式'),
                          value: "table",
                          options: [
                            {
                              "label": t('widgets-meta:steedos-object-table_crudMode_table', '表格'),
                              "value": "table"
                            },
                            {
                              "label": t('widgets-meta:steedos-object-table_crudMode_cards', '卡片'),
                              "value": "cards"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "collapse",
                      headingClassName: 'ae-formItemControl-header',
                      bodyClassName: 'ae-formItemControl-body',
                      "key": "2",
                      "header": t('widgets-meta:steedos-object-table_collapse_api', '数据接口'),
                      "body": [
                        {
                          type: "editor",
                          name: "requestAdaptor",
                          label: t('widgets-meta:steedos-object-table_requestAdaptor', '发送适配器'),
                          language: "javascript",
                          description: t('widgets-meta:steedos-object-table_requestAdaptor_desc', '函数签名：(api) => api， 数据在 api.data 中，修改后返回 api 对象。')
                        },
                        {
                          type: "editor",
                          name: "adaptor",
                          label: t('widgets-meta:steedos-object-table_adaptor', '接收适配器'),
                          language: "javascript",
                          description: t('widgets-meta:steedos-object-table_adaptor_desc', '函数签名: (payload, response, api) => payload')
                        }
                      ]
                    },
                    {
                      "type": "collapse",
                      headingClassName: 'ae-formItemControl-header',
                      bodyClassName: 'ae-formItemControl-body',
                      "key": "3",
                      "header": t('widgets-meta:steedos-object-table_collapse_advanced', '高级'),
                      "body": [
                        {
                          type: "editor",
                          name: "crudDataFilter",
                          label: "CRUD",
                          description: ""
                        },
                        {
                          "type": "markdown",
                          "value": t('widgets-meta:steedos-object-table_markdown_crud', "如果需要对组件原始返回的crud进行加工，可以自己写一段函数脚本来实现。\n\n函数签名：(crud, env, data) => crud\n\n参数说明：\n\ncrud 组件原始返回的crud schema\n\nenv amis env，可以调用env.fetcher函数实现异步请求\n\ndata 数据域中的data\n\n返回值：\n\n最后需要返回加工后的crud schema\n\n示例：\n\n```\nconsole.log('data===>', data);\nconst api = ...;\nreturn env.fetcher(api, {}).then((result) => {\n  console.log(result);\n  crud.columns.push({'label': 'xxx', name: 'xxx'});\n  return crud;\n});\n\n```\n"),
                          "className": "text-gray-500"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "title": t('widgets-meta:steedos-object-table_tabs_appearance', '外观'),
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
                      "header": t('widgets-meta:steedos-object-table_collapse_css', 'CSS 类名'),
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
                          label: t('widgets-meta:steedos-object-table_css_table', '表格'),
                          value: "my-2"
                        }
                      ]
                    },
                  ]
                }
              ]
            },
            {
              "title": t('widgets-meta:steedos-object-table_tabs_filter', '过滤'),
              className: '',
              "body": [
                {
                  "type": "condition-builder",
                  "name": "amisCondition",
                  "label": t('widgets-meta:steedos-object-table_filter_condition', '过滤条件'),
                  "source": {
                    "method": "get",
                    "url": "/service/api/amis-metadata-listviews/getFilterFields?objectName=${objectApiName === '${objectName}' ? 'space_users' : objectApiName}",
                    "requestAdaptor": "api.url = Builder.settings.rootUrl  + api.url; if(!api.headers){api.headers = {}};api.headers.Authorization='Bearer ' + Builder.settings.tenantId + ',' + Builder.settings.authToken  ;return api;",
                    "dataType": "json"
                  }
                }
              ]
            },
            {
              "title": t('widgets-meta:steedos-object-table_tabs_other', '其他'),
              className: '',
              "body": [
                {
                  "type": "select",
                  "label": t('widgets-meta:steedos-object-table_sortField', '排序字段'),
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
                  "label": t('widgets-meta:steedos-object-table_sortOrder', '排序顺序'),
                  "options": [{
                    "label": t('widgets-meta:steedos-object-table_sortOrder_asc', '升序'),
                    "value": "asc"
                  },{
                    "label": t('widgets-meta:steedos-object-table_sortOrder_desc', '倒序'),
                    "value": "desc"
                  }]
                },
                {
                  "type": "input-number",
                  "name": "top",
                  "label": t('widgets-meta:steedos-object-table_top', '显示的记录数量'),
                  "labelRemark": t('widgets-meta:steedos-object-table_top_remark', '即TOP，配置该属性后不再支持翻页，始终显示该属性值配置的记录数')
                }
              ]
            }
          ]
        }
      ]
    }
  }
};
