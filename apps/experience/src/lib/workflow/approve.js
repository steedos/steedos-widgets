import { last, map } from "lodash";
import {
  lookupToAmisPicker,
  getSteedosAuth,
} from "@steedos-widgets/amis-lib";
//TODO Meteor.settings.public?.workflow?.hideCounterSignJudgeOptions
const HIDE_COUNTER_SIGN_JUDGE_OPTIONS = false;

const getNextStep = async (instance) => {
  return instance.flowVersion.steps; // TODO
};

const getNextStepOptions = async (instance) => {
  const steps = await getNextStep(instance);
  return map(steps, (step) => {
    return {
      label: step.name,
      value: step._id,
    };
  });
};

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
  if (judgeOptions.length > 0) {
    return {
      type: "radios",
      label: false,
      name: "judge",
      options: judgeOptions,
      id: "u:444dbad76e90",
    };
  }
};

//TODO 只有一个下一步时,默认选中,并且禁止修改.
const getNextStepInput = async (instance) => {
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
            options: await getNextStepOptions(instance),
            id: "u:61f5de3d39cb",
            multiple: false,
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
          Object.assign({name: "next_users", value: ""}, await lookupToAmisPicker(
            {
              name: "next_users",
              label: false,
              reference_to: "space_users",
              reference_to_field: 'user',
              multiple: false,
            },
            false,
            {}
          )),
        ],
        id: "u:81a4913c61cc",
      },
    ],
    id: "u:ffff15b76c89",
    className: "b-a b-1x p-xs m-b-none m-l-none m-r-none m-t-sm",
    subFormMode: "",
  };
};

const getPostSubmitRequestAdaptor = async (instance) => {
  return `  console.log("submit", api)
            const formValues = SteedosUI.getRef("amis-root-workflow").getComponentById("instance_form").getValues();
            const approveValues = SteedosUI.getRef("amis-root-workflow").getComponentById("instance_approval").getValues();

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
                            users: [approveValues.next_users],
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
  return `  console.log("engine", api)
            const formValues = SteedosUI.getRef("amis-root-workflow").getComponentById("instance_form").getValues();
            const approveValues = SteedosUI.getRef("amis-root-workflow").getComponentById("instance_approval").getValues();
            const body = {Approvals: [{
              instance: "${instance._id}",
              judge: approveValues.judge,
              trace: "${instance.approve.trace}",
              _id: "${instance.approve._id}",
              next_steps: [{
                  step: approveValues.next_step,
                  users: [approveValues.next_users],
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
  if (instance.state === "draft") {
    api = "/api/workflow/submit";
    requestAdaptor = await getPostSubmitRequestAdaptor(instance);
  } else if (instance.state === "pending") {
    api = "/api/workflow/engine";
    requestAdaptor = await getPostEngineRequestAdaptor(instance);
  } else {
    return null; //TODO 考虑异常情况?
  }

  return [
    {
      componentId: "",
      args: {
        api: {
          url: `\${context.rootUrl}${api}`,
          method: "post",
          dataType: "json",
          headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}",
          },
          requestAdaptor: requestAdaptor,
        },
        messages: {
          success: "提交成功",
        },
      },
      actionType: "ajax",
    },
  ];
};

export const getApprovalDrawerSchema = async (instance) => {
  return {
    type: "drawer",
    overlay: false,
    resizable: false,
    size: "sm",
    title: `${instance.step.name}`,
    className: "approval-drawer absolute",
    body: [
      {
        type: "form",
        debug: false,
        id: "instance_approval",
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
          },
          await getNextStepInput(instance),
          await getNextStepUsersInput(instance),
        ],
      },
    ],
    id: "u:8861156e0b23",
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
    ],
  };
};
