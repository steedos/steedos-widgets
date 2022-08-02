/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 17:34:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-02 11:34:16
 * @Description: 
 */
import { AmisRender } from "@/components/AmisRender";
import { execute } from "@/lib/buttons";
import { useRouter } from 'next/router';
export function Button(props) {
  const router = useRouter()
  const { button, data, className,  } = props;
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
        id={SteedosUI.getRefId({type: 'button', appId: data.app_id, name: button.name})}
        schema={schema}
        router={router}
      ></AmisRender>
    );
  } else {
    return (
      <button
        onClick={buttonClick}
        className={`antd-Button py-0.5 px-3 text-slate-700 border-solid border-1 border-gray-300 sm:rounded-[2px] ${className ? className : ''}`}
      >
        {button.label}
      </button>
    );
  }
}
