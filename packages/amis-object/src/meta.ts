/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-01 18:46:29
 * @Description: 
 */
// import Hello from "./metas/Hello";
import AmisObjectForm from "./metas/AmisObjectForm";
import AmisObjectListview from "./metas/AmisObjectListview";
import AmisRecordDetailHeader from "./metas/AmisRecordDetailHeader";
import AmisSpaceUsersPicker from "./metas/AmisSpaceUsersPicker";

const components = [AmisObjectForm, AmisObjectListview, AmisRecordDetailHeader, AmisSpaceUsersPicker];
const componentList = [
  {
    title: "华炎魔方",
    icon: "",
    children: [AmisObjectForm, AmisObjectListview,AmisRecordDetailHeader, AmisSpaceUsersPicker]
  }
];
export default {
  componentList,
  components
};
