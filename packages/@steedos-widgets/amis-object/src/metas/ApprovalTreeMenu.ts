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
  preview: {
    apiUrl: '/api/approve_workflow/workflow/nav',
  },
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

    plugin: {
      rendererName: config.amis.name,
      $schema: '/schemas/UnkownSchema.json',
      name: config.title,
      description: '审批中心左侧树形菜单，支持多层结构、图标、角标、选中高亮等',
      tags: [config.group],
      order: -9999,
      icon: config.amis.icon,

      scaffold: {
        type: config.amis.name,
        apiUrl: '/api/approve_workflow/workflow/nav',
        navigateMode: 'router',
      },

      previewSchema: {
        type: config.amis.name,
        apiUrl: '/api/approve_workflow/workflow/nav',
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
                  name: 'apiUrl',
                  label: '接口地址',
                  placeholder: '/api/approve_workflow/workflow/nav',
                  description: '菜单数据接口，默认 /api/approve_workflow/workflow/nav',
                },
                {
                  type: 'select',
                  name: 'navigateMode',
                  label: '跳转方式',
                  value: 'router',
                  options: [
                    { label: 'SPA 路由跳转（推荐）', value: 'router' },
                    { label: 'window.location.href', value: 'location' },
                    { label: 'postMessage（跨框架）', value: 'postMessage' },
                    { label: '不跳转（仅触发回调）', value: 'none' },
                  ],
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
