import { shouldUseAllStepSelection, getWorkflowMultiLookupNormalizationScript } from './util';

const syncSafeFieldNamesScript = `
  const syncSafeFieldNames = function(values) {
    const safeFieldNameMap = context.__safeFieldNameMap || api.data.__safeFieldNameMap || (api.data.context && api.data.context.__safeFieldNameMap) || {};
    _.each(safeFieldNameMap, function(safeKey, originalKey) {
      if (values[originalKey] !== undefined && values[safeKey] !== values[originalKey]) {
        values[safeKey] = values[originalKey];
      } else if (values[originalKey] === undefined && values[safeKey] !== undefined) {
        values[originalKey] = values[safeKey];
      }
    });
    return values;
  };
`;

export const getStepsSchema = (instance) => {
    if(shouldUseAllStepSelection(instance)){
        const serviceApi = {
            "url": "/api/workflow/v2/nextSteps",
            "method": "post",
            "requestAdaptor": `
                const ctx = api.data.context;
                let formValues = context._scoped.getComponentById("instance_form").getValues();
                ${syncSafeFieldNamesScript}
                formValues = syncSafeFieldNames(formValues);
                ${getWorkflowMultiLookupNormalizationScript(instance?.formVersion?.fields)}
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
                // 排序：开始步骤始终在最前，结束步骤始终在最后
                payload.nextSteps = _.sortBy(payload.nextSteps, function(step) {
                  if (step.step_type === 'start') return -1;
                  if (step.step_type === 'end') return 1;
                  return 0;
                });
                payload.stepIds = _.map(payload.nextSteps, '_id');
                return payload;
            `
        };

        const quickSaveItemApi = {
            "url": "/api/workflow/v2/set_instance_steps",
            "method": "post",
            "requestAdaptor": `
                // $('.steedos-approve-close-button').trigger('click');
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
        };

        const schema = {
            "type": "service",
            "id": "u:set_steps_users",
            "api": serviceApi,
            "body": [
                {
                    "type": "table2",
                    "source": "$nextSteps",
                    "className": "set-next-steps-users my-4",
                    "label": false,
                    "needConfirm": false,
                    "bordered": true,
                    "title": false,
                    "quickSaveItemApi": quickSaveItemApi,
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
