jest.mock('@steedos-widgets/amis-lib', () => ({
  fetchAPI: jest.fn(),
  getSteedosAuth: jest.fn(() => ({ userId: 'viewer-1' })),
}), { virtual: true });

jest.mock('i18next', () => ({
  t: (key) => key,
}));

import { fetchAPI as mockFetchAPI } from '@steedos-widgets/amis-lib';
import { getInstanceInfo } from '../instance';

const buildInstance = (agentApprove) => ({
  _id: 'instance-agent-1',
  space: 'space-agent-1',
  name: 'Agent instance',
  state: 'pending',
  values: {},
  flow_version: 'flow-version-agent-1',
  form_version: 'form-version-agent-1',
  flow: { _id: 'flow-agent-1', name: 'Agent flow' },
  form: { _id: 'form-agent-1', name: 'Agent form' },
  traces: [
    {
      _id: 'trace-1',
      name: '二号审批',
      step: 'sign-step',
      is_finished: !!agentApprove.is_finished,
      approves: [Object.assign({ _id: 'approve-1', trace: 'trace-1' }, agentApprove)],
    },
  ],
});

const mockApis = (instance, signUsers) => {
  mockFetchAPI.mockImplementation(async (url) => {
    if (url === '/graphql') {
      return { data: { instance } };
    }
    if (url === '/api/workflow/flow/flow-agent-1/version/flow-version-agent-1') {
      return { steps: [{ _id: 'sign-step', name: '二号审批', step_type: 'sign', permissions: {} }] };
    }
    if (url === '/api/workflow/form/form-agent-1/version/form-version-agent-1') {
      return { fields: [], version: 'v2' };
    }
    if (url === '/api/workflow/v2/flow_permissions/flow-agent-1') {
      return { permissions: [] };
    }
    if (url.startsWith('/api/v1/space_user_signs?')) {
      signUsers.push(url);
      return { data: { items: [{ sign: 'sign-file-agent' }] } };
    }
    throw new Error(`Unexpected fetchAPI call: ${url}`);
  });
};

describe('getInstanceInfo historyApproves agent (委托)', () => {
  beforeEach(() => {
    mockFetchAPI.mockReset();
  });

  test('approve without agent keeps user_name as-is', async () => {
    const signUsers = [];
    mockApis(buildInstance({
      user: 'user-a',
      user_name: '张三',
      handler: 'user-a',
      handler_name: '张三',
      description: '同意',
      is_finished: false,
      judge: 'pending',
    }), signUsers);

    const result = await getInstanceInfo({ instanceId: 'instance-agent-1', box: 'monitor', print: false });
    const row = result.historyApproves[0].children[0];

    expect(row.is_agent).toBe(false);
    expect(row.user_name).toBe('张三');
    expect(row.user_name_text).toBe('张三');
    expect(row.opinion).toBe('同意');
  });

  test('pending delegated approve: delegation note is shown with handler, not as opinion', async () => {
    const signUsers = [];
    mockApis(buildInstance({
      user: 'user-liangjiawei',
      user_name: '梁嘉玮',
      handler: 'user-huangyi',
      handler_name: '黄怡',
      agent: 'user-huangyi',
      description: '梁嘉玮委托',
      is_finished: false,
      judge: 'pending',
    }), signUsers);

    const result = await getInstanceInfo({ instanceId: 'instance-agent-1', box: 'monitor', print: false });
    const row = result.historyApproves[0].children[0];

    expect(row.opinion).toBe('');
    expect(row.is_agent).toBe(true);
    expect(row.agent_text).toBe('梁嘉玮委托');
    expect(row.user_name_text).toBe('黄怡 (梁嘉玮委托)');
    expect(row.user_name).toContain('黄怡');
    expect(row.user_name).not.toContain('{{name}}');
    expect(row.user_name).not.toMatch(/^梁嘉玮/);
    expect(row.user_name).toContain('梁嘉玮委托');
    expect(signUsers).toHaveLength(0);
  });

  test('finished delegated approve keeps real opinion and uses delegate sign image', async () => {
    const signUsers = [];
    mockApis(buildInstance({
      user: 'user-liangjiawei',
      user_name: '梁嘉玮',
      handler: 'user-huangyi',
      handler_name: '黄怡',
      agent: 'user-huangyi',
      description: '同意',
      is_finished: true,
      judge: 'approved',
      finish_date: '2026-09-24T05:00:00Z',
    }), signUsers);

    const result = await getInstanceInfo({ instanceId: 'instance-agent-1', box: 'monitor', print: false });
    const row = result.historyApproves[0].children[0];

    expect(row.opinion).toBe('同意');
    expect(row.user_name_text).toBe('黄怡 (梁嘉玮委托)');
    expect(row.user_name).toContain('class="image-sign"');
    expect(row.user_name).toContain('梁嘉玮委托');
    expect(signUsers).toHaveLength(1);
    expect(signUsers[0]).toContain('user-huangyi');
    expect(signUsers[0]).not.toContain('user-liangjiawei');
  });
});
