/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 16:32:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-08-29 16:36:45
 * @Description: 
 */
// import Hello from "./metas/Hello";
import AmisObjectForm from "./metas/AmisObjectForm";
import AmisObjectListview from "./metas/AmisObjectListview";
import AmisObjectCalendar from "./metas/AmisObjectCalendar";
import AmisObjectTable from "./metas/AmisObjectTable";
import AmisRecordDetailHeader from "./metas/AmisRecordDetailHeader";
import AmisRecordDetail from "./metas/AmisRecordDetail";
import AmisRecordService from "./metas/AmisRecordService";
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

import AmisGlobalHeaderToolbar from './metas/AmisGlobalHeaderToolbar';

import SteedosIcon from './metas/SteedosIcon';

import SteedosDropdown from "./metas/SteedosDropdown";

import FromNow from './metas/FromNow';

import AmisGlobalHeader from './metas/AmisGlobalHeader';

import AmisGlobalFooter from './metas/AmisGlobalFooter';

import SteedosLoading from './metas/SteedosLoading';

import SteedosBadge from "./metas/SteedosBadge";
import SteedosBadgeRibbon from "./metas/SteedosBadgeRibbon";

import AmisSteedosField from "./metas/AmisSteedosField";

import AmisSelectFlow from './metas/AmisSelectFlow';

import AmisInstanceDetail from './metas/AmisInstanceDetail';

import PageListViewMeta from './pages/PageListView.meta';
import PageRecordDetailMeta from './pages/PageRecordDetail.meta';
import SteedosSkeleton from './metas/SteedosSkeleton';

import PageObject from './pages/PageObject.meta';

import AmisInputTable from './metas/AmisInputTable';

import AmisRecordDetailMini from './metas/AmisRecordDetailMini';

import { fieldMetas } from './metas/steedos-fields/index';

import AmisSteedosFieldGroup from './metas/AmisSteedosFieldGroup';

import AmisSteedosObject from './metas/AmisSteedosObject';

const components = [
  AmisRecordDetailHeader,
  AmisObjectForm, 
  AmisObjectListview, 
  AmisObjectTable,
  AmisRecordDetailRelatedList, 
  AmisRecordDetailRelatedLists,
  AmisRecordDetail,
  AmisRecordService,
  AmisObjectCalendar,
  AmisObjectButton,
  AmisObjectFieldLookup,
  AmisSelectUser, 
  SteedosDropdownButton,
  AmisGlobalHeader,
  AmisGlobalFooter,
  AmisGlobalHeaderToolbar,
  AmisAppLauncher,
  AmisProvider, 
  AmisLogo,
  AmisAppMenu,
  SteedosIcon,
  SteedosDropdown,
  FromNow,
  SteedosBadge,
  SteedosBadgeRibbon,
  AmisSteedosField,
  AmisSelectFlow,
  AmisInstanceDetail,
  SteedosLoading,
  PageListViewMeta,
  PageRecordDetailMeta,
  SteedosSkeleton,
  PageObject,
  AmisInputTable,
  AmisRecordDetailMini,
  ...fieldMetas,
  AmisSteedosFieldGroup,
  AmisSteedosObject
];

const componentList = [
  {
    title: "华炎魔方",
    icon: "",
    children: components
  }
];
export default {
  componentList,
  components
};
