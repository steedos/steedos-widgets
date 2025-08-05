const config: any = {
    componentType: 'amisSchema', 
    group: "华炎魔方-审批王",
    componentName: "AmisSteedosFlowForm",
    title: "流程表单",
    docUrl: "",
    screenshot: "",
    npm: {
      package: "@steedos-widgets/amis-object",
      version: "{{version}}",
      exportName: "AmisSteedosFlowForm",
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
      name: 'steedos-flow-form',
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
        
        isBaseComponent: true,
        order: -10000,
        icon: config.amis.icon,
        scaffold: {
            type: 'steedos-flow-form',
          body: [],// 容器类字段
        },
        // 容器类组件必需字段
        regions: [
          {
            key: 'body',
            label: '内容区'
          },
        ],
        previewSchema: {
          type: config.amis.name,
        },
        panelTitle: "设置",
        panelControls: [
          {
            type: 'text',
            name: 'name',
            label: '表单名',
            "validateOnChange": true,
            "validations": {
                "isVariableName": /^[a-zA-Z]([A-Za-z0-9]|_(?!_))*[A-Za-z0-9]$/
            }
          },
          {
            type: 'textarea',
            name: 'description',
            label: '描述'
          }
        ]
      }
    }
  };
  