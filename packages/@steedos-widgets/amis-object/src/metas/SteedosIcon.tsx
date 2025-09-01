/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-11 09:39:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-09 19:01:32
 * @Description: 
 */
const t = (window as any).steedosI18next.t;

const config: any = {
  group: t('widgets-meta:steedos-icon_group', '华炎魔方-原子组件'),
  componentName: "SteedosIcon",
  title: t('widgets-meta:steedos-icon_title', '图标'),
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/amis-object",
    version: "{{version}}",
    exportName: "SteedosIcon",
    main: "",
    destructuring: true,
    subName: ""
  },
  preview: {},
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],
  amis: {
    name: 'steedos-icon',
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
      description: config.title,
      tags: [config.group],
      order: -9999,
      icon: config.amis.icon,
      scaffold: {
        type: config.amis.name,
        category: 'standard',
        name: 'account',
        colorVariant: 'default',
        size: 'medium'
      },
      previewSchema: { type: config.amis.name },
      panelTitle: t('widgets-meta:steedos-icon_panelTitle', '设置'),
      panelControls: [
        {
          type: "select",
          name: "category",
          label: t('widgets-meta:steedos-icon_category', '分类'),
          options: [
            {label: 'action', value: 'action'},
            {label: 'custom', value: 'custom'},
            {label: 'doctype', value: 'doctype'},
            {label: 'standard', value: 'standard'},
            {label: 'utility', value: 'utility'}
          ]
        },
        {
          name: "name",
          label: t('widgets-meta:steedos-icon_name', '名称'),
          type: "select",
          className: "m-0",
          labelClassName: "text-left",
          id: "u:d0724fe17aa7",
          required: true,
          joinValues: false,
          extractValue: true,
          labelField: "symbol",
          valueField: "symbol",
          multiple: false,
          searchable: true,
          source: {
            method: "get",
            url: "${context.rootUrl}/ui.icons.json?c=${category}",
            requestAdaptor: "",
            data: { category: "${category}" },
            adaptor: "if (payload && payload.length) {\n  let data = {};\n  let sldsStandardIcons = _.find(payload, { name: api.body.category || \"standard\" });\n  sldsStandardIcons = sldsStandardIcons && sldsStandardIcons.icons;\n  data.options = sldsStandardIcons;\n  payload.data = data;\n}\nreturn payload;\n",
            headers: { Authorization: "Bearer ${context.tenantId},${context.authToken}" },
            sendOn: "this.category"
          }
        },
        { type: "text", name: "className", label: t('widgets-meta:steedos-icon_className', 'ClassName') },
        { type: "text", name: "containerClassName", label: t('widgets-meta:steedos-icon_containerClassName', '容器 ClassName') },
        {
          type: "select",
          name: "colorVariant",
          label: t('widgets-meta:steedos-icon_colorVariant', '图标颜色'),
          options: [
            {label: 'base', value: 'base'},
            {label: 'default', value: 'default'},
            {label: 'error', value: 'error'},
            {label: 'light', value: 'light'},
            {label: 'warning', value: 'warning'}
          ]
        },
        {
          type: "select",
          name: "size",
          label: t('widgets-meta:steedos-icon_size', '图标大小'),
          options: [
            {label: 'xx-small', value: 'xx-small'},
            {label: 'x-small', value: 'x-small'},
            {label: 'small', value: 'small'},
            {label: 'medium', value: 'medium'},
            {label: 'large', value: 'large'}
          ]
        },
        { type: 'text', name: 'basePath', label: t('widgets-meta:steedos-icon_basePath', '基础路径') }
      ]
    }
  }
};
