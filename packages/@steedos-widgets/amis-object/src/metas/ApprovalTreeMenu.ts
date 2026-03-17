/**
 * ApprovalTreeMenu Meta 配置
 * 用于在 amis 低代码平台中注册 ApprovalTreeMenu 为自定义渲染器
 */

const config: any = {
  group: 'Approval',
  componentName: 'ApprovalTreeMenu',
  title: '审批中心树形菜单',
  docUrl: '',
  screenshot: '',
  npm: {
    package: '@steedos-widgets/amis-object',
    version: '{{version}}',
    exportName: 'ApprovalTreeMenu',
    main: '',
    destructuring: true,
    subName: '',
  },
  preview: {},
  targets: ['steedos__RecordPage', 'steedos__AppPage', 'steedos__HomePage'],
  engines: ['amis'],
  amis: {
    name: 'approval-tree-menu',
    icon: 'fa-fw fas fa-sitemap',
  },
};

export default {
  ...config,

  snippets: [
    {
      title: config.title,
      screenshot: '',
      schema: {
        componentName: config.componentName,
        props: config.preview,
      },
    },
  ],

  amis: {
    render: {
      type: config.amis.name,
      usage: 'renderer',
      weight: 1,
      framework: 'react',
    },

    plugin_disabled: {
      rendererName: config.amis.name,
      $schema: '/schemas/UnkownSchema.json',
      name: config.title,
      description: '审批中心左侧树形菜单，支持多层结构、图标、角标、选中高亮等',
      tags: [config.group],
      order: -9999,
      icon: config.amis.icon,

      scaffold: {
        type: config.amis.name,
      },

      previewSchema: {
        type: config.amis.name,
      },

      panelTitle: '审批中心树菜单配置',

      panelControls: [
        {
          type: 'tabs',
          tabs: [
            {
              title: '基本配置',
              body: [
                {
                  type: 'input-text',
                  name: 'appId',
                  label: '应用 ID',
                  description: '可选，组件会自动从 amis 作用域获取当前应用 code 来拼接接口地址和菜单 URL。仅在需要手动覆盖时才填写。',
                },
                {
                  type: 'input-text',
                  name: 'selectedKey',
                  label: '默认选中项 Key',
                  description: '外部控制选中状态，传入节点 _id',
                },
              ],
            },
            {
              title: '样式',
              body: [
                {
                  type: 'input-text',
                  name: 'className',
                  label: '自定义 className',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
