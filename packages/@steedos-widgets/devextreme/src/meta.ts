/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-01 18:46:29
 * @Description: 
 */
import DataGrid from "./metas/DataGrid";
import PivotGrid from "./metas/PivotGrid";
import Gantt from './metas/Gantt';

const components = [DataGrid, PivotGrid, Gantt];
const componentList = [
  {
    title: "DevExtreme",
    icon: "",
    children: components
  }
];
export default {
  componentList,
  components
};
