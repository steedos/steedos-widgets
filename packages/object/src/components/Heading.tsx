import React from 'react';

// Register our heading component for use in
// the visual editor
export const Heading = (props:any) => (
  <h1 className="my-heading">{props.title}</h1>
)
  
const config = {
  name: 'heading',
  label: '标题',
  inputs: [{ name: 'title', type: 'text' }],
  amis: {
    weight: 99,
    icon: 'fa fa-file-code-o',
    tags: ['华炎魔方'],
    panelTitle: '配置',
    panelControls: [
      {
        type: 'text',
        name: 'title',
        label: '标题',
      },
    ],
  },
  previewSchema: {
    title: 'Hello World!'
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