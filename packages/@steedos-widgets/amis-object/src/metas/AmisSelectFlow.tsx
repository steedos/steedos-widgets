/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-11 09:39:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-01-14 16:51:23
 * @Description: 
 */
const config: any = {
    componentType: 'amisSchema', 
    group: "华炎魔方",
    componentName: "AmisSelectFlow",
    title: "Select Flow",
    docUrl: "",
    screenshot: "",
    npm: {
      package: "@steedos-widgets/amis-object",
      version: "{{version}}",
      exportName: "AmisSelectFlow",
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
      name: 'steedos-select-flow',
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
        usage: "renderer", //formitem
        weight: 1,
        framework: "react"
      },
      // plugin: {
      //   rendererName: config.amis.name,
      //   $schema: '/schemas/UnkownSchema.json',
      //   name: config.title,
      //   description: config.title,
      //   tags: [config.group],
      //   order: -9999,
      //   icon: config.amis.icon,
      //   scaffold: {
      //     type: config.amis.name,
      //   },
      //   previewSchema: {
      //     type: config.amis.name,
      //   },
      //   panelTitle: "设置",
      //   panelControls: [
      //     {
      //       type: "editor",
      //       name: "field",
      //       label: "Field",
      //       language: "json"
      //     }
      //   ]
      // }
    }
  };
  