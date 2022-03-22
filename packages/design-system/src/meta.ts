
import Button from "./metas/Button";
import Icon from "./metas/Icon";
import IconSettings from "./metas/IconSettings";

const components:any = [Button, Icon, IconSettings];
const componentList = [
  {
    title: "Design System",
    icon: "",
    children: [Button, Icon, IconSettings]
  }
];

export default {
  componentList,
  components
};
