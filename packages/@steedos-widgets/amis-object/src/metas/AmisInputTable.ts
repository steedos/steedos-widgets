/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-11-15 09:50:22
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-12-14 11:56:41
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
      name: "inlineEditMode",
      propType: "boolean",
      description: '内联模式',
    },
    {
      name: "strictMode",
      propType: "boolean",
      description: '静态模式',
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
        strictMode: true,
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
        strictMode: true,
        showIndex: false
      },
      panelTitle: "设置",
      panelControls: [
        {
          "type": "input-text",
          "name": "name",
          mode: "horizontal",
          horizontal: {
            left: 3,
            right: 9,
            justify: true
          },
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
          type: "editor",
          name: "columns",
          label: "显示的列",
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
          type: "switch",
          name: "addable",
          mode: "horizontal",
          horizontal: {
            left: 9,
            right: 4,
            justify: true
          },
          label: '可新增',
        },
        {
          type: "switch",
          name: "editable",
          mode: "horizontal",
          horizontal: {
            left: 9,
            right: 4,
            justify: true
          },
          label: '可编辑',
        },
        {
          type: "switch",
          name: "removable",
          mode: "horizontal",
          horizontal: {
            left: 9,
            right: 4,
            justify: true
          },
          label: '可删除',
        },
        {
          type: "switch",
          name: "draggable",
          mode: "horizontal",
          horizontal: {
            left: 9,
            right: 4,
            justify: true
          },
          label: '可拖拽',
        },
        {
          type: "switch",
          name: "inlineEditMode",
          mode: "horizontal",
          labelRemark: "可编辑时显示为内联模式直接在单元格中编辑字段值。",
          horizontal: {
            left: 9,
            right: 4,
            justify: true
          },
          label: '内联模式',
        },
        {
          type: "switch",
          name: "strictMode",
          mode: "horizontal",
          labelRemark: "为了性能，默认其他表单项项值变化不会让当前表格更新，有时候为了同步获取主表单项字段值，比如有类型为lookup且配置了depend_on属性的子字段时，需要关闭静态模式。",
          horizontal: {
            left: 9,
            right: 4,
            justify: true
          },
          label: '静态模式',
        },
        {
          type: "switch",
          name: "showIndex",
          mode: "horizontal",
          horizontal: {
            left: 9,
            right: 4,
            justify: true
          },
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
