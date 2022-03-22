export const objectFormConfig = {
    name: 'steedos-object-form',
    inputs: [
      { name: 'objectApiName', type: 'text', friendlyName: "对象名" },
      { name: 'recordId', type: 'text', friendlyName: "记录ID" },
      { name: 'mode', type: 'text', friendlyName: "Mode", defaultValue: "edit" }, 
      { name: 'editable', type: 'text', friendlyName: "Editable" }
    ],
    canHaveChildren: true
  };
  

const config = {
  name: 'steedos-object-form',
  label: '对象表单',
  inputs: [{ name: 'objectApiName', type: 'text' }],
  amis: {
    weight: 99,
    icon: 'fa fa-file-code-o',
    tags: ['华炎魔方'],
    panelTitle: '配置',
    panelControls: [
      {
        type: 'text',
        name: 'objectApiName',
        label: '标题',
      },
    ],
  },
  previewSchema: {
    objectApiName: 'space_users'
  }
}

const builderConfig = {
  name: config.name,
  inputs: config.inputs,
}

const amisRenderConfig = {
  type: config.name,
  usage: 'renderer',
  weight: config.amis.weight,
  framework: 'react',
}

const amisPluginConfig = {
  rendererName: config.name,
  // $schema: '/schemas/UnkownSchema.json',
  name: config.name,
  description: config.label,
  tags: config.amis.tags,
  icon: config.amis.icon,
  scaffold: {
    type: config.name,
    label: config.label,
    name: config.name,      
    ...config.previewSchema,
  },
  previewSchema: {
    type: config.name,
    ...config.previewSchema,
  },
  panelTitle: config.amis.panelTitle,
  panelControls: config.amis.panelControls,
}

export default {
  ...config,
  builderConfig,
  amisRenderConfig,
  amisPluginConfig,  
}