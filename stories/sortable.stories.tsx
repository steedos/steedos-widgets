import React from 'react';
import {rectSortingStrategy} from '@dnd-kit/sortable';

import {MultipleContainers} from '@steedos-widgets/sortable'
//import {MultipleContainers} from '../packages/sortable/src' 

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Sortable',
  component: MultipleContainers,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const defaultValue = {
  X: ['A1', 'B1'],
  Y: ['A2', 'B2']
}


const containerSource = [
  {
    id: 'X',
    title: 'Board X',
  },
  {
    id: 'Y',
    title: 'Board Y'
  }
]

const itemSource = [
  {
    id: 'A1',
    title: 'Item A1'
  },
  {
    id: 'B1',
    title: 'Item B1'
  },
]

export const Simple = () => <MultipleContainers/>;

export const withItems = () => <MultipleContainers defaultValue={defaultValue}/>;

export const withSource = () => <MultipleContainers containerSource={containerSource} itemSource={itemSource} defaultValue={defaultValue}/>;

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