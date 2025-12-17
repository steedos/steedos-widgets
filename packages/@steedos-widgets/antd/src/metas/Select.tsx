/*
 * @Description: Configuration definition for the Antd Select Amis Custom Component.
 */

// Removed i18next dependency (t function)

const config: any = {
  // 1. Base Configuration
  group: 'Antd', 
  componentName: "AntdSelect", 
  title: 'Select',
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/antd", 
    version: "{{version}}",
    exportName: "AntdSelect", 
    main: "",
    destructuring: true,
    subName: ""
  },
  preview: { 
    placeholder: "Please select",
    options: [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
    ]
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],

  // 2. Amis Core Configuration
  amis: {
    name: 'antd-select', 
    icon: "fa-fw fas fa-caret-square-down" 
  }
};

export default {
  ...config,
  
  // 3. Snippets Configuration
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

  // 4. Amis Renderer and Editor Plugin Configuration
  amis: {
    render: { 
        type: config.amis.name, 
        usage: "formitem", 
        weight: 1, 
        framework: "react" 
    },
    
    plugin: {
      rendererName: config.amis.name,
      $schema: '/schemas/FormItem.json', 
      name: config.title,
      description: config.title,
      tags: [config.group],
      order: -9999,
      icon: config.amis.icon,
      
      scaffold: {
        type: config.amis.name,
        label: config.title,
        name: 'select_field',
        options: [
            { label: 'Option One', value: 'one' },
            { label: 'Option Two', value: 'two' },
        ]
      },
      
      previewSchema: { type: config.amis.name, label: 'Preview', placeholder: 'Please select' },
      panelTitle: 'Select Dropdown Settings',
      
      // ====== OPTIMIZED PANEL CONTROLS (General & Advanced Tabs) START ======
      panelControls: [
        { 
            type: 'tabs',
            tabs: [
                // =================================== 标签页 1: General ===================================
                {
                    title: 'General',
                    body: [
                        { type: 'switch', name: 'selectProps.allowClear', label: 'Allow Clear', value: true },
                        { type: 'switch', name: 'isLoading', label: 'Show Loading Indicator' },
                        {
                            type: 'select',
                            name: 'selectProps.mode', 
                            label: 'Selection Mode',
                            options: [
                                { label: 'Single Select (Default)', value: undefined },
                                { label: 'Multiple Select', value: 'multiple' },
                                { label: 'Tags', value: 'tags' }
                            ]
                        },
                        {
                            type: 'switch',
                            name: 'selectProps.showSearch', 
                            label: 'Enable Search',
                            pipeIn: (value: any) => value !== false, 
                        },
                        {
                            type: 'select',
                            name: 'selectProps.size', 
                            label: 'Size',
                            options: [
                                { label: 'Default', value: 'default' },
                                { label: 'Large', value: 'large' },
                                { label: 'Small', value: 'small' }
                            ],
                            value: 'default',
                        },
                        { type: 'switch', name: 'selectProps.bordered', label: 'Show Border', value: true },
                        {
                            type: 'combo',
                            name: 'options',
                            label: 'Options',
                            "multiLine": true,
                            multiple: true,
                            items: [
                                { type: 'input-text', name: 'label', label: 'Display Value' },
                                { type: 'input-text', name: 'value', label: 'Actual Value' }
                            ]
                        },
                        { type: 'input-text', name: 'source', label: 'API Data Source (URL)' } 
                    ]
                },

                // =================================== 标签页 2: Advanced ===================================
                {
                    title: 'Advanced',
                    body: [
                        // --- Custom Option Template (NEW) ---
                        {
                            type: 'textarea', // 接收文本模板
                            name: 'selectProps.optionTpl', // 新属性名
                            label: 'Custom Option Template',
                            description: 'Use Amis template syntax (e.g., <span>\\${label} (\\${value})</span>) to render each option item.',
                            language: 'html', // 方便输入 HTML 结构
                        },
                        // --- Custom Option Template (NEW) ---
                        {
                            type: 'textarea', // 接收文本模板
                            name: 'selectProps.labelTpl', // 新属性名
                            label: 'Custom Label Template',
                            description: 'Use Amis template syntax (e.g., <span>\\${label} (\\${value})</span>) to render each option item.',
                            language: 'html', // 方便输入 HTML 结构
                        },

                        // --- Multi-select Tagging ---
                        {
                            type: 'number',
                            name: 'selectProps.maxTagCount',
                            label: 'Max Tags to Display',
                            description: 'When exceeded, remaining tags are collapsed.',
                            min: 0,
                            visibleOn: 'this.selectProps && (this.selectProps.mode === "multiple" || this.selectProps.mode === "tags")',
                        },
                        {
                            type: 'select',
                            name: 'selectProps.maxTagPlaceholder',
                            label: 'Overflow Tag Placeholder',
                            options: [
                                { label: 'Default (count)', value: undefined },
                                { label: 'Custom text...', value: 'expression' } 
                            ],
                            visibleOn: 'this.selectProps && (this.selectProps.mode === "multiple" || this.selectProps.mode === "tags")',
                        },

                        // --- Input Limits ---
                        {
                            type: 'number',
                            name: 'selectProps.maxLength',
                            label: 'Max Input Length (Search)',
                        },
                        
                        // --- Dropdown Overlay ---
                        {
                            type: 'switch',
                            name: 'selectProps.dropdownMatchSelectWidth',
                            label: 'Dropdown Width Match',
                            value: true,
                        },
                        {
                            type: 'input-text',
                            name: 'selectProps.dropdownClassName',
                            label: 'Dropdown Class Name',
                        },
                        
                    ]
                }
            ]
        }
      ]
    }
  }
};