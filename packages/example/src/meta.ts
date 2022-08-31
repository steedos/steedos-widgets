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
