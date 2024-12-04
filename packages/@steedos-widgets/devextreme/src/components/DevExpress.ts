
// const DevExpressLib = require('devextreme/bundles/modules/core');
// const data = DevExpressLib.data = require('devextreme/bundles/modules/data');
// data.odata = require('devextreme/bundles/modules/data.odata');

import DevExpress from 'devextreme/bundles/modules/core';
import data from 'devextreme/bundles/modules/data';
import 'devextreme/bundles/modules/data.odata';
import {
  DataGrid
} from 'devextreme-react/data-grid';

DevExpress.data = data;
DevExpress.DataGrid = DataGrid;

export default DevExpress;