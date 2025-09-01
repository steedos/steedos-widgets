/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-08-19 15:02:47
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-09-01 23:13:27
 */

const t = (window as any).steedosI18next.t;

const config: any = {
    componentType: 'amisSchema', 
    group: t('widgets-meta:steedos-flow-form_group', 'Steedos-审批王'),
    componentName: "AmisSteedosFlowForm",
    title: t('widgets-meta:steedos-flow-form_title', '流程表单'),
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
    preview: {},
    targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
    engines: ["amis"],
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
          body: [],
        },
        regions: [
          {
            key: 'body',
            label: t('widgets-meta:steedos-flow-form_region_body', '内容区')
          },
        ],
        previewSchema: {
          type: config.amis.name,
        },
        panelTitle: t('widgets-meta:steedos-flow-form_panelTitle', '设置'),
        panelControls: [
          {
            type: 'text',
            name: 'name',
            label: t('widgets-meta:steedos-flow-form_name', '表单名'),
            validateOnChange: true,
            validations: {
                isVariableName: /^[a-zA-Z]([A-Za-z0-9]|_(?!_))*[A-Za-z0-9]$/
            }
          },
          {
            type: 'radios',
            name: 'style',
            label: t('widgets-meta:steedos-flow-form_style', '样式'),
            options: [
              {label: t('widgets-meta:steedos-flow-form_style_table', '表格'), value: 'table'},
              {label: t('widgets-meta:steedos-flow-form_style_wizard', '向导'), value: 'wizard'}
            ]
          },
          {
            type: 'radios',
            name: 'mode',
            label: t('widgets-meta:steedos-flow-form_mode', '表单模式'),
            visibleOn: "${style === 'wizard'}",
            options: [
              {label: t('widgets-meta:steedos-flow-form_mode_normal', '默认'), value: 'normal'},
              {label: t('widgets-meta:steedos-flow-form_mode_horizontal', '水平模式'), value: 'horizontal'},
              {label: t('widgets-meta:steedos-flow-form_mode_inline', '内联模式'), value: 'inline'}
            ]
          },
          {
            type: 'radios',
            name: 'wizard_mode',
            label: t('widgets-meta:steedos-flow-form_wizard_mode', '向导模式'),
            visibleOn: "${style === 'wizard'}",
            options: [
              {label: t('widgets-meta:steedos-flow-form_wizard_mode_vertical', '纵向'), value: 'vertical'},
              {label: t('widgets-meta:steedos-flow-form_wizard_mode_horizontal', '横向'), value: 'horizontal'}
            ]
          },
          {
            type: 'textarea',
            name: 'description',
            label: t('widgets-meta:steedos-flow-form_description', '描述')
          }
        ]
      }
    }
};
