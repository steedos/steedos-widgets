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
        columns: [{"field": "name"}]
      },
      previewSchema: {
        type: config.amis.name,
        objectApiName: 'space_users',
        columns: [{"field": "name"}]
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
          "type": "combo",
          "name": "columns",
          "label": "显示列",
          "multiLine": true,
          "multiple": true,
          "draggable": true,
          "items": [
            {
              "name": "field",
              "type": "input-text",
              "placeholder": "字段"
            },
            {
              "name": "width",
              "type": "input-text",
              "placeholder": "宽度"
            },
            // {
            //   "name": "wrap",
            //   "type": "checkbox",
            //   "option": "换行"
            // }
          ]
        },
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
        },
        {
          "type": "select",
          "label": "排序字段",
          "name": "sortField",
          "searchable": true,
          "multiple": false,
          "source": {
            "method": "get",
            "data": {
              "objectName": "${objectName}",
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
          "type": "number",
          "name": "top",
          "label": "显示的记录数量",
        }
      ]
    }
  }
};
