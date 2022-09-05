import React from 'react';

import {MultipleContainers} from '@steedos-widgets/dnd-kit'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/MultipleContainers',
  component: MultipleContainers,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export const Simple =<MultipleContainers />;