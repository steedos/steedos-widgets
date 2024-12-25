/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-12-25 14:59:55
 * @Description: 
 */
import AgGrid from "./metas/AgGrid";
import AmisTablesGrid from "./metas/AmisTablesGrid";
const components = [AgGrid, AmisTablesGrid];
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
