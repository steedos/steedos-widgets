import React from 'react';
import {rectSortingStrategy} from '@dnd-kit/sortable';

import {MultipleContainers} from '@steedos-widgets/sortable'
//import {MultipleContainers} from '../packages/sortable/src' 

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Sortable/MultipleContainers',
  component: MultipleContainers,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const items = {
  X: ['A1', 'X2'],
  Y: ['Y2', 'Y2']
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
      height: 50,
    })}
  />
);


export const VerticalGrid = () => (
  <MultipleContainers
    columns={2}
    strategy={rectSortingStrategy}
    wrapperStyle={() => ({
      width: 150,
      height: 50,
    })}
    vertical
  />
);