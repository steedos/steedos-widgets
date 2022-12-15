/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-14 13:38:04
 * @Description: 
 */
// import Hello from "./metas/Hello";
import AmisObjectForm from "./metas/AmisObjectForm";
import AmisObjectListview from "./metas/AmisObjectListview";
import AmisObjectTable from "./metas/AmisObjectTable";
import AmisRecordDetailHeader from "./metas/AmisRecordDetailHeader";
import AmisRecordDetail from "./metas/AmisRecordDetail";
import AmisSelectUser from "./metas/AmisSelectUser";
import AmisRecordDetailRelatedList from "./metas/AmisRecordDetailRelatedList";
import AmisRecordDetailRelatedLists from "./metas/AmisRecordDetailRelatedLists";
import AmisProvider from "./metas/AmisProvider";

import AmisObjectFieldLookup from './metas/AmisObjectFieldLookup';

import AmisObjectButton from "./metas/AmisObjectButton";

import SteedosDropdownButton from "./metas/SteedosDropdownButton";
// import Hello from './metas/Hello';

import AmisAppLauncher from './metas/AmisAppLauncher';

import AmisLogo from './metas/AmisLogo';

import AmisAppMenu from './metas/AmisAppMenu';

import SteedosIcon from './metas/SteedosIcon';

import SteedosDropdown from "./metas/SteedosDropdown";

import FromNow from './metas/FromNow';

import AmisGlobalHeader from './metas/AmisGlobalHeader';

const components = [
  AmisObjectForm, 
  AmisObjectListview, 
  AmisRecordDetailHeader,
  AmisRecordDetail, 
  AmisSelectUser, 
  AmisRecordDetailRelatedList, 
  AmisRecordDetailRelatedLists,
  AmisProvider, 
  AmisObjectFieldLookup,
  AmisObjectTable,
  AmisObjectButton,
  SteedosDropdownButton,
  AmisAppLauncher,
  AmisLogo,
  AmisAppMenu,
  SteedosIcon,
  SteedosDropdown,
  FromNow,
  AmisGlobalHeader
];

const componentList = [
  {
    title: "华炎魔方",
    icon: "",
    children: [
      AmisObjectForm, 
      AmisObjectListview, 
      AmisRecordDetailHeader, 
      AmisRecordDetail, 
      AmisSelectUser,
      AmisRecordDetailRelatedList,
      AmisRecordDetailRelatedLists,
      AmisProvider,
      AmisObjectFieldLookup,
      AmisObjectTable,
      AmisObjectButton,
      SteedosDropdownButton,
      AmisAppLauncher,
      AmisLogo,
      AmisAppMenu,
      SteedosIcon,
      SteedosDropdown,
      FromNow,
      AmisGlobalHeader
    ]
  }
];
export default {
  componentList,
  components
};
