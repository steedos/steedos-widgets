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
                  new_next_step: undefined,
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
            "source": {
              "url": "${context.rootUrl}/api/workflow/v2/nextStep",
              "headers": {
                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
              },
              "method": "post",
              "messages": {
              },
              "requestAdaptor": "let { context, judge } = api.data; if(!judge){judge='approved'}\nconst formValues = SteedosUI.getRef(api.data.$scopeId).getComponentById(\"instance_form\").getValues();\n\napi.data = {\nflowVersionId: context.flowVersion._id,\n  instanceId: context._id,\n  flowId: context.flow._id,\n  step: context.step,\n  judge: judge,\n  values: formValues\n}\n\n\n return api;",
              "adaptor": `
                payload.data = {
                  options: _.map(payload.nextSteps, (item)=>{
                    return {
                      label: item.name, 
                      value: item
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
            // "labelField": "name",
            // "valueField": "_id",
            "onEvent": {
              // "change": {
              //   "weight": 0,
              //   "actions": [
              //     {
              //       "componentId": "u:next_users",
              //       "args": {
              //       },
              //       "actionType": "reload"
              //     }
              //   ]
              // },
              "change": {
                "weight": 0,
                "actions": [
                  {
                    "componentId": "instance_approval",
                    "args": {
                      "value": {
                        new_next_step: "${event.data.value}",
                      }
                    },
                    "actionType": "setValue"
                  },
                  {
                    // "componentId": "u:next_step",
                    "args": {
                      next_step: "${event.data.value}",
                    },
                    "actionType": "broadcast",
                    eventName: "approve_next_step_change"
                  },
                ]
              }
              
            }
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
          // TODO 处理下一步处理人默认值
          Object.assign({}, await lookupToAmisPicker(
            {
              name: "next_users",
              label: false,
              reference_to: "space_users",
              reference_to_field: 'user',
              multiple: false,
            },
            false,
            {}
          ),{
            name: "next_users", 
            value: "",
            hiddenOn: "this.new_next_step.deal_type != 'pickupAtRuntime'",
            required: true
          }),
          {
            type: "list-select",
            label: "",
            name: "next_users",
            // options: await getNextStepOptions(instance),
            id: "u:next_users",
            required: true,
            multiple: false,
            "source": {
              "url": "${context.rootUrl}/api/workflow/v2/nextStepUsers",
              "method": "post",
              "sendOn": "!!this.new_next_step && this.new_next_step.step_type != 'end'",
              "headers": {
                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
              },
              "messages": {
              },
              "requestAdaptor": "console.log('======requestAdaptor====');\nconst { context, next_step, $scopeId } = api.data;\nconst formValues = SteedosUI.getRef($scopeId).getComponentById(\"instance_form\").getValues();\n\napi.data = {\n  instanceId: context._id,\n nextStepId: next_step._id,\n  values: formValues\n}\n\n\n return api;",
              "adaptor": "\npayload.data = payload.nextStepUsers;\nreturn payload;",
              "data": {
                "&": "$$",
                "$scopeId": "$scopeId",
                "context": "${context}",
                "next_step": "${new_next_step}",
              }
            },
            "labelField": "name",
            "valueField": "id",
            hiddenOn: "this.new_next_step.deal_type === 'pickupAtRuntime'"
          }
        ],
        id: "u:81a4913c61cc",
      },
    ],
    id: "u:ffff15b76c89",
    className: "b-a b-1x p-xs m-b-none m-l-none m-r-none m-t-sm",
    subFormMode: "",
    hiddenOn: "!!!this.new_next_step || this.new_next_step?.step_type === 'end'"
  };
};

const getCCSubmitRequestAdaptor = async (instance) => {
  return `  
            const instanceForm = SteedosUI.getRef(api.data.$scopeId).getComponentById("instance_form");
            const approveValues = SteedosUI.getRef(api.data.$scopeId).getComponentById("instance_approval").getValues();
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
  return `  const instanceForm = SteedosUI.getRef(api.data.$scopeId).getComponentById("instance_form");
            const formValues = instanceForm.getValues();
            const approveValues = SteedosUI.getRef(api.data.$scopeId).getComponentById("instance_approval").getValues();
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
                            step: approveValues.next_step._id,
                            users: nextUsers,
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
            const formValues = SteedosUI.getRef(api.data.$scopeId).getComponentById("instance_form").getValues();
            const approveValues = SteedosUI.getRef(api.data.$scopeId).getComponentById("instance_approval").getValues();
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
                  step: approveValues.next_step._id,
                  users: nextUsers,
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
  // console.log(`getSubmitActions instance====`, instance)
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
        // console.log("======getSubmitActions");
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
          url: `\${context.rootUrl}${api}`,
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
  // console.log("=============getApprovalDrawerSchema=============")
  return {
    type: "drawer",
    overlay: true,
    resizable: false,
    closeOnEsc: true,
    closeOnOutside: true,
    size: "sm",
    title: `${instance.step.name}`,
    className: "approval-drawer absolute",
    body: [
      {
        type: "form",
        debug: false,
        id: "instance_approval",
        resetAfterSubmit: true,
        body: [
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
          //       "args": {t
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
