/**
 * UserSelector 组件的 amis meta 配置
 */

const t = (window as any).steedosI18next?.t || ((k: string, d: string) => d);

const config: any = {
  group: t('widgets-meta:user-selector_group', '华炎魔方-原子组件'),
  componentName: "SteedosUserSelector",
  title: t('widgets-meta:user-selector_title', '人员选择'),
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "SteedosUserSelector",
    main: "",
    destructuring: true,
    subName: ""
  },
  preview: {},
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  amis: {
    name: 'steedos-user-selector',
    icon: "fa fa-users"
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
    render: { type: config.amis.name, usage: "formitem", weight: 1, framework: "react" },
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
        name: 'user',
        label: config.title,
        multiple: false,
        placeholder: t('widgets-meta:user-selector_placeholder', '请选择人员')
      },
      regions: [],
      previewSchema: { type: config.amis.name },
      panelTitle: t('widgets-meta:user-selector_panelTitle', '设置'),
      panelControls: [
        { type: 'text', name: 'name', label: t('widgets-meta:form_item_name', '字段名') },
        { type: 'text', name: 'label', label: t('widgets-meta:form_item_label', '标题') },
        { type: 'switch', name: 'multiple', label: t('widgets-meta:user-selector_multiple', '多选') },
        { type: 'text', name: 'placeholder', label: t('widgets-meta:user-selector_placeholder', '占位符') }
        // fetchUsers 和 fetchDepartments 通常由平台注入，不建议在低代码属性面板暴露
      ]
    }
  }
};
