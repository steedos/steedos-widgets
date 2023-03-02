/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-01 15:51:00
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-03-02 17:33:51
 * @Description: 
 */

export const getSchema = async (uiSchema, ctx) => {
    const schemaApiAdaptor = `
        let formSchema = {
            "type": "steedos-object-form",
            "label": "对象表单",
            "objectApiName": "\${objectName}",
            "recordId": "",
            "mode": "edit",
            "layout": "normal"
        };

        if (payload && payload.schema) {
            const pageSchema = _.isString(payload.schema) ? JSON.parse(payload.schema) : payload.schema;
            formSchema = pageSchema.body[0];
            // 设置form的canAccessSuperData属性防止弹出窗口从父级取字段默认值
            formSchema.canAccessSuperData = false;
            // 设置form的wrapWithPanel属性隐藏其底部保存取消按钮
            formSchema.wrapWithPanel = false;
            formSchema.className = "steedos-amis-form";
        }
        // TODO: 后续可以改为直接调用data_change_\${objectName}广播事件来刷新子表，就不用找到formSchema给配置onEvent来处理刷新问题
        const isLookup = api.body?.isLookup;
        if (isLookup) {
            formSchema.onEvent = {
                submitSucc: {
                    "weight": 0,
                    "actions": [
                        {
                            "actionType": "custom",
                            "script": "const scope = event.context.scoped; const listView = scope.parent.parent.parent.parent.getComponents().find(function(n){ return n.props.type === 'crud'; }); listView.reload();"
                        }
                    ]
                }
            }
        }
        return {
            data: formSchema
        };
    `;
    return {
        "type": "service",
        "body": [
            {
                "type": "button",
                "label": "新建",
                "id": "u:standard_new",
                "level": "default",
                "onEvent": {
                    "click": {
                        "weight": 0,
                        "actions": [
                            {
                                "actionType": "dialog",
                                "dialog": {
                                    "type": "dialog",
                                    "data": {
                                        "$master": "$$",
                                        "defaultData": "${defaultData}",
                                        "appId": "${appId}",
                                        "objectName": "${objectName}",
                                        "context": "${context}",
                                        "global": "${global}",
                                        "listViewId": "${listViewId}",
                                        "uiSchema": "${uiSchema}",
                                        "isLookup": "${isLookup}"
                                    },
                                    "title": "新建 ${uiSchema.label}",
                                    "body": [
                                        {
                                            "type": "service",
                                            "id": "u:1678e148c4d2",
                                            "messages": {},
                                            "schemaApi": {
                                                "data": {
                                                    "isLookup": "${isLookup}"
                                                },
                                                "url": "${context.rootUrl}/api/pageSchema/form?app=${appId}&objectApiName=${objectName}&formFactor=${formFactor}",
                                                "method": "get",
                                                "messages": {
                                                },
                                                "requestAdaptor": "",
                                                "adaptor": schemaApiAdaptor
                                            }
                                        }
                                    ],
                                    "showCloseButton": true,
                                    "id": "u:e11347411d2d",
                                    "closeOnEsc": false,
                                    "closeOnOutside": false,
                                    "size": "lg"
                                }
                            }
                        ]
                    }
                }
            }
        ],
        "regions": [
            "body"
        ],
        "className": "p-0 border-0",
        "id": "u:aef99d937b10"
    }
}