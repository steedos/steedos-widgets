const t = (window as any).steedosI18next.t;

const config: any = {
    // componentType: 'amisSchema', 
    group: t('widgets-meta:steedos-object_group', '华炎魔方-对象'),
    componentName: "SteedosObject",
    title: t('widgets-meta:steedos-object_title', '对象'),
    docUrl: "",
    screenshot: "",
    npm: {
      package: "@steedos-widgets/amis-object",
      version: "{{version}}",
      exportName: "SteedosObject",
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
      name: 'steedos-object',
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
        usage: t('widgets-meta:steedos-object_usage', 'renderer'),
        weight: 1,
        framework: "react"
      },
      plugin: {
        rendererName: config.amis.name,
        $schema: '/schemas/UnkownSchema.json',
        name: config.title,
        description: config.title,
        tags: [config.group],
        isBaseComponent: true,
        order: -10000,
        icon: config.amis.icon,
        scaffold: {
            type: 'steedos-object',
          body: [],// 容器类字段
        },
        // 容器类组件必需字段
        regions: [
          {
            key: 'body',
            label: t('widgets-meta:steedos-object_body_label', '内容区')
          },
        ],
        previewSchema: {
          type: config.amis.name,
        },
        panelTitle: t('widgets-meta:steedos-object_panel_title', '设置'),
        panelControls: [
          {
            type: 'text',
            name: 'name',
            label: t('widgets-meta:steedos-object_name_label', '对象名'),
            "validateOnChange": true,
            "validations": {
                "isVariableName": /^[a-zA-Z]([A-Za-z0-9]|_(?!_))*[A-Za-z0-9]$/
            }
          },
          {
            type: 'text',
            name: 'label',
            label: t('widgets-meta:steedos-object_label_label', '显示名称')
          },
          {
            type: 'textarea',
            name: 'description',
            label: t('widgets-meta:steedos-object_description_label', '描述')
          }
        ]
      }
    }
  };