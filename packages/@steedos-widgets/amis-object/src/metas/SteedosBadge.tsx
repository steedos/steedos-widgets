/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-11 09:39:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-16 10:15:58
 * @Description: 
 */
const config: any = {
    // componentType: 'amisSchema', 
    group: "华炎魔方",
    componentName: "SteedosBadge",
    title: "徽标数",
    docUrl: "",
    screenshot: "",
    npm: {
      package: "@steedos-widgets/amis-object",
      version: "{{version}}",
      exportName: "SteedosBadge",
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
      name: 'steedos-badge',
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
        },
        panelTitle: "设置",
        panelControls: [
          {
            type: 'input-color',
            name: 'color',
            label: '小圆点的颜色'
          },
          {
            type: 'text',
            name: 'count',
            label: '展示的数字'
          },
          {
            type: 'switch',
            name: 'dot',
            label: '不展示数字，只有一个小红点'
          },
          // {
          //   type: 'text',
          //   name: 'offset',
          //   label: '设置状态点的位置偏移	'
          // },
          {
            type: 'number',
            name: 'overflowCount',
            label: '展示封顶的数字值	'
          },
          {
            type: 'switch',
            name: 'showZero',
            label: '当数值为 0 时，是否展示 Badge'
          },
          {
            type: 'select',
            name: 'size',
            label: '在设置了 count 的前提下有效，设置小圆点的大小',
            options: [
              {label: 'default', value: 'default'},
              {label: 'small', value: 'small'}
            ]
          },
          {
            type: 'select',
            name: 'status',
            label: 'Badge 为状态点',
            options: [
              {label: 'success', value: 'success'},
              {label: 'processing', value: 'processing'},
              {label: 'default', value: 'default'},
              {label: 'error', value: 'error'},
              {label: 'warning', value: 'warning'}
            ]
          },
          {
            type: 'text',
            name: 'text',
            label: '在设置了 status 的前提下有效，设置状态点的文本',
          },
          {
            type: 'text',
            name: 'title',
            label: '设置鼠标放在状态点上时显示的文字',
          },
        ]
      }
    }
  };
  