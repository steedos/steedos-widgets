/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-11-15 09:50:22
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-12-14 14:51:35
 */
const t = (window as any).steedosI18next.t;

const config: any = {
  componentType: 'amisSchema', // amisSchema || react 
  group: t('widgets-meta:steedos-input-table_group', '华炎魔方'),
  componentName: "AmisInputTable",
  title: t('widgets-meta:steedos-input-table_title', '表格编辑框'),
  description: t('widgets-meta:steedos-input-table_description', '表格编辑组件，对amis input-table组件的进一步封装。'),
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
    { name: "name", propType: "string", description: t('widgets-meta:steedos-input-table_props_name', '字段名') },
    { name: "fields", propType: "json", description: t('widgets-meta:steedos-input-table_props_fields', '字段配置') },
    { name: "addable", propType: "boolean", description: t('widgets-meta:steedos-input-table_props_addable', '可新增') },
    { name: "editable", propType: "boolean", description: t('widgets-meta:steedos-input-table_props_editable', '可编辑') },
    { name: "removable", propType: "boolean", description: t('widgets-meta:steedos-input-table_props_removable', '可删除') },
    { name: "draggable", propType: "boolean", description: t('widgets-meta:steedos-input-table_props_draggable', '可拖拽') },
    { name: "inlineEditMode", propType: "boolean", description: t('widgets-meta:steedos-input-table_props_inlineEditMode', '内联模式') },
    { name: "strictMode", propType: "boolean", description: t('widgets-meta:steedos-input-table_props_strictMode', '静态模式') },
    { name: "perPage", propType: "number", description: t('widgets-meta:steedos-input-table_props_perPage', '每页展示条数') },
    { name: "enableDialog", propType: "boolean", description: t('widgets-meta:steedos-input-table_props_enableDialog', '启用弹框模式') }
  ],
  preview: {},
  targets: ["steedos__RecordPage"],
  engines: ["amis"],
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
      schema: { componentName: config.componentName, props: config.preview }
    }
  ],
  amis: {
    render: { type: config.amis.name, usage: "renderer", weight: 1, framework: "react" },
    plugin: {
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
          { name: "a", label: t('widgets-meta:steedos-input-table_scaffold_fields_a', 'A'), type: "text" },
          {
            name: "b",
            label: t('widgets-meta:steedos-input-table_scaffold_fields_b', 'B'),
            type: "select",
            options: [
              { label: t('widgets-meta:steedos-input-table_scaffold_fields_b_options_op1', '选项1'), value: "op1" },
              { label: t('widgets-meta:steedos-input-table_scaffold_fields_b_options_op2', '选项2'), value: "op2" }
            ]
          }
        ],
        addable: false,
        editable: false,
        removable: false,
        draggable: false,
        strictMode: true,
        enableDialog: true
      },
      previewSchema: {
        type: config.amis.name,
        fields: [
          { name: "a", label: t('widgets-meta:steedos-input-table_preview_fields_a', 'A'), type: "text" },
          {
            name: "b",
            label: t('widgets-meta:steedos-input-table_preview_fields_b', 'B'),
            type: "select",
            options: [
              { label: t('widgets-meta:steedos-input-table_preview_fields_b_options_op1', '选项1'), value: "op1" },
              { label: t('widgets-meta:steedos-input-table_preview_fields_b_options_op2', '选项2'), value: "op2" }
            ]
          }
        ],
        addable: false,
        editable: false,
        removable: false,
        draggable: false,
        strictMode: true,
        enableDialog: true
      },
      panelTitle: t('widgets-meta:steedos-input-table_panelTitle', '设置'),
      panelControls: [
        { type: "input-text", name: "name", mode: "horizontal", horizontal: { left: 3, right: 9, justify: true }, label: t('widgets-meta:steedos-input-table_panelControls_name', '字段名') },
        { type: "editor", name: "fields", label: t('widgets-meta:steedos-input-table_panelControls_fields', '字段配置'), options: { lineNumbers: "off" }, pipeOut: (value) => { try { return value ? JSON.parse(value) : null; } catch (e) {} return value; }, language: "json" },
        { type: "editor", name: "columns", label: t('widgets-meta:steedos-input-table_panelControls_columns', '显示的列'), options: { lineNumbers: "off" }, pipeOut: (value) => { try { return value ? JSON.parse(value) : null; } catch (e) {} return value; }, language: "json" },
        { type: "switch", name: "addable", mode: "horizontal", horizontal: { left: 9, right: 4, justify: true }, label: t('widgets-meta:steedos-input-table_panelControls_addable', '可新增') },
        { type: "switch", name: "editable", mode: "horizontal", horizontal: { left: 9, right: 4, justify: true }, label: t('widgets-meta:steedos-input-table_panelControls_editable', '可编辑') },
        { type: "switch", name: "removable", mode: "horizontal", horizontal: { left: 9, right: 4, justify: true }, label: t('widgets-meta:steedos-input-table_panelControls_removable', '可删除') },
        { type: "switch", name: "draggable", mode: "horizontal", horizontal: { left: 9, right: 4, justify: true }, label: t('widgets-meta:steedos-input-table_panelControls_draggable', '可拖拽') },
        { type: "switch", name: "inlineEditMode", mode: "horizontal", labelRemark: t('widgets-meta:steedos-input-table_panelControls_inlineEditMode_remark', '可编辑时显示为内联模式直接在单元格中编辑字段值。'), horizontal: { left: 9, right: 4, justify: true }, label: t('widgets-meta:steedos-input-table_panelControls_inlineEditMode', '内联模式'), visibleOn: "${enableDialog != false}" },
        { type: "switch", name: "strictMode", mode: "horizontal", labelRemark: t('widgets-meta:steedos-input-table_panelControls_strictMode_remark', '为了性能，默认其他表单项项值变化不会让当前表格更新，有时候为了同步获取其它主表单项字段值，需要关闭静态模式，当有类型为lookup且配置了depend_on属性的子字段时，会自动强制关闭静态模式。'), horizontal: { left: 9, right: 4, justify: true }, label: t('widgets-meta:steedos-input-table_panelControls_strictMode', '静态模式') },
        { type: "input-number", name: "perPage", label: t('widgets-meta:steedos-input-table_panelControls_perPage', '每页展示条数'), labelRemark: t('widgets-meta:steedos-input-table_panelControls_perPage_remark', '如果为空则不进行分页') },
        { type: "switch", name: "enableDialog", mode: "horizontal", labelRemark: t('widgets-meta:steedos-input-table_panelControls_enableDialog_remark', '禁用弹框模式时，自动开启內联模式'), horizontal: { left: 9, right: 4, justify: true }, label: t('widgets-meta:steedos-input-table_panelControls_enableDialog', '启用弹框模式') }
      ]
    }
  ]
};
