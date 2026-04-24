/**
 * ApprovalTreeMenu URL 工具函数单元测试
 *
 * 测试 isGridModePath 和 viewUrlToGridUrl 两个纯函数
 * 覆盖审批中心所有节点类型（6个根节点 + L2分类 + L3流程）的 URL 转换逻辑
 *
 * @see https://github.com/steedos/steedos-widgets/issues/619
 * @see https://github.com/steedos/steedos-plugins/issues/428
 */

const { isGridModePath, viewUrlToGridUrl, stripBackendOnlyParams } = require('../approval-tree-menu-url-utils');

// ===================== isGridModePath =====================

describe('isGridModePath', () => {
  test('二栏列表页 — instance_tasks inbox', () => {
    expect(isGridModePath('/app/approve_workflow/instance_tasks/grid/inbox')).toBe(true);
  });

  test('二栏列表页 — instance_tasks outbox', () => {
    expect(isGridModePath('/app/approve_workflow/instance_tasks/grid/outbox')).toBe(true);
  });

  test('二栏列表页 — instances draft', () => {
    expect(isGridModePath('/app/approve_workflow/instances/grid/draft')).toBe(true);
  });

  test('二栏列表页 — instances monitor', () => {
    expect(isGridModePath('/app/approve_workflow/instances/grid/monitor')).toBe(true);
  });

  test('三栏列表页不匹配', () => {
    expect(isGridModePath('/app/approve_workflow/instance_tasks/view/none')).toBe(false);
  });

  test('三栏详情页不匹配', () => {
    expect(isGridModePath('/app/approve_workflow/instance_tasks/view/69dcee261f5fd36df3a218d0')).toBe(false);
  });

  test('二栏详情页不匹配（view 格式）', () => {
    expect(isGridModePath('/app/approve_workflow/instance_tasks/view/69dcee261f5fd36df3a218d0')).toBe(false);
  });

  test('其他对象的 grid 页', () => {
    expect(isGridModePath('/app/admin/users/grid/all')).toBe(true);
  });

  test('不完整路径不匹配', () => {
    expect(isGridModePath('/grid/inbox')).toBe(false);
  });

  test('路径含 grid 但格式不对', () => {
    expect(isGridModePath('/app/approve_workflow/grid')).toBe(false);
  });

  test('空路径', () => {
    expect(isGridModePath('')).toBe(false);
  });

  test('根路径', () => {
    expect(isGridModePath('/')).toBe(false);
  });
});

// ===================== viewUrlToGridUrl =====================

