/**
 * SteedosFileUpload 组件的 amis meta 配置
 */

const t = (window as any).steedosI18next?.t || ((k: string, d: string) => d);

const config: any = {
  group: t('widgets-meta:file-upload_group', '华炎魔方-原子组件'),
  componentName: "SteedosFileUpload",
  title: t('widgets-meta:file-upload_title', '文件上传'),
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "SteedosFileUpload",
    main: "",
    destructuring: true,
    subName: ""
  },
  preview: {},
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  amis: {
    name: 'steedos-file-upload',
    icon: "fa fa-upload"
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
        label: '附件',
        multiple: true,
        maxCount: 10,
        btnLabel: '上传附件',
      },
      regions: [],
      previewSchema: { type: config.amis.name },
      panelTitle: t('widgets-meta:file-upload_panelTitle', '设置'),
      panelControls: [
        { type: 'text', name: 'label', label: '标题' },
        { type: 'text', name: 'action', label: '上传接口' },
        { type: 'switch', name: 'multiple', label: '多文件', value: true },
        { type: 'number', name: 'maxCount', label: '最大数量', value: 10 },
        { type: 'text', name: 'btnLabel', label: '按钮文字', value: '上传附件' },
        { type: 'switch', name: 'disabled', label: '禁用', value: false },
      ]
    }
  }
};
