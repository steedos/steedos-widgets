import {
  lookupToAmisPicker,
  getSteedosAuth, Router
} from "@steedos-widgets/amis-lib";
//TODO Meteor.settings.public?.workflow?.hideCounterSignJudgeOptions

const HIDE_COUNTER_SIGN_JUDGE_OPTIONS = false;

const getJudgeOptions = async (instance) => {
  const { step } = instance;
  const options = [];
  if (step.step_type === "sign") {
    options.push({
      label: "核准",
      value: "approved",
    });
    options.push({
      label: "驳回",
      value: "rejected",
    });
  } else if (
    step.step_type === "counterSign" &&
    HIDE_COUNTER_SIGN_JUDGE_OPTIONS != true
  ) {
    options.push({
      label: "核准",
      value: "approved",
    });
    options.push({
      label: "驳回",
      value: "rejected",
    });
    options.push({
      label: "已阅",
      value: "readed",
    });
  }
  return options;
};

const getJudgeInput = async (instance) => {
  const judgeOptions = await getJudgeOptions(instance);
  // console.log('getJudgeInput', judgeOptions);
  if (judgeOptions.length > 0 && instance.approve.type != 'cc') {
    return {
      type: "radios",
      label: false,
      name: "judge",
      value: "approved",
      options: judgeOptions,
      id: "u:444dbad76e90",
      required: true,
      "onEvent": {
        "change": {
          "weight": 0,
          "actions": [
            {
              "componentId": "instance_approval",
              "args": {
                "value": {
                  new_judge: "${event.data.value}",
                  next_step: undefined,
                }
              },
              "actionType": "setValue"
            },
            {
              // "componentId": "u:next_step",
              "args": {
                judge: "${event.data.value}"
              },
              "actionType": "broadcast",
              eventName: "approve_judge_change"
            },
          ]
        }
      }
    };
  }
};

//TODO 只有一个下一步时,默认选中,并且禁止修改.
const getNextStepInput = async (instance) => {
  // console.log('getNextStepInput', instance);
  if(instance.approve?.type == 'cc'){
    return ;
  }
  return {
    type: "grid",
    columns: [
      {
        body: [
          {
            type: "tpl",
            tpl: "下一步",
            inline: true,
            wrapperComponent: "",
            id: "u:0a85de51480f",
          },
        ],
        id: "u:bf75adfb544e",
        md: "auto",
        valign: "middle",
      },
      {
        body: [
          {
            type: "list-select",
            label: "",
            name: "next_step",
            id: "u:next_step",
            multiple: false,
            required: true,
            // selectFirst: true,
            autoFill: {
              "new_next_step": "${step}",
              "next_users": null
            },
            "source": {
              "url": "/api/workflow/v2/nextStep?judge=${new_judge}",
              "headers": {
                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
              },
              "method": "post",
              "messages": {
              },
              "requestAdaptor": `
                let { judge } = api.data; 
                const ctx = api.data.context;
                if(!judge){
                  judge='approved'
                };
                const formValues = context._scoped.getComponentById("instance_form").getValues();
                api.data = {
                  flowVersionId: ctx.flowVersion._id,
                  instanceId: ctx._id,
                  flowId: ctx.flow._id,
                  step: ctx.step,
                  judge: judge,
                  values: formValues
                };
                return api;
              `,
              "adaptor": `
                if(payload.error){
                  SteedosUI.notification.error({message: payload.error});
                  return {
                    status: 0,
                    data: {}
                  }
                }
                payload.data = {
                  value: payload.nextSteps.length === 1 ? payload.nextSteps[0]._id : null, 
                  options: _.map(payload.nextSteps, (item)=>{
                    return {
                      label: item.name, 
                      value: item._id,
                      step: item
                    }
                  })
                };
                return payload;
              `,
              "data": {
                // "&": "$$",
                "context": "${context}",
                "$scopeId": "${scopeId}",
                "judge": "${new_judge}",
              }
            },
            // "onEvent": {
            //   "change": {
            //     "weight": 0,
            //     "actions": [
            //       {
            //         "componentId": "instance_approval",
            //         "args": {
            //           "value": {
            //             new_next_step: "${event.data.value}",
            //           }
            //         },
            //         "actionType": "setValue"
            //       },
            //       // {
            //       //   "args": {
            //       //     next_step: "${event.data.value}",
            //       //   },
            //       //   "actionType": "broadcast",
            //       //   eventName: "approve_next_step_change"
            //       // },
            //     ]
            //   }
            // }
          },
        ],
        id: "u:4d3a884b437c",
      },
    ],
    id: "u:016c56efe5fd",
    className: "b-a b-1x m-none p-xs",
    subFormMode: "",
  };
};

