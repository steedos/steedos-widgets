/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-11 09:39:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-09 19:00:03
 * @Description: 
 */
const t = (window as any).steedosI18next.t;

const config: any = {
  group: t('widgets-meta:steedos-badge-ribbon_group', '华炎魔方-原子组件'),
  componentName: "SteedosBadgeRibbon",
  title: t('widgets-meta:steedos-badge-ribbon_title', '缎带'),
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
  preview: {},
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
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
      scaffold: { type: config.amis.name, body: [] },
      regions: [{ key: 'body', label: t('widgets-meta:steedos-badge-ribbon_body', '内容区') }],
      previewSchema: { type: config.amis.name },
      panelTitle: t('widgets-meta:steedos-badge-ribbon_panelTitle', '设置'),
      panelControls: [
        { type: 'input-color', name: 'color', label: t('widgets-meta:steedos-badge-ribbon_color', '缎带的颜色') },
        {
          type: 'select',
          name: 'placement',
          label: t('widgets-meta:steedos-badge-ribbon_placement', '缎带的位置'),
          options: [
            { label: 'Start', value: 'start' },
            { label: 'End', value: 'end' }
          ]
        },
        { type: 'text', name: 'text', label: t('widgets-meta:steedos-badge-ribbon_text', '缎带中填入的内容') }
      ]
    }
  }
};
