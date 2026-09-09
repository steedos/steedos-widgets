jest.mock('@steedos-widgets/amis-lib', () => ({
  getSteedosAuth: jest.fn(() => ({ userId: 'user-1' })),
  fetchAPI: jest.fn()
}), { virtual: true });

import {
  checkDeletePermission,
  allowRemoveAttachment,
  getAttachmentUploadStepId
} from '../attachment';

// 步骤
const STEP_APPLY = { _id: 'step-apply', name: '申请' };
const STEP_MANAGER = { _id: 'step-manager', name: '经理审批' };
// 经理审批步骤同样允许编辑普通附件（can_edit_normal_attach 未配置 = 允许），
// 正是这一点让「上传人在后续步骤也能删」的漏洞得以触发。

const USER_A = 'user-a'; // 申请人，在申请步骤上传了附件
const USER_B = 'user-b'; // 其他人

/**
 * 构造一张申请单：
 * trace1 = 申请步骤(approve-1, 处理人 user-a)
 * trace2 = 经理审批步骤(approve-2, 处理人由参数决定)
 */
function makeInstance({ traces, box = 'inbox', state = 'pending', approve } = {}) {
  return {
    _id: 'ins-1',
    state,
    box,
    approve,
    flow: { _id: 'flow-1', state: 'enabled' },
    traces
  };
}

const TRACE_APPLY = {
  _id: 'trace-1',
  step: STEP_APPLY._id,
  approves: [{ _id: 'approve-1', handler: USER_A, user: USER_A, type: 'draft' }]
};

function traceManager(handler) {
  return {
    _id: 'trace-2',
    step: STEP_MANAGER._id,
    approves: [{ _id: 'approve-2', handler, user: handler }]
  };
}

// 在申请步骤(approve-1)由 user-a 上传的普通附件
function makeAttachment(overrides = {}) {
  return {
    _id: 'file-1',
    original: { name: 'a.pdf' },
    metadata: {
      owner: USER_A,
      instance: 'ins-1',
      approve: 'approve-1',
      parent: 'file-1',
      current: true,
      ...(overrides.metadata || {})
    },
    history_versions: overrides.history_versions || [{ _id: 'file-1' }]
  };
}

