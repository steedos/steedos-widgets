import { React, AmisRender } from '../components/AmisRender';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Enterprise/Ag Grid',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

const data = {};
const env = {
  assetUrls: [
    `${process.env.STEEDOS_UNPKG_URL}/@steedos-widgets/ag-grid/dist/assets.json`,
  ],
};

const rowData = [
  { make: "Toyota", model: "Celica", price: 35000 },
  { make: "Ford", model: "Mondeo", price: 32000 },
  { make: "Porsche", model: "Boxster", price: 72000 },
  { make: "BMW", model: "M50", price: 60000 },
  { make: "Aston Martin", model: "DBX", price: 190000 },
];

const columnDefs = [
  { field: "make" },
  { field: "model" },
  { field: "price" },
];

export const Gerneral = () => (
  <AmisRender schema = {{
    "type": "ag-grid",
    "dsType": "api",
    "className": "b6-tables-ag-grid h-96 ag-theme-quartz",
    "config": {
      columnDefs: columnDefs,
      rowData: rowData
    }
  }} data ={data} env = {env} />
);

export const StyleAutoHeight = () =>  (
  <AmisRender schema = {{
    "type": "page",
    "body": [
      {
        "type": "ag-grid",
        "dsType": "api",
        "className": "b6-tables-ag-grid h-96 ag-theme-quartz",
        "style": {
          "height": "calc(100vh - 58px)"
        },
        "config": {
          columnDefs: columnDefs,
          rowData: rowData
        }
      }
    ],
  }} data ={data} env = {env} />
);


export const DataFilter = () =>(
  <AmisRender schema = {{
    "type": "page",
    "body": [
      {
        "type": "ag-grid",
        "dsType": "api",
        "dataFilter": `
          const getServerSideDatasource = () => {
            return {
              getRows: (params) => {
                const rowData = ${JSON.stringify(rowData)};
                const data = {
                  data: rowData,
                  totalCount: rowData.length
                }
                params.success({
                  rowData: data.data,
                  rowCount: data.totalCount
              });
              }
            };
          }
          return Object.assign({}, config, {
            rowModelType: 'serverSide',
            serverSideDatasource: getServerSideDatasource()
          });
        `,
        "className": "b6-tables-ag-grid h-96 ag-theme-quartz",
        "config": {
          columnDefs: columnDefs
        }
      }
    ],
  }} data ={data} env = {env} />
);