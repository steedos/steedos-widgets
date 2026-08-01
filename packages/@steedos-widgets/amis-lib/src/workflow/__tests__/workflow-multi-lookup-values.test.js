import {
  getWorkflowMultiLookupFieldPaths,
  getWorkflowMultiLookupNormalizationScript,
  normalizeWorkflowMultiLookupValues,
  wrapWorkflowMultiLookupFormGetValues,
} from '../util';
import { getStepsSchema } from '../nextSteps';

describe('Workflow 3.0 多选 lookup 值规范化', () => {
  test('收集普通字段、section 字段和 table 子字段路径', () => {
    const fields = [
      {
        name: 'contracts',
        type: 'lookup',
        pickerMultiple: true,
      },
      {
        code: 'members',
        config: { type: 'lookup', multiple: true },
      },
      {
        type: 'section',
        fields: [
          {
            code: 'reviewers',
            config: { type: 'lookup', multiple: true },
          },
          {
            code: 'owner',
            config: { type: 'lookup', multiple: false },
          },
        ],
      },
      {
        type: 'table',
        code: 'items',
        fields: [
          {
            code: 'participants',
            config: { type: 'lookup', multiple: true },
          },
        ],
      },
      {
        code: 'legacy_odata',
        type: 'odata',
        is_multiselect: true,
      },
    ];

    expect(getWorkflowMultiLookupFieldPaths(fields)).toEqual([
      ['contracts'],
      ['members'],
      ['reviewers'],
      ['items', 'participants'],
    ]);
  });

  test('把逗号字符串恢复为数组，并保留已有数组和单选 lookup', () => {
    const values = {
      members: 'user-a,user-b',
      reviewers: ['user-c'],
      owner: 'user-d',
    };
    const paths = [['members'], ['reviewers']];

    expect(normalizeWorkflowMultiLookupValues(values, paths)).toEqual({
      members: ['user-a', 'user-b'],
      reviewers: ['user-c'],
      owner: 'user-d',
    });
    expect(values.members).toBe('user-a,user-b');
  });

  test('单个值和空字符串也输出数组', () => {
    expect(normalizeWorkflowMultiLookupValues(
      { members: 'user-a', reviewers: '  ' },
      [['members'], ['reviewers']],
    )).toEqual({
      members: ['user-a'],
      reviewers: [],
    });
  });

  test('单个 lookup 对象和空值也始终输出数组', () => {
    const member = { id: 'user-a', name: 'User A' };

    expect(normalizeWorkflowMultiLookupValues(
      { members: member, reviewers: null, observers: undefined },
      [['members'], ['reviewers'], ['observers']],
    )).toEqual({
      members: [member],
      reviewers: [],
      observers: [],
    });
  });

  test('数组中的逗号连接值也拆成独立记录', () => {
    expect(normalizeWorkflowMultiLookupValues(
      { members: ['user-a,user-b'] },
      [['members']],
    )).toEqual({
      members: ['user-a', 'user-b'],
    });
  });

  test('规范化 table 每一行中的多选 lookup', () => {
    const values = {
      items: [
        { name: 'row-1', participants: 'user-a,user-b' },
        { name: 'row-2', participants: ['user-c'] },
        { name: 'row-3', participants: { id: 'user-d', name: 'User D' } },
      ],
    };

    expect(normalizeWorkflowMultiLookupValues(values, [['items', 'participants']])).toEqual({
      items: [
        { name: 'row-1', participants: ['user-a', 'user-b'] },
        { name: 'row-2', participants: ['user-c'] },
        { name: 'row-3', participants: [{ id: 'user-d', name: 'User D' }] },
      ],
    });
    expect(values.items[0].participants).toBe('user-a,user-b');
  });

  test('为 Workflow API adaptor 生成对应字段路径的规范化脚本', () => {
    const script = getWorkflowMultiLookupNormalizationScript([
      { code: 'members', config: { type: 'lookup', multiple: true } },
    ]);

    expect(script).toContain('normalizeWorkflowMultiLookupValues');
    expect(script).toContain('[["members"]]');
    expect(getWorkflowMultiLookupNormalizationScript([
      { code: 'legacy_odata', type: 'odata', is_multiselect: true },
    ])).toBe('');
  });

  test('包装 workflow-form-v2 getValues，供外部保存按钮取得数组', () => {
    const form = {
      getValues: jest.fn(() => ({ members: 'user-a,user-b' })),
    };

    wrapWorkflowMultiLookupFormGetValues(form, [['members']]);
    expect(form.getValues()).toEqual({ members: ['user-a', 'user-b'] });

    const wrappedGetValues = form.getValues;
    wrapWorkflowMultiLookupFormGetValues(form, [['members']]);
    expect(form.getValues).toBe(wrappedGetValues);
  });

  test('Workflow 3.0 先保存一条再保存多条时始终返回数组', () => {
    const paths = getWorkflowMultiLookupFieldPaths([
      { name: 'contracts', type: 'lookup', pickerMultiple: true },
    ]);
    const form = {
      getValues: jest.fn(() => ({ contracts: ['contract-a'] })),
    };

    wrapWorkflowMultiLookupFormGetValues(form, paths);
    expect(form.getValues()).toEqual({ contracts: ['contract-a'] });

    // 第一次保存后的 Renderer 重渲染会更新 Scoped component 的方法。
    Object.assign(form, {
      getValues: jest.fn(() => ({ contracts: 'contract-a,contract-b' })),
    });

    expect(form.getValues()).toEqual({ contracts: ['contract-a', 'contract-b'] });
  });

  test('全节点处理人接口也使用 lookup 数组规范化', () => {
    const schema = getStepsSchema({
      box: 'draft',
      state: 'draft',
      flow: { allow_select_step: true },
      formVersion: {
        fields: [
          { name: 'contracts', type: 'lookup', pickerMultiple: true },
        ],
      },
    });

    expect(schema.api.requestAdaptor).toContain('normalizeWorkflowMultiLookupValues');
    expect(schema.api.requestAdaptor).toContain('[["contracts"]]');
  });
});
