/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-11 09:39:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-04 12:04:41
 * @Description: 
 */
const config: any = {
    // componentType: 'amisSchema', 
    group: "华炎魔方",
    componentName: "AmisObjectButton",
    title: "按钮",
    docUrl: "",
    screenshot: "",
    npm: {
      package: "@steedos-widgets/amis-object",
      version: "{{version}}",
      exportName: "AmisObjectButton",
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
      name: 'steedos-object-button',
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
      //     label: config.title,
      //     name: 'board',
      //     columns: 1,
      //     vertical: false
      //   },
      //   previewSchema: {
      //     type: config.amis.name,
      //   },
      //   panelTitle: "设置",
      //   panelControls: [
      //   ]
      // }
    }
  };
  