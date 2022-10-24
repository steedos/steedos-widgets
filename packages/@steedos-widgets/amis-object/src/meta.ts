/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-24 11:35:39
 * @Description: 
 */
// import Hello from "./metas/Hello";
import AmisObjectForm from "./metas/AmisObjectForm";
import AmisObjectListview from "./metas/AmisObjectListview";
import AmisRecordDetailHeader from "./metas/AmisRecordDetailHeader";
import AmisSelectUser from "./metas/AmisSelectUser";
import AmisRecordDetailRelatedList from "./metas/AmisRecordDetailRelatedList";
import AmisProvider from "./metas/AmisProvider";

import AmisObjectFieldLookup from './metas/AmisObjectFieldLookup';

import AmisObjectButton from "./metas/AmisObjectButton";

import SteedosDropdownButton from "./metas/SteedosDropdownButton";
// import Hello from './metas/Hello';

const components = [
  AmisObjectForm, 
  AmisObjectListview, 
  AmisRecordDetailHeader, 
  AmisSelectUser, 
  AmisRecordDetailRelatedList, 
  AmisProvider, 
  AmisObjectFieldLookup,
  AmisObjectButton,
  SteedosDropdownButton
];
const componentList = [
  {
    title: "华炎魔方",
    icon: "",
    children: [
      AmisObjectForm, 
      AmisObjectListview, 
      AmisRecordDetailHeader, 
      AmisSelectUser,
      AmisRecordDetailRelatedList,
      AmisProvider,
      AmisObjectFieldLookup,
      AmisObjectButton,
      SteedosDropdownButton
    ]
  }
];
export default {
  componentList,
  components
};
