/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-11 09:39:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-12 14:35:40
 * @Description: 
 */
const config: any = {
    // componentType: 'amisSchema', 
    group: "华炎魔方-原子组件",
    componentName: "SteedosSkeleton",
    title: "骨架屏",
    docUrl: "",
    screenshot: "",
    npm: {
      package: "@steedos-widgets/amis-object",
      version: "{{version}}",
      exportName: "SteedosSkeleton",
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
      name: 'steedos-skeleton',
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
      plugin_disable: {
        rendererName: config.amis.name,
        $schema: '/schemas/UnkownSchema.json',
        name: config.title,
        description: config.title,
        tags: [config.group],
        order: -9999,
        icon: config.amis.icon,
        scaffold: {
          type: config.amis.name,
          count: 100,
          body: [],// 容器类字段
        },
        regions: [
          {
            key: 'body',
            label: '内容区'
          }
        ],
        previewSchema: {
          type: config.amis.name,
          config: {
            "active": true,
            "loading": true
          }
        },
        panelTitle: "设置",
        panelControls: [
          {
            type: "editor",
            name: "config",
            label: "定义",
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
  