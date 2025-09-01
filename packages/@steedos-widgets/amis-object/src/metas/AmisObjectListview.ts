/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: liaodaxue
 * @LastEditTime: 2023-10-20 13:24:39
 * @Description: 
 */
const t = (window as any).steedosI18next.t;

const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: t('widgets-meta:steedos-object-listview_group', '华炎魔方'),
  componentName: "AmisObjectListView",
  title: t('widgets-meta:steedos-object-listview_title', '列表视图'),
  description: t('widgets-meta:steedos-object-listview_description', '显示指定对象的列表视图。'),
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "AmisObjectListView",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
    {
      name: "objectApiName",
      propType: "string",
      description: t('widgets-meta:steedos-object-listview_objectApiName', '对象名称'),
    },
    {
      name: "listName",
      propType: "string",
      description: t('widgets-meta:steedos-object-listview_listName', '视图名称'),
    },
    {
      name: "requestAdaptor",
      propType: "string",
      description: t('widgets-meta:steedos-object-listview_requestAdaptor', '发送适配器'),
    },
    {
      name: "adaptor",
      propType: "string",
      description: t('widgets-meta:steedos-object-listview_adaptor', '接收适配器'),
    }
  ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-object-listview',
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
        listName: "all",
        showHeader: true,
      },
      previewSchema: {
        type: config.amis.name,
        objectApiName: 'space_users',
        listName: "all",
        showHeader: true,
      },
      panelTitle: t('widgets-meta:steedos-object-listview_panelTitle', '设置'),
      panelControls: [
        {
          "type": "select",
          "label": t('widgets-meta:steedos-object-listview_object', '对象'),
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
                label: "${t('widgets-meta:steedos-object-listview_current_object', '当前对象')}",
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
          type: "select",
          name: "listName",
          multiple: false,
          label: t('widgets-meta:steedos-object-listview_view', '视图'),
          "source": {
            "url": "/service/api/amis-design/object/${objectApiName || 'space_users'}",
            "method": "get",
            "messages": {
            },
            "data": {
              "objectName": "${objectName || 'space_users'}"
            },
            "requestAdaptor": "api.url = Builder.settings.rootUrl  + api.url.replaceAll('${objectName}',api.body.objectName); if(!api.headers){api.headers = {}};api.headers.Authorization='Bearer ' + Builder.settings.tenantId + ',' + Builder.settings.authToken  ;return api;",
            "adaptor": `
                const listViews = payload && payload.list_views;
                if(!listViews){
                  return;
                }
                const options = listViews.map(function (item) {
                  return { value: item.name || item._id, label: item.label || item.name }
                })
                payload.data = {
                  options
                }
                return payload;
            `,
            "sendOn": "this.objectApiName"
          },
          "labelField": "label",
          "valueField": "value"
        },
        {
          "type": "number",
          "name": "perPage",
          "label": t('widgets-meta:steedos-object-listview_perPage', '每页显示记录数量'),
        },
        {
          "type": "checkbox",
          "name": "showHeader",
          "label": t('widgets-meta:steedos-object-listview_showHeader', '显示表头'),
        },
        {
          type: "button-group-select",
          name: "crudMode",
          label: t('widgets-meta:steedos-object-listview_crudMode', '显示模式'),
          value: "table",
          options: [
            {
              "label": t('widgets-meta:steedos-object-listview_table', '表格'),
              "value": "table"
            },
            {
              "label": t('widgets-meta:steedos-object-listview_cards', '卡片'),
              "value": "cards"
            }
          ]
        },
        {
          type: "text",
          name: "className",
          label: t('widgets-meta:steedos-object-listview_className', 'CSS类名')
        },
        {
          "type": "collapse",
          headingClassName: 'pl-0',
          bodyClassName: '',
          "collapsed": true,
          "header": t('widgets-meta:steedos-object-listview_data_api', '数据接口'),
          "body": [
            {
              type: "editor",
              name: "requestAdaptor",
              label: t('widgets-meta:steedos-object-listview_requestAdaptor', '发送适配器'),
              language: "javascript",
              description: t('widgets-meta:steedos-object-listview_requestAdaptor_desc', '函数签名：(api) => api， 数据在 api.data 中，修改后返回 api 对象。')
            },
            {
              type: "editor",
              name: "adaptor",
              label: t('widgets-meta:steedos-object-listview_adaptor', '接收适配器'),
              language: "javascript",
              description: t('widgets-meta:steedos-object-listview_adaptor_desc', '函数签名: (payload, response, api) => payload')
            }
          ]
        },
        {
          "type": "collapse",
          headingClassName: 'pl-0',
          bodyClassName: '',
          "collapsed": true,
          "header": t('widgets-meta:steedos-object-listview_advanced', '高级'),
          "body": [
            {
              type: "editor",
              name: "crudDataFilter",
              label: t('widgets-meta:steedos-object-listview_crud', 'CRUD'),
              description: ""
            },
            {
              "type": "markdown",
              "value": t('widgets-meta:steedos-object-listview_crud_doc', '如果需要对组件原始返回的crud进行加工，可以自己写一段函数脚本来实现。\n\n函数签名：(crud, env, data) => crud\n\n参数说明：\n\ncrud 组件原始返回的crud schema\n\nenv amis env，可以调用env.fetcher函数实现异步请求\n\ndata 数据域中的data\n\n返回值：\n\n最后需要返回加工后的crud schema\n\n示例：\n\n```\nconsole.log(\'data===>\', data);\nconst api = ...;\nreturn env.fetcher(api, {}).then((result) => {\n  console.log(result);\n  crud.columns.push({\'label\': \'xxx\', name: \'xxx\'});\n  return crud;\n});\n\n```'),
              "className": "text-gray-500"
            }
          ]
        }
      ]
    }
  }
};
