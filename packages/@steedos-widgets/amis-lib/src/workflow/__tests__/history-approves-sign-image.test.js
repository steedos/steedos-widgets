jest.mock('@steedos-widgets/amis-lib', () => ({
  fetchAPI: jest.fn(),
  getSteedosAuth: jest.fn(() => ({ userId: 'viewer-1' })),
}), { virtual: true });

jest.mock('i18next', () => ({
  t: (key) => key,
}));

import { fetchAPI as mockFetchAPI } from '@steedos-widgets/amis-lib';
import { getInstanceInfo } from '../instance';

describe('getInstanceInfo historyApproves sign image', () => {
  beforeEach(() => {
    mockFetchAPI.mockReset();
  });

  test('start step shows sign image; returned/unfinished rows stay text-only', async () => {
    const instance = {
      _id: 'instance-sign-1',
      space: 'space-sign-1',
      name: 'Sign image instance',
      state: 'pending',
      values: {},
      flow_version: 'flow-version-sign-1',
      form_version: 'form-version-sign-1',
      flow: {
        _id: 'flow-sign-1',
        name: 'Sign image flow',
      },
      form: {
        _id: 'form-sign-1',
        name: 'Sign image form',
      },
      traces: [
        {
          _id: 'trace-1',
          name: '本人签字',
          step: 'start-step',
          is_finished: true,
          judge: 'submitted',
          approves: [{
            _id: 'approve-1',
            trace: 'trace-1',
            handler: 'handler-a',
            user_name: '张三',
            is_finished: true,
            judge: 'submitted',
            finish_date: '2026-08-25T02:00:00Z',
          }],
        },
        {
          _id: 'trace-2',
          name: '呈报单位意见',
          step: 'sign-step',
          is_finished: true,
          judge: 'returned',
          approves: [{
            _id: 'approve-2',
            trace: 'trace-2',
            handler: 'handler-a',
            user_name: '张三',
            is_finished: true,
            judge: 'returned',
            finish_date: '2026-08-25T03:00:00Z',
          }],
        },
        {
          _id: 'trace-3',
          name: '领导审批',
          step: 'sign-step',
          is_finished: false,
          approves: [{
            _id: 'approve-3',
            trace: 'trace-3',
            handler: 'handler-c',
            user_name: '王五',
            is_finished: false,
            judge: 'pending',
          }],
        },
      ],
    };

    mockFetchAPI.mockImplementation(async (url) => {
      if (url === '/graphql') {
        return { data: { instance } };
      }
      if (url === '/api/workflow/flow/flow-sign-1/version/flow-version-sign-1') {
        return {
          steps: [
            { _id: 'start-step', name: '本人签字', step_type: 'start', permissions: {} },
            { _id: 'sign-step', name: '审批', step_type: 'sign', permissions: {} },
          ],
        };
      }
      if (url === '/api/workflow/form/form-sign-1/version/form-version-sign-1') {
        return { fields: [], version: 'v2' };
      }
      if (url === '/api/workflow/v2/flow_permissions/flow-sign-1') {
        return { permissions: [] };
      }
      if (url.startsWith('/api/v1/space_user_signs?')) {
        expect(url).toContain('"space-sign-1"');
        return { data: { items: [{ sign: 'sign-file-001' }] } };
      }
      throw new Error(`Unexpected fetchAPI call: ${url}`);
    });

    const result = await getInstanceInfo({
      instanceId: 'instance-sign-1',
      box: 'monitor',
      print: false,
    });

    const [startTrace, returnedTrace, pendingTrace] = result.historyApproves;

    // 开始步骤已完成且处理人有图片签名：显示签名图
    const startRow = startTrace.children[0];
    expect(startRow.user_name).toContain('class="image-sign"');
    expect(startRow.signature_url).toBe('/api/v6/files/download/cfs.avatars.filerecord/sign-file-001');
    expect(startRow.user_name_text).toBe('张三');

    // 已退回的步骤：即使处理人有图片签名也不显示
    const returnedRow = returnedTrace.children[0];
    expect(returnedRow.user_name).toBe('张三');
    expect(returnedRow.signature_url).toBe('');

    // 未完成的步骤:不显示签名图
    const pendingRow = pendingTrace.children[0];
    expect(pendingRow.user_name).toBe('王五');
    expect(pendingRow.signature_url).toBe('');
  });
});
