global.window = {
  innerWidth: 1024,
  navigator: {
    userAgent: "Mozilla/5.0 Chrome/126 Safari/537.36"
  }
};

global.document = {
  querySelector: jest.fn(() => null)
};

global.BuilderAmisObject = {
  AmisLib: {
    createObject: jest.fn((base, extra) => ({ ...(base || {}), ...(extra || {}) }))
  }
};

jest.mock("i18next", () => ({
  t: (key) => ({
    frontend_workflow_next_step: "下一步",
    frontend_workflow_next_users: "处理人",
    frontend_workflow_judge_option_approved: "核准",
    frontend_workflow_judge_option_rejected: "驳回",
    frontend_workflow_judge_option_readed: "已阅",
    frontend_workflow_suggestion_placeholder: "请填写意见"
  }[key] || key)
}));

jest.mock("@steedos-widgets/amis-lib", () => ({
  lookupToAmisPicker: jest.fn(),
  getSteedosAuth: jest.fn(() => ({ userId: "user-1" })),
  Router: {}
}));

jest.mock("../util", () => ({
  getUserApprove: jest.fn(() => ({
    _id: "approve-1",
    type: "approve",
    handler: "user-1",
    description: ""
  })),
  isCC: jest.fn(() => false),
  shouldUseAllStepSelection: jest.fn(() => false),
  getWorkflowMultiLookupNormalizationScript: jest.fn(() => '')
}));

jest.mock("../nextSteps", () => ({
  getStepsSchema: jest.fn(() => ({
    type: "tpl",
    tpl: ""
  }))
}));

const { getApprovalDrawerSchema } = require("../approve");

const walk = (node, predicate, matches = []) => {
  if (!node || typeof node !== "object") {
    return matches;
  }
  if (predicate(node)) {
    matches.push(node);
  }
  if (Array.isArray(node)) {
    node.forEach(child => walk(child, predicate, matches));
    return matches;
  }
  Object.values(node).forEach(child => walk(child, predicate, matches));
  return matches;
};

const schemaText = (node) => JSON.stringify(node);

const createInstance = () => ({
  _id: "instance-1",
  state: "pending",
  box: "inbox",
  step: {
    _id: "step-current",
    name: "会签",
    step_type: "sign"
  },
  approve: {
    _id: "approve-1",
    type: "approve",
    handler: "user-1",
    description: ""
  },
  flow: {
    _id: "flow-1"
  },
  flowVersion: {
    _id: "flow-version-1"
  },
  trace: {
    _id: "trace-1"
  },
  traces: []
});

describe("approval DingTalk PC layout reflow", () => {
  test("injects DingTalk PC layout pulse without replacing next user controls", async () => {
    const schema = await getApprovalDrawerSchema(createInstance(), {
      submitEvents: [],
      nextStepInitedEvents: [],
      nextStepChangeEvents: [],
      nextStepUserChangeEvents: []
    });

    const nextStep = walk(schema, node => node.type === "list-select" && node.name === "next_step")[0];
    expect(nextStep).toBeTruthy();
    expect(nextStep.source.adaptor).toContain("__steedosPulseDingTalkPcApprovalLayout");

    const radios = walk(schema, node => node.type === "radios" && node.name === "next_users")[0];
    expect(radios).toBeTruthy();
    expect(radios.source.adaptor).toContain("__steedosPulseDingTalkPcApprovalLayout");
    expect(radios.hiddenOn).toContain("this.new_next_step.deal_type === 'pickupAtRuntime'");

    const checkboxes = walk(schema, node => node.type === "checkboxes" && node.name === "next_users")[0];
    expect(checkboxes).toBeTruthy();
    expect(checkboxes.source.adaptor).toContain("__steedosPulseDingTalkPcApprovalLayout");

    const nextUsersService = walk(schema, node => node.id === "u:next_step_users_service")[0];
    expect(nextUsersService).toBeTruthy();
    expect(nextUsersService.api.adaptor).toContain("__steedosPulseDingTalkPcApprovalLayout");

    const fullSchema = schemaText(schema);
    expect(fullSchema).not.toContain("approval-next-users-single-display");
    expect(fullSchema).not.toContain("approval-dingtalk-pc-display-row");
    expect(fullSchema).not.toContain("_singleNextUserDisplayName");
  });
});
