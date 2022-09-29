/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-01 18:46:29
 * @Description: 
 */
import MultipleContainers from "./metas/MultipleContainers";
const components = [MultipleContainers];
const componentList = [
  {
    title: "Steedos",
    icon: "",
    children: [MultipleContainers]
  }
];
export default {
  componentList,
  components
};
