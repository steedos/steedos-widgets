
export const AmisInstanceHandler = async (props) => {
    // console.log('AmisInstanceHandler===>', props);
    const { data, id, name, label='' } = props;
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
        type: 'service',
        api: {
            "url": "${context.rootUrl}/api/workflow/v2/nextStepUsers?next_step=${_id}",
            "method": "post",
            "sendOn": "!!this && this.step_type != 'end' && this.deal_type != 'pickupAtRuntime'",
            "requestAdaptor": `
                const { next_step, $scopeId } = api.data;
                const formValues = context._scoped.getComponentById("instance_form").getValues();

                api.data = {
                instanceId: context.recordId,
                nextStepId: context._id,
                values: formValues
                }
                return api;
            `,
            "adaptor": `
            if(payload.error){
                return {
                    status: 0,
                    data: {
                        nextStepUsersError: payload.error,
                        nextStepUsers: [] 
                    }
                };
            }
            let value = null;

            // if(context.step_type == 'counterSign'){
            //     value = _.map(payload.nextStepUsers, 'id');
            // }
            if(payload.nextStepUsers.length === 1){
                value = payload.nextStepUsers[0].id;
            }

            payload.data = {
                nextStepUsersError: null,
                nextStepUsers: payload.nextStepUsers,
                ["${name}"]: value
            }; 
            return payload;`,
            "data": {
                "&": "$$",
                "$scopeId": "$scopeId",
                "context": "${context}",
            }
        },
        body: [
            {
                type: "steedos-select-user",
                label: label,
                name: name,
                id: id,
                hiddenOn: "this.deal_type != 'pickupAtRuntime' && (this.nextStepUsers && this.nextStepUsers.length > 0) || this.step_type == 'counterSign'",
                required: true,
                "inputClassName": "${nextStepUsersError ? 'border-red-500' : ''}"
            },
            {
                type: "steedos-select-user",
                label: label,
                name: name,
                id: id,
                hiddenOn: "this.deal_type != 'pickupAtRuntime' && (this.nextStepUsers && this.nextStepUsers.length > 0) || this.step_type != 'counterSign'",
                required: true,
                multiple: true,
                "inputClassName": "${nextStepUsersError ? 'border-red-500' : ''}"
            },
            {
                type: "checkboxes",
                label: label,
                name: name,
                id: id,
                required: true,
                hiddenOn: "this.deal_type == 'pickupAtRuntime' || !this.nextStepUsers || this.nextStepUsers.length == 0 || this.step_type != 'counterSign'",
                multiple: true,
                "source": "${nextStepUsers}",
                "labelField": "name",
                "valueField": "id",
                "joinValues": false,
                "extractValue": true,
                "className": "${nextStepUsersError ? 'border-red-500 border' : ''}"
            },
            {
                type: "radios",
                label: label,
                name: name,
                id: id,
                required: true,
                hiddenOn: "this.deal_type == 'pickupAtRuntime' || !this.nextStepUsers || this.nextStepUsers.length == 0 || this.step_type == 'counterSign'",
                multiple: false,
                "source": "${nextStepUsers}",
                "labelField": "name",
                "valueField": "id",
                "joinValues": false,
                "extractValue": true,
                "className": "${nextStepUsersError ? 'border-red-500 border' : ''}"
            },
            {
                "type": "tpl",
                "tpl": "<div class='text-danger text-sm'>${nextStepUsersError}</div>",
                "visibleOn": "this.nextStepUsersError"
            }
        ]
    }
    // console.log(`AmisInstanceHandler schema`, props, schema)
    return schema;
}