describe('viewUrlToGridUrl', () => {
  // --- 根节点（L1）：instance_tasks ---

  test('待审核根节点 — instance_tasks inbox', () => {
    const input = '/app/approve_workflow/instance_tasks/view/none?side_object=instance_tasks&side_listview_id=inbox&additionalFilters=';
    const result = viewUrlToGridUrl(input);
    expect(result).toBe('/app/approve_workflow/instance_tasks/grid/inbox?display=grid&additionalFilters=');
    expect(result).not.toContain('side_object');
    expect(result).not.toContain('side_listview_id');
  });

  test('已审核根节点 — instance_tasks outbox', () => {
    const input = '/app/approve_workflow/instance_tasks/view/none?side_object=instance_tasks&side_listview_id=outbox&additionalFilters=';
    const result = viewUrlToGridUrl(input);
    expect(result).toBe('/app/approve_workflow/instance_tasks/grid/outbox?display=grid&additionalFilters=');
  });

  // --- 根节点（L1）：instances ---

  test('监控箱根节点 — instances monitor', () => {
    const input = '/app/approve_workflow/instances/view/none?side_object=instances&side_listview_id=monitor&additionalFilters=';
    const result = viewUrlToGridUrl(input);
    expect(result).toBe('/app/approve_workflow/instances/grid/monitor?display=grid&additionalFilters=');
  });

  test('草稿根节点 — instances draft', () => {
    const input = '/app/approve_workflow/instances/view/none?side_object=instances&side_listview_id=draft&additionalFilters=';
    const result = viewUrlToGridUrl(input);
    expect(result).toBe('/app/approve_workflow/instances/grid/draft?display=grid&additionalFilters=');
  });

  test('进行中根节点 — instances pending', () => {
    const input = '/app/approve_workflow/instances/view/none?side_object=instances&side_listview_id=pending&additionalFilters=';
    const result = viewUrlToGridUrl(input);
    expect(result).toBe('/app/approve_workflow/instances/grid/pending?display=grid&additionalFilters=');
  });

  test('已完成根节点 — instances completed', () => {
    const input = '/app/approve_workflow/instances/view/none?side_object=instances&side_listview_id=completed&additionalFilters=';
    const result = viewUrlToGridUrl(input);
    expect(result).toBe('/app/approve_workflow/instances/grid/completed?display=grid&additionalFilters=');
  });

  // --- L2 分类节点 ---

  test('待审核下分类节点 — instance_tasks category', () => {
    const input = "/app/approve_workflow/instance_tasks/view/none?side_object=instance_tasks&side_listview_id=inbox&additionalFilters=['category','=','erpqTD6Jh9g6JtWbt']&flowId=&categoryId=erpqTD6Jh9g6JtWbt";
    const result = viewUrlToGridUrl(input);
    expect(result).toContain('/instance_tasks/grid/inbox');
    expect(result).toContain('display=grid');
    expect(result).toContain("additionalFilters=['category','=','erpqTD6Jh9g6JtWbt']");
    expect(result).toContain('categoryId=erpqTD6Jh9g6JtWbt');
    expect(result).not.toContain('side_object');
    expect(result).not.toContain('side_listview_id');
  });

  test('监控箱下分类节点 — instances category', () => {
    const input = "/app/approve_workflow/instances/view/none?side_object=instances&side_listview_id=monitor&additionalFilters=['category','=','f19655370605532b9fc0a470']&flowId=&categoryId=f19655370605532b9fc0a470";
    const result = viewUrlToGridUrl(input);
    expect(result).toContain('/instances/grid/monitor');
    expect(result).toContain('display=grid');
    expect(result).toContain("additionalFilters=['category','=','f19655370605532b9fc0a470']");
    expect(result).toContain('categoryId=f19655370605532b9fc0a470');
    expect(result).not.toContain('side_object');
  });

  // --- L3 流程节点 ---

  test('待审核下流程节点 — instance_tasks flow', () => {
    const input = "/app/approve_workflow/instance_tasks/view/none?side_object=instance_tasks&side_listview_id=inbox&additionalFilters=['flow','=','62qjtF8QZggXXbRhe']&flowId=62qjtF8QZggXXbRhe&categoryId=erpqTD6Jh9g6JtWbt";
    const result = viewUrlToGridUrl(input);
    expect(result).toContain('/instance_tasks/grid/inbox');
    expect(result).toContain('display=grid');
    expect(result).toContain("additionalFilters=['flow','=','62qjtF8QZggXXbRhe']");
    expect(result).toContain('flowId=62qjtF8QZggXXbRhe');
    expect(result).toContain('categoryId=erpqTD6Jh9g6JtWbt');
    expect(result).not.toContain('side_object');
  });

  test('监控箱下流程节点 — instances flow', () => {
    const input = "/app/approve_workflow/instances/view/none?side_object=instances&side_listview_id=monitor&additionalFilters=['flow','=','c0b706b5bdbe75bdb96cda22']&flowId=c0b706b5bdbe75bdb96cda22&categoryId=f19655370605532b9fc0a470";
    const result = viewUrlToGridUrl(input);
    expect(result).toContain('/instances/grid/monitor');
    expect(result).toContain('display=grid');
    expect(result).toContain("additionalFilters=['flow','=','c0b706b5bdbe75bdb96cda22']");
    expect(result).toContain('flowId=c0b706b5bdbe75bdb96cda22');
    expect(result).toContain('categoryId=f19655370605532b9fc0a470');
  });

  // --- 安全降级 ---

  test('已经是 grid 格式的 URL — 原样返回', () => {
    const input = '/app/approve_workflow/instance_tasks/grid/inbox?display=grid&additionalFilters=';
    expect(viewUrlToGridUrl(input)).toBe(input);
  });

  test('缺少 side_listview_id — 原样返回', () => {
    const input = '/app/approve_workflow/instance_tasks/view/none?side_object=instance_tasks&additionalFilters=';
    expect(viewUrlToGridUrl(input)).toBe(input);
  });

  test('非 Steedos 路由格式 — 原样返回', () => {
    const input = '/some/random/view/path?side_listview_id=inbox';
    expect(viewUrlToGridUrl(input)).toBe(input);
  });

  test('空字符串 — 原样返回', () => {
    expect(viewUrlToGridUrl('')).toBe('');
  });

  test('无 query string 的 view URL — 原样返回（无 side_listview_id）', () => {
    const input = '/app/approve_workflow/instance_tasks/view/none';
    expect(viewUrlToGridUrl(input)).toBe(input);
  });

  test('带实际 recordId 的 view URL — 也能转换', () => {
    const input = '/app/approve_workflow/instance_tasks/view/69dcee261f5fd36df3a218d0?side_object=instance_tasks&side_listview_id=inbox&additionalFilters=';
    const result = viewUrlToGridUrl(input);
    expect(result).toContain('/instance_tasks/grid/inbox');
    expect(result).toContain('display=grid');
  });

  // --- display=grid 不重复 ---

  test('输出中 display=grid 只出现一次', () => {
    const input = '/app/approve_workflow/instance_tasks/view/none?side_object=instance_tasks&side_listview_id=inbox&additionalFilters=';
    const result = viewUrlToGridUrl(input);
    const matches = result.match(/display=grid/g);
    expect(matches).toHaveLength(1);
  });
});