describe('附件删除权限：只有原上传人回到原步骤才能删除 (#871)', () => {
  test('原上传人在原步骤可以删除', () => {
    const instance = makeInstance({ traces: [TRACE_APPLY] });
    expect(
      checkDeletePermission({
        instance,
        attachment: makeAttachment(),
        currentStep: STEP_APPLY,
        userId: USER_A,
        box: 'inbox'
      })
    ).toBe(true);
  });

  test('流程已流转到别的步骤时，即使当前处理人就是原上传人也不能删除', () => {
    // user-a 在申请步骤上传附件，流程走到经理审批步骤，而经理恰好也是 user-a
    const instance = makeInstance({ traces: [TRACE_APPLY, traceManager(USER_A)] });
    expect(
      checkDeletePermission({
        instance,
        attachment: makeAttachment(),
        currentStep: STEP_MANAGER,
        userId: USER_A,
        box: 'inbox'
      })
    ).toBe(false);
  });

  test('退回到原步骤后（新 trace、同一步骤）原上传人可以删除', () => {
    const returnedTrace = {
      _id: 'trace-3',
      step: STEP_APPLY._id,
      approves: [{ _id: 'approve-3', handler: USER_A, user: USER_A }]
    };
    const instance = makeInstance({
      traces: [TRACE_APPLY, traceManager(USER_B), returnedTrace]
    });
    expect(
      checkDeletePermission({
        instance,
        attachment: makeAttachment(),
        currentStep: STEP_APPLY,
        userId: USER_A,
        box: 'inbox'
      })
    ).toBe(true);
  });

  test('非原上传人在原步骤也不能删除', () => {
    const instance = makeInstance({ traces: [TRACE_APPLY] });
    expect(
      checkDeletePermission({
        instance,
        attachment: makeAttachment(),
        currentStep: STEP_APPLY,
        userId: USER_B,
        box: 'inbox'
      })
    ).toBe(false);
  });

  test('主附件同样受原步骤限制', () => {
    const mainAttachment = makeAttachment({ metadata: { main: true } });
    const stepApplyMain = { ...STEP_APPLY, can_edit_main_attach: true };
    const stepManagerMain = { ...STEP_MANAGER, can_edit_main_attach: true };

    expect(
      checkDeletePermission({
        instance: makeInstance({ traces: [TRACE_APPLY] }),
        attachment: mainAttachment,
        currentStep: stepApplyMain,
        userId: USER_A,
        box: 'inbox'
      })
    ).toBe(true);

    expect(
      checkDeletePermission({
        instance: makeInstance({ traces: [TRACE_APPLY, traceManager(USER_A)] }),
        attachment: mainAttachment,
        currentStep: stepManagerMain,
        userId: USER_A,
        box: 'inbox'
      })
    ).toBe(false);
  });

  test('历史版本删除同样受原步骤限制', () => {
    // 两个版本：v1 在申请步骤上传，v2 在经理步骤上传，当前停留在经理步骤
    const v1 = makeAttachment({ metadata: { approve: 'approve-1' } });
    const v2 = makeAttachment({ metadata: { approve: 'approve-2' } });
    const instance = makeInstance({ traces: [TRACE_APPLY, traceManager(USER_A)] });
    const params = { instance, currentStep: STEP_MANAGER, userId: USER_A, box: 'inbox' };

    expect(checkDeletePermission({ ...params, attachment: v1 })).toBe(false);
    expect(checkDeletePermission({ ...params, attachment: v2 })).toBe(true);
  });

  test('metadata.approve 缺失或无法定位到步骤时不允许删除', () => {
    const instance = makeInstance({ traces: [TRACE_APPLY] });
    const params = { instance, currentStep: STEP_APPLY, userId: USER_A, box: 'inbox' };

    expect(
      checkDeletePermission({ ...params, attachment: makeAttachment({ metadata: { approve: '' } }) })
    ).toBe(false);
    expect(
      checkDeletePermission({
        ...params,
        attachment: makeAttachment({ metadata: { approve: 'approve-not-exists' } })
      })
    ).toBe(false);
  });

  test('getAttachmentUploadStepId 反查上传时所在步骤', () => {
    const instance = makeInstance({ traces: [TRACE_APPLY, traceManager(USER_B)] });

    expect(getAttachmentUploadStepId(instance, makeAttachment())).toBe(STEP_APPLY._id);
    expect(
      getAttachmentUploadStepId(instance, makeAttachment({ metadata: { approve: 'approve-2' } }))
    ).toBe(STEP_MANAGER._id);
    expect(
      getAttachmentUploadStepId(instance, makeAttachment({ metadata: { approve: 'nope' } }))
    ).toBe(null);
    expect(getAttachmentUploadStepId(null, makeAttachment())).toBe(null);
    expect(getAttachmentUploadStepId(instance, null)).toBe(null);
  });
});

describe('附件删除权限：原有规则不受影响', () => {
  const instance = makeInstance({ traces: [TRACE_APPLY] });
  const base = { instance, currentStep: STEP_APPLY, userId: USER_A, box: 'inbox' };

  test('已办结的申请单不能删除附件', () => {
    expect(
      checkDeletePermission({
        ...base,
        instance: makeInstance({ traces: [TRACE_APPLY], state: 'completed' }),
        attachment: makeAttachment()
      })
    ).toBe(false);
  });

  test('只有草稿箱/待办箱能删除附件', () => {
    expect(checkDeletePermission({ ...base, attachment: makeAttachment(), box: 'monitor' })).toBe(false);
    expect(checkDeletePermission({ ...base, attachment: makeAttachment(), box: 'draft' })).toBe(true);
  });

  test('流程未启用不能删除附件', () => {
    const disabled = { ...instance, flow: { _id: 'flow-1', state: 'disabled' } };
    expect(checkDeletePermission({ ...base, instance: disabled, attachment: makeAttachment() })).toBe(false);
  });

  test('附件被锁定不能删除', () => {
    expect(
      checkDeletePermission({
        ...base,
        attachment: makeAttachment({ metadata: { locked_by: USER_B } })
      })
    ).toBe(false);
  });

  test('分发来源的附件不能删除', () => {
    const distributed = { ...instance, distribute_from_instances: ['ins-1'] };
    expect(checkDeletePermission({ ...base, instance: distributed, attachment: makeAttachment() })).toBe(false);
  });

  test('存在多个版本时不能整体删除附件（只能删版本）', () => {
    const multi = makeAttachment({ history_versions: [{ _id: 'file-2' }, { _id: 'file-1' }] });
    expect(allowRemoveAttachment({ ...base, attachment: multi })).toBe(false);
    expect(allowRemoveAttachment({ ...base, attachment: makeAttachment() })).toBe(true);
  });
});
