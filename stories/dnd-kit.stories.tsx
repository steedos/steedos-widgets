import React from 'react';
import {rectSortingStrategy} from '@dnd-kit/sortable';

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
  X: ['XX1', 'XX2'],
  Y: ['YY2', 'YY2']
}

export const Simple = () => <MultipleContainers/>;

export const withItems = () => <MultipleContainers items={items}/>;

export const Vertical = () => <MultipleContainers itemCount={5} vertical />;

export const Grid = () => (
  <MultipleContainers
    columns={2}
    strategy={rectSortingStrategy}
    wrapperStyle={() => ({
      width: 150,
      height: 150,
    })}
  />
);