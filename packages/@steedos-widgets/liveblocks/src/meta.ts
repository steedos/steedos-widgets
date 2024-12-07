/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-01 18:46:29
 * @Description: 
 */
import LBComments from "./metas/Comments";
const components = [LBComments];
const componentList = [
  {
    title: "华炎魔方",
    icon: "",
    children: [LBComments]
  }
];
export default {
  componentList,
  components
};
