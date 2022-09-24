/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 17:34:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-23 08:57:43
 * @Description: 
 */
import { AmisRender } from "@/components/AmisRender";
import { execute } from "@steedos-widgets/amis-lib";
import { useRouter } from 'next/router';
export function Button(props) {
  const router = useRouter()
  const { button, data, className, scopeClassName, inMore } = props;
  const { dataComponentId } = data;
  const buttonClick = () => {
    return execute(button, Object.assign({}, data , {scope: SteedosUI.getRef(dataComponentId)})); //TODO 处理参数
  };

  if (button.type === "amis_button") {
    const schema = button.amis_schema ? (_.isString(button.amis_schema) ?  JSON.parse(button.amis_schema) : button.amis_schema) : {
      type: "service",
      bodyClassName: 'p-0',
      body: [
          {
              type: "button",
              label: button.label
          }
      ],
      regions: [
        "body"
      ]
    };
    return (
      <AmisRender
        id={SteedosUI.getRefId({type: 'button', appId: data.app_id, name: button.name})}
        schema={schema}
        router={router}
        className={scopeClassName}
        data={data}
      ></AmisRender>
    );
  } else {
    return (
      <button
        onClick={buttonClick}
        className={`antd-Button antd-Button--default ${className ? className : ''}`}
      >
        {button.label}
      </button>
    );
  }
}
