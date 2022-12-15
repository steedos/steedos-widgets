/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-11 09:39:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-14 14:54:10
 * @Description: 
 */
const config: any = {
    // componentType: 'amisSchema', 
    group: "华炎魔方",
    componentName: "SteedosIcon",
    title: "Icon",
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
    preview: {
    },
    targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
    engines: ["amis"],
    // settings for amis.
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
        order: -9999,
        icon: config.amis.icon,
        scaffold: {
          type: config.amis.name,
          category: 'standard',
          name: 'account',
          colorVariant: 'default',
          size: 'medium'
        },
        previewSchema: {
          type: config.amis.name,
        },
        panelTitle: "设置",
        panelControls: [
          {
            type: "select",
            name: "category",
            label: "Category",
            options: [
              {label: 'action', value: 'action'},
              {label: 'custom', value: 'custom'},
              {label: 'doctype', value: 'doctype'},
              {label: 'standard', value: 'standard'},
              {label: 'utility', value: 'utility'},
            ]
          },
          {
            type: "text",
            name: "name",
            label: "名称"
          },
          {
            type: "text",
            name: "className",
            label: "ClassName"
          },
          {
            type: "text",
            name: "containerClassName",
            label: "Container ClassName"
          },
          {
            type: "select",
            name: "colorVariant",
            label: "Icon color variants",
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
            label: "Size of the icon",
            options: [
              {label: 'xx-small', value: 'xx-small'},
              {label: 'x-small', value: 'x-small'},
              {label: 'small', value: 'small'},
              {label: 'medium', value: 'medium'},
              {label: 'large', value: 'large'},
            ]
          },
          {
            type: 'text',
            name: 'basePath',
            label: 'Base Path'
          }
        ]
      }
    }
  };
  