//TODO 只有一个处理人时,默认选中,禁止修改. 部分情况不需要显示下一步处理人
const getNextStepUsersInput = async (instance) => {
  if(instance.approve?.type == 'cc'){
    return ;
  }
  return {
    type: "grid",
    columns: [
      {
        body: [
          {
            type: "tpl",
            tpl: "处理人",
            inline: true,
            wrapperComponent: "",
            id: "u:3203cc281b3c",
          },
        ],
        id: "u:8eece76a9e4c",
        md: "auto",
        valign: "middle",
      },
      {
        body: [
          {
            type: "steedos-select-user",
            label: "",
            name: "next_users", 
            hiddenOn: "this.new_next_step.deal_type != 'pickupAtRuntime'",
            required: true
          },
          {
            type: "list-select",
            label: "",
            name: "next_users",
            id: "u:next_users",
            required: true,
            hiddenOn: "this.new_next_step.deal_type === 'pickupAtRuntime'",
            multiple: "this.new_next_step.deal_type === 'counterSign'",
            "source": {
              "url": "${context.rootUrl}/api/workflow/v2/nextStepUsers?next_step=${next_step}",
              "method": "post",
              "sendOn": "!!this.new_next_step && this.new_next_step.step_type != 'end'",
              "headers": {
                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
              },
              "messages": {
              },
              "requestAdaptor": "\nconst { next_step, $scopeId } = api.data;\nconst formValues = context._scoped.getComponentById(\"instance_form\").getValues();\n\napi.data = {\n  instanceId: api.data.context._id,\n nextStepId: next_step._id,\n  values: formValues\n}\n\n\n return api;",
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
                "next_step": "${new_next_step}",
              }
            },
            "labelField": "name",
            "valueField": "id",
            value: '${new_next_step.approver_users}',
            "joinValues": false,
            "extractValue": true,
          },
          // {
          //   type: "steedos-select-user",
          //   label: "",
          //   name: "next_users",
          //   id: "u:next_users",
          //   required: true,
          //   hiddenOn: "this.new_next_step.deal_type === 'pickupAtRuntime'",
          //   amis: {
          //     multiple: "this.new_next_step.deal_type === 'counterSign'",
          //     "source": {
          //       "url": "${context.rootUrl}/api/workflow/v2/nextStepUsers",
          //       "method": "post",
          //       "sendOn": "!!this.new_next_step && this.new_next_step.step_type != 'end'",
          //       "headers": {
          //         "Authorization": "Bearer ${context.tenantId},${context.authToken}"
          //       },
          //       "messages": {
          //       },
          //       "requestAdaptor": "\nconst { next_step, $scopeId } = api.data;\nconst formValues = context._scoped.getComponentById(\"instance_form\").getValues();\n\napi.data = {\n  instanceId: api.data.context._id,\n nextStepId: next_step._id,\n  values: formValues\n}\n\n\n return api;",
          //       "adaptor": "\npayload.data = {value: payload.nextStepUsers.length === 1 ? payload.nextStepUsers[0].id : null, options: payload.nextStepUsers};\nreturn payload;",
          //       "data": {
          //         "&": "$$",
          //         "$scopeId": "$scopeId",
          //         "context": "${context}",
          //         "next_step": "${new_next_step}",
          //       }
          //     },
          //     "labelField": "name",
          //     "valueField": "id",
          //     value: '${new_next_step.approver_users}',
          //   }
          // }
        ],
        id: "u:81a4913c61cc",
      },
    ],
    id: "u:ffff15b76c89",
    className: "b-a b-1x p-xs m-b-none m-l-none m-r-none m-t-sm ${record.step.step_type == 'counterSign' ? 'hidden' : ''}",
    subFormMode: "",
    hiddenOn: "!!!this.new_next_step || (this.new_next_step && this.new_next_step.step_type === 'end')"
  };
};

