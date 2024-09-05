/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-11 09:39:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-09-05 15:53:41
 * @Description: 
 */
const config: any = {
    // componentType: 'amisSchema', 
    group: "字段",
    componentName: "SteedosFieldSet",
    title: "分组",
    docUrl: "",
    screenshot: "",
    npm: {
      package: "@steedos-widgets/amis-object",
      version: "{{version}}",
      exportName: "SteedosFieldSet",
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
      name: 'steedos-field-group',
      icon: "fa-fw fa fa-object-group"
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
        filterProps: function(props, node){
            props.collapsed = false;
            return props;
        }.toString(),
        scaffold: {
            title: '分组',
            collapsable: true,
            type: 'steedos-field-group',
            body: [{type: 'sfield-text', amis: {}}],// 容器类字段
        },
        // 容器类组件必需字段
        regions: [
          {
            key: 'body',
            label: '内容区',
            renderMethod: 'renderBody',
            insertPosition: 'inner',
          },
        ],
        previewSchema: {
          type: config.amis.name,
        },
        panelTitle: "设置",
        panelControls: [
          {
            type: 'text',
            name: 'title',
            label: '标题'
          },
          {
            type: 'switch',
            name: 'collapsed',
            label: '默认是否折叠'
          },
          {
            type: 'input-formula',
            name: 'visible_on',
            label: '显示条件'
          }
        ]
      }
    }
  };
  