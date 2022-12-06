import React from 'react';

import { FullCalendar } from '@steedos-widgets/fullcalendar'

let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T12:00:00'
  },
  {
    id: createEventId(),
    title: 'Timed event 2',
    start: todayStr + 'T12:05:00'
  }
]

function createEventId() {
  return String(eventGuid++)
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'React/Full Calendar',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export const Simple = () => (
    <FullCalendar
        initialEvents={INITIAL_EVENTS}
    />
);

export const ReadOnly = () => (
    <FullCalendar
        initialEvents={INITIAL_EVENTS}
        editable={false}
    />
);
