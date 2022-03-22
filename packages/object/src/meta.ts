import SteedosProvider from "./metas/SteedosProvider";
import ObjectForm from "./metas/ObjectForm";
import ObjectListView from "./metas/ObjectListView";

const components = [SteedosProvider,ObjectForm,ObjectListView];
const componentList = [
  {
    title: "对象组件",
    icon: "",
    children: [SteedosProvider,ObjectForm,ObjectListView]
  }
];

export default {
  componentList,
  components
};
