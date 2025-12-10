
export const AmisInstanceHandler = async (props) => {
    // console.log('AmisInstanceHandler===>', props);
    const { data, id, name } = props;
    if(data.step_type === 'start' || data.step_type === 'end'){
        return {
            type: 'tpl',
            tpl: ''
        }
    }
    // schema.data = {
    //     "&": "$$",
    //     recordLoaded: true,
    //     submit_date: instanceInfo.submit_date,
    //     applicant_name: instanceInfo.applicant_name,
    //     related_instances: instanceInfo.related_instances,
    //     historyApproves: instanceInfo.historyApproves,
    //     boxName,
    //     ...instanceInfo.approveValues,
    //     context: Object.assign({}, data.context, instanceInfo),
    //     record: instanceInfo,
    //     applicant: applicant
    //   }
    const schema = {
        body: [
            {
                type: "steedos-select-user",
                label: "",
                name: name,
                id: id,
                hiddenOn: "this.deal_type != 'pickupAtRuntime' || this.step_type == 'counterSign'",
                required: true
            },
            {
                type: "steedos-select-user",
                label: "",
                name: name,
                id: id,
                hiddenOn: "this.deal_type != 'pickupAtRuntime' || this.step_type != 'counterSign'",
                required: true,
                multiple: true
            },
            {
                type: "list-select",
                label: "",
                name: name,
                id: id,
                required: true,
                hiddenOn: "this.deal_type == 'pickupAtRuntime' || this.step_type != 'counterSign'",
                multiple: true,
                "source": {
                    "url": "${context.rootUrl}/api/workflow/v2/nextStepUsers?next_step=${_id}",
                    "method": "post",
                    "sendOn": "!!this && this.step_type != 'end'",
                    "requestAdaptor": "debugger;\nconst { next_step, $scopeId } = api.data;\nconst formValues = context._scoped.getComponentById(\"instance_form\").getValues();\n\napi.data = {\n  instanceId: context.recordId,\n nextStepId: context._id,\n  values: formValues\n}\n\n\n return api;",
                    "adaptor": `
                if(payload.error){
                  SteedosUI.notification.error({message: payload.error});
                  return {
                    status: 0,
                    data: {}
                  }
                }
                payload.data = {
                  value: payload.nextStepUsers.length === 1 ? payload.nextStepUsers[0].id : null, 
                  options: payload.nextStepUsers
                }; 
                return payload;`,
                    "data": {
                        "&": "$$",
                        "$scopeId": "$scopeId",
                        "context": "${context}",
                        "next_step": "$}",
                    }
                },
                "labelField": "name",
                "valueField": "id",
                value: '${approver_users}',
                "joinValues": false,
                "extractValue": true
            },
            {
                type: "list-select",
                label: "",
                name: name,
                id: id,
                required: true,
                hiddenOn: "this.deal_type === 'pickupAtRuntime' || this.step_type == 'counterSign'",
                multiple: false,
                "source": {
                    "url": "${context.rootUrl}/api/workflow/v2/nextStepUsers?next_step=${_id}",
                    "method": "post",
                    "sendOn": "!!this && this.step_type != 'end'",
                    "requestAdaptor": "debugger;\nconst { next_step, $scopeId } = api.data;\nconst formValues = context._scoped.getComponentById(\"instance_form\").getValues();\n\napi.data = {\n  instanceId: context.recordId,\n nextStepId: context._id,\n  values: formValues\n}\n\n\n return api;",
                    "adaptor": `
                if(payload.error){
                  SteedosUI.notification.error({message: payload.error});
                  return {
                    status: 0,
                    data: {}
                  }
                }
                payload.data = {
                  value: payload.nextStepUsers.length === 1 ? payload.nextStepUsers[0].id : null, 
                  options: payload.nextStepUsers
                }; 
                return payload;`,
                    "data": {
                        "&": "$$",
                        "$scopeId": "$scopeId",
                        "context": "${context}",
                        "next_step": "$}",
                    }
                },
                "labelField": "name",
                "valueField": "id",
                value: '${approver_users}',
                "joinValues": false,
                "extractValue": true,
            }
        ],
        type: 'service'
    }
    // console.log(`AmisInstanceHandler schema`, props, schema)
    return schema;
}