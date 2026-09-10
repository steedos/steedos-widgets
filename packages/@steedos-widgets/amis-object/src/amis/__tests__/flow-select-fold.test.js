/**
 * @jest-environment jsdom
 */
const { resolveFoldProps } = require('../flow-select-fold');

// 下拉树默认收起后的最终取值，下面 amis 行为回归直接吃它，
// 保证被验证的是真正发出去的属性而不是手写常量。
const SHIPPED = resolveFoldProps('tree-select', undefined, undefined);

describe('resolveFoldProps', () => {
  test('下拉树默认收起分类', () => {
    expect(SHIPPED).toEqual({ initiallyOpen: false, unfoldedLevel: 0 });
  });

  test('内嵌树（发起流程）不干预，保持 amis 默认', () => {
    expect(resolveFoldProps('input-tree', undefined, undefined)).toEqual({
      initiallyOpen: undefined,
      unfoldedLevel: undefined,
    });
  });

  test('mode 缺省时不干预', () => {
    expect(resolveFoldProps(undefined, undefined, undefined)).toEqual({
      initiallyOpen: undefined,
      unfoldedLevel: undefined,
    });
  });

  test('调用方显式传值时以调用方为准', () => {
    expect(resolveFoldProps('tree-select', true, 1)).toEqual({
      initiallyOpen: true,
      unfoldedLevel: 1,
    });
  });

  test('两个属性各自独立兜底，只覆盖一个也说得通', () => {
    expect(resolveFoldProps('tree-select', true, undefined)).toEqual({
      initiallyOpen: true,
      unfoldedLevel: 0,
    });
    expect(resolveFoldProps('tree-select', undefined, 2)).toEqual({
      initiallyOpen: false,
      unfoldedLevel: 2,
    });
  });

  test('显式传 false / 0 不会被当成缺省', () => {
    expect(resolveFoldProps('tree-select', false, 0)).toEqual({
      initiallyOpen: false,
      unfoldedLevel: 0,
    });
  });
});

/**
 * 直接驱动 amis 已发布代码里的真实方法，锁住 issue #875 想要的三态：
 * 收起 -> 搜索展开 -> 清空回到收起。amis 升级后行为若变，这组会红。
 *   - amis-ui  Tree.prototype.syncUnFolded        决定每个节点展开与否
 *   - amis     TreeSelect.prototype.filterOptions searchable 的客户端过滤
 */
const { TreeSelector } = require('amis-ui/lib/components/Tree.js');
const TreeSelectControl = require('amis/lib/renderers/Form/TreeSelect.js').default;

// 两层树：分类 -> 流程，形状与 flows__getList 返回一致
const makeOptions = () => [
  {
    value: 'c1',
    label: '全面预算',
    children: [
      { value: 'f1', label: '预算编制申请' },
      { value: 'f2', label: '预算调整申请' },
    ],
  },
  {
    value: 'c2',
    label: '合同/协议审批',
    children: [
      { value: 'f3', label: '合同用印申请' },
      { value: 'f4', label: '补充协议审批' },
    ],
  },
  {
    value: 'c3',
    label: '行政事务',
    children: [
      { value: 'f5', label: '用车申请' },
      { value: 'f6', label: '名片印制申请' },
    ],
  },
];

// 模拟 TreeSelect 传给 Tree 的固定契约：foldedField 恒为 "collapsed"
const makeTree = (foldProps) => {
  const stub = {
    unfolded: new WeakMap(),
    props: {
      deferField: 'defer',
      foldedField: 'collapsed',
      unfoldedField: undefined,
    },
    flattenOptions() {},
    forceUpdate() {},
  };
  // 每次 options 引用变化时 componentDidUpdate 都会重跑 syncUnFolded(props)
  stub.sync = (options) => {
    TreeSelector.prototype.syncUnFolded.call(
      stub,
      Object.assign({ options }, foldProps),
      undefined,
      false
    );
    return options.map((o) => stub.unfolded.get(o));
  };
  return stub;
};

// filterOptions 内部递归调用 this.filterOptions，所以 stub 上要挂同一个方法
const searchCtx = {
  props: { labelField: 'label', valueField: 'value' },
  filterOptions: TreeSelectControl.prototype.filterOptions,
};
const filterOptions = (options, keywords) =>
  searchCtx.filterOptions(options, keywords);

describe('amis 折叠/搜索行为（#875 三态）', () => {
  test('改之前：amis 默认 initiallyOpen=true / unfoldedLevel=1 -> 分类全展开', () => {
    const tree = makeTree({ initiallyOpen: true, unfoldedLevel: 1 });
    expect(tree.sync(makeOptions())).toEqual([true, true, true]);
  });

  test('只给 initiallyOpen=false 不够：unfoldedLevel 默认 1 仍把分类那层展开', () => {
    const tree = makeTree({ initiallyOpen: false, unfoldedLevel: 1 });
    expect(tree.sync(makeOptions())).toEqual([true, true, true]);
  });

  test('① 收起：按 resolveFoldProps 发出的属性，分类全部收起', () => {
    const tree = makeTree(SHIPPED);
    expect(tree.sync(makeOptions())).toEqual([false, false, false]);
  });

  test('三态全链路：收起 -> 搜流程名自动展开 -> 清空回到收起', () => {
    const options = makeOptions();
    const tree = makeTree(SHIPPED);

    // ① 初始：全部收起
    expect(tree.sync(options)).toEqual([false, false, false]);

    // ② 搜索一个只命中叶子（流程名）的关键字
    const filtered = filterOptions(options, '用车');
    expect(tree.sync(filtered)).toEqual([false, false, true]); // 只有 行政事务 展开

    // 展开的分类里只显示命中的流程
    const admin = filtered[2];
    expect(admin.visible).toBe(true);
    expect(admin.children.map((c) => [c.label, !!c.visible])).toEqual([
      ['用车申请', true],
      ['名片印制申请', false],
    ]);

    // ③ 清空搜索：TreeSelect 把原始 options 原样传回
    expect(tree.sync(options)).toEqual([false, false, false]);
  });

  test('搜索命中分类名时整类展开', () => {
    const options = makeOptions();
    const tree = makeTree(SHIPPED);
    tree.sync(options);
    expect(tree.sync(filterOptions(options, '合同'))).toEqual([
      false,
      true,
      false,
    ]);
  });

  test('搜索不污染原始 options（filterOptions 写在浅拷贝上）', () => {
    const options = makeOptions();
    filterOptions(options, '用车');
    options.forEach((o) => {
      expect(Object.prototype.hasOwnProperty.call(o, 'collapsed')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(o, 'visible')).toBe(false);
    });
  });

  test('用户手动展开的分类，在搜索/清空一轮后仍保持展开', () => {
    const options = makeOptions();
    const tree = makeTree(SHIPPED);
    tree.sync(options);

    tree.unfolded.set(options[0], true); // 等价于点了一下 全面预算 的箭头
    tree.sync(filterOptions(options, '用车'));
    expect(tree.sync(options)).toEqual([true, false, false]);
  });
});
