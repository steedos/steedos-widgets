const config: any = {
  group: 'General',
  componentName: 'AntdRelatedInstances',
  title: 'Related Instances',
  docUrl: '',
  screenshot: '',
  npm: {
    package: '@steedos-widgets/antd',
    version: '{{version}}',
    exportName: 'AntdRelatedInstances',
    main: '',
    destructuring: true,
    subName: '',
  },
  preview: {
    placeholder: 'Please select',
  },
  targets: ['steedos__RecordPage', 'steedos__AppPage', 'steedos__HomePage'],
  engines: ['amis'],

  amis: {
    name: 'antd-related-instances',
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
      usage: 'formitem',
      weight: 1,
      framework: 'react',
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
        label: config.title,
        name: 'related_instances',
      },

      previewSchema: { type: config.amis.name, label: 'Preview', placeholder: 'Please select' },
      panelTitle: 'Related Instances Settings',

      panelControls: [
        {
          type: 'input-text',
          name: 'placeholder',
          label: 'Placeholder',
          value: 'Please select',
        },
      ],
    },
  },
};
