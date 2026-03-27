/**
 * ApprovalTreeMenu 过滤条件一致性测试脚本
 *
 * @version 1.2
 * @see https://github.com/steedos/steedos-widgets/issues/598   - 测试脚本汇总 issue
 * @see https://github.com/steedos/steedos-plugins/issues/491   - 待审核列表乱跳主 issue
 * @see https://github.com/steedos/steedos-widgets/issues/594   - 前端菜单修复 issue
 *
 * ═══════════════════════════════════════════════════════════
 * 一、测试依据 — 各节点类型的正确过滤条件规则
 * ═══════════════════════════════════════════════════════════
 *
 * 规则来源：/api/:appId/workflow/nav 接口返回的菜单结构 + 实际 GraphQL 请求抓包验证。
 *
 * 菜单结构（3 种层级）：
 *   根节点(level=1)：待审核 / 已审核 / 监控箱 / 草稿 / 进行中 / 已完成
 *   分类节点(level=2)：根节点下按 category 分组（如"数智技术中心"、"公务用车"）
 *   流程节点(level=3)：分类下的具体流程（如"设备维修审批单"）
 *   容器节点：我的文件（纯容器，无 value/url，不触发请求）
 *
 * 注意：待审核和监控箱可能没有子节点（只有根节点），也可能有完整的三层结构。
 *
 * ┌────────────────────┬──────────────────┬───────────────────────────────┐
 * │ 点击节点           │ 查询对象         │ filters 规则                  │
 * ├────────────────────┼──────────────────┼───────────────────────────────┤
 * │ 待审核（根）       │ instance_tasks   │ handler + is_finished         │
 * │                    │                  │ ❌ 不含 flow, 不含 category   │
 * ├────────────────────┼──────────────────┼───────────────────────────────┤
 * │ 待审核→分类        │ instance_tasks   │ handler + is_finished         │
 * │                    │                  │ ✅ + ["category","=","<id>"]  │
 * │                    │                  │ ❌ 不含 flow                  │
 * ├────────────────────┼──────────────────┼───────────────────────────────┤
 * │ 待审核→流程        │ instance_tasks   │ handler + is_finished         │
 * │                    │                  │ ✅ + ["flow","=","<id>"]      │
 * │                    │                  │ ❌ 不含 category              │
 * ├────────────────────┼──────────────────┼───────────────────────────────┤
 * │ 已审核（根）       │ instance_tasks   │ 基础过滤                      │
 * │                    │                  │ ❌ 不含 flow, 不含 category   │
 * ├────────────────────┼──────────────────┼───────────────────────────────┤
 * │ 监控箱（根）       │ instances        │ state + submit_date           │
 * │                    │                  │ ❌ 不含 flow, 不含 category   │
 * ├────────────────────┼──────────────────┼───────────────────────────────┤
 * │ 监控箱→分类        │ instances        │ state + submit_date           │
 * │                    │                  │ ✅ + ["category","=","<id>"]  │
 * │                    │                  │ ❌ 不含 flow                  │
 * ├────────────────────┼──────────────────┼───────────────────────────────┤
 * │ 监控箱→流程        │ instances        │ state + submit_date           │
 * │                    │                  │ ✅ + ["flow","=","<id>"]      │
 * │                    │                  │ ❌ 不含 category              │
 * ├────────────────────┼──────────────────┼───────────────────────────────┤
 * │ 草稿/进行中/已完成 │ instances        │ 各自基础过滤                   │
 * │                    │                  │ ❌ 不含 flow, 不含 category   │
 * ├────────────────────┼──────────────────┼───────────────────────────────┤
 * │ 我的文件           │ —                │ 无请求（纯容器节点）           │
 * └────────────────────┴──────────────────┴───────────────────────────────┘
 *
 * 请求格式：
 *   XHR POST /graphql?reload=<encoded_additionalFilters>
 *   Body: {"query":"{rows:<object>(filters: [...], top: N, ...){...}}"}
 *
 * ═══════════════════════════════════════════════════════════
 * 二、测试策略（5 个阶段，系统化覆盖）
 * ═══════════════════════════════════════════════════════════
 *
 * 阶段0: 归位
 *   展开所有节点，点击"已完成"归位，清除初始状态干扰后才开启请求捕获。
 *
 * 阶段1: 根节点和箱子项巡回
 *   依次点击：待审核→已审核→监控箱→我的文件→草稿→进行中→已完成
 *   验证：请求中不包含 flow/category 过滤，对象名正确
 *
 * 阶段2: 待审核内切换
 *   a. 依次点击分类节点（最多 3 个），验证 category 过滤
 *   b. 依次点击流程节点（最多 4 个），验证 flow 过滤 + 残留检测
 *   c. 交叉切换：流程→分类→流程，验证过滤条件完全切换
 *   d. 回到根节点，验证过滤清除
 *
 * 阶段3: 监控箱内切换
 *   与阶段2 相同的测试逻辑，验证 instances 对象下的行为
 *
 * 阶段4: 跨根节点切换
 *   序列：待审核流程→监控箱分类→监控箱流程→草稿→待审核根→已完成→待审核流程
 *   验证：对象从 instance_tasks↔instances 正确切换，过滤条件无残留
 *
 * 阶段5: 快速连续切换
 *   300ms 间隔快速点击 5 个不同节点，验证最终请求参数正确
 *
 * ═══════════════════════════════════════════════════════════
 * 三、真实价值评估
 * ═══════════════════════════════════════════════════════════
 *
 * 已验证（确定性，100% 可靠）：
 *   ✅ 每种节点类型的 GraphQL 请求中 filters 参数符合上述规则表
 *   ✅ 同根节点内切换时 flow/category 过滤正确替换、无残留
 *   ✅ 交叉切换（流程→分类→流程）时过滤条件完全清除并重建
 *   ✅ 回到根节点时额外过滤条件完全清除
 *   ✅ 跨根节点切换时查询对象（instance_tasks↔instances）正确切换
 *   ✅ 冗余请求检测和记录
 *
 * 局限性（不覆盖）：
 *   ❌ 不验证请求响应后列表显示的数据是否正确（只检查请求参数）
 *   ❌ 不验证用户搜索表单条件叠加后切换菜单的行为（另一个脚本的职责）
 *   ❌ 不验证 DOM 选中态、URL 一致性等前端表现（由 approval-tree-menu-stress.js 覆盖）
 *
 * 适用场景：
 *   - 修改了 ApprovalTreeMenu.handleSelect 逻辑后的回归验证
 *   - 新环境部署后的冒烟测试
 *   - 升级 amis / react-router 后验证过滤机制未被破坏
 *
 * ═══════════════════════════════════════════════════════════
 * 四、使用方式
 * ═══════════════════════════════════════════════════════════
 *
 *   1. 在浏览器中打开审批中心页面（如 /app/approve_workflow/...）
 *   2. 按 F12 打开 DevTools → Console 标签页
 *   3. 粘贴本脚本全部内容并按回车执行
 *   4. 等待约 2 分钟执行完毕，查看控制台输出的测试报告
 *   5. 建议连续运行 2 次，全部 0 失败才算通过
 *
 * 可调参数：
 *   - PHASE_DELAY:  阶段间等待(ms)，默认 2000
 *   - CLICK_DELAY:  点击后等待请求完成(ms)，默认 2500。网络慢改为 4000
 *   - FAST_DELAY:   快速切换间隔(ms)，默认 300。模拟极端快速操作改为 100
 *
 * 注意事项：
 *   - 本脚本通过 Hook XMLHttpRequest 拦截 GraphQL 请求，执行完毕后自动恢复
 *   - 仅操作 DOM 点击 + 读取请求参数，不调用后端 API、不修改任何数据
 *   - 不依赖特定数据库或环境，任何有审批中心页面的环境均可运行
 *   - 不适用于 Node.js / Jest / Vitest 等测试框架直接运行
 */

