/*
 * @Description: Configuration definition for the Antd Select Amis Custom Component.
 */

// Removed i18next dependency (t function)

const config: any = {
  // 1. Base Configuration
  group: 'General', 
  componentName: "Inject", 
  title: 'Inject',
  docUrl: "",
  screenshot: "",
  npm: {
    package: "@steedos-widgets/antd", 
    version: "{{version}}",
    exportName: "Inject", 
    main: "",
    destructuring: true,
    subName: ""
  },
  targets: ["steedos__RecordPage", "steedos__AppPage", "steedos__HomePage"],
  engines: ["amis"],

  // 2. Amis Core Configuration
  amis: {
    name: 'inject', 
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
        usage: "renderer", 
        weight: 1, 
        framework: "react" 
    },
    
    plugin: {
      rendererName: config.amis.name,
      $schema: '/schemas/UnkownSchema.json', 
      name: config.title,
      description: "Inject css or js into the page head",
      tags: [config.group],
      order: 99,
      icon: config.amis.icon,
    }
  }
};