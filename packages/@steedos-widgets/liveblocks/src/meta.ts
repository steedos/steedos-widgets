/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-01 18:46:29
 * @Description: 
 */
import Comments from "./metas/Comments";
import InboxPopover from "./metas/InboxPopover";
import Provider from "./metas/Provider";

const components = [Comments, InboxPopover, Provider];
const componentList = [
  {
    title: "Builder6",
    icon: "",
    children: [Comments, InboxPopover, Provider]
  }
];
export default {
  componentList,
  components
};
