/*
 * @Description: Configuration definition for the Liquid Template Amis Custom Component.
 */

const config = {
  // 1. Base Configuration
  group: 'General', // 或者 'Display'
  componentName: "LiquidComponent", 
  title: 'Liquid Template',
  docUrl: "", // 可以填入 LiquidJS 的官方文档链接
  screenshot: "",
  npm: {
    package: "@steedos-widgets/antd", // 请修改为你实际发布的包名
    version: "{{version}}",
    exportName: "LiquidComponent", 
    main: "",
    destructuring: true,
    subName: ""
  },
  preview: { 
    template: "Hello {{name}}!",
    data: { name: "World" }
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],

  // 2. Amis Core Configuration
  amis: {
    name: 'liquid', // 对应 React 组件 @Renderer 中的 name
    icon: "fa-fw fas fa-code" 
  }
};

export default {
  ...config,
  
  // 3. Snippets Configuration (拖拽组件时的默认代码片段)
  snippets: [
    {
      title: config.title,
      screenshot: "",
      schema: { 
          type: config.amis.name,
          template: "<div>\n  <h3>{{title}}</h3>\n  <p>User: {{user.name}}</p>\n</div>", 
          data: {
            title: "Demo",
            user: { name: "Steedos User" }
          }
      }
    }
  ],

  // 4. Amis Renderer and Editor Plugin Configuration
  amis: {
    render: { 
        type: config.amis.name, 
        usage: "renderer", // 这是一个展示型组件，不是表单项，所以用 renderer
        weight: 1, 
        framework: "react" 
    },
    
    plugin: {
      rendererName: config.amis.name,
      $schema: '/schemas/UnkownSchema.json', 
      name: config.title,
      description: "Render HTML using LiquidJS template engine",
      tags: [config.group],
      order: 99,
      icon: config.amis.icon,
      
      // 容器类组件必需字段
      regions: [
        {
          key: 'body',
          label: 'Partials',
          insertPosition: 'inner',
        },
      ],
      scaffold: {
        type: config.amis.name,
        template: "Hello {{name}}",
      },
      
      previewSchema: { 
        type: config.amis.name, 
        template: "Preview: {{text}}",
      },
      panelTitle: 'Liquid Settings',
      
      // ====== DESIGNER PANEL CONTROLS ======
      panelControls: [
        { 
            type: 'tabs',
            tabs: [
                // =================================== 标签页 1: General (核心设置) ===================================
                {
                    title: 'General',
                    body: [
                        {
                            type: 'editor', // 使用代码编辑器，方便写多行模板
                            language: 'html', // Liquid 语法接近 HTML
                            name: 'template',
                            label: 'Template String',
                            description: 'Support LiquidJS syntax (e.g., {{variable}}, {% if condition %}). HTML is allowed.',
                            options: {
                                lineNumbers: true
                            }
                        },
                        {
                            type: 'input-text',
                            name: 'visibleOn',
                            label: 'Visible Expression',
                            description: 'Amis expression to control visibility.'
                        }
                    ]
                },

                // =================================== 标签页 2: Appearance (外观) ===================================
                {
                    title: 'Appearance',
                    body: [
                        {
                            type: 'input-text',
                            name: 'className',
                            label: 'CSS Class Name',
                            description: 'Custom class for the container div.'
                        },
                        {
                            type: 'input-text',
                            name: 'style', 
                            label: 'Inline Style',
                            placeholder: 'e.g. color: red; margin: 10px;'
                        }
                    ]
                },
            ]
        }
      ]
    }
  }
};