import React from 'react';

import { Calendar } from '@steedos-widgets/fullcalendar'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Full Calendar',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export const Simple = () => <Calendar/>;
