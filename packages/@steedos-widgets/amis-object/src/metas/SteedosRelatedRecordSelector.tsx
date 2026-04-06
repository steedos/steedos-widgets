/**
 * SteedosRelatedRecordSelector 组件的 amis meta 配置
 * 相关表选择器 - 支持多选、搜索
 */

const t = (window as any).steedosI18next?.t || ((k: string, d: string) => d);

const config: any = {
  group: t('widgets-meta:related-record-selector_group', '华炎魔方-原子组件'),
  componentName: "SteedosRelatedRecordSelector",
  title: t('widgets-meta:related-record-selector_title', '相关表选择'),
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "SteedosRelatedRecordSelector",
    main: "",
    destructuring: true,
    subName: ""
  },
  preview: {},
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  amis: {
    name: 'steedos-related-record-selector',
    icon: "fa fa-th-list"
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
      description: t('widgets-meta:related-record-selector_description', '从相关表中选择记录，支持多选和搜索'),
      tags: [config.group],
      order: -9999,
      icon: config.amis.icon,
      scaffold: {
        type: config.amis.name,
        name: 'related_records',
        label: config.title,
        objectApiName: '',
        multiple: true,
        valueFormat: 'string',
        placeholder: t('widgets-meta:related-record-selector_placeholder', '请选择相关记录')
      },
      regions: [],
      previewSchema: { type: config.amis.name },
      panelTitle: t('widgets-meta:related-record-selector_panelTitle', '设置'),
      panelControls: [
        { type: 'text', name: 'name', label: t('widgets-meta:form_item_name', '字段名') },
        { type: 'text', name: 'label', label: t('widgets-meta:form_item_label', '标题') },
        {
          type: 'text',
          name: 'objectApiName',
          label: t('widgets-meta:related-record-selector_objectApiName', '对象API名称'),
          required: true,
          description: t('widgets-meta:related-record-selector_objectApiName_desc', '要选择记录的对象API名称，例如：contracts, accounts')
        },
        {
          type: 'text',
          name: 'nameFieldKey',
          label: t('widgets-meta:related-record-selector_nameFieldKey', '名称字段'),
          description: t('widgets-meta:related-record-selector_nameFieldKey_desc', '用于显示记录名称的字段，默认自动获取')
        },
        { type: 'switch', name: 'multiple', label: t('widgets-meta:related-record-selector_multiple', '多选'), value: true },
        {
          type: 'select',
          name: 'valueFormat',
          label: t('widgets-meta:value_format', '值格式'),
          value: 'string',
          options: [
            { label: t('widgets-meta:value_format_string', '字符串'), value: 'string' },
            { label: t('widgets-meta:value_format_object', '对象'), value: 'object' }
          ]
        },
        { type: 'switch', name: 'clearable', label: t('widgets-meta:related-record-selector_clearable', '可清除'), value: true },
        { type: 'text', name: 'placeholder', label: t('widgets-meta:related-record-selector_placeholder_label', '占位符') },
        {
          type: 'input-number',
          name: 'pageSize',
          label: t('widgets-meta:related-record-selector_pageSize', '每页记录数'),
          value: 50,
          min: 10,
          max: 200
        }
      ]
    }
  }
};
