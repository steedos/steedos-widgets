jest.mock('@steedos-widgets/amis-lib', () => ({
  fetchAPI: jest.fn(),
  getSteedosAuth: jest.fn(() => ({ userId: 'user-1' })),
}), { virtual: true });

jest.mock('i18next', () => ({
  t: (key) => key,
}));

import { fetchAPI as mockFetchAPI } from '@steedos-widgets/amis-lib';
import { getInstanceInfo } from '../instance';

describe('getInstanceInfo instance values', () => {
  beforeEach(() => {
    mockFetchAPI.mockReset();
  });

  test('keeps persisted values separate from the current approve values', async () => {
    const persistedValues = {
      amount: 169800,
      '合同分项金额明细': [
        { account_types: 'subject-1', '本次分项金额': 99900 },
      ],
    };
    const approveValues = {
      amount: 170000,
      '合同分项金额明细': [
        { account_types: 'subject-1', '本次分项金额': 100100 },
      ],
    };
    const instance = {
      _id: 'instance-1',
      space: 'space-1',
      name: 'Test instance',
      state: 'pending',
      values: persistedValues,
      flow_version: 'flow-version-1',
      form_version: 'form-version-1',
      flow: {
        _id: 'flow-1',
        name: 'Test flow',
      },
      form: {
        _id: 'form-1',
        name: 'Test form',
      },
      traces: [{
        _id: 'trace-1',
        step: 'start-step',
        is_finished: false,
        approves: [{
          _id: 'approve-1',
          trace: 'trace-1',
          handler: 'user-1',
          is_finished: false,
          values: approveValues,
        }],
      }],
    };

    mockFetchAPI.mockImplementation(async (url) => {
      if (url === '/graphql') {
        return { data: { instance } };
      }
      if (url === '/api/workflow/flow/flow-1/version/flow-version-1') {
        return {
          steps: [{
            _id: 'start-step',
            name: 'Start',
            step_type: 'start',
            permissions: {},
          }],
        };
      }
      if (url === '/api/workflow/form/form-1/version/form-version-1') {
        return { fields: [], version: 'v2' };
      }
      if (url === '/api/workflow/v2/flow_permissions/flow-1') {
        return { permissions: [] };
      }
      throw new Error(`Unexpected fetchAPI call: ${url}`);
    });

    const result = await getInstanceInfo({
      instanceId: 'instance-1',
      box: 'inbox',
      print: false,
    });

    expect(result.values).toEqual(persistedValues);
    expect(result.approveValues).toEqual(approveValues);
  });
});
