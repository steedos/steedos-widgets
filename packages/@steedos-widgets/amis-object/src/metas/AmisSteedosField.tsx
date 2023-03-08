/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-11 09:39:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-06 18:29:59
 * @Description: 
 */
const config: any = {
    componentType: 'amisSchema', 
    group: "华炎魔方-原子组件",
    componentName: "AmisSteedosField",
    title: "字段",
    docUrl: "",
    screenshot: "",
    npm: {
      package: "@steedos-widgets/amis-object",
      version: "{{version}}",
      exportName: "AmisSteedosField",
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
      name: 'steedos-field',
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
          config: {
            "type": "text",
            "label": "字段1"
          }
        },
        previewSchema: {
          type: config.amis.name,
          config: {
            "type": "text",
            "label": "字段1"
          }
        },
        panelTitle: "设置",
        panelControls: [
          {
            type: "editor",
            name: "config",
            label: "字段定义",
            language: "json",     
            pipeOut: (value) => {
              try {
                return value ? JSON.parse(value) : null;
              } catch (e) {
              }
              return value;
            }
          }
        ]
      }
    }
  };
  