/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-11 09:39:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-07 18:31:37
 * @Description: 
 */
const t = (window as any).steedosI18next.t;

const config: any = {
  group: t('widgets-meta:steedos-badge_group', '华炎魔方-原子组件'),
  componentName: "SteedosBadge",
  title: t('widgets-meta:steedos-badge_title', '徽标数'),
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
  preview: {},
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
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
      schema: { componentName: config.componentName, props: config.preview }
    }
  ],
  amis: {
    render: { type: config.amis.name, usage: "renderer", weight: 1, framework: "react" },
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
        body: []
      },
      regions: [{ key: 'body', label: t('widgets-meta:steedos-badge_body', '内容区') }],
      previewSchema: { type: config.amis.name },
      panelTitle: t('widgets-meta:steedos-badge_panelTitle', '设置'),
      panelControls: [
        { type: 'input-color', name: 'color', label: t('widgets-meta:steedos-badge_color', '小圆点的颜色') },
        { type: 'text', name: 'count', label: t('widgets-meta:steedos-badge_count', '展示的数字') },
        { type: 'switch', name: 'dot', label: t('widgets-meta:steedos-badge_dot', '不展示数字，只有一个小红点') },
        { type: 'number', name: 'overflowCount', label: t('widgets-meta:steedos-badge_overflowCount', '展示封顶的数字值') },
        { type: 'switch', name: 'showZero', label: t('widgets-meta:steedos-badge_showZero', '当数值为 0 时，是否展示 Badge') },
        {
          type: 'select',
          name: 'size',
          label: t('widgets-meta:steedos-badge_size', '在设置了 count 的前提下有效，设置小圆点的大小'),
          options: [
            { label: 'default', value: 'default' },
            { label: 'small', value: 'small' }
          ]
        },
        {
          type: 'select',
          name: 'status',
          label: t('widgets-meta:steedos-badge_status', 'Badge 为状态点'),
          options: [
            { label: 'success', value: 'success' },
            { label: 'processing', value: 'processing' },
            { label: 'default', value: 'default' },
            { label: 'error', value: 'error' },
            { label: 'warning', value: 'warning' }
          ]
        },
        { type: 'text', name: 'text', label: t('widgets-meta:steedos-badge_text', '在设置了 status 的前提下有效，设置状态点的文本') },
        { type: 'text', name: 'title', label: t('widgets-meta:steedos-badge_titleLabel', '设置鼠标放在状态点上时显示的文字') }
      ]
    }
  }
};
