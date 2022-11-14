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
  componentName: "AmisObjectListView",
  title: "列表视图",
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
      description: '对象名称',
    },
    {
      name: "listName",
      propType: "string",
      description: '视图名称',
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
      description: config.title,
      tags: [config.group],
      order: -9999,
      icon: config.amis.icon,
      scaffold: {
        type: config.amis.name,
        label: config.title,
        objectApiName: "${objectName}",
        listName: "all"
      },
      previewSchema: {
        type: config.amis.name,
        objectApiName: 'space_users',
        listName: "all"
      },
      panelTitle: "设置",
      panelControls: [
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
          name: "listName",
          // "multiple": false,
          label: "视图",
          hiddenOn: "this.showHeader",
          // "source": {
          //   "url": "/service/api/amis-design/object/${objectApiName === '${objectName}' ? 'space_users' : objectApiName}",
          //   "method": "get",
          //   "messages": {
          //   },
          //   "requestAdaptor": "api.url = Builder.settings.rootUrl  + api.url; if(!api.headers){api.headers = {}};api.headers.Authorization='Bearer ' + Builder.settings.tenantId + ',' + Builder.settings.authToken  ;return api;",
          //   "adaptor": `
          //       const listViews = payload && payload.list_views;
          //       if(!listViews){
          //         return;
          //       }
          //       const options = listViews.map(function (item) {
          //         return { value: item.name || item._id, label: item.label || item.name }
          //       })
          //       payload.data = {
          //         options
          //       }
          //       return payload;
          //   `,
          //   "sendOn": "this.objectApiName"
          // },
          // "labelField": "label",
          // "valueField": "value"
        },
        {
          "type": "number",
          "name": "top",
          "label": "显示的记录数量",
        },
        {
          "type": "checkbox",
          "name": "showHeader",
          "label": "显示表头",
        }
      ]
    }
  }
};
