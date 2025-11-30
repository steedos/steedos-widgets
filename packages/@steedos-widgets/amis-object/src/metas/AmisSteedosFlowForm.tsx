const t = (window as any).steedosI18next.t;

const config: any = {
  componentType: "amisSchema",
  group: (window as any).steedosI18next.t("widgets-meta:steedos-flow-form_group", "Steedos-审批王"),
  componentName: "AmisSteedosFlowForm",
  title: (window as any).steedosI18next.t("widgets-meta:steedos-flow-form_title", "流程表单"),
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "AmisSteedosFlowForm",
    main: "",
    destructuring: true,
    subName: "",
  },
  preview: {},
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  amis: {
    name: "steedos-flow-form",
    icon: "fa-fw fa fa-list-alt",
  },
};

export default {
  ...config,
  snippets: [
    {
      title: config.title,
      screenshot: "",
      schema: {
        componentName: config.componentName,
        props: config.preview,
      },
    },
  ],
  amis: {
    render: {
      type: config.amis.name,
      usage: "renderer",
      weight: 1,
      framework: "react",
    },
    plugin: {
      rendererName: config.amis.name,
      $schema: "/schemas/AmisSteedosFlowFormSchema.json",
      name: config.title,
      description: config.title,
      tags: [config.group],
      isBaseComponent: true,
      order: -10000,
      icon: config.amis.icon,
      events: [
        { eventName: "inited", eventLabel: "表单初始化完成", description: "表单初始化完成事件，不管配置不配置 initApi 都会触发，实际上还会等部分子表单项初始化完成" },
        { eventName: "change", eventLabel: "表单值变化时触发", description: "" },
        { eventName: "submit", eventLabel: "表单提交前触发", description: "" },
        { eventName: "nextStepInited", eventLabel: "下一步初始化完成", description: "" },
        { eventName: "nextStepChange", eventLabel: "下一步步骤变化时触发", description: "" },
        { eventName: "nextStepUserChange", eventLabel: "下一步处理人变化时触发", description: "" },
      ],
      scaffold: {
        type: "steedos-flow-form",
        body: [],
      },
      regions: [
        {
          key: "body",
          label: (window as any).steedosI18next.t("widgets-meta:steedos-flow-form_region_body", "内容区"),
        },
      ],
      previewSchema: {
        type: config.amis.name,
      },
      panelTitle: (window as any).steedosI18next.t("widgets-meta:steedos-flow-form_panelTitle", "设置"),
      panelBodyCreator: function(context){
        return [
          {
            type: "tabs",
            tabsMode: "line",
            className: "editor-prop-config-tabs",
            linksClassName: "editor-prop-config-tabs-links",
            contentClassName: "no-border editor-prop-config-tabs-cont",
            tabs: [
              {
                title: "属性",
                className: "",
                body: [
                  {
                    type: "collapse-group",
                    expandIconPosition: "right",
                    expandIcon: {
                      type: "icon",
                      icon: "chevron-right",
                    },
                    className: "ae-formItemControl",
                    body: [
                      {
                        type: "input-text",
                        name: "name",
                        label: (window as any).steedosI18next.t("widgets-meta:steedos-flow-form_name", "表单名"),
                        validateOnChange: true
                      },
                      {
                        type: "radios",
                        name: "style",
                        label: (window as any).steedosI18next.t("widgets-meta:steedos-flow-form_style", "样式"),
                        options: [
                          {
                            label: (window as any).steedosI18next.t(
                              "widgets-meta:steedos-flow-form_style_table",
                              "表格"
                            ),
                            value: "table",
                          },
                          {
                            label: (window as any).steedosI18next.t(
                              "widgets-meta:steedos-flow-form_style_wizard",
                              "向导"
                            ),
                            value: "wizard",
                          },
                        ],
                        value: 'table'
                      },
                      {
                        type: "radios",
                        name: "mode",
                        label: (window as any).steedosI18next.t(
                          "widgets-meta:steedos-flow-form_mode",
                          "表单模式"
                        ),
                        visibleOn: "${style === 'wizard'}",
                        options: [
                          {
                            label: (window as any).steedosI18next.t(
                              "widgets-meta:steedos-flow-form_mode_normal",
                              "默认"
                            ),
                            value: "normal",
                          },
                          {
                            label: (window as any).steedosI18next.t(
                              "widgets-meta:steedos-flow-form_mode_horizontal",
                              "水平模式"
                            ),
                            value: "horizontal",
                          },
                          {
                            label: (window as any).steedosI18next.t(
                              "widgets-meta:steedos-flow-form_mode_inline",
                              "内联模式"
                            ),
                            value: "inline",
                          },
                        ],
                      },
                      {
                        type: "radios",
                        name: "wizard_mode",
                        label: (window as any).steedosI18next.t(
                          "widgets-meta:steedos-flow-form_wizard_mode",
                          "向导模式"
                        ),
                        visibleOn: "${style === 'wizard'}",
                        options: [
                          {
                            label: (window as any).steedosI18next.t(
                              "widgets-meta:steedos-flow-form_wizard_mode_vertical",
                              "纵向"
                            ),
                            value: "vertical",
                          },
                          {
                            label: (window as any).steedosI18next.t(
                              "widgets-meta:steedos-flow-form_wizard_mode_horizontal",
                              "横向"
                            ),
                            value: "horizontal",
                          },
                        ],
                      },
                      {
                        type: "textarea",
                        name: "description",
                        label: (window as any).steedosI18next.t(
                          "widgets-meta:steedos-flow-form_description",
                          "描述"
                        ),
                      },
                    ],
                  },
                ],
              },
              {
                title: "事件",
                className: "p-none",
                body: [
                  Object.assign({name: 'onEvent'}, (window as any).AmisEditor?.formItemControl(
                      { },
                      context
                    )[0].tabs[2].body[0]
                  )
                ],
              },
            ],
          },
        ]
      }
    },
  },
};
