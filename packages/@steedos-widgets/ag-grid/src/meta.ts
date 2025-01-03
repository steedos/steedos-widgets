/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-03 15:50:58
 * @Description: 
 */
import AgGrid from "./metas/AgGrid";
import AmisTablesGrid from "./metas/AmisTablesGrid";
import AmisTablesGrid2 from "./metas/AmisTablesGrid2";
import AmisTablesGrid3 from "./metas/AmisTablesGrid3";
const components = [AgGrid, AmisTablesGrid, AmisTablesGrid2, AmisTablesGrid3];
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
