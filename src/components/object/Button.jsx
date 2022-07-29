import { AmisRender } from "@/components/AmisRender";
import { execute } from "@/lib/buttons";
export function Button(props) {
  const { button, data, router, className, scope } = props;
  const buttonClick = () => {
    console.log(`data._ref.props.store.toJSON()`, scope.getComponentById("listview_project")?.props.store.toJSON())
    return execute(button, data); //TODO 处理参数
  };

  if (button.type === "action") {
    const schema = {
        type: "page",
        bodyClassName: 'p-0',
        body: [
            {
                type: "button",
                label: button.label,
                className: className,
                onEvent: {
                  click: {
                    actions: JSON.parse(button.actions),
                  },
                }
            }
        ],
        regions: [
          "body"
        ],
        data: data
      };
    return (
      <AmisRender
        id={`amis-root-button-${button.name}`}
        schema={schema}
        router={router}
      ></AmisRender>
    );
  } else {
    return (
      <button
        onClick={buttonClick}
        className="antd-Button bg-sky-500 py-0.5 px-3 text-sm font-semibold text-white shadow hover:bg-sky-600 focus:outline-none sm:rounded-[2px]"
      >
        {button.label}
      </button>
    );
  }
}
