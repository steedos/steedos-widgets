/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-06 17:48:28
 * @Description: 
 */
const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: "华炎魔方",
  componentName: "AmisTablesGrid",
  title: "Tables Grid",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/ag-grid",
    version: "{{version}}",
    exportName: "AmisTablesGrid",
    main: "",
    destructuring: true,
    subName: ""
  },
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-tables-grid',
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
    plugin_disabled: {
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
      panelTitle: "设置",
      panelControls: [
      ]
    }
  }
};
