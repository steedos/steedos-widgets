/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-02 09:04:33
 * @Description: 
 */

const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: "华炎魔方",
  componentName: "AmisProvider",
  title: "魔方容器",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "AmisProvider",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
  ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-provider',
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
        body: [],// 容器类字段
      },
      // 容器类组件必需字段
      regions: [
        {
          key: 'body',
          label: '内容区'
        },
      ],
      previewSchema: {
        type: config.amis.name,
      },
      panelTitle: "设置",
      panelControls: []
    }
  }
};
