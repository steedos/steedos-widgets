/**
 * @jest-environment jsdom
 */
// 老表单 odata 多选字段（如采购订单流程「相关采购合同」contracts）在监控箱/已完成等只读箱打开时显示为空。
//
// 根因：flow.js 只读分支给 odata 字段生成的模板是 `<div>${code['@label']}</div>`，
// 只认「单个对象」这一种值形态；库里多选值是对象数组 [{ '@label': ..., name: ..., serial_number: ... }]，
// 数组上取 '@label' 得 undefined，amis 内置 ${} 引擎把 undefined 渲染成空串，于是整格空白。
// 修法：模板改按运行时值形态分支（空值 / 单对象 / 对象数组），数组逐项取 '@label' 后用 ", " 拼接；
// 模板用 amis 的 lodash `<% %>` 引擎（与同文件 getReadonlyOptionsTpl 一致），这里直接拿 amis-core 的 filter 真实求值。

global._ = require('lodash');

jest.mock('i18next', () => ({ t: (key) => key }));
jest.mock(
  '@steedos-widgets/amis-lib',
  () => ({
    lookupToAmis: jest.fn(async () => ({ type: 'select' })),
    getSteedosAuth: jest.fn(() => ({ user: { _id: 'u1' }, userId: 'u1' })),
    fetchAPI: jest.fn(),
  }),
  { virtual: true }
);
jest.mock('../approve', () => ({ getApprovalDrawerSchema: jest.fn(async () => ({})) }));
jest.mock('../attachment', () => ({ getAttachments: jest.fn(async () => null) }));
jest.mock('../related', () => ({
  getRelatedRecords: jest.fn(async () => null),
  getRelatedInstances: jest.fn(async () => null),
}));
jest.mock('../history', () => ({ getInstanceApprovalHistory: jest.fn(async () => null) }));

const { filter } = require('amis-core');
const { getReadonlyOdataTpl } = require('../util');
const { getFlowFormSchema } = require('../flow');

// 与本地库 instances/99s7JLejrmmB5RkrJ 的 values.contracts 同形：老 odata 多选值 = 带 @label 的对象数组
const contractA = {
  '@label': '东海厂一期生产用购买带式压滤机一体机喷嘴费用-63621',
  _id: 'c1',
  name: '东海厂一期生产用购买带式压滤机一体机喷嘴费用',
  serial_number: '63621',
};
const contractB = {
  '@label': '东海厂二期污泥脱水机配件-63700',
  _id: 'c2',
  name: '东海厂二期污泥脱水机配件',
  serial_number: '63700',
};

const render = (tpl, data) => filter(tpl, data);

describe('getReadonlyOdataTpl：老 odata 字段只读模板按值形态分支', () => {
  test('多选值（对象数组）逐项取 @label 并用 ", " 拼接', () => {
    const tpl = getReadonlyOdataTpl('contracts', 'contracts');
    expect(render(tpl, { contracts: [contractA, contractB] })).toBe(
      '<div>东海厂一期生产用购买带式压滤机一体机喷嘴费用-63621, 东海厂二期污泥脱水机配件-63700</div>'
    );
  });

  test('单选值（单个对象）取 @label，与原模板行为一致', () => {
    const tpl = getReadonlyOdataTpl('contract', 'contract');
    expect(render(tpl, { contract: contractA })).toBe(
      '<div>东海厂一期生产用购买带式压滤机一体机喷嘴费用-63621</div>'
    );
  });

  test('空值（undefined / null / "" / []）渲染为空的 div，不出现 undefined', () => {
    const tpl = getReadonlyOdataTpl('contracts', 'contracts');
    expect(render(tpl, {})).toBe('<div></div>');
    expect(render(tpl, { contracts: null })).toBe('<div></div>');
    expect(render(tpl, { contracts: '' })).toBe('<div></div>');
    expect(render(tpl, { contracts: [] })).toBe('<div></div>');
  });

  test('对象没有 @label 时回退 name，字符串项原样显示，空项跳过', () => {
    const tpl = getReadonlyOdataTpl('contracts', 'contracts');
    expect(render(tpl, { contracts: [{ name: '甲合同' }, '乙合同', null, { '@label': '' }] })).toBe(
      '<div>甲合同, 乙合同</div>'
    );
  });

  test('字段 code 含非法字符时按 getSafeCode 后的键回退取值', () => {
    // 表单里字段 code 为「合同(主)」，amis 表单数据链上另有一份 safe 键「合同主」
    const tpl = getReadonlyOdataTpl('合同(主)', '合同主');
    expect(render(tpl, { '合同主': [contractA] })).toBe(
      '<div>东海厂一期生产用购买带式压滤机一体机喷嘴费用-63621</div>'
    );
    // 原始键有值时优先原始键
    expect(render(tpl, { '合同(主)': [contractB], '合同主': [contractA] })).toBe(
      '<div>东海厂二期污泥脱水机配件-63700</div>'
    );
  });

  test('标签里的 HTML 特殊字符被转义（沿用原 ${} 模板的 html 过滤语义）', () => {
    const tpl = getReadonlyOdataTpl('contracts', 'contracts');
    expect(render(tpl, { contracts: [{ '@label': 'A<b>&B' }] })).toBe('<div>A&lt;b&gt;&amp;B</div>');
  });
});

describe('getFlowFormSchema：监控箱打开老表单时 odata 多选字段只读渲染', () => {
  const findStaticByName = (node, name) => {
    if (!node || typeof node !== 'object') return null;
    if (Array.isArray(node)) {
      for (const child of node) {
        const found = findStaticByName(child, name);
        if (found) return found;
      }
      return null;
    }
    if (node.type === 'static' && node.name === name) return node;
    for (const key of Object.keys(node)) {
      const found = findStaticByName(node[key], name);
      if (found) return found;
    }
    return null;
  };

  const buildInstance = () => ({
    _id: '99s7JLejrmmB5RkrJ',
    title: '采购订单-测试',
    state: 'completed',
    box: 'monitor',
    applicant: 'u1',
    applicant_name: '测试申请人',
    submit_date: '2024-01-01T00:00:00.000Z',
    fields: [
      {
        code: 'contracts',
        name: '相关采购合同',
        type: 'odata',
        is_multiselect: true,
        permission: 'readonly',
        formula: '{contracts.name}+"-"+{contracts.serial_number}',
      },
      {
        code: 'remark',
        name: '备注',
        type: 'input',
        permission: 'readonly',
      },
    ],
    formVersion: { style: 'table', version: 'v1', fields: [] },
    flowVersion: {},
    flow: {},
    form: {},
    currentStep: { permissions: {} },
    approveValues: { contracts: [contractA, contractB], remark: 'x' },
    values: { contracts: [contractA, contractB], remark: 'x' },
    historyApproves: [],
  });

  test('监控箱（readonly box）里 contracts 字段的 static 模板按数组值渲染出全部合同标签', async () => {
    const schema = await getFlowFormSchema(buildInstance(), 'monitor', false);
    const node = findStaticByName(schema, 'contracts');
    expect(node).toBeTruthy();
    expect(render(node.tpl, { contracts: [contractA, contractB] })).toBe(
      '<div>东海厂一期生产用购买带式压滤机一体机喷嘴费用-63621, 东海厂二期污泥脱水机配件-63700</div>'
    );
  });
});
