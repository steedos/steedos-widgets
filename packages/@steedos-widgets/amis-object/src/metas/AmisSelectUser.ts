const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: "华炎魔方-界面",
  componentName: "AmisSelectUser",
  title: "选择用户",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "AmisSelectUser",
    main: "",
    destructuring: true,
    subName: ""
  },
  // props: [
  //   {
  //     name: "name",
  //     propType: "string",
  //     description: '字段名称',
  //   },
  //   {
  //     name: "label",
  //     propType: "string",
  //     description: '标题',
  //   },
  //   {
  //     name: "multiple",
  //     propType: "boolean",
  //     description: '多选',
  //   },
  //   {
  //     name: "searchable",
  //     propType: "boolean",
  //     description: '可搜索',
  //   }
  // ],
  preview: {
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-select-user',
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
      usage: "formitem",
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
        name: ""
      },
      previewSchema: {
        type: config.amis.name,
      },
      panelTitle: "设置",
      panelControls: [
        {
          type: "checkbox",
          name: "multiple",
          label: '多选',
        },
        {
          type: "checkbox",
          name: "searchable",
          label: '可搜索',
        }
        // ,{
        //   "type": "editor",
        //   "name": "editor",
        //   "label": "编辑器",
        //   "placeholder": "function() {\n  console.log('hello world')\n}"
        // }
      ]
    }
  }
};