// ===================== stripBackendOnlyParams =====================

describe('stripBackendOnlyParams', () => {
  test('无 query string — 原样返回', () => {
    const input = '/app/approve_workflow/instance_tasks/view/none';
    expect(stripBackendOnlyParams(input)).toBe(input);
  });

  test('空字符串 — 原样返回', () => {
    expect(stripBackendOnlyParams('')).toBe('');
  });

  test('剥除 flowId/categoryId/url 三个 key — 保留 additionalFilters 与 side_*', () => {
    const input = "/app/approve_workflow/instance_tasks/view/none?side_object=instance_tasks&side_listview_id=inbox&additionalFilters=['category','=','x']&flowId=&categoryId=x&url=encoded";
    const result = stripBackendOnlyParams(input);
    expect(result).toContain('side_object=instance_tasks');
    expect(result).toContain('side_listview_id=inbox');
    expect(result).toContain("additionalFilters=['category','=','x']");
    expect(result).not.toMatch(/[?&]flowId=/);
    expect(result).not.toMatch(/[?&]categoryId=/);
    expect(result).not.toMatch(/[?&]url=/);
  });

  test('对 additionalFilters 值做 decodeURIComponent 归一化', () => {
    // 浏览器地址栏 percent-encoded 形态
    const encoded = "/app/approve_workflow/instance_tasks/view/abc?side_object=instance_tasks&side_listview_id=inbox&additionalFilters=%5B%27category%27%2C%27%3D%27%2C%27x%27%5D";
    // nav API 字面量形态
    const literal = "/app/approve_workflow/instance_tasks/view/abc?side_object=instance_tasks&side_listview_id=inbox&additionalFilters=['category','=','x']&flowId=&categoryId=x";
    expect(stripBackendOnlyParams(encoded)).toBe(stripBackendOnlyParams(literal));
  });

  test('保留参数顺序', () => {
    const input = '/p?a=1&flowId=2&b=3&categoryId=4&c=5';
    expect(stripBackendOnlyParams(input)).toBe('/p?a=1&b=3&c=5');
  });

  test('全部参数都被剥除时 — 不留 ? 后缀', () => {
    const input = '/p?flowId=1&categoryId=2&url=x';
    expect(stripBackendOnlyParams(input)).toBe('/p');
  });

  test('不剥除 additionalFilters（与 stripFilterParams 的关键差异）', () => {
    const input = "/p?additionalFilters=['cat','=','x']&flowId=1";
    const result = stripBackendOnlyParams(input);
    expect(result).toContain("additionalFilters=['cat','=','x']");
    expect(result).not.toContain('flowId');
  });

  test('错误 percent-encoding — 保留原值不抛错', () => {
    const input = '/p?additionalFilters=%E0%A4%A';
    expect(() => stripBackendOnlyParams(input)).not.toThrow();
  });

  test('无值参数 — 保留 key=', () => {
    const input = '/p?empty=&flowId=2';
    expect(stripBackendOnlyParams(input)).toBe('/p?empty=');
  });
});

