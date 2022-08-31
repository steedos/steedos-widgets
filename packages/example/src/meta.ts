import Hello from "./metas/Hello";
import AmisHello from "./metas/AmisHello";

const components = [Hello, AmisHello];
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
