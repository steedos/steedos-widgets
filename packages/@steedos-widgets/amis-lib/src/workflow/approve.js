import {
  lookupToAmisPicker,
  getSteedosAuth, Router
} from "@steedos-widgets/amis-lib";
import i18next from "i18next";
import { getUserApprove, isCC } from './util';
import { getStepsSchema } from './nextSteps';

//TODO Meteor.settings.public?.workflow?.hideCounterSignJudgeOptions

const HIDE_COUNTER_SIGN_JUDGE_OPTIONS = false;

const getJudgeOptions = async (instance) => {
  const { step } = instance;
  const options = [];
  if (step.step_type === "sign") {
    options.push({
      label: i18next.t('frontend_workflow_judge_option_approved'),//"核准",
      value: "approved",
    });
    options.push({
      label: i18next.t('frontend_workflow_judge_option_rejected'),//"驳回",
      value: "rejected",
    });
  } else if (
    step.step_type === "counterSign" &&
    HIDE_COUNTER_SIGN_JUDGE_OPTIONS != true
  ) {
    options.push({
      label: i18next.t('frontend_workflow_judge_option_approved'),//"核准",
      value: "approved",
    });
    options.push({
      label: i18next.t('frontend_workflow_judge_option_rejected'),//"驳回",
      value: "rejected",
    });
    if(step.showReadOption != false){
      options.push({
        label: i18next.t('frontend_workflow_judge_option_readed'),//"已阅",
        value: "readed",
      }); 
    }
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
      inline: true,
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
const getNextStepInput = async (instance, nextStepChangeEvents) => {
  // console.log('getNextStepInput', instance);
  if(instance.approve?.type == 'cc'){
    return ;
  }
  const isMobile = window.innerWidth < 768;
  return {
    type: "grid",
    columns: [
      {
        body: [
          {
            type: "tpl",
            tpl: i18next.t('frontend_workflow_next_step'),//"下一步",
            inline: true,
            wrapperComponent: "",
            id: "u:0a85de51480f",
          },
        ],
        id: "u:bf75adfb544e",
        md: "auto",
        xs: "auto",
        valign: "middle",
        columnClassName: "pr-2"
      },
      {
        body: [
          {
            type: "list-select",
            label: false,//手机端label和value显示为两行，左侧不应该有空隙
            name: "next_step",
            id: "u:next_step",
            multiple: false,
            required: true,
            className: "m-b-none",
            // selectFirst: true,
            autoFill: {
              "new_next_step": "${step}"
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
                  setTimeout(()=>{
                    context._scoped.doAction({
                      actionType: 'setValue',
                      componentId: 'instance_approval',
                      args: {
                        value: {
                          nextStepsError: payload.error
                        }
                      }
                    });
                  }, 100);
                  return {
                    status: 0,
                    data: {
                      options: [],
                      value: null
                    }
                  }
                }
                setTimeout(()=>{
                  context._scoped.doAction({
                    actionType: 'setValue',
                    componentId: 'instance_approval',
                    args: {
                      value: {
                        nextStepsError: null
                      }
                    }
                  });
                }, 100);
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
                if(payload.nextSteps.length === 1){
                  setTimeout(()=>{
                    var formComp = context._scoped.getComponentById("instance_approval");
                    if(formComp){
                      formComp.props.dispatchEvent("next_step_auto_selected", BuilderAmisObject.AmisLib.createObject(formComp.props.data, {
                        value: payload.nextSteps[0]._id,
                        next_step: payload.nextSteps[0]._id
                      }));
                    }
                  }, 100)
                }
                return payload;
              `,
              "data": {
                // "&": "$$",
                "context": "${context}",
                "$scopeId": "${scopeId}",
                "judge": "${new_judge}",
              }
            },
            "onEvent": {
              "change": {
                "weight": 0,
                "actions": [
                  ...nextStepChangeEvents
                ]
              }
            }
          },
          {
            "type": "tpl",
            "tpl": "<div class='text-danger text-sm'>${nextStepsError}</div>",
            "visibleOn": "this.nextStepsError"
          }
        ],
        id: "u:4d3a884b437c",
        valign: "middle"
      },
    ],
    id: "u:016c56efe5fd",
    className: isMobile ? "flex flex-wrap items-center py-1 mb-1" : "border-b border-gray-200 py-2",
    subFormMode: "",
  };
};

//TODO 只有一个处理人时,默认选中,禁止修改. 部分情况不需要显示下一步处理人
const getNextStepUsersInput = async (instance, nextStepUserChangeEvents) => {
  const isMobile = window.innerWidth < 768;
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
            tpl: i18next.t('frontend_workflow_next_users'),//"处理人",
            inline: true,
            wrapperComponent: "",
            id: "u:3203cc281b3c",
          },
        ],
        id: "u:8eece76a9e4c",
        md: "auto",
        xs: "auto",
        valign: "middle",
        columnClassName: "pr-2"
      },
      {
        body: [
          {
            type: 'service',
            id: "u:next_step_users_service",
            api: {
                "url": "/api/workflow/v2/nextStepUsersValue?next_step=${next_step}",
                "method": "post",
                "sendOn": "!!this.new_next_step && this.new_next_step.step_type != 'end' && this.next_step && !this.nextStepUsersError",
                "messages": {
                },
                "requestAdaptor": "\nconst { next_step, $scopeId } = api.data;\n\n\napi.data = {\n  instanceId: api.data.context._id,\n nextStepId: next_step,\n  \n}\n\n\n return api;",
                "adaptor": `
                  var _errorMsg = payload._error || payload.error;
                  if(!_errorMsg && payload.errors && payload.errors.length > 0){
                    _errorMsg = payload.errors.map(function(e){ return e.errorMessage || e.message || JSON.stringify(e); }).join('; ');
                  }
                  if(_errorMsg){
                    payload.data = {
                      next_users: null,
                      hasNextUsers: false,
                      nextStepUsersError: _errorMsg,
                      status: 0
                    };
                    return payload;
                  }
                  payload.data = {
                    next_users: payload.value,
                    hasNextUsers: !!payload.value && !_.isEmpty(payload.value)
                  }; 
                  return payload;`
              },
            body: [
              {
                "type": "steedos-user-selector",
                "multiple": false,
                label: false,
                name: "next_users",
                id: "u:next_users",
                hiddenOn: "(!this.hasNextUsers && this.new_next_step.deal_type != 'pickupAtRuntime') || this.new_next_step.step_type == 'counterSign' || this.nextStepUsersError",
                readonly: "${hasNextUsers || new_judge == 'rejected' || nextStepUsersError}",
                required: true,
                className: "m-b-none",
                "onEvent": {
                  "change": {
                    "weight": 0,
                    "actions": [
                      ...nextStepUserChangeEvents
                    ]
                  }
                }
            },
            {
                "type": "steedos-user-selector",
                label: false,
                "multiple": true,
                name: "next_users",
                id: "u:next_users",
                hiddenOn: "(!this.hasNextUsers && this.new_next_step.deal_type != 'pickupAtRuntime') || this.new_next_step.step_type != 'counterSign' || this.nextStepUsersError",
                readonly: "${hasNextUsers || new_judge == 'rejected' || nextStepUsersError}",
                required: true,
                multiple: true,
                className: "m-b-none",
                "onEvent": {
                  "change": {
                    "weight": 0,
                    "actions": [
                      ...nextStepUserChangeEvents
                    ]
                  }
                }
            },
            
            {
              type: "checkboxes",
              label: false,//手机端label和value显示为两行，左侧不应该有空隙
              name: "next_users",
              id: "u:next_users",
              required: true,
              hiddenOn: "this.new_next_step.deal_type == 'pickupAtRuntime' || this.hasNextUsers || this.new_next_step.step_type != 'counterSign' || this.nextStepUsersError",
              multiple: true,
              className: "m-b-none ${nextStepUsersError ? 'hidden' : ''}",
              disabledOn: "this.new_judge == 'rejected'",
              "source": {
                "url": "/api/workflow/v2/nextStepUsers?next_step=${next_step}",
                "method": "post",
                "sendOn": "!!this.new_next_step && this.new_next_step.step_type != 'end' && !!this.next_step",
                "trackExpression": "${new_next_step}",
                "messages": {
                },
                "requestAdaptor": " \nconst { next_step, $scopeId } = api.data;\n let formValues = context._scoped.getComponentById(\"instance_form\").getValues(); formValues = {...context.approveValues, ...formValues}; \n\napi.data = {\n  instanceId: api.data.context._id,\n nextStepId: next_step._id,\n  values: formValues\n}\n\n\n return api;",
                "adaptor": `
                  if(payload.error){
                    context._scoped.doAction({
                      actionType: 'setValue',
                      componentId: 'u:next_step_users_service',
                      args: {
                        value: {
                          nextStepUsersError: payload.error,
                          next_users: null,
                          hasNextUsers: false
                        }
                      }
                    });
                    return {
                      status: 0,
                      data: {
                        options: [],
                        value: null
                      }
                    }
                  }
                  context._scoped.doAction({
                    actionType: 'setValue',
                    componentId: 'u:next_step_users_service',
                    args: {
                      value: {
                        nextStepUsersError: null
                      }
                    }
                  });
                  let value = null;
                  if(context.new_next_step.step_type == 'counterSign'){
                      value = _.map(payload.nextStepUsers, 'id');
                  } else if(payload.nextStepUsers.length === 1){
                      value = payload.nextStepUsers[0].id;
                  }
                  if(payload.nextStepUsers.length === 1){
                    setTimeout(()=>{
                      context._scoped.doAction({
                        actionType: 'setValue',
                        componentId: 'instance_approval',
                        args: {
                          value: {
                            next_users: value
                          }
                        }
                      });
                    }, 200);
                  }

                  payload.data = {
                    value: value,
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
              "onEvent": {
                "change": {
                  "weight": 0,
                  "actions": [
                    ...nextStepUserChangeEvents
                  ]
                }
              }
            },
            {
              type: "radios",
              label: false,//手机端label和value显示为两行，左侧不应该有空隙
              name: "next_users",
              id: "u:next_users",
              required: true,
              hiddenOn: "this.new_next_step.deal_type === 'pickupAtRuntime' || this.hasNextUsers || this.new_next_step.step_type == 'counterSign' || this.nextStepUsersError",
              multiple: false,
              className: "m-b-none ${nextStepUsersError ? 'hidden' : ''}",
              disabledOn: "this.new_judge == 'rejected'",
              "source": {
                "url": "/api/workflow/v2/nextStepUsers?next_step=${next_step}",
                "method": "post",
                "sendOn": "!!this.new_next_step && this.new_next_step.step_type != 'end' && !!this.next_step",
                "trackExpression": "${new_next_step}",
                "messages": {
                },
                "requestAdaptor": " const { next_step, $scopeId } = api.data;\n if(api.query.next_step != next_step._id){return {'mockResponse':{'status':200,'data':{'status':0,'data':{}}}}}; \n let formValues = context._scoped.getComponentById(\"instance_form\").getValues(); formValues = {...context.approveValues, ...formValues}; \n\napi.data = {\n  instanceId: api.data.context._id,\n nextStepId: next_step._id,\n  values: formValues\n}\n\n\n return api;",
                "adaptor": `
                  if(payload.error){
                    context._scoped.doAction({
                      actionType: 'setValue',
                      componentId: 'u:next_step_users_service',
                      args: {
                        value: {
                          nextStepUsersError: payload.error,
                          next_users: null,
                          hasNextUsers: false
                        }
                      }
                    });
                    return {
                      status: 0,
                      data: {
                        options: [],
                        value: null
                      }
                    }
                  }
                  context._scoped.doAction({
                    actionType: 'setValue',
                    componentId: 'u:next_step_users_service',
                    args: {
                      value: {
                        nextStepUsersError: null
                      }
                    }
                  });
                  let nextUsersValue = payload.nextStepUsers.length === 1 ? payload.nextStepUsers[0].id : null;
                  if(payload.nextStepUsers.length === 1){
                    setTimeout(()=>{
                      context._scoped.doAction({
                        actionType: 'setValue',
                        componentId: 'instance_approval',
                        args: {
                          value: {
                            next_users: nextUsersValue
                          }
                        }
                      });
                    }, 200);
                  }
                  payload.data = {
                    value: nextUsersValue,
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
              "onEvent": {
                "change": {
                  "weight": 0,
                  "actions": [
                    ...nextStepUserChangeEvents
                  ]
                }
              }
            },
            {
              "type": "tpl",
              "tpl": "<div class='text-danger text-sm'>${nextStepUsersError}</div>",
              "visibleOn": "this.nextStepUsersError"
            }
            ]
          },
        ],
        id: "u:81a4913c61cc",
        valign: "middle",
      },
    ],
    id: "u:ffff15b76c89",
    className: isMobile ? "flex flex-wrap items-center py-1 mb-1" : "border-b border-gray-200 py-3", // ${new_next_step.step_type == 'counterSign' ? 'hidden' : ''}
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
                applicant: formValues.__applicant,
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
const getSubmitActions = async (instance, submitEvents) => {
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
        var wizard = event.context.scoped.getComponentById('instance_wizard');
        var form = event.context.scoped.getComponentById('instance_form');
        if (!wizard) {
          return form.validate().then(function(formValid) {
            event.setData(BuilderAmisObject.AmisLib.createObject(event.data, {instanceFormValidate: formValid}));
            return formValid;
          });
        }

        var stepsCount = wizard.state.rawSteps.length;
        var originStep = wizard.state.currentStep; // 索引从1开始

        function validateStepsUntilFail(i) {
          if (i > stepsCount) {
            // 所有校验都通过，回到原来的页面
            return wizard.gotoStep(originStep).then(function(){
              return true;
            });
          }
          return wizard.gotoStep(i).then(function() {
            return wizard.form.validate();
          }).then(function(valid) {
            if (!valid) {
              // 校验失败，停在本步骤，返回 false
              return false;
            }
            // 校验通过，递归下一个
            return validateStepsUntilFail(i + 1);
          });
        }

        return form.validate().then(function(formValid){
          return validateStepsUntilFail(1).then(function(wizardValid){
            // wizardValid为false时，当前wizard已停在第一个未通过步骤，并且未通过表单项高亮
            var allValid = formValid && wizardValid;
            event.setData(BuilderAmisObject.AmisLib.createObject(event.data, {instanceFormValidate: allValid}));
            return allValid;
          });
        });
      `
    },
    {
      "componentId": "",
      "args": {},
      "actionType": "custom",
      "script": ` 
        var form = event.context.scoped.getComponentById('instance_form');
        return form.submit().then((process)=>{
          if(process===false){
            event.stopPropagation();
            event.preventDefault();
            return ;
          }
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
          event.setData(BuilderAmisObject.AmisLib.createObject(event.data, {approvalFormValidate: approvalFormValidate}));
        })
      `,
      expression: "${event.data.instanceFormValidate}"
    },
    ...submitEvents,
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
          adaptor: `
            if (payload.errors && payload.errors.length > 0) {
              var errorMessages = payload.errors.map(function(e) { return e.errorMessage || e.message || JSON.stringify(e); }).join('; ');
              return { status: -1, msg: errorMessages };
            }
            window.SteedosWorkflow.Instance.changed=false;
            return { status: 0, data: { submitSuccess: true } };
          `
        },
        messages: {
          success: "提交成功!",
        },
      },
      actionType: "ajax",
      expression: "${event.data.instanceFormValidate && event.data.approvalFormValidate}"
    },
    {
        "actionType": "wait",
        "args": {
            "time": 300
        },
        expression: "${event.data.submitSuccess}"
    },
    {
      "actionType": "custom",
      "script": `
        const appId = context.props.data.appId;
        const objectName = context.props.data.objectName;
        const side_listview_id = context.props.data.side_listview_id;
        const additionalFilters = context.props.data.additionalFilters;
        if(context.props.data.display === 'split'){
          window.navigate(\`/app/\${appId}/\${objectName}/view/none?side_object=\${objectName}&side_listview_id=\${side_listview_id}&additionalFilters=\${additionalFilters ? encodeURIComponent(additionalFilters) : ''}\`);
          window.$(".list-view-btn-reload").click();
        }else{
          window.navigate(\`/app/\${appId}/\${objectName}/grid/\${side_listview_id}\`);
        }
        // 仅草稿提交时主动广播刷新左侧审批菜单：草稿数不在 badge 推送机制里。
        // 非草稿提交后服务端会推送 badge:change / instance:record:change 事件，
        // socket.client.js 已会触发 approval-tree-menu:reload，重复广播会导致 nav 接口被多次调用。
        // ApprovalTreeMenu 的"过滤器失效自愈"逻辑（issue #693）依赖 socket 触发的那次 reload 即可完成。
        ${instance.state === "draft" ? `window.postMessage({ type: 'approval-tree-menu:reload' }, '*');` : ''}
      `,
      expression: "${event.data.submitSuccess}"
    },
    {
      "actionType": "closeDialog",
      expression: "${event.data.submitSuccess}"
    }
  ];
};

export const getApprovalDrawerSchema = async (instance, events) => {
  const { submitEvents , nextStepInitedEvents, nextStepChangeEvents, nextStepUserChangeEvents } = events;
  const shouldUseApprovalWizard = instance.box === 'draft' && instance.state === 'draft' && instance.flow.allow_select_step;
  const isMobile = window.innerWidth < 768;
  const userId = getSteedosAuth().userId;
  const userApprove = getUserApprove({ instance, userId });
  const isCCApprove = isCC({ instance, approve: userApprove, userId });
  let drawerTitle = instance.step.name;
  if (isCCApprove) {
    let ccLabel = i18next.t('frontend_workflow_instance_cc_title');//"传阅",
    let ccFromLabel = i18next.t('frontend_workflow_instance_from');//"来自",
    const ccFromUserName = userApprove?.from_user_name || '';
    const ccDescription = userApprove?.cc_description || '';
    drawerTitle = `${ccLabel}&nbsp;(${ccFromLabel}${ccFromUserName})`;
    if (ccDescription.length) {
      drawerTitle += `&nbsp;:&nbsp;${ccDescription}`;
    }
  }
  const schema = {
    type: "drawer",
    overlay: false,
    resizable: false,
    closeOnEsc: true,
    closeOnOutside: true,
    size: isMobile ? "xl" : "sm",
    title: shouldUseApprovalWizard ? false : drawerTitle,
    className: ['approval-drawer', 'absolute', isMobile && shouldUseApprovalWizard && 'approval-drawer-mobile-wizard'].filter(Boolean).join(' '),
    headerClassName: 'p-2',
    bodyClassName: shouldUseApprovalWizard ? 'p-0' : 'p-2',
    footerClassName: "p-2 pt-0 flex justify-start",
    drawerContainer: ()=>{
      return document.querySelector(".steedos-amis-instance-approval-drawer-container");//document.body;
    },
    body: [
      {
        type: "form",
        initApi: {
          method: 'POST',
          url: '/api/v6/amis/health_check'
        },
        messages: {
          validateFailed: ""
        },
        debug: false,
        id: "instance_approval",
        resetAfterSubmit: true,
        body: shouldUseApprovalWizard ? [
          {
            type: "wizard",
            id: "u:approval_drawer_wizard",
            className: "approval-drawer-wizard mt-8 mb-0 border-0",
            steps: [
              {
                title: "指定审批步骤、处理人",
                body: [
                  ...(isMobile ? [{
                    type: 'tpl',
                    tpl: '<span class="step-dot active" style="margin-right:6px"></span><span class="step-dot"></span><span class="step-title" style="margin-left:10px">指定审批步骤、处理人</span>',
                    className: 'mobile-wizard-step-indicator'
                  }] : []),
                  await getStepsSchema(instance)
                ],
                actions: [
                  {
                    type: 'button',
                    label: '下一步',
                    level: 'primary',
                    onEvent: {
                      click: {
                        actions: [
                          // 校验表单
                          {
                            "componentId": "",
                            "args": {},
                            "actionType": "custom",
                            "script": `
                              var wizard = event.context.scoped.getComponentById('instance_wizard');
                              var form = event.context.scoped.getComponentById('instance_form');
                              if (!wizard) {
                                return form.validate().then(function(formValid) {
                                  if(!formValid){
                                    event.stopPropagation();
                                    event.preventDefault();
                                  }
                                  return formValid;
                                });
                              }

                              var stepsCount = wizard.state.rawSteps.length;
                              var originStep = wizard.state.currentStep; // 索引从1开始

                              function validateStepsUntilFail(i) {
                                if (i > stepsCount) {
                                  // 所有校验都通过，回到原来的页面
                                  return wizard.gotoStep(originStep).then(function(){
                                    return true;
                                  });
                                }
                                return wizard.gotoStep(i).then(function() {
                                  return wizard.form.validate();
                                }).then(function(valid) {
                                  if (!valid) {
                                    // 校验失败，停在本步骤，返回 false
                                    return false;
                                  }
                                  // 校验通过，递归下一个
                                  return validateStepsUntilFail(i + 1);
                                });
                              }

                              return form.validate().then(function(formValid){
                                return validateStepsUntilFail(1).then(function(wizardValid){
                                  // wizardValid为false时，当前wizard已停在第一个未通过步骤，并且未通过表单项高亮
                                  var allValid = formValid && wizardValid;
                                  if(!allValid){
                                    event.stopPropagation();
                                    event.preventDefault();
                                  }
                                  return allValid;
                                });
                              });
                            `
                          },
                          {
                            "actionType": "custom",
                            "script": `let isValid = true;
                              const instance = event.data.record;
                              if(instance.box === 'draft' && instance.state === 'draft' && instance.flow.allow_select_step){
                                const steps = event.data._scoped.getComponentById("u:set_steps_users").props.data?.nextSteps || [];
                                const result = Steedos.authRequest('/api/workflow/v2/get_instance_steps/'+instance._id, {async: false})
                                const stepApprove = result.data.step_approve; 
                                const skip_steps = result.data.skip_steps; 
                                _.each(steps, (step) => {
                                  if (step.step_type !== "start" && step.step_type !== "end" && !_.includes(skip_steps, step._id)) {
                                    const stepApproves = stepApprove[step._id]
                                      if (_.isEmpty(stepApproves)) {
                                        isValid = false;
                                        SteedosUI.notification.error({message:'请选择「'+step.name+'」步骤的处理人'});
                                      }
                                  }
                                });
                                if(!isValid){
                                  event.stopPropagation();
                                  event.preventDefault();
                                  return false;
                                };
                              }
                              return true;
                            `
                          },
                          {
                            "actionType": "next",
                            "componentId": 'u:approval_drawer_wizard'
                          }
                        ]
                      }
                    }
                  },
                  {
                    type: "button",
                    label: "${'Cancel' | t}",
                    className: "steedos-approve-close-button",
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
                  },
                ]
              },
              {
                title: '发送',
                body: [
                  ...(isMobile ? [{
                    type: 'tpl',
                    tpl: '<span class="step-dot" style="margin-right:6px"></span><span class="step-dot active"></span><span class="step-title" style="margin-left:10px">发送</span>',
                    className: 'mobile-wizard-step-indicator'
                  }] : []),
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
                    className: isMobile ? "mb-2" : "",
                    minRows: 3,
                    maxRows: 20,
                    placeholder: i18next.t('frontend_workflow_suggestion_placeholder'),//"请填写意见",
                    requiredOn: "${judge === 'rejected'}",
                    value: userApprove?.description,
                    "onEvent": {
                      "blur": {
                        "actions": [
                          {
                            "componentId": "u:instancePage",
                            "actionType": "setValue",
                            "args": {
                              "value": {
                                "instance_my_approve_description": "${value}"
                              }
                            }
                          }
                        ]
                      }
                    }
                  },
                  await getNextStepInput(instance, nextStepChangeEvents),
                  await getNextStepUsersInput(instance, nextStepUserChangeEvents),
                ],
                actions: [
                  {
                    type: "button",
                    label: "${'Submit' | t}",
                    onEvent: {
                      click: {
                        actions: await getSubmitActions(instance, submitEvents),
                      },
                    },
                    id: "steedos-approve-submit-button",
                    className: "steedos-approve-submit-button",
                    level: "primary",
                  },
                  // {
                  //   type: "button",
                  //   label: "上一步",
                  //   actionType: "prev",
                  //   componentId: "u:approval_drawer_wizard",
                  // },
                  {
                    type: "button",
                    label: "${'Cancel' | t}",
                    className: "steedos-approve-close-button",
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
              }
            ],
            "onEvent": {
              "change": {
                "actions": [
                  {
                    "actionType": "setValue",
                    "componentId": "instance_approval",
                    "args": {
                      "value": "${event.data}"
                    }
                  }
                ]
              }
            }
          }
        ] : [
          await getStepsSchema(instance),
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
            className: isMobile ? "mb-2" : "",
            minRows: 3,
            maxRows: 20,
            placeholder: i18next.t('frontend_workflow_suggestion_placeholder'),//"请填写意见",
            requiredOn: "${judge === 'rejected'}",
            value: userApprove?.description,
            "onEvent": {
              "blur": {
                "actions": [
                  {
                    "componentId": "u:instancePage",
                    "actionType": "setValue",
                    "args": {
                      "value": {
                        "instance_my_approve_description": "${value}"
                      }
                    }
                  }
                ]
              }
            }
          },
          await getNextStepInput(instance, nextStepChangeEvents),
          await getNextStepUsersInput(instance, nextStepUserChangeEvents),
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
          "next_step_auto_selected": {
            "actions": [
              ...nextStepChangeEvents
            ]
          },
          "inited": {
            "actions": [
              ...nextStepInitedEvents,
              {
                "actionType": "custom",
                "script": (context, doAction, event) => {
                  if (window.approvalDrawerObserver) window.approvalDrawerObserver.disconnect();

                  const CONFIG = {
                    bodySelector: ".steedos-amis-instance-view .antd-Page-content .steedos-amis-instance-view-body",
                    drawerContainerSelector: ".steedos-amis-instance-view .steedos-amis-instance-approval-drawer-container",
                    drawerSelector: ".steedos-amis-instance-view .approval-drawer",
                    drawerContentSelector: ".steedos-amis-instance-view .approval-drawer .antd-Drawer-content",
                    approveButtonSelector: ".steedos-instance-detail-wrapper .steedos-amis-instance-view .approve-button"
                  };

                  const container = document.querySelector(CONFIG.drawerContainerSelector);
                  if (!container) return;

                  // 每次点开底部签批栏添加审批单内部底边距以解决签批栏会挡住申请单内容的问题
                  const syncHeight = () => {
                    const drawerEl = document.querySelector(CONFIG.drawerSelector);
                    const bodyEl = document.querySelector(CONFIG.bodySelector);
                    
                    if (!drawerEl) {
                      // 场景 A: Drawer 已经消失 -> 清理样式
                      if (bodyEl) {
                        bodyEl.style.marginBottom = "0px";
                        bodyEl.style.paddingBottom = "0px";
                        
                        const btn = document.querySelector(CONFIG.approveButtonSelector);
                        if (btn) btn.classList.remove('hidden');
                        
                        if (window.approvalDrawerObserver) {
                            window.approvalDrawerObserver.disconnect();
                            window.approvalDrawerObserver = null;
                        }
                      }
                      return;
                    }

                    // 场景 B: Drawer 还在 -> 动态计算并更新高度
                    const contentEl = document.querySelector(CONFIG.drawerContentSelector);
                    if (contentEl && bodyEl) {
                      const newHeight = contentEl.clientHeight + 2;
                      const currentMargin = parseInt(bodyEl.style.marginBottom || "0");
                      
                      // 只有高度变化超过一定大小才会触发重绘，减少性能损耗
                      if (Math.abs(newHeight - currentMargin) > 10) {
                        requestAnimationFrame(() => {
                          if (bodyEl) {
                            bodyEl.style.marginBottom = newHeight + "px";
                            // 这里签批栏高度clientHeight可能动态变高一行，MutationObserver会触发syncHeight函数会重新计算适配，所以这里的paddingBottom大点小点没关系
                            bodyEl.style.paddingBottom = "30px";
                          }
                        });
                      }
                    }
                  };

                  requestAnimationFrame(() => {
                    setTimeout(syncHeight, 300);
                  });
                  
                  window.approvalDrawerObserver = new MutationObserver((mutations, obs) => {
                    // 无论是 Drawer 本身被删了，还是它里面的子节点变了，都会触发 syncHeight
                    try {
                      syncHeight();
                    } catch (e) {
                      console.error("Instance Approval MutationObserver Error:", e);
                      obs.disconnect();
                    }
                  });

                  // 启动监听：只监控子节点增删，开销极小
                  window.approvalDrawerObserver.observe(container, {
                    childList: true,
                    subtree: true
                  });

                  var scrollToBottom = function(){
                    setTimeout(function(){
                      const instanceViewBody = document.querySelector(CONFIG.bodySelector);
                      if (instanceViewBody){
                        $(instanceViewBody).animate({scrollTop: $(instanceViewBody).prop("scrollHeight")});
                      }
                    }, 500);
                  }
                  var btn = document.querySelector(CONFIG.approveButtonSelector);
                  if (btn && btn.dataset.triggerSource === 'scrollToBottom') {
                    scrollToBottom();
                    delete btn.dataset.triggerSource;
                  }

                  var submitApprovalForm = function(){
                    // 用amis actionType触发btnSubmit提交事件不会触发表单校验，加很长时间的延时也没用，改用原生js click事件触发
                    setTimeout(function(){
                      var btnSubmit = document.querySelector('.steedos-instance-detail-wrapper .approval-drawer .steedos-approve-submit-button');
                      if (btnSubmit) {
                        btnSubmit.click();
                      }
                    }, 500);
                  }
                  event.data.autoSubmitInstance && submitApprovalForm();
                }
              }
            ]
          }
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
          // validateError: {
          //   weight: 0,
          //   actions: [
          //     {
          //       "componentId": "",
          //       "args": {
          //         "msgType": "info",
          //         "position": "top-right",
          //         "closeButton": true,
          //         "showIcon": true,
          //         "title": i18next.t('frontend_workflow_submit_validate_error_title'),//"提交失败",
          //         "msg": i18next.t('frontend_workflow_submit_validate_error_msg'),//"请填写必填字段"
          //       },
          //       "actionType": "toast"
          //     }
          //   ],
          // }
        },
        
      },
    ],
    id: "u:approve_8861156e0b23",
    position: "bottom",
    actions: shouldUseApprovalWizard ? false : [
      {
        type: "button",
        label: "${'Submit' | t}",
        onEvent: {
          click: {
            actions: await getSubmitActions(instance, submitEvents),
          },
        },
        id: "steedos-approve-submit-button",
        className: "steedos-approve-submit-button",
        level: "primary",
      },
      {
        type: "button",
        label: "${'Cancel' | t}",
        className: "steedos-approve-close-button",
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
  // console.log(`getApprovalDrawerSchema: `, schema)
  return schema;
};
