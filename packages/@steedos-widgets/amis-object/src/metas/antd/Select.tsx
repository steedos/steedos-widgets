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
    package: "@steedos-widgets/amis-object", // Replace with your actual package name
    version: "{{version}}",
    exportName: "AntdSelect", 
    main: "",
    destructuring: true,
    subName: ""
  },
  preview: { // Default props for preview
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
    name: 'antd-select', // Amis Renderer Type Name
    icon: "fa-fw fa fa-angle-down" // Icon for the component
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
    // Renderer Registration Info
    render: { 
        type: config.amis.name, 
        usage: "formitem", // Declares this as a form item component
        weight: 1, 
        framework: "react" 
    },
    
    // Editor Plugin Configuration
    plugin: {
      rendererName: config.amis.name,
      $schema: '/schemas/FormItem.json', 
      name: config.title,
      description: config.title,
      tags: [config.group],
      order: -9999,
      icon: config.amis.icon,
      
      // Default scaffolding structure
      scaffold: {
        type: config.amis.name,
        label: config.title,
        options: [
            { label: 'Option One', value: 'one' },
            { label: 'Option Two', value: 'two' },
        ]
      },
      
      previewSchema: { type: config.amis.name, label: 'Preview', placeholder: 'Please select' },
      panelTitle: 'Select Dropdown Settings',
      
      // Controls for the editor's right-side property panel
      panelControls: [
        // ====== Basic Properties ======
        { 
            type: 'text', 
            name: 'label', 
            label: 'Label' 
        },
        { 
            type: 'text', 
            name: 'name', 
            label: 'Field Name' 
        },
        { 
            type: 'text', 
            name: 'placeholder', 
            label: 'Placeholder Text' 
        },
        
        // ====== Options Configuration ======
        {
          type: 'combo',
          name: 'options',
          label: 'Options Configuration',
          multiple: true,
          items: [
            { type: 'text', name: 'label', label: 'Display Value' },
            { type: 'text', name: 'value', label: 'Actual Value' }
          ]
        },
        {
            type: 'switch',
            name: 'selectProps.showSearch', // Maps to the selectProps object
            label: 'Searchable',
            pipeIn: (value: any) => value !== false, 
        },
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
            name: 'required', // Amis Form validation property
            label: 'Is Required',
        }]
    }
  }
};