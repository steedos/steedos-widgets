/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-04-05 15:11:21
 * @Description: 
 */
const config: any = {
  group: "华炎魔方",
  componentName: "ObjectListView",
  title: "列表视图",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/steedos-object",
    version: "{{version}}",
    exportName: "ObjectListView",
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
      name: "listName",
      propType: "string",
      description: '列表视图名称'
    }, 
  ],
  preview: {
    text: "Submit",
    link: "https://www.steedos.cn"
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-object-listview',
    icon: "fa-fw fa fa-table"
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
        name: config.amis.name,
        ...config.preview
      },
      previewSchema: {
        type: config.amis.name,
        ...config.preview
      },
      panelTitle: "设置",
      panelControls: [
        {
          type: "text",
          name: "objectApiName",
          label: "object Api Name",
        },
        {
          type: "text",
          name: "listName",
          label: "list Name",
          value: "all"
        }
      ]
    }
  }
};
