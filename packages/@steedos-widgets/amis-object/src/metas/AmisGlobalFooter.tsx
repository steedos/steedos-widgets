/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-11 09:39:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-16 14:17:37
 * @Description: 
 */
const config: any = {
    componentType: 'amisSchema', 
    group: "华炎魔方",
    componentName: "AmisGlobalFooter",
    title: "Global Footer",
    docUrl: "",
    screenshot: "",
    npm: {
      package: "@steedos-widgets/amis-object",
      version: "{{version}}",
      exportName: "AmisGlobalFooter",
      main: "",
      destructuring: true,
      subName: ""
    },
    props: [
      {
        name: "stacked",
        propType: "string",
        description: '是否竖着摆放',
      }
    ],
    preview: {
    },
    targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
    engines: ["amis"],
    // settings for amis.
    amis: {
      name: 'steedos-global-footer',
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
          label: config.title
        },
        previewSchema: {
          type: config.amis.name,
        },
        panelTitle: "设置",
        panelControls: [
        ]
      }
    }
  };
  