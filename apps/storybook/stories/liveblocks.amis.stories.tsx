import { React, AmisRender } from '../components/AmisRender';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Amis/Liveblocks',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};
const env = {
  assetUrls: [
    `${process.env.STEEDOS_UNPKG_URL}/@steedos-widgets/liveblocks@6.3.12-beta.6/dist/assets.json`,
  ],
}

const data = {
  roomId: 'test'
}

export const Comments = () => (
  <AmisRender schema = {{
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
            roomId: '${roomId}',
          },
        ],
      },
    ],
  }} data ={data} env = {env} />
);


export const InboxNotification = () =>  (
  <AmisRender schema = {{
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
  }} data ={data} env = {env} />
);


export const Full = () =>  (
  <AmisRender schema = {{
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
            roomId: '${roomId}',
          },
        ],
      },
    ],
  }} data ={data} env = {env} />
);