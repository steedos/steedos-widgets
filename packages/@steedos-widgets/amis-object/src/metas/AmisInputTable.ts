/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-11-15 09:50:22
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-11-19 09:19:23
 */
const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: "华炎魔方",
  componentName: "AmisInputTable",
  title: "表格编辑框",
  description: "表格编辑组件，对amis input-table组件的进一步封装。",
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "AmisInputTable",
    main: "",
    destructuring: true,
    subName: ""
  },
  props: [
    {
      name: "name",
      propType: "string",
      description: '字段名',
    },
    {
      name: "fields",
      propType: "json",
      description: '字段配置',
    },
    {
      name: "addable",
      propType: "boolean",
      description: '可新增',
    },
    {
      name: "editable",
      propType: "boolean",
      description: '可编辑',
    },
    {
      name: "removable",
      propType: "boolean",
      description: '可删除',
    },
    {
      name: "draggable",
      propType: "boolean",
      description: '可拖拽',
    },
    {
      name: "showIndex",
      propType: "boolean",
      description: '显示序号',
    },
    {
      name: "perPage",
      propType: "number",
      description: '每页展示条数',
    }
  ],
  preview: {
  },
  targets: ["steedos__RecordPage"],
  engines: ["amis"],
  // settings for amis.
  amis: {
    name: 'steedos-input-table',
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
      usage: "renderer",//renderer/formitem
      weight: 1,
      framework: "react"
    },
    plugin: {
    // plugin_disabled: {
      rendererName: config.amis.name,
      $schema: '/schemas/UnkownSchema.json',
      name: config.title,
      description: config.description,
      tags: [config.group],
      order: -9999,
      icon: config.amis.icon,
      scaffold: {
        type: config.amis.name,
        label: config.title,
        fields: [
          {
            "name": "a",
            "label": "A",
            "type": "text"
          },
          {
            "name": "b",
            "label": "B",
            "type": "select",
            "options": [
              {
                "label": "选项1",
                "value": "op1"
              },
              {
                "label": "选项2",
                "value": "op2"
              }
            ]
          }
        ],
        addable: false,
        editable: false,
        removable: false,
        draggable: false,
        showIndex: false
      },
      previewSchema: {
        type: config.amis.name,
        fields: [
          {
            "name": "a",
            "label": "A",
            "type": "text"
          },
          {
            "name": "b",
            "label": "B",
            "type": "select",
            "options": [
              {
                "label": "选项1",
                "value": "op1"
              },
              {
                "label": "选项2",
                "value": "op2"
              }
            ]
          }
        ],
        addable: false,
        editable: false,
        removable: false,
        draggable: false,
        showIndex: false
      },
      panelTitle: "设置",
      panelControls: [
        {
          "type": "input-text",
          "name": "name",
          "label": "字段名"
        },
        {
          type: "editor",
          name: "fields",
          label: "字段配置",
          "options": {
            "lineNumbers": "off"
          },
          pipeOut: (value) => {
            try {
              return value ? JSON.parse(value) : null;
            } catch (e) {
            }
            return value;
          },
          language: "json"
        },
        {
          type: "checkbox",
          name: "addable",
          label: '可新增',
        },
        {
          type: "checkbox",
          name: "editable",
          label: '可编辑',
        },
        {
          type: "checkbox",
          name: "removable",
          label: '可删除',
        },
        {
          type: "checkbox",
          name: "draggable",
          label: '可拖拽',
        },
        {
          type: "checkbox",
          name: "showIndex",
          label: '显示序号',
        },
        {
          "type": "input-number",
          "name": "perPage",
          "label": "每页展示条数",
          "labelRemark": "如果为空则不进行分页"
        }
      ]
    }
  }
};
