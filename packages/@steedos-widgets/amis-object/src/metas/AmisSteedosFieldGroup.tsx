/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-11 09:39:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-10-08 15:04:40
 * @Description: 
 */
const t = (window as any).steedosI18next.t; // 确保国际化函数能被使用

const config: any = {
    // componentType: 'amisSchema', 
    group: t('widgets-meta:steedos-field-group_sfield_tab_group', '字段'),
    componentName: "SteedosFieldSet",
    title: t('widgets-meta:steedos-field-group_title', '分组'),
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
        order: -100000,
        icon: config.amis.icon,
        filterProps: function(props, node){
            props.collapsed = false;
            return props;
        }.toString(),
        scaffold: {
            title: t('widgets-meta:steedos-field-group_scaffold_title', '分组'),
            collapsable: true,
            type: 'steedos-field-group',
            body: [],// 容器类字段
        },
        // 容器类组件必需字段
        regions: [
          {
            key: 'body',
            label: t('widgets-meta:steedos-field-group_regions_body_label', '字段项'),
            renderMethod: 'renderBody',
            insertPosition: 'inner',
            accept: function(json){
              if(json.type === 'steedos-field-group'){
                return false;
              }
              return true
            }.toString()
          },
        ],
        previewSchema: {
          type: config.amis.name,
        },
        panelTitle: t('widgets-meta:steedos-field-group_panel_title', "设置"),
        panelControls: [
          {
            type: 'text',
            name: 'title',
            label: t('widgets-meta:steedos-field-group_panel_controls_title_label', '标题')
          },
          {
            type: 'switch',
            name: 'collapsed',
            label: t('widgets-meta:steedos-field-group_panel_controls_collapsed_label', '默认是否折叠')
          },
          {
            type: 'input-formula',
            name: 'visible_on',
            label: t('widgets-meta:steedos-field-group_panel_controls_visible_on_label', '显示条件')
          }
        ]
      }
    }
  };