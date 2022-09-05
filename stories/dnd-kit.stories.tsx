import React from 'react';

import {MultipleContainers} from '@steedos-widgets/dnd-kit'
//import {MultipleContainers} from '../packages/dnd-kit/src' 

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'MultipleContainers',
  component: MultipleContainers,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const items = {
  A: ['A1', 'A2'],
  B: ['B1', 'B2']
}

export const Simple = <MultipleContainers/>;