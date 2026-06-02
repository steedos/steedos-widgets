
export const AmisInstanceHandler = async (props) => {
    console.log('AmisInstanceHandler===>', props);
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
            "url": "${context.rootUrl}/api/workflow/v2/nextStepUsersState?next_step=${_id}",
            "method": "post",
            "sendOn": "!!this && this.step_type != 'end' && this.deal_type != 'pickupAtRuntime'",
            "requestAdaptor": `
                const { next_step, $scopeId } = api.data;
                const formComp = context._scoped.getComponentById("instance_form");
                const formValues = formComp.getValues();
                const formData = (formComp.getData ? formComp.getData() : (formComp.props && formComp.props.data)) || {};
                const instanceRecord = formData.record || formData || {};
                const isTaskEntry = instanceRecord.box === 'inbox';
                const realInstanceId = isTaskEntry
                    ? (instanceRecord._id || (formValues && formValues._id) || context.recordId)
                    : context.recordId;
                api.data = {
                    instanceId: realInstanceId,
                    nextStepId: context._id,
                    values: formValues,
                    autoSaveSingleCandidate: true
                }
                return api;
            `,
            "adaptor": `
            const error = payload.error || payload.nextStepUsersError || payload._nextStepUsersSourceError;
            if(error){
                return {
                    status: 0,
                    data: {
                        nextStepUsersError: error,
                        nextStepUsers: [],
                        nextStepUsersCount: 0,
                        hasNextUsers: false,
                        _singleNextUserOption: false,
                        _nextStepUsersSourceError: null,
                        ["${name}"]: null
                    }
                };
            }

            payload.data = {
                nextStepUsersError: null,
                nextStepUsers: payload.nextStepUsers || [],
                nextStepUsersCount: payload.nextStepUsersCount || 0,
                hasNextUsers: payload.hasNextUsers === true,
                _singleNextUserOption: payload._singleNextUserOption === true,
                _nextStepUsersSourceError: payload._nextStepUsersSourceError || null,
                ["${name}"]: payload.next_users
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
                hiddenOn: "this.deal_type != 'pickupAtRuntime' && (this.hasNextUsers || this._singleNextUserOption || (this.nextStepUsers && this.nextStepUsers.length > 1)) || this.step_type == 'counterSign'",
                required: true,
                value: `\${${name}}`,
                "inputClassName": "${nextStepUsersError ? 'border-red-500' : ''}"
            },
            {
                type: "steedos-select-user",
                label: label,
                name: name,
                id: id,
                hiddenOn: "this.deal_type != 'pickupAtRuntime' && (this.hasNextUsers || this._singleNextUserOption || (this.nextStepUsers && this.nextStepUsers.length > 1)) || this.step_type != 'counterSign'",
                required: true,
                multiple: true,
                value: `\${${name}}`,
                "inputClassName": "${nextStepUsersError ? 'border-red-500' : ''}"
            },
            {
                type: "steedos-select-user",
                label: label,
                name: name,
                id: id,
                hiddenOn: "!(this.hasNextUsers || this._singleNextUserOption) || this.step_type == 'counterSign' || this.nextStepUsersError || this._nextStepUsersSourceError",
                readonly: true,
                required: true,
                value: `\${${name}}`,
                "inputClassName": "${nextStepUsersError ? 'border-red-500' : ''}"
            },
            {
                type: "steedos-select-user",
                label: label,
                name: name,
                id: id,
                hiddenOn: "!(this.hasNextUsers || this._singleNextUserOption) || this.step_type != 'counterSign' || this.nextStepUsersError || this._nextStepUsersSourceError",
                readonly: true,
                required: true,
                multiple: true,
                value: `\${${name}}`,
                "inputClassName": "${nextStepUsersError ? 'border-red-500' : ''}"
            },
            {
                // 会签：checkboxes + 可选自由选人
                type: "group",
                className: "w-full",
                hiddenOn: "this.deal_type == 'pickupAtRuntime' || this.hasNextUsers || this._singleNextUserOption || !this.nextStepUsers || this.nextStepUsers.length == 0 || this.step_type != 'counterSign'",
                body: [
                    {
                        type: "checkboxes",
                        label: label,
                        name: name,
                        id: id,
                        required: true,
                        multiple: true,
                        "source": "${nextStepUsers}",
                        "labelField": "name",
                        "valueField": "id",
                        value: `\${${name}}`,
                        "joinValues": false,
                        "extractValue": true,
                        "className": "${nextStepUsersError ? 'border-red-500 border' : ''}"
                    },
                    {
                        type: "steedos-select-user",
                        name: name,
                        id: id + '_pick',
                        visibleOn: "this.allow_pick_approve_users",
                        required: false,
                        multiple: true,
                        placeholder: "选择人员",
                        columnRatio: "auto",
                        columnClassName: "w-[150px]",
                        "inputClassName": "${nextStepUsersError ? 'border-red-500' : ''}"
                    }
                ]
            },
            {
                // 非会签：radios + 可选自由选人
                type: "group",
                className: "w-full",
                hiddenOn: "this.deal_type == 'pickupAtRuntime' || this.hasNextUsers || this._singleNextUserOption || !this.nextStepUsers || this.nextStepUsers.length == 0 || this.step_type == 'counterSign'",
                body: [
                    {
                        type: "radios",
                        label: label,
                        name: name,
                        id: id,
                        required: true,
                        multiple: false,
                        "source": "${nextStepUsers}",
                        "labelField": "name",
                        "valueField": "id",
                        value: `\${${name}}`,
                        "joinValues": false,
                        "extractValue": true,
                        "className": "${nextStepUsersError ? 'border-red-500 border' : ''}"
                    },
                    {
                        type: "steedos-select-user",
                        name: name,
                        id: id + '_pick',
                        visibleOn: "this.allow_pick_approve_users",
                        required: false,
                        placeholder: "选择人员",
                        columnRatio: "auto",
                        columnClassName: "w-[150px]",
                        "inputClassName": "${nextStepUsersError ? 'border-red-500' : ''}"
                    }
                ]
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
