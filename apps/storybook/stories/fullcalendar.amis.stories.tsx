
import React from 'react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Amis/Full Calendar',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

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

export const Gerneral = () => {
  const schema = {
    "type": "steedos-fullcalendar",
    "label": "日程",
    "name": "fullcalendar",
    "id": "u:866648329263",
    "onEvent": {
      "getEvents": {
        "weight": 0,
        "actions": [
          {
            "componentId": "",
            "args": {
            },
            "actionType": "custom",
            "script": "console.log('getEvents'); console.log(event); const events = [{id: event.data.fetchInfo.start, title: event.data.fetchInfo.startStr, start: event.data.fetchInfo.start}]; console.log(events); event.data.successCallback(events);"
          }
        ]
      },
      "select": {
        "weight": 0,
        "actions": [
          {
            "componentId": "",
            "args": {
            },
            "actionType": "custom",
            "script": "console.log('select'); console.log(event);"
          }
        ]
      },
      "eventClick": {
        "weight": 0,
        "actions": [
          {
            "componentId": "",
            "args": {
            },
            "actionType": "custom",
            "script": "console.log('eventClick'); console.log(event);"
          }
        ]
      },
      "eventAdd": {
        "weight": 0,
        "actions": [
          {
            "componentId": "",
            "args": {
            },
            "actionType": "custom",
            "script": "console.log('eventAdd'); console.log(event);"
          }
        ]
      },
      "eventChange": {
        "weight": 0,
        "actions": [
          {
            "componentId": "",
            "args": {
            },
            "actionType": "custom",
            "script": "console.log('eventChange'); console.log(event);"
          }
        ]
      },
      "eventRemove": {
        "weight": 0,
        "actions": [
          {
            "componentId": "",
            "args": {
            },
            "actionType": "custom",
            "script": "console.log('eventRemove'); console.log(event);"
          }
        ]
      },
      "eventsSet": {
        "weight": 0,
        "actions": [
          {
            "componentId": "",
            "args": {
            },
            "actionType": "custom",
            "script": "console.log('eventsSet'); console.log(event);"
          }
        ]
      },
    }
  };
  const data = {};
  const env = {
    assetUrls: [
      `https://unpkg.steedos.cn/@steedos-widgets/fullcalendar/dist/assets-dev.json`,
    ],
    unpkgUrl: 'https://unpkg.steedos.cn'
  };
  return renderAmisSchema(schema, data, env)
};
