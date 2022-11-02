/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 17:34:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-01 18:28:04
 * @Description: 
 */
import { AmisRender } from "@/components/AmisRender";
import { getButtonVisibleOn } from "@steedos-widgets/amis-lib";
import { useRouter } from 'next/router';
export function Button(props) {
  const router = useRouter()
  const { button, data, className, scopeClassName, inMore, formFactor, uiSchema, permissions } = props;
  button.objectName = uiSchema.name
  const buttonSchema = {
    type: "service",
    bodyClassName: 'p-0',
    body: [
      {
        type: 'steedos-object-button',
        name: button.name,
        objectName: button.objectName,
        visibleOn: getButtonVisibleOn(button),
        className: 'antd-Button--default'
        // className: 'border-none antd-Button--link text-left w-full'
      }
    ],
    regions: [
      "body"
    ]
  }
  return <AmisRender
  id={SteedosUI.getRefId({type: 'button', appId: data.app_id, name: button.name})}
  schema={buttonSchema}
  router={router}
  className={scopeClassName}
  data={Object.assign({}, data, {objectName: data.object_name, _id: data.recordId, recordPermissions: permissions || uiSchema.permissions, listViewId: data.listViewId})}
  ></AmisRender>
}
