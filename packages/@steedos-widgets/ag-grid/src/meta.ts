/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-01 18:46:29
 * @Description: 
 */
import AgGrid from "./metas/AgGrid";
const components = [AgGrid];
const componentList = [
  {
    title: "华炎魔方",
    icon: "",
    children: [AgGrid]
  }
];
export default {
  componentList,
  components
};
