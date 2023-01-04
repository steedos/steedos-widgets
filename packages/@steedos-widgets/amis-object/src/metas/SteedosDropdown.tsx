/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-11 09:39:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-16 11:11:32
 * @Description: 
 */
const config: any = {
    // componentType: 'amisSchema', 
    group: "华炎魔方",
    componentName: "SteedosDropdown",
    title: "下拉菜单",
    docUrl: "",
    screenshot: "",
    npm: {
      package: "@steedos-widgets/amis-object",
      version: "{{version}}",
      exportName: "SteedosDropdown",
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
      name: 'steedos-dropdown',
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
          placement: 'bottomLeft',
          trigger: ['click'],
          body: [],// 容器类字段
          overlay: [],
        },
        regions: [
          {
            key: 'body',
            label: '内容区'
          },
          {
            key: 'overlay',
            label: 'Overlay'
          },
        ],
        previewSchema: {
          type: config.amis.name,
        },
        panelTitle: "设置",
        panelControls: [
          {
            type: "select",
            name: "placement",
            label: "Placement",
            options: [
              {label: 'bottom', value: 'bottom'},
              {label: 'bottomLeft', value: 'bottomLeft'},
              {label: 'bottomRight', value: 'bottomRight'},
              {label: 'top', value: 'top'},
              {label: 'topLeft', value: 'topLeft'},
              {label: 'topRight', value: 'topRight'},
            ]
          },
          {
            type: "select",
            name: "trigger",
            label: "触发下拉的行为, 移动端不支持 hover",
            options: [
              {label: 'click', value: 'click'},
              {label: 'hover', value: 'hover'}
            ],
            multiple: true
          },
          {
            type: 'text',
            name: 'className',
            label: 'Class Name'
          },
          {
            type: 'text',
            name: 'overlayClassName',
            label: 'Overlay Class Name'
          }
        ]
      }
    }
  };
  