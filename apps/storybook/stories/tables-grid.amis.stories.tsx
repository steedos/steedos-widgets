import { React, AmisRender } from '../components/AmisRender';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Enterprise/Tables',
};

const data = {};

const env = {
  assetUrls: [
    process.env.STEEDOS_UNPKG_URL + '/@steedos-widgets/amis-object/dist/assets.json',
    process.env.STEEDOS_UNPKG_URL + '/@steedos-widgets/ag-grid/dist/assets.json',
  ],
};

/** 以上为可复用代码 **/
export const Gerneral = () => (
  <AmisRender
    data={data}
    env={env}
    schema={{
      "type": "page",
      "body": [
        {
          "type": "steedos-tables-grid",
          "className": "h-96",
          "style": {
            "height": "calc(100vh - 58px)"
          },
          "tableId": "67658ac0cc184d0efc68b752",
          "mode": "admin"
        }
      ],
    }}
  />
)
