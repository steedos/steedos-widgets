import React from 'react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Amis/ObjectForm',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export const Simple = () => {
  const schema = {
    type: 'page',
    title: 'Hello',
  };
  const data = {};
  const env = {
    assetUrls: [
      `http://localhost:8080/@steedos-widgets/amis-object/dist/assets-dev.json`,
    ],
  };
  return renderAmisSchema(schema, data, env)
};
