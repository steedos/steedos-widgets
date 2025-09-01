/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-07 17:41:41
 * @Description: 
 */
const t = (window as any).steedosI18next.t;

const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: t('widgets-meta:steedos-object-related-listview_group', 'Steedos'),
  componentName: "AmisRecordDetailRelatedList",
  title: t('widgets-meta:steedos-object-related-listview_title', '相关表'),
  description: t('widgets-meta:steedos-object-related-listview_description', '显示指定对象的相关某一个相关表。'),
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
      description: t('widgets-meta:steedos-object-related-listview_props_objectApiName', '父级对象'),
    },
    {
      name: "recordId",
      propType: "string",
      description: t('widgets-meta:steedos-object-related-listview_props_recordId', '父级记录'),
    },
    {
      name: "relatedObjectApiName",
      propType: "string",
      description: t('widgets-meta:steedos-object-related-listview_props_relatedObjectApiName', '相关列表对象'),
    },
    {
      name: "requestAdaptor",
      propType: "string",
      description: t('widgets-meta:steedos-object-related-listview_props_requestAdaptor', '发送适配器'),
    },
    {
      name: "adaptor",
      propType: "string",
      description: t('widgets-meta:steedos-object-related-listview_props_adaptor', '接收适配器'),
    }
  ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
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
      panelTitle: t('widgets-meta:steedos-object-related-listview_panelTitle', '设置'),
      panelControls: [
        {
          "type": "tabs",
          tabsMode: 'line',
          className: 'editor-prop-config-tabs',
          linksClassName: 'editor-prop-config-tabs-links',
          contentClassName: 'no-border editor-prop-config-tabs-cont',
          tabs: [
            {
              "title": t('widgets-meta:steedos-object-related-listview_tabs_props', '属性'),
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
                  "activeKey": ["1"],
                  "body": [
                    {
                      "type": "collapse",
                      headingClassName: 'ae-formItemControl-header',
                      bodyClassName: 'ae-formItemControl-body',
                      "key": "1",
                      "header": t('widgets-meta:steedos-object-related-listview_collapse_basic', '基本属性'),
                      body: [
                        {
                          "type": "select",
                          "label": t('widgets-meta:steedos-object-related-listview_objectApiName', '父级对象'),
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
                                label: "${t('widgets-meta:steedos-object-related-listview_currentObject', '当前对象')}",
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
                          label: t('widgets-meta:steedos-object-related-listview_recordId', '父级记录')
                        },
                        {
                          "type": "select",
                          "label": t('widgets-meta:steedos-object-related-listview_relatedObjectApiName', '相关列表对象'),
                          "name": "relatedObjectApiName",
                          "searchable": true,
                          "multiple": false,
                          "source": {
                            "method": "get",
                            "data": { "objectName": "${objectName || 'space_users'}" },
                            "url": "/service/api/amis-design/related_objects/${objectApiName}",
                            "requestAdaptor": "api.url = Builder.settings.rootUrl  + api.url.replaceAll('${objectName}',api.body.objectName); if(!api.headers){api.headers = {}};api.headers.Authorization='Bearer ' + Builder.settings.tenantId + ',' + Builder.settings.authToken  ;return api;",
                            "sendOn": "this.objectApiName"
                          },
                          "labelField": "label",
                          "valueField": "name",
                          "menuTpl": ""
                        },
                        {
                          "type": "checkbox",
                          "name": "enableHeaderToolbar",
                          "label": t('widgets-meta:steedos-object-related-listview_enableHeaderToolbar', '显示表头工具栏')
                        },
                        {
                          "type": "input-number",
                          "name": "top",
                          "label": t('widgets-meta:steedos-object-related-listview_top', '显示的记录数量'),
                          "labelRemark": t('widgets-meta:steedos-object-related-listview_top_remark', '即TOP，配置该属性后不再支持翻页，始终显示该属性值配置的记录数')
                        },
                        {
                          "type": "input-number",
                          "name": "perPage",
                          "label": t('widgets-meta:steedos-object-related-listview_perPage', '每页显示记录数量'),
                        },
                        {
                          "type": "textarea",
                          "name": "visibleOn",
                          "label": t('widgets-meta:steedos-object-related-listview_visibleOn', '显示条件'),
                          "labelRemark": t('widgets-meta:steedos-object-related-listview_visibleOn_remark', '格式：静态/表达式')
                        },
                        {
                          type: "input-text",
                          name: "className",
                          label: t('widgets-meta:steedos-object-related-listview_className', 'CSS类名')
                        }
                      ]
                    },
                    {
                      "type": "collapse",
                      headingClassName: 'ae-formItemControl-header',
                      bodyClassName: 'ae-formItemControl-body',
                      "key": "2",
                      "header": t('widgets-meta:steedos-object-related-listview_collapse_api', '数据接口'),
                      "body": [
                        {
                          type: "editor",
                          name: "requestAdaptor",
                          label: t('widgets-meta:steedos-object-related-listview_requestAdaptor', '发送适配器'),
                          language: "javascript",
                          description: t('widgets-meta:steedos-object-related-listview_requestAdaptor_desc', '函数签名：(api) => api， 数据在 api.data 中，修改后返回 api 对象。')
                        },
                        {
                          type: "editor",
                          name: "adaptor",
                          label: t('widgets-meta:steedos-object-related-listview_adaptor', '接收适配器'),
                          language: "javascript",
                          description: t('widgets-meta:steedos-object-related-listview_adaptor_desc', '函数签名: (payload, response, api) => payload')
                        }
                      ]
                    },
                    {
                      "type": "collapse",
                      headingClassName: 'ae-formItemControl-header',
                      bodyClassName: 'ae-formItemControl-body',
                      "key": "3",
                      "collapsed": true,
                      "header": t('widgets-meta:steedos-object-related-listview_collapse_advanced', '高级'),
                      "body": [
                        {
                          type: "editor",
                          name: "crudDataFilter",
                          label: t('widgets-meta:steedos-object-related-listview_crudDataFilter', 'CRUD'),
                          description: ""
                        },
                        {
                          "type": "markdown",
                          "value": t('widgets-meta:steedos-object-related-listview_markdown_crud', "如果需要对组件原始返回的crud进行加工，可以自己写一段函数脚本来实现。\n\n函数签名：(crud, env, data) => crud\n\n参数说明：\n\ncrud 组件原始返回的crud schema\n\nenv amis env，可以调用env.fetcher函数实现异步请求\n\ndata 数据域中的data\n\n返回值：\n\n最后需要返回加工后的crud schema\n\n示例：\n\n```\nconsole.log('data===>', data);\nconst api = ...;\nreturn env.fetcher(api, {}).then((result) => {\n  console.log(result);\n  crud.columns.push({'label': 'xxx', name: 'xxx'});\n  return crud;\n});\n```"),
                          "className": "text-gray-500"
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
