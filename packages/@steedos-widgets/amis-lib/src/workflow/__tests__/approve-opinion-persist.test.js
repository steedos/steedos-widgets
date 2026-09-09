// steedos/steedos-plugins#879 签批抽屉关闭后重开，意见栏应保留提交前写的意见
// jest 默认 jsdom 环境：window / document / window.localStorage 都是真实实现（window.localStorage 是只读访问器，不能整体替换）
global.BuilderAmisObject = {
  AmisLib: {
    createObject: jest.fn((base, extra) => ({ ...(base || {}), ...(extra || {}) }))
  }
};

jest.mock("i18next", () => ({
  t: (key) => key
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
    description: "服务器上已保存的意见"
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
const { getUserApprove, shouldUseAllStepSelection } = require("../util");

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

const createInstance = (overrides = {}) => ({
  _id: "instance-1",
  state: "pending",
  box: "inbox",
  step: {
    _id: "step-current",
    name: "二号审批",
    step_type: "counterSign"
  },
  approve: {
    _id: "approve-1",
    type: "approve",
    handler: "user-1",
    description: "服务器上已保存的意见"
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
  traces: [],
  ...overrides
});

const createEvents = () => ({
  submitEvents: [],
  nextStepInitedEvents: [{ actionType: "custom", script: "/* 原有的 inited 动作 */" }],
  nextStepChangeEvents: [],
  nextStepUserChangeEvents: []
});

// 脚本里的 window.localStorage 就是 jsdom 的真实 Storage，这里只包一层方便断言
const storage = {
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
  keys: () => Array.from({ length: window.localStorage.length }, (_, index) => window.localStorage.key(index))
};

// amis custom 动作就是把 script 字符串编译成 (context, doAction, event) 函数再调用
const runScript = (script, { event = {}, context = {} } = {}) => {
  expect(typeof script).toBe("string");
  const fn = new Function("context", "doAction", "event", script);
  return fn.call({}, context, () => {}, event);
};

const KEY_PATTERN = /steedos_workflow_approval_suggestion_[^"'\s]+/;
const extractKey = (script) => {
  const matched = (script || "").match(KEY_PATTERN);
  expect(matched).toBeTruthy();
  return matched[0];
};

const findApprovalForm = (schema) =>
  walk(schema, node => node.type === "form" && node.id === "instance_approval")[0];

// 直接持有意见输入框的那一层：普通抽屉是 instance_approval 表单本身，向导模式是「发送」步骤（amis 会把每一步渲染成独立 form）
const findOpinionOwner = (schema) =>
  walk(schema, node =>
    Array.isArray(node.body) &&
    node.body.some(child => child && child.type === "textarea" && child.name === "suggestion")
  )[0];

const findTextareas = (schema) =>
  walk(schema, node => node.type === "textarea" && node.name === "suggestion");

const findInitedRestoreActions = (node) => {
  const actions = node && node.onEvent && node.onEvent.inited && node.onEvent.inited.actions;
  expect(Array.isArray(actions)).toBe(true);
  return actions.filter(action =>
    action && action.actionType === "custom" && KEY_PATTERN.test(action.script || "")
  );
};

const findSubmitActions = (schema) => {
  const button = walk(schema, node =>
    typeof node.className === "string" && node.className.includes("steedos-approve-submit-button")
  )[0];
  expect(button).toBeTruthy();
  const actions = button.onEvent && button.onEvent.click && button.onEvent.click.actions;
  expect(Array.isArray(actions)).toBe(true);
  return actions;
};

describe("approval drawer keeps the opinion after the drawer is closed (#879)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    shouldUseAllStepSelection.mockReturnValue(false);
  });

  test.each([
    ["plain", false],
    ["wizard", true]
  ])("%s drawer: typing writes the opinion to localStorage under a key per instance and approve", async (_label, wizard) => {
    shouldUseAllStepSelection.mockReturnValue(wizard);

    const schema = await getApprovalDrawerSchema(createInstance(), createEvents());
    const textareas = findTextareas(schema);
    expect(textareas.length).toBeGreaterThan(0);

    textareas.forEach(textarea => {
      // 首次打开仍以服务器上已保存的意见为默认值
      expect(textarea.value).toBe("服务器上已保存的意见");
      // 输入立即写进表单并触发 change，否则 250ms 防抖在抽屉关闭卸载时被取消，最后一段输入保留不下来
      expect(textarea.changeImmediately).toBe(true);
      // 原有的 blur → 页面变量 instance_my_approve_description 同步不能丢（静默保存靠它）
      const blurActions = textarea.onEvent.blur.actions;
      expect(blurActions.some(action => action.actionType === "setValue" && action.componentId === "u:instancePage")).toBe(true);

      const changeActions = textarea.onEvent.change.actions.filter(action => action.actionType === "custom");
      expect(changeActions.length).toBe(1);
      const key = extractKey(changeActions[0].script);
      expect(key).toContain("instance-1");
      expect(key).toContain("approve-1");
      expect(key).not.toContain("$");

      runScript(changeActions[0].script, { event: { data: { value: "用户刚输入的意见" } } });
      expect(storage.keys()).toEqual([key]);
      expect(storage.getItem(key)).toBe("用户刚输入的意见");

      // 用户把意见清空也要如实保留，重开不能又冒出服务器上的旧意见
      runScript(changeActions[0].script, { event: { data: { value: "" } } });
      expect(storage.getItem(key)).toBe("");

      runScript(changeActions[0].script, { event: { data: { value: undefined } } });
      expect(storage.keys()).toEqual([]);
    });
  });

  test("plain drawer: form inited restores the locally kept opinion into instance_approval, server value stays when nothing is kept", async () => {
    const schema = await getApprovalDrawerSchema(createInstance(), createEvents());
    const form = findApprovalForm(schema);
    expect(findOpinionOwner(schema)).toBe(form);

    const restoreActions = findInitedRestoreActions(form);
    expect(restoreActions.length).toBe(1);
    // 回填排在原有 inited 动作前面，意见尽早显示
    expect(form.onEvent.inited.actions[0]).toBe(restoreActions[0]);
    expect(form.onEvent.inited.actions.length).toBeGreaterThan(1);

    const key = extractKey(restoreActions[0].script);
    const approvalForm = { setValues: jest.fn() };
    const scoped = { getComponentById: jest.fn(id => (id === "instance_approval" ? approvalForm : null)) };

    // 本地没有记录：不动表单，仍显示服务器上已保存的意见
    runScript(restoreActions[0].script, { event: { context: { scoped } } });
    expect(approvalForm.setValues).not.toHaveBeenCalled();

    storage.setItem(key, "关闭抽屉前写的意见");
    runScript(restoreActions[0].script, { event: { context: { scoped } } });
    expect(approvalForm.setValues).toHaveBeenCalledTimes(1);
    expect(approvalForm.setValues).toHaveBeenCalledWith({ suggestion: "关闭抽屉前写的意见" });

    // 空串也是用户的选择
    approvalForm.setValues.mockClear();
    storage.setItem(key, "");
    runScript(restoreActions[0].script, { event: { context: { scoped } } });
    expect(approvalForm.setValues).toHaveBeenCalledWith({ suggestion: "" });
  });

  test("wizard drawer: the 发送 step form restores into itself and into instance_approval", async () => {
    shouldUseAllStepSelection.mockReturnValue(true);

    const schema = await getApprovalDrawerSchema(createInstance(), createEvents());
    const step = findOpinionOwner(schema);
    expect(step.title).toBe("发送");
    // 向导每一步是独立 form，得有 id 才能被 getComponentById 找到
    expect(typeof step.id).toBe("string");
    expect(step.id.length).toBeGreaterThan(0);

    const restoreActions = findInitedRestoreActions(step);
    expect(restoreActions.length).toBe(1);
    const key = extractKey(restoreActions[0].script);

    const stepForm = { setValues: jest.fn() };
    const approvalForm = { setValues: jest.fn() };
    const scoped = {
      getComponentById: jest.fn(id => {
        if (id === step.id) return stepForm;
        if (id === "instance_approval") return approvalForm;
        return null;
      })
    };

    storage.setItem(key, "关闭抽屉前写的意见");
    runScript(restoreActions[0].script, { event: { context: { scoped } } });
    expect(stepForm.setValues).toHaveBeenCalledWith({ suggestion: "关闭抽屉前写的意见" });
    expect(approvalForm.setValues).toHaveBeenCalledWith({ suggestion: "关闭抽屉前写的意见" });

    // 外层 instance_approval 自己 inited 时也回填（向导 change 同步只在用户改动时触发）
    const outerRestore = findInitedRestoreActions(findApprovalForm(schema));
    expect(outerRestore.length).toBe(1);
    expect(extractKey(outerRestore[0].script)).toBe(key);

    // 「发送」步骤的意见输入框写的也是同一个 key
    const textarea = findTextareas(schema)[0];
    expect(extractKey(textarea.onEvent.change.actions[0].script)).toBe(key);
  });

  test("restore is a no-op when the form cannot be found", async () => {
    const schema = await getApprovalDrawerSchema(createInstance(), createEvents());
    const restoreActions = findInitedRestoreActions(findApprovalForm(schema));
    storage.setItem(extractKey(restoreActions[0].script), "x");
    expect(() => runScript(restoreActions[0].script, { event: {} })).not.toThrow();
    expect(() => runScript(restoreActions[0].script, {
      event: { context: { scoped: { getComponentById: () => null } } }
    })).not.toThrow();
  });

  test("storage key changes with the instance and the approve record", async () => {
    const first = extractKey(findTextareas(await getApprovalDrawerSchema(createInstance(), createEvents()))[0].onEvent.change.actions[0].script);

    getUserApprove.mockReturnValueOnce({
      _id: "approve-2",
      type: "approve",
      handler: "user-1",
      description: ""
    });
    const second = extractKey(findTextareas(
      await getApprovalDrawerSchema(createInstance({ _id: "instance-2" }), createEvents())
    )[0].onEvent.change.actions[0].script);

    expect(first).not.toBe(second);
    expect(second).toContain("instance-2");
    expect(second).toContain("approve-2");
  });

  test.each([
    ["plain", false],
    ["wizard", true]
  ])("%s drawer: successful submit clears the kept opinion before the drawer closes", async (_label, wizard) => {
    shouldUseAllStepSelection.mockReturnValue(wizard);

    const schema = await getApprovalDrawerSchema(createInstance(), createEvents());
    const key = extractKey(findTextareas(schema)[0].onEvent.change.actions[0].script);
    const actions = findSubmitActions(schema);

    const ajaxIndex = actions.findIndex(action => action.actionType === "ajax");
    const closeIndex = actions.findIndex(action => action.actionType === "closeDialog");
    const clearIndex = actions.findIndex(action =>
      action.actionType === "custom" && /localStorage/.test(action.script || "")
    );

    expect(ajaxIndex).toBeGreaterThan(-1);
    expect(closeIndex).toBeGreaterThan(ajaxIndex);
    // 提交走的是 ajax 动作，amis 自己的 clearPersistDataAfterSubmit 不会触发，必须显式清
    expect(clearIndex).toBeGreaterThan(ajaxIndex);
    expect(clearIndex).toBeLessThan(closeIndex);
    expect(actions[clearIndex].expression).toBe("${event.data.submitSuccess}");

    storage.setItem(key, "提交的意见");
    storage.setItem("steedos_workflow_approval_suggestion_other-instance_other-approve", "别的申请单的意见");
    runScript(actions[clearIndex].script, { event: { data: { submitSuccess: true } } });
    expect(storage.getItem(key)).toBe(null);
    // 只清本条签批的，不动别的申请单
    expect(storage.getItem("steedos_workflow_approval_suggestion_other-instance_other-approve")).toBe("别的申请单的意见");
  });
});
