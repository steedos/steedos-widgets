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
import AmisSelectUser from "./metas/AmisSelectUser";
import AmisRecordDetailRelatedList from "./metas/AmisRecordDetailRelatedList";
import AmisProvider from "./metas/AmisProvider";

const components = [AmisObjectForm, AmisObjectListview, AmisRecordDetailHeader, AmisSelectUser, AmisRecordDetailRelatedList, AmisProvider];
const componentList = [
  {
    title: "华炎魔方",
    icon: "",
    children: [AmisObjectForm, AmisObjectListview,AmisRecordDetailHeader, AmisSelectUser, AmisRecordDetailRelatedList, AmisProvider]
  }
];
export default {
  componentList,
  components
};
