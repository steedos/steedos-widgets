/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 17:34:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-01 11:25:43
 * @Description: 
 */
import { AmisRender } from "@/components/AmisRender";
import { execute } from "@/lib/buttons";
export function Button(props) {
  const { button, data, router, className,  } = props;
  const { dataComponentId } = data;
  const buttonClick = () => {
    return execute(button, Object.assign({}, data , {scope: SteedosUI.getRef(dataComponentId)})); //TODO 处理参数
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
        data: {
            ...data
        }
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
        className={`antd-Button py-0.5 px-3 text-slate-700 border-solid border-1 border-gray-300 sm:rounded-[2px] ${className}`}
      >
        {button.label}
      </button>
    );
  }
}
