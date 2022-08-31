/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-06 13:33:37
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-08 15:21:25
 * @Description: 
 */
import { AmisRender } from "@/components/AmisRender";
import { isFunction } from 'lodash';
const schema = require('@/amis/fields_transfer.amis.json');

export const Field = {
    showFieldsTransfer: (objectName, data, onOk, onCancel)=>{
        const name = `${objectName}-fields-transfer`;
        const amisScopeId = `amis-${name}`;
        SteedosUI.Modal(Object.assign({
            name: name,
            title: '选择字段',
            destroyOnClose: true,
            maskClosable: false,
            keyboard: false, // 禁止 esc 关闭
            // footer: null,
            cancelText: '取消',
            okText: '确定',
            onOk: async (e)=>{
                const formValues = SteedosUI.getRef(amisScopeId).getComponentByName("page.form").getValues();
                SteedosUI.getRef(name).close();
                return await onOk(formValues)
            },
            onCancel: (e)=>{
                SteedosUI.getRef(name).close();
                if(isFunction(onCancel)){
                    onCancel(e)
                }
            },
            bodyStyle: {padding: "0px", paddingTop: "12px"},
            children: <AmisRender
            id={amisScopeId}
            schema={schema}
            data={{data: Object.assign({}, data, {objectName: objectName})}}
            ></AmisRender>
        }, {}));
    }
}