const getCCSubmitRequestAdaptor = async (instance) => {
  return `  
            const instanceForm = context._scoped.getComponentById("instance_form");
            const approveValues = context._scoped.getComponentById("instance_approval").getValues();
            api.data = {
              instanceId: "${instance._id}", 
              traceId: "${instance.trace._id}", 
              approveId: "${instance.approve._id}",  
              description: approveValues.suggestion 
            };
            return api;
            `;
};

const getPostSubmitRequestAdaptor = async (instance) => {
  return `  const instanceForm = context._scoped.getComponentById("instance_form");
            const formValues = instanceForm.getValues();
            const approveValues = context._scoped.getComponentById("instance_approval").getValues();
            let nextUsers = approveValues.next_users;
            if(_.isString(nextUsers)){
              nextUsers = [approveValues.next_users];
            }
            const body = {Instances: [{
                _id: "${instance._id}",
                flow: "${instance.flow._id}",
                applicant: formValues.applicant,
                submitter: formValues.submitter,
                traces: [{
                    _id: "${instance.trace._id}",
                    step: "${instance.step._id}",
                    approves: [{
                        _id: "${instance.approve._id}",
                        next_steps: [{
                            step: approveValues.next_step,
                            users: nextUsers || [],
                        }],
                        description: approveValues.suggestion,
                        values: formValues
                    }]
                }]
            }]};
            api.data = body;
            return api;
            `;
};

const getPostEngineRequestAdaptor = async (instance) => {
  return `  
            const formValues = context._scoped.getComponentById("instance_form").getValues();
            const approveValues = context._scoped.getComponentById("instance_approval").getValues();
            let nextUsers = approveValues.next_users;
            if(_.isString(nextUsers)){
              nextUsers = [approveValues.next_users];
            }
            const body = {Approvals: [{
              instance: "${instance._id}",
              judge: approveValues.judge,
              trace: "${instance.approve.trace}",
              _id: "${instance.approve._id}",
              next_steps: [{
                  step: approveValues.next_step,
                  users: nextUsers || [],
              }],
              description: approveValues.suggestion,
              values: formValues
            }]};
            api.data = body;
            return api;
            `;
};

/**
 * 1 TODO 处理传阅提交
 * 2 草稿状态提交. TODO 申请单的表单、流程升级
 * 3 待审核提交
 * @param instance
 * @returns
 */
const getSubmitActions = async (instance) => {
  let api = "";
  let requestAdaptor = "";
  if(instance.approve?.type == "cc"){
    api = "/api/workflow/v2/cc_submit";
    requestAdaptor = await getCCSubmitRequestAdaptor(instance);
  }else{
    if (instance.state === "draft") {
      api = "/api/workflow/submit";
      requestAdaptor = await getPostSubmitRequestAdaptor(instance);
    } else if (instance.state === "pending") {
      api = "/api/workflow/engine";
      requestAdaptor = await getPostEngineRequestAdaptor(instance);
    } else {
      return null; //TODO 考虑异常情况?
    }
  }
  return [
    // 校验表单
    {
      "componentId": "",
      "args": {},
      "actionType": "custom",
      "script": `
        const form = event.context.scoped.getComponentById("instance_form");
        return form.validate().then((instanceFormValidate)=>{
          event.setData({...event.data, instanceFormValidate})
        })
      `
    },
    // 校验审批表单
    {
      "componentId": "",
      "args": {},
      "actionType": "custom",
      "script": `
        const form = event.context.scoped.getComponentById("instance_approval");
        return form.validate().then((approvalFormValidate)=>{
          event.setData({...event.data, approvalFormValidate})
        })
      `,
      expression: "${event.data.instanceFormValidate}"
    },
    {
      componentId: "",
      args: {
        api: {
          url: `${api}`,
          method: "post",
          dataType: "json",
          data: {
            "&": "$$",
            "$scopeId": "${$scopeId}"
          },
          headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}",
          },
          requestAdaptor: requestAdaptor,
        },
        messages: {
          success: "提交成功!",
        },
      },
      actionType: "ajax",
      expression: "${event.data.instanceFormValidate && event.data.approvalFormValidate}"
    },
    {
      "componentId": "",
      "args": {
        "blank": false,
        "url": Router.getObjectListViewPath({appId: "${appId}", objectName: "${objectName}", listViewName: "${side_listview_id}"})
      },
      "actionType": "url",
      expression: "${event.data.instanceFormValidate && event.data.approvalFormValidate}"
    },
    {
      "actionType": "closeDialog",
      expression: "${event.data.instanceFormValidate && event.data.approvalFormValidate}"
    }
  ];
};

export const getApprovalDrawerSchema = async (instance) => {
  return {
    type: "drawer",
    overlay: false,
    resizable: false,
    closeOnEsc: true,
    closeOnOutside: false,
    size: "sm",
    title: `${instance.step.name}`,
    className: "approval-drawer absolute",
    headerClassName: 'p-2',
    bodyClassName: 'p-2',
    footerClassName: 'p-2 pt-0',
    drawerContainer: ()=>{
      return document.body;
    },
    body: [
      {
        type: "form",
        debug: false,
        id: "instance_approval",
        resetAfterSubmit: true,
        clearPersistDataAfterSubmit: true,
        persistData: `workflow_approve_form_${instance.approve._id}`,
        body: [
          {
            type: 'hidden',
            name: 'new_next_step'
          },
          await getJudgeInput(instance),
          {
            type: "textarea",
            label: false,
            name: "suggestion",
            id: "u:cd344f708ddc",
            minRows: 3,
            maxRows: 20,
            placeholder: "请填写意见",
            requiredOn: "${judge === 'rejected'}"
          },
          await getNextStepInput(instance),
          await getNextStepUsersInput(instance),
        ],
        onEvent: {
          "approve_judge_change": {
            "actions": [
              {
                "actionType": "reload",
                "componentId": "u:next_step",
                "args": {
                }
              }
            ]
          },
          // "approve_next_step_change": {
          //   "actions": [
          //     {
          //       "actionType": "reload",
          //       "componentId": "u:nex_users",
          //       "args": {
          //       }
          //     }
          //   ]
          // },
          validateError: {
            weight: 0,
            actions: [
              {
                "componentId": "",
                "args": {
                  "msgType": "info",
                  "position": "top-right",
                  "closeButton": true,
                  "showIcon": true,
                  "title": "提交失败",
                  "msg": "请填写必填字段"
                },
                "actionType": "toast"
              }
            ],
          }
        },
        
      },
    ],
    id: "u:approve_8861156e0b23",
    position: "bottom",
    actions: [
      {
        type: "button",
        label: "提交",
        onEvent: {
          click: {
            actions: await getSubmitActions(instance),
          },
        },
        id: "u:f6f8c3933f6c",
        level: "primary",
      },
      {
        type: "button",
        label: "取消",
        onEvent: {
          click: {
            actions: [
              {
                componentId: "",
                args: {},
                actionType: "closeDrawer",
              },
            ],
          },
        },
        id: "u:127ff1da7283",
      },
    ]
  };
};
