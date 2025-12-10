export const getStepsSchema = (instance) => {
    if(instance.box === 'draft' && instance.state === 'draft' && instance.flow.allow_select_step){
        const schema = {
            "type": "service",
            "id": "u:set_steps_users",
            "api": {
                "url": "/api/workflow/v2/nextSteps",
                "method": "post",
                "requestAdaptor": `
                    const ctx = api.data.context;
                    const formValues = context._scoped.getComponentById("instance_form").getValues();
                    api.data = {
                    flowVersionId: ctx.flowVersion._id,
                    instanceId: ctx._id,
                    flowId: ctx.flow._id,
                    step: ctx.step,
                    values: formValues
                    };
                    return api;
                `,
                "adaptor": `
                    payload.stepIds = _.map(payload.nextSteps, '_id');
                    return payload;
                `
            }
            ,
            "body": [
                {
                    "type": "table2",
                    "source": "$nextSteps",
                    "className": "set-next-steps-users my-4",
                    "label": false,
                    "needConfirm": false,
                    "bordered": true,
                    "title": "审批步骤",
                    "quickSaveItemApi": {
                        "url": "/api/workflow/v2/set_instance_steps",
                        "method": "post",
                        "requestAdaptor": `
                            if(event && false){
                                api.data = {
                                    instanceId: 'none'
                                }
                            }else{
                                const ctx = api.data.context;
                                api.data = {
                                    instanceId: ctx._id,
                                    stepId: context._id,
                                    selected: context.selected,
                                    handler: context.stepHandler
                                };
                            }
                            
                            return api;
                        `,
                        "adaptor": `
                            payload.stepIds = _.map(payload.nextSteps, '_id');
                            return payload;
                        `
                    },
                    // "rowSelection": {
                    //     "type": "checkbox",
                    //     "keyField": "id",
                    //     "checked": true,
                    //     "selected": true,
                    //     // "disableOn": "${allow_skip != true}",
                    //     "selectedRowKeysExpr": "${ARRAYINCLUDES(stepIds, id)}"
                    // },
                    "columns": [
                        {
                            "label": "选择",
                            "name": "selected",
                            "width": 50,
                            "quickEdit": {
                                "type": "checkbox",
                                "mode": "inline",
                                "id": "selected",
                                "name": "selected",
                                "saveImmediately": true,
                                "value": true,
                                "disabledOn": "${allow_skip != true}",
                            }
                        },
                        {
                            "label": "步骤名称",
                            "name": "name",
                            "quickEdit": false
                        },
                        {
                            "label": "处理人",
                            "name": "stepHandler",
                            "quickEdit": {
                                "type": "steedos-instance-handler",
                                "mode": "inline",
                                "id": "stepHandler",
                                "name": "stepHandler",
                                "saveImmediately": true
                            }
                        },
                        // {
                        //     "label": "操作",
                        //     "name": "actions"
                        // }
                    ]
                }
            ]
        };
        return schema;
    }else{
        return {
            type: 'tpl',
            id: "u:set_steps_users",
            tpl: ''
        }
    }
}