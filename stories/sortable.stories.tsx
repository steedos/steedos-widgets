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
  A: ['A1', 'B1'],
  B: ['A2', 'B2']
}


const containerSource = [
  {
    id: 'A',
    label: 'Board A',
  },
  {
    id: 'B',
    label: 'Board B'
  }
]

const itemSource = [
  {
    id: 'A1',
    label: 'Item A1',
    columnSpan: 2,
    color: 'red'
  },
  {
    id: 'A2',
    label: 'Item A2',
    columnSpan: 1,
    color: 'blue'
  },
  {
    id: 'B1',
    label: 'Item B1',
    color: 'green'
  },,
  {
    id: 'B2',
    label: 'Item B2',
    color: 'silver'
  },
]

const itemBody = [{
  "type": "tpl",
  "tpl": "${label}",
  "inline": false,
}]

export const Simple = () => <MultipleContainers/>;

export const withItems = () => <MultipleContainers defaultValue={defaultValue}/>;

export const withItemTemplate = () => <MultipleContainers defaultValue={defaultValue} itemBody={itemBody}/>;

export const withSource = () => <MultipleContainers containerSource={containerSource} itemSource={itemSource} defaultValue={defaultValue}/>;

export const Vertical = () => <MultipleContainers itemCount={5} vertical />;

export const Grid = () => (
  <MultipleContainers
    columns={2}
    containerSource={containerSource} 
    itemSource={itemSource}
    strategy={rectSortingStrategy}
    wrapperStyle={() => ({
      height: 50,
    })}
  />
);


export const VerticalGrid = () => (
  <MultipleContainers
    columns={3}
    containerSource={containerSource} 
    itemSource={itemSource}
    strategy={rectSortingStrategy}
    wrapperStyle={() => ({
      height: 50,
    })}
    vertical
  />
);