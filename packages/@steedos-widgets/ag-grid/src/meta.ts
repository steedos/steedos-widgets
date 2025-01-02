/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-02 15:37:33
 * @Description: 
 */
import AgGrid from "./metas/AgGrid";
import AmisTablesGrid from "./metas/AmisTablesGrid";
import AmisTablesGrid2 from "./metas/AmisTablesGrid2";
const components = [AgGrid, AmisTablesGrid, AmisTablesGrid2];
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
