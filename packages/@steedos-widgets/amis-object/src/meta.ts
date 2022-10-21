/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-13 15:00:08
 * @Description: 
 */
// import Hello from "./metas/Hello";
import AmisObjectForm from "./metas/AmisObjectForm";
import AmisObjectListview from "./metas/AmisObjectListview";
import AmisObjectTable from "./metas/AmisObjectTable";
import AmisRecordDetailHeader from "./metas/AmisRecordDetailHeader";
import AmisSelectUser from "./metas/AmisSelectUser";
import AmisRecordDetailRelatedList from "./metas/AmisRecordDetailRelatedList";
import AmisProvider from "./metas/AmisProvider";

import AmisObjectFieldLookup from './metas/AmisObjectFieldLookup';

// import Hello from './metas/Hello';

const components = [AmisObjectForm, AmisObjectListview, AmisObjectTable, AmisRecordDetailRelatedList, 
  AmisRecordDetailHeader, AmisProvider, AmisSelectUser, AmisObjectFieldLookup];
const componentList = [
  {
    title: "华炎魔方",
    icon: "",
    children: [AmisObjectForm, AmisObjectListview, AmisObjectTable, AmisRecordDetailRelatedList, 
      AmisRecordDetailHeader, AmisProvider, AmisSelectUser, AmisObjectFieldLookup]
  }
];
export default {
  componentList,
  components
};
