import React from 'react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Amis/Liveblocks',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

const data = {
  ...Builder.settings,
};




export const Comments = () => {
  const roomId = 'test';
  const schema = {
    type: 'page',
    title: '${context.rootUrl}',
    body: [
      {
        type: 'rooms-provider',
        baseUrl: '${context.rootUrl}',
        body: [
          {
            type: 'rooms-comments',
            className: 'flex flex-col m-3 gap-3',
            roomId: `${roomId}`,
          },
        ],
      },
    ],
  };
  const env = {
    assetUrls: [
      `${process.env.STEEDOS_UNPKG_URL}/@steedos-widgets/liveblocks@6.3.12-beta.6/dist/assets.json`,
    ],
  };
  return renderAmisSchema(schema, data, env)
};


export const InboxNotification = () => {
  const roomId = 'test';
  const schema = {
    type: 'page',
    title: '${context.rootUrl}',
    body: [
      {
        type: 'rooms-provider',
        baseUrl: '${context.rootUrl}',
        body: {
          type: 'wrapper',
          className: 'p-4',
          body: {
            type: 'rooms-inbox-popover',
          },
        },
      },
    ],
  };
  const env = {
    assetUrls: [
      `${process.env.STEEDOS_UNPKG_URL}/@steedos-widgets/liveblocks@6.3.12-beta.6/dist/assets.json`,
    ],
  };
  return renderAmisSchema(schema, data, env)
};


export const Full = () => {
  const roomId = 'test';
  const schema = {
    type: 'page',
    title: '${context.rootUrl}',
    regions: ['body', 'toolbar', 'header'],
    toolbar: [
      {
        type: 'rooms-provider',
        baseUrl: '${context.rootUrl}',
        body: {
          type: 'wrapper',
          className: 'p-4',
          body: {
            type: 'rooms-inbox-popover',
          },
        },
      },
    ],
    body: [
      {
        type: 'rooms-provider',
        baseUrl: '${context.rootUrl}',
        body: [
          {
            type: 'rooms-comments',
            className: 'flex flex-col m-3 gap-3',
            roomId: `${roomId}`,
          },
        ],
      },
    ],
  };
  const env = {
    assetUrls: [
      `${process.env.STEEDOS_UNPKG_URL}/@steedos-widgets/liveblocks@6.3.12-beta.6/dist/assets.json`,
    ],
  };
  return renderAmisSchema(schema, data, env)
};
