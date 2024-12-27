import React from 'react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Amis/Liveblocks',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export const Simple = () => {
  const schema = {
    type: 'page',
    title: 'Hello',
    toolbar: [
      {
        type: 'rooms-provider',
        baseUrl: process.env.B6_HOST,
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
        baseUrl: process.env.B6_HOST,
        body: [
          {
            type: 'rooms-comments',
            className: 'flex flex-col m-3 gap-3',
            roomId: `001`,
          },
        ],
      },
    ],
  };
  const data = {};
  const env = {
    assetUrls: [
      `https://unpkg.com/@steedos-widgets/liveblocks@6.3.12-beta.6/dist/assets.json`,
    ],
  };
  return renderAmisSchema(schema, data, env)
};
