/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-01 18:46:29
 * @Description: 
 */
import Hello from "./metas/Hello";
const components = [Hello];
const componentList = [
  {
    title: "哈喽组件",
    icon: "",
    children: [Hello]
  }
];
export default {
  componentList,
  components
};