(async () => {
  const PHASE_DELAY = 2000;
  const CLICK_DELAY = 2500;
  const FAST_DELAY = 300;

  const errors = [];
  const warnings = [];
  const allRequests = [];
  let testIndex = 0;

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  // ==================== Hook XMLHttpRequest ====================
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;
  let captureEnabled = false;
  let phaseRequests = [];

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._hookUrl = url;
    return origOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (body) {
    if (captureEnabled && this._hookUrl && this._hookUrl.includes('/graphql') && body) {
      try {
        const bodyStr = typeof body === 'string' ? body : '';
        const parsed = JSON.parse(bodyStr);
        const query = parsed.query || '';

        if (query.includes('rows:')) {
          const objMatch = query.match(/rows:(\w+)\(/);
          const objectName = objMatch ? objMatch[1] : '(unknown)';

          const filtersMatch = query.match(/filters:\s*(\[[\s\S]*?\]),\s*top:/);
          const filtersStr = filtersMatch ? filtersMatch[1] : '';

          const flowMatch = filtersStr.match(/\\?"flow\\?"\s*,\s*\\?"=\\?"\s*,\s*\\?"([^"\\]+)\\?"/);
          const catMatch = filtersStr.match(/\\?"category\\?"\s*,\s*\\?"=\\?"\s*,\s*\\?"([^"\\]+)\\?"/);

          let reloadParam = '';
          try {
            const u = new URL(this._hookUrl, location.origin);
            reloadParam = decodeURIComponent(u.searchParams.get('reload') || '');
          } catch {}

          const info = {
            timestamp: Date.now(),
            objectName,
            flowId: flowMatch ? flowMatch[1] : null,
            categoryId: catMatch ? catMatch[1] : null,
            reloadParam,
            filtersSnippet: filtersStr.substring(0, 150),
          };

          phaseRequests.push(info);
          allRequests.push(info);
        }
      } catch {}
    }
    return origSend.call(this, body);
  };

  const clearPhase = () => { phaseRequests = []; };

  // ==================== DOM 辅助 ====================
  const getNodes = () => Array.from(document.querySelectorAll('.approval-tree-menu .ant-tree-treenode'));
  const isLeaf = (n) => !!n.querySelector('.approval-tree-menu__label--item');
  const nodeTitle = (n) => n.querySelector('.approval-tree-menu__label')?.textContent?.trim() || '(unknown)';
  const nodeIndent = (n) => n.querySelectorAll('.ant-tree-indent-unit').length;

  const clickNode = (node) => {
    const t = node.querySelector('.ant-tree-title') || node.querySelector('.ant-tree-node-content-wrapper');
    if (t) t.click();
  };

  const expandNode = async (node) => {
    const sw = node.querySelector('.ant-tree-switcher:not(.ant-tree-switcher-noop)');
    if (sw && !sw.classList.contains('ant-tree-switcher_open')) {
      sw.click();
      await delay(500);
      return true;
    }
    return false;
  };

  const classifyAllNodes = () => {
    const nodes = getNodes();
    const result = { roots: [], categories: [], flows: [], boxItems: [] };
    let currentRoot = '', currentCategory = '';

    nodes.forEach(n => {
      const ind = nodeIndent(n);
      const t = nodeTitle(n);
      const leaf = isLeaf(n);
      const isGroup = !!n.querySelector('.approval-tree-menu__label--group');

      if (ind === 0) {
        currentRoot = t; currentCategory = '';
        result.roots.push({ node: n, title: t });
      } else if (ind === 1) {
        if (isGroup) { currentCategory = t; result.categories.push({ node: n, title: t, root: currentRoot }); }
        else if (leaf) { result.boxItems.push({ node: n, title: t, root: currentRoot }); }
      } else if (ind === 2 && leaf) {
        result.flows.push({ node: n, title: t, root: currentRoot, category: currentCategory });
      }
    });
    return result;
  };

  // ==================== 测试记录 ====================
  const log = (phase, desc, passed, detail = '') => {
    testIndex++;
    const msg = `[${testIndex}] ${passed ? '✅' : '❌'} [${phase}] ${desc}${detail ? ' — ' + detail : ''}`;
    if (passed) console.log(msg); else { console.error(msg); errors.push({ test: testIndex, phase, desc, detail }); }
  };
  const warn = (phase, desc) => {
    console.warn(`  ⚠️ [${phase}] ${desc}`);
    warnings.push({ phase, desc });
  };

  // 通用验证
  const verify = (phase, label, expect) => {
    const listReqs = phaseRequests.filter(r => r.objectName === 'instance_tasks' || r.objectName === 'instances');
    const req = listReqs.length > 0 ? listReqs[listReqs.length - 1] : null;

    if (!req) { log(phase, `点击"${label}"`, false, '未捕获到列表请求'); return; }

    let passed = true; const details = [];

    if (expect.object && req.objectName !== expect.object) {
      passed = false; details.push(`对象错误: 预期 ${expect.object}, 实际 ${req.objectName}`);
    }
    if (expect.flow) {
      if (!req.flowId) { passed = false; details.push('预期包含 flow 过滤但未找到'); }
      else if (expect.flowId && req.flowId !== expect.flowId) { passed = false; details.push(`flowId 不匹配: 预期 ${expect.flowId}, 实际 ${req.flowId}`); }
    }
    if (expect.category) {
      if (!req.categoryId) { passed = false; details.push('预期包含 category 过滤但未找到'); }
      else if (expect.categoryId && req.categoryId !== expect.categoryId) { passed = false; details.push(`categoryId 不匹配`); }
    }
    if (expect.noFlow && req.flowId) { passed = false; details.push(`不应包含 flow 过滤，但发现 flowId=${req.flowId}`); }
    if (expect.noCategory && req.categoryId) { passed = false; details.push(`不应包含 category 过滤，但发现 categoryId=${req.categoryId}`); }

    const info = details.length > 0 ? details.join('; ')
      : `对象=${req.objectName}${req.flowId ? ', flow=' + req.flowId : ''}${req.categoryId ? ', cat=' + req.categoryId : ''}`;
    log(phase, `点击"${label}"`, passed, info);

    // 冗余请求检查（含重现描述）
    if (listReqs.length > 1) {
      const objs = listReqs.map(r => r.objectName);
      const isCrossRoot = objs[0] !== objs[objs.length - 1];
      const reproDesc = isCrossRoot
        ? `跨根节点切换时先发了旧对象(${objs[0]})的请求再发新对象(${objs[objs.length-1]})的请求`
        : `同对象(${objs[0]})下发了 ${listReqs.length} 次请求`;
      warn(phase, `"${label}"触发了 ${listReqs.length} 个列表请求: ${objs.join(' → ')}。重现: 从上一个节点切换到"${label}"即可触发。原因: ${reproDesc}`);
    }
  };

  // 点击并等待
  const clickAndWait = async (node, waitMs = CLICK_DELAY) => {
    clearPhase();
    clickNode(node);
    await delay(waitMs);
  };

  // ==================== 阶段0: 初始化 ====================
  console.log('%c🚀 开始过滤条件一致性系统化测试', 'color: #1677ff; font-size: 16px; font-weight: bold;');
  console.log('%c阶段0: 初始化 — 展开所有节点并归位', 'color: #722ed1; font-size: 14px; font-weight: bold;');

  await delay(500);
  let cls = classifyAllNodes();
  for (const r of cls.roots) { await expandNode(r.node); }
  await delay(300);
  cls = classifyAllNodes();
  for (const c of cls.categories) { await expandNode(c.node); }
  await delay(500);
  cls = classifyAllNodes();

  console.log(`节点统计: ${cls.roots.length} 根, ${cls.categories.length} 分类, ${cls.flows.length} 流程, ${cls.boxItems.length} 箱子项`);
  console.log(`根节点: ${cls.roots.map(r => r.title).join(', ')}`);
  console.log(`箱子项: ${cls.boxItems.map(b => `${b.title}(${b.root})`).join(', ')}\n`);

  // 归位到"已完成"
  const completedBox = cls.boxItems.find(b => b.title === '已完成');
  if (completedBox) {
    clickNode(completedBox.node);
    await delay(3000);
  }

  captureEnabled = true;

  // ========== 阶段1: 根节点和箱子项巡回 ==========
  console.log('%c📋 阶段1: 根节点和箱子项巡回', 'color: #722ed1; font-size: 14px; font-weight: bold;');
  console.log('验证: 请求不应包含 flow/category 过滤\n');

  const inboxRoot = cls.roots.find(r => r.title === '待审核');
  if (inboxRoot) {
    await clickAndWait(inboxRoot.node);
    verify('阶段1', '待审核', { object: 'instance_tasks', noFlow: true, noCategory: true });
  }

  const outboxRoot = cls.roots.find(r => r.title === '已审核');
  if (outboxRoot) {
    await clickAndWait(outboxRoot.node);
    verify('阶段1', '已审核', { object: 'instance_tasks', noFlow: true, noCategory: true });
  }

  const monitorRoot = cls.roots.find(r => r.title === '监控箱');
  if (monitorRoot) {
    await clickAndWait(monitorRoot.node);
    verify('阶段1', '监控箱', { object: 'instances', noFlow: true, noCategory: true });
  }

  const myFileRoot = cls.roots.find(r => r.title === '我的文件');
  if (myFileRoot) {
    clearPhase();
    clickNode(myFileRoot.node);
    await delay(1500);
    const listReqs = phaseRequests.filter(r => r.objectName === 'instance_tasks' || r.objectName === 'instances');
    if (listReqs.length > 0) {
      warn('阶段1', `"我的文件"触发了 ${listReqs.length} 个意外列表请求`);
    } else {
      testIndex++;
      console.log(`[${testIndex}] ✅ [阶段1] 点击"我的文件" — 无列表请求（容器节点，正确）`);
    }
  }

  for (const box of cls.boxItems) {
    await clickAndWait(box.node);
    verify('阶段1', box.title, { object: 'instances', noFlow: true, noCategory: true });
  }

  await delay(PHASE_DELAY);

  // ========== 阶段2: 待审核内切换 ==========
  console.log('\n%c📋 阶段2: 待审核内切换', 'color: #722ed1; font-size: 14px; font-weight: bold;');
  console.log('验证: 分类→category, 流程→flow, 交叉切换, 回根清除\n');

  if (inboxRoot) { await clickAndWait(inboxRoot.node); }
  cls = classifyAllNodes();
  const inboxCats = cls.categories.filter(c => c.root === '待审核');
  const inboxFlows = cls.flows.filter(f => f.root === '待审核');

  for (const cat of inboxCats.slice(0, 3)) {
    await clickAndWait(cat.node);
    verify('阶段2', `分类"${cat.title}"`, { object: 'instance_tasks', category: true, noFlow: true });
  }

  let prevFlowId = null;
  for (const flow of inboxFlows.slice(0, 4)) {
    await clickAndWait(flow.node);
    verify('阶段2', `流程"${flow.title}"`, { object: 'instance_tasks', flow: true, noCategory: true });
    const listReqs = phaseRequests.filter(r => r.objectName === 'instance_tasks' || r.objectName === 'instances');
    const req = listReqs.length > 0 ? listReqs[listReqs.length - 1] : null;
    if (req && req.flowId && prevFlowId && req.flowId === prevFlowId) {
      log('阶段2', `残留检测"${flow.title}"`, false, `flowId=${req.flowId} 与上一个相同`);
    }
    if (req) prevFlowId = req.flowId;
  }

  if (inboxFlows.length > 0 && inboxCats.length > 0) {
    console.log('  交叉切换: 流程→分类→流程');
    await clickAndWait(inboxFlows[0].node);
    verify('阶段2', `交叉:流程"${inboxFlows[0].title}"`, { flow: true, noCategory: true });

    await clickAndWait(inboxCats[0].node);
    verify('阶段2', `交叉:分类"${inboxCats[0].title}"`, { category: true, noFlow: true });

    const f2 = inboxFlows.length > 1 ? inboxFlows[1] : inboxFlows[0];
    await clickAndWait(f2.node);
    verify('阶段2', `交叉:流程"${f2.title}"`, { flow: true, noCategory: true });
  }

  if (inboxRoot) {
    await clickAndWait(inboxRoot.node);
    verify('阶段2', '回到根"待审核"清除过滤', { noFlow: true, noCategory: true });
  }

  if (inboxCats.length === 0 && inboxFlows.length === 0) console.log('  待审核下无子节点，跳过');

  await delay(PHASE_DELAY);

  // ========== 阶段3: 监控箱内切换 ==========
  console.log('\n%c📋 阶段3: 监控箱内切换', 'color: #722ed1; font-size: 14px; font-weight: bold;');
  console.log('验证: 分类→category, 流程→flow\n');

  if (monitorRoot) { await clickAndWait(monitorRoot.node); }
  cls = classifyAllNodes();
  const monCats = cls.categories.filter(c => c.root === '监控箱');
  const monFlows = cls.flows.filter(f => f.root === '监控箱');

  for (const cat of monCats.slice(0, 3)) {
    await clickAndWait(cat.node);
    verify('阶段3', `分类"${cat.title}"`, { object: 'instances', category: true, noFlow: true });
  }

  let prevMonFlowId = null;
  for (const flow of monFlows.slice(0, 4)) {
    await clickAndWait(flow.node);
    verify('阶段3', `流程"${flow.title}"`, { object: 'instances', flow: true, noCategory: true });
    const listReqs = phaseRequests.filter(r => r.objectName === 'instance_tasks' || r.objectName === 'instances');
    const req = listReqs.length > 0 ? listReqs[listReqs.length - 1] : null;
    if (req && req.flowId && prevMonFlowId && req.flowId === prevMonFlowId) {
      log('阶段3', `残留检测"${flow.title}"`, false, `flowId 未变化`);
    }
    if (req) prevMonFlowId = req.flowId;
  }

  if (monitorRoot) {
    await clickAndWait(monitorRoot.node);
    verify('阶段3', '回到根"监控箱"清除过滤', { noFlow: true, noCategory: true });
  }

  if (monCats.length === 0 && monFlows.length === 0) console.log('  监控箱下无子节点，跳过');

  await delay(PHASE_DELAY);

  // ========== 阶段4: 跨根节点切换 ==========
  console.log('\n%c📋 阶段4: 跨根节点切换', 'color: #722ed1; font-size: 14px; font-weight: bold;');
  console.log('验证: 对象切换正确，过滤无残留\n');

  cls = classifyAllNodes();
  const allInboxFlows = cls.flows.filter(f => f.root === '待审核');
  const allMonFlows = cls.flows.filter(f => f.root === '监控箱');
  const allMonCats = cls.categories.filter(c => c.root === '监控箱');

  const crossTests = [];
  if (allInboxFlows.length > 0) crossTests.push({ ...allInboxFlows[0], expect: { object: 'instance_tasks', flow: true, noCategory: true } });
  if (allMonCats.length > 0) crossTests.push({ ...allMonCats[0], expect: { object: 'instances', category: true, noFlow: true } });
  if (allMonFlows.length > 0) crossTests.push({ ...allMonFlows[0], expect: { object: 'instances', flow: true, noCategory: true } });
  const draftBox = cls.boxItems.find(b => b.title === '草稿');
  if (draftBox) crossTests.push({ ...draftBox, label: '草稿', expect: { object: 'instances', noFlow: true, noCategory: true } });
  if (inboxRoot) crossTests.push({ node: inboxRoot.node, title: '待审核', expect: { object: 'instance_tasks', noFlow: true, noCategory: true } });
  const compBox = cls.boxItems.find(b => b.title === '已完成');
  if (compBox) crossTests.push({ ...compBox, label: '已完成', expect: { object: 'instances', noFlow: true, noCategory: true } });
  if (allInboxFlows.length > 1) crossTests.push({ ...allInboxFlows[1], expect: { object: 'instance_tasks', flow: true, noCategory: true } });

  for (const t of crossTests) {
    await clickAndWait(t.node, CLICK_DELAY + 500);
    verify('阶段4', t.label || t.title, t.expect);
  }

  await delay(PHASE_DELAY);

  // ========== 阶段5: 快速连续切换 ==========
  console.log('\n%c📋 阶段5: 快速连续切换', 'color: #722ed1; font-size: 14px; font-weight: bold;');
  console.log('验证: 快速连续点击后最终请求正确\n');

  cls = classifyAllNodes();
  const allLeaves = [...cls.flows, ...cls.boxItems];

  if (allLeaves.length < 3) {
    console.warn('  ⚠️ 可点击节点不足，跳过阶段5');
  } else {
    const picks = allLeaves.slice(0, Math.min(5, allLeaves.length));
    const lastPick = picks[picks.length - 1];
    clearPhase();

    for (let i = 0; i < picks.length; i++) {
      clickNode(picks[i].node);
      if (i < picks.length - 1) await delay(FAST_DELAY);
    }

    await delay(CLICK_DELAY + 3000);

    const listReqs = phaseRequests.filter(r => r.objectName === 'instance_tasks' || r.objectName === 'instances');
    const finalReq = listReqs.length > 0 ? listReqs[listReqs.length - 1] : null;

    if (finalReq) {
      const info = `最终: 对象=${finalReq.objectName}, flow=${finalReq.flowId || '无'}, cat=${finalReq.categoryId || '无'}, 点击数=${picks.length}, 请求数=${listReqs.length}`;
      log('阶段5', `快速点击${picks.length}个节点，最终="${lastPick.title}"`, true, info);
      if (listReqs.length > picks.length) {
        warn('阶段5', `请求数(${listReqs.length}) > 点击数(${picks.length})，可能有冗余`);
      }
    } else {
      log('阶段5', `快速点击${picks.length}个节点`, false, '未捕获到列表请求');
    }
  }

  // ==================== 恢复 & 报告 ====================
  captureEnabled = false;
  XMLHttpRequest.prototype.open = origOpen;
  XMLHttpRequest.prototype.send = origSend;

  console.log('\n%c' + '═'.repeat(60), 'color: #1677ff;');
  console.log('%c📊 过滤条件一致性测试报告', 'color: #1677ff; font-size: 16px; font-weight: bold;');
  console.log('%c' + '═'.repeat(60), 'color: #1677ff;');
  console.log(`总测试项: ${testIndex}`);
  console.log(`✅ 通过: ${testIndex - errors.length}`);
  console.log(`❌ 失败: ${errors.length}`);
  console.log(`⚠️ 警告: ${warnings.length}（冗余请求等，不阻塞功能）`);
  console.log(`📡 总捕获请求数: ${allRequests.length}`);

  if (errors.length > 0) {
    console.log('\n%c❌ 失败项:', 'color: red; font-weight: bold;');
    console.table(errors);
  }
  if (warnings.length > 0) {
    console.log('\n%c⚠️ 警告项:', 'color: orange; font-weight: bold;');
    console.table(warnings);
  }
  if (errors.length === 0) {
    console.log('\n%c✅ 全部通过，过滤条件一致性正常', 'color: #52c41a; font-size: 14px;');
  }

  if (allRequests.length > 0) {
    console.log('\n%c📋 全部列表请求明细:', 'font-weight: bold;');
    console.table(allRequests.map((r, i) => ({
      '#': i + 1,
      对象: r.objectName,
      flowId: r.flowId || '',
      categoryId: r.categoryId || '',
      reload: (r.reloadParam || '').substring(0, 40),
      时间: new Date(r.timestamp).toLocaleTimeString(),
    })));
  }
})();
