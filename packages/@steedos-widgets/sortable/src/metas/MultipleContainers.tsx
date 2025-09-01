const t = (window as any).steedosI18next.t;
const config: any = {
  group: t('widgets-meta:steedos-board_group', '华炎魔方-原子组件'),
  componentName: "MultipleContainers",
  title: t('widgets-meta:steedos-board_title', '看板'),
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/sortable",
    version: "{{version}}",
    exportName: "MultipleContainers",
    main: "",
    destructuring: true,
    subName: ""
  },
  // props: [
  //   {
  //     name: "title",
  //     propType: "string",
  //     description: t('widgets-meta:steedos-board_props_title_description', '标题'),
  //   }
  // ],
  preview: {},
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-board',
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
      usage: "formitem",
      weight: 1,
      framework: "react"
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
        name: 'board',
        columns: 1,
        vertical: false,
        value: {
          "A": [
            "A1",
            "B1"
          ],
          "B": [
            "A2",
            "B2"
          ]
        },
        boardSource: [
          {
            id: "A",
            label: t('widgets-meta:steedos-board_boardSource_A_label', 'Board A')
          },
          {
            id: "B",
            label: t('widgets-meta:steedos-board_boardSource_B_label', 'Board B')
          }
        ],
        boardClassName: "bg-gray-50 p-2 border rounded shadow",
        boardHeader: {
          type: "tpl",
          tpl: t('widgets-meta:steedos-board_boardHeader_tpl', 'Board ${label}')
        },
        boardFooter: {
          type: "tpl",
          tpl: t('widgets-meta:steedos-board_boardFooter_tpl', 'Board ${label} Footer')
        },
        cardClassName: "bg-white border w-full p-2 rounded shadow",
        cardSchema: {
          type: "card",
          header: {
            className: "items-center",
            title: "${label}",
          },
          toolbar: [
            {
              type: "dropdown-button",
              level: "link",
              icon: "fa fa-ellipsis-h",
              className: "pr-1 flex",
              hideCaret: true,
              buttons: [
                {
                  type: "button",
                  label: t('widgets-meta:steedos-board_cardSchema_toolbar_buttons_edit_label', '编辑'),
                  actionType: "dialog",
                  dialog: {
                    title: t('widgets-meta:steedos-board_cardSchema_toolbar_buttons_edit_dialog_title', '编辑'),
                    body: t('widgets-meta:steedos-board_cardSchema_toolbar_buttons_edit_dialog_body', '你正在编辑该卡片')
                  }
                },
                {
                  type: "button",
                  label: t('widgets-meta:steedos-board_cardSchema_toolbar_buttons_delete_label', '删除'),
                  actionType: "dialog",
                  dialog: {
                    title: t('widgets-meta:steedos-board_cardSchema_toolbar_buttons_delete_dialog_title', '提示'),
                    body: t('widgets-meta:steedos-board_cardSchema_toolbar_buttons_delete_dialog_body', '你删掉了该卡片')
                  }
                }
              ]
            }
          ],
          className: "mb-0"
        },
        cardSource: [
          {
            id: "A1",
            label: t('widgets-meta:steedos-board_cardSource_A1_label', 'Item A1'),
            columnSpan: 2,
            color: "red"
          },
          {
            id: "A2",
            label: t('widgets-meta:steedos-board_cardSource_A2_label', 'Item A2'),
            columnSpan: 1,
            color: "blue"
          },
          {
            id: "B1",
            label: t('widgets-meta:steedos-board_cardSource_B1_label', 'Item B1'),
            color: "green"
          },
          {
            id: "B2",
            label: t('widgets-meta:steedos-board_cardSource_B2_label', 'Item B2'),
            color: "silver"
          }
        ],
      },
      previewSchema: {
        type: config.amis.name,
      },
      panelTitle: t('widgets-meta:steedos-board_panelTitle', '设置'),
      panelControls: [
        {
          name: "columns",
          type: "input-number",
          label: t('widgets-meta:steedos-board_panelControls_columns_label', '列数'),
        },
        {
          name: "vertical",
          type: "checkbox",
          label: t('widgets-meta:steedos-board_panelControls_vertical_label', '布局'),
          option: t('widgets-meta:steedos-board_panelControls_vertical_option', '纵向')
        }
      ]
    }
  }
};