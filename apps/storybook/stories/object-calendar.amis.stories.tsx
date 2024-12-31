import { React, AmisRender } from '../components/AmisRender';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Steedos/Object Calendar',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

const data = {};

const env = {
  assetUrls: [
    `${process.env.STEEDOS_UNPKG_URL}/@steedos-widgets/amis-object/dist/assets.json`,
  ],
};




export const ObjectCalendar = () =>  (
  <AmisRender schema = {{
    type: 'page',
    title: '日历视图',
    body: [{
      "type": "steedos-object-calendar",
      "objectApiName": "events"
    }]
  }} data ={data} env = {env} />
)
