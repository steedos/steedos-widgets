/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-11 09:39:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-16 10:12:33
 * @Description: 
 */
const config: any = {
    // componentType: 'amisSchema', 
    group: "华炎魔方",
    componentName: "SteedosBadgeRibbon",
    title: "缎带",
    docUrl: "",
    screenshot: "",
    npm: {
      package: "@steedos-widgets/amis-object",
      version: "{{version}}",
      exportName: "SteedosBadgeRibbon",
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
      name: 'steedos-badge-ribbon',
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
        },
        panelTitle: "设置",
        panelControls: [
          {
            type: 'input-color',
            name: 'color',
            label: '缎带的颜色'
          },
          {
            type: 'select',
            name: 'placement',
            label: '缎带的位置',
            options: [
              {label: 'Start', value: 'start'},
              {label: 'End', value: 'end'}
            ]
          },
          {
            type: 'text',
            name: 'text',
            label: '缎带中填入的内容'
          }
        ]
      }
    }
  };
  