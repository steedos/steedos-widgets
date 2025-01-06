/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-06 17:51:50
 * @Description: 
 */
import AgGrid from "./metas/AgGrid";
import AmisTablesGrid from "./metas/AmisTablesGrid";
import AmisTablesGrid_OLD from "./metas/AmisTablesGrid_OLD";
import AmisTablesGrid3 from "./metas/AmisTablesGrid3";
import AmisAirtableGrid from "./metas/AmisAirtableGrid";
const components = [AgGrid, AmisTablesGrid, AmisTablesGrid_OLD, AmisTablesGrid3, AmisAirtableGrid];
const componentList = [
  {
    title: "华炎魔方",
    icon: "",
    children: components
  }
];
export default {
  componentList,
  components
};
