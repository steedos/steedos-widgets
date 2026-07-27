jest.mock('@steedos-widgets/amis-lib', () => ({
  getSteedosAuth: jest.fn(() => ({ userId: 'user-1' }))
}), { virtual: true });

jest.mock('i18next', () => ({
  t: (key) => key
}));

import { getRelatedRecords, openWorkflowRelatedRecord } from '../related';

describe('workflow related records link custom open hook', () => {
  const instance = {
    _id: 'ins-1',
    record_ids: [{ o: 'accounts', ids: ['rec-1'] }]
  };

  test('calls window.customOpenRelatedRecord and prevents default navigation when the hook is defined', () => {
    const customOpenRelatedRecord = jest.fn();
    const windowLike = { customOpenRelatedRecord };

    const result = openWorkflowRelatedRecord('accounts', 'rec-1', 'ins-1', windowLike);

    expect(result).toBe(false);
    expect(customOpenRelatedRecord).toHaveBeenCalledWith({
      objectName: 'accounts',
      recordId: 'rec-1',
      instanceId: 'ins-1',
      defaultUrl: '/app/-/accounts/view/rec-1'
    });
  });

  test('falls back to default navigation when the hook is absent or not a function', () => {
    expect(openWorkflowRelatedRecord('accounts', 'rec-1', 'ins-1', {})).toBe(true);
    expect(
      openWorkflowRelatedRecord('accounts', 'rec-1', 'ins-1', { customOpenRelatedRecord: 'not-a-function' })
    ).toBe(true);
  });

  test('generated link keeps the default href and routes clicks through the dispatcher on window', async () => {
    const windowLike = {};

    const schema = await getRelatedRecords(instance, windowLike);
    const tpl = schema.body[0].tpl;

    expect(windowLike.openWorkflowRelatedRecord).toBe(openWorkflowRelatedRecord);
    expect(tpl).toContain("href='/app/-/accounts/view/rec-1'");
    expect(tpl).toContain(
      `onclick="return window.openWorkflowRelatedRecord('accounts', 'rec-1', 'ins-1')"`
    );
  });
});
