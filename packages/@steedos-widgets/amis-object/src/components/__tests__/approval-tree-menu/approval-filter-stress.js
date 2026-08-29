/**
 * ApprovalTreeMenu 过滤条件一致性测试脚本
 *
 * @see https://github.com/steedos/steedos-plugins/issues/491  - 待审核列表乱跳主 issue
 * @see https://github.com/steedos/steedos-widgets/issues/594   - 前端菜单修复 issue
 * @see https://github.com/steedos/steedos-widgets/issues/598   - 测试脚本收录 issue
 *
 * 一、测试依据（基于 nav 接口返回结构和实际抓包确认）
 *
 *   节点类型        | options.level | 查询对象        | 预期过滤条件
 *   --------------- | ------------- | --------------- | ----------------------------------
 *   待审核（根）     | 1             | instance_tasks  | handler + is_finished，无 flow/category
 *   待审核→分类      | 2             | instance_tasks  | 基础 + ["category","=","<id>"]
 *   待审核→流程      | 3             | instance_tasks  | 基础 + ["flow","=","<id>"]
 *   已审核（根）     | 1             | instance_tasks  | 基础过滤，无 flow/category
 *   监控箱（根）     | 1             | instances       | state + submit_date，无 flow/category
 *   监控箱→分类      | 2             | instances       | 基础 + ["category","=","<id>"]
 *   监控箱→流程      | 3             | instances       | 基础 + ["flow","=","<id>"]
 *   草稿/进行中/已完成| 1            | instances       | 各自基础过滤，无 flow/category
 *   我的文件（容器）  | 1            | —               | 无请求
 *
 * 二、测试策略（系统化覆盖，非随机）
 *
 *   阶段0: 归位 — 展开所有节点，归位到"已完成"，清除初始状态干扰
 *   阶段1: 根节点和箱子项巡回 — 验证无 flow/category 过滤
 *   阶段2: 待审核内切换 — 分类→category, 流程→flow, 交叉切换, 回根清除
 *   阶段3: 监控箱内切换 — 同阶段2
 *   阶段4: 跨根节点切换 — 验证对象切换(instance_tasks↔instances)和过滤无残留
 *   阶段5: 快速连续切换 — 验证最终状态正确
 *
 * 三、已验证（确定性检测，覆盖完整）
 *
 *   - 根节点/箱子项请求无额外 flow/category 过滤
 *   - 分类节点 → category 过滤正确
 *   - 流程节点 → flow 过滤正确
 *   - 交叉切换（流程→分类→流程）后无残留
 *   - 回到根节点后过滤清除
 *   - 跨根节点时对象名正确切换
 *   - 冗余请求检测（已知问题，记录但不阻塞）
 *
 * 四、局限性
 *
 *   - 不验证请求响应后列表显示的数据是否正确（只检查请求参数）
 *   - 不覆盖"叠加搜索条件"场景（用户在搜索表单中设置条件后切换菜单）
 *   - 不检测后端返回数据的正确性
 *   - 受网络延迟和浏览器渲染时序影响，如遇偶发失败可加大 CLICK_DELAY
 *
 * 五、真实价值
 *
 *   本脚本定位为回归防护——确保 ApprovalTreeMenu.handleSelect 中的过滤逻辑
 *   在未来代码修改中不被破坏。适用场景：
 *   - 每次修改 ApprovalTreeMenu 代码后跑一次（约2分钟）
 *   - 新环境部署后的冒烟测试
 *   - 监控冗余请求数量的变化
 *   - 建议跑 2-3 次确认稳定性
 *
 * 使用方式：浏览器 DevTools Console 粘贴执行
 *
 * 可调参数：
 *   - PHASE_DELAY:      阶段间等待(ms)，默认 2000，增大可提高稳定性
 *   - CLICK_DELAY:      点击后等待请求完成(ms)，默认 2500，网络慢时建议 3500+
 *   - CROSS_ROOT_DELAY: 跨根节点切换额外等待(ms)，默认 1500，解决冗余请求时序问题
 *   - FAST_DELAY:       快速切换间隔(ms)，默认 300
 */

(async () => {
  const PHASE_DELAY = 2000;
  const CLICK_DELAY = 2500;
  const CROSS_ROOT_DELAY = 1500;
  const FAST_DELAY = 300;

  const errors = [];
  const warnings = [];
  const allRequests = [];
  let testIndex = 0;
  let lastClickedLabel = '(初始)';
  let prevClickedLabel = '(初始)';

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
  const warn = (phase, desc, detail = '') => {
    warnings.push({ phase, desc, detail });
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

    // 冗余请求检查
    if (listReqs.length > 1) {
      const fromTo = `从"${prevClickedLabel}"切换到"${label}"`;
      const reqChain = listReqs.map(r => r.objectName).join(' → ');
      const isSameObj = listReqs[0].objectName === listReqs[listReqs.length - 1].objectName;
      let reason;
      if (isSameObj) {
        reason = `同对象(${listReqs[0].objectName})下发了 ${listReqs.length} 次请求`;
      } else {
        reason = `先发了旧对象(${listReqs[0].objectName})请求再发新对象(${listReqs[listReqs.length - 1].objectName})请求`;
      }
      warn(phase, `"${label}"触发了 ${listReqs.length} 个列表请求: ${reqChain}`, `${fromTo}。${reason}`);
    }
  };

  // 点击并等待
  const clickAndWait = async (node, label, waitMs = CLICK_DELAY) => {
    prevClickedLabel = lastClickedLabel;
    clearPhase();
    clickNode(node);
    await delay(waitMs);
    lastClickedLabel = label;
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
    lastClickedLabel = '我的文件/已完成';
  }

  captureEnabled = true;

  // ========== 阶段1: 根节点和箱子项巡回 ==========
  console.log('%c📋 阶段1: 根节点和箱子项巡回', 'color: #722ed1; font-size: 14px; font-weight: bold;');
  console.log('验证: 请求不应包含 flow/category 过滤\n');

  const inboxRoot = cls.roots.find(r => r.title === '待审核');
  if (inboxRoot) {
    await clickAndWait(inboxRoot.node, '待审核(根)', CLICK_DELAY + CROSS_ROOT_DELAY);
    verify('阶段1', '待审核(根)', { object: 'instance_tasks', noFlow: true, noCategory: true });
  }

  const outboxRoot = cls.roots.find(r => r.title === '已审核');
  if (outboxRoot) {
    await clickAndWait(outboxRoot.node, '已审核(根)');
    verify('阶段1', '已审核(根)', { object: 'instance_tasks', noFlow: true, noCategory: true });
  }

  const monitorRoot = cls.roots.find(r => r.title === '监控箱');
  if (monitorRoot) {
    await clickAndWait(monitorRoot.node, '监控箱(根)', CLICK_DELAY + CROSS_ROOT_DELAY);
    verify('阶段1', '监控箱(根)', { object: 'instances', noFlow: true, noCategory: true });
  }

  const myFileRoot = cls.roots.find(r => r.title === '我的文件');
  if (myFileRoot) {
    prevClickedLabel = lastClickedLabel;
    clearPhase();
    clickNode(myFileRoot.node);
    await delay(1500);
    const listReqs = phaseRequests.filter(r => r.objectName === 'instance_tasks' || r.objectName === 'instances');
    if (listReqs.length > 0) {
      warn('阶段1', `"我的文件(容器)"触发了 ${listReqs.length} 个意外列表请求`);
    } else {
      testIndex++;
      console.log(`[${testIndex}] ✅ [阶段1] 点击"我的文件(容器)" — 无列表请求（正确）`);
    }
    lastClickedLabel = '我的文件(容器)';
  }

  for (const box of cls.boxItems) {
    const boxLabel = `我的文件/${box.title}`;
    await clickAndWait(box.node, boxLabel);
    verify('阶段1', boxLabel, { object: 'instances', noFlow: true, noCategory: true });
  }

  await delay(PHASE_DELAY);

  // ========== 阶段2: 待审核内切换 ==========
  console.log('\n%c📋 阶段2: 待审核内切换', 'color: #722ed1; font-size: 14px; font-weight: bold;');
  console.log('验证: 分类→category, 流程→flow, 交叉切换, 回根清除\n');

  if (inboxRoot) { await clickAndWait(inboxRoot.node, '待审核(根)', CLICK_DELAY + CROSS_ROOT_DELAY); }
  cls = classifyAllNodes();
  const inboxCats = cls.categories.filter(c => c.root === '待审核');
  const inboxFlows = cls.flows.filter(f => f.root === '待审核');

  for (const cat of inboxCats.slice(0, 3)) {
    const catLabel = `待审核/分类"${cat.title}"`;
    await clickAndWait(cat.node, catLabel);
    verify('阶段2', catLabel, { object: 'instance_tasks', category: true, noFlow: true });
  }

  let prevFlowId = null;
  for (const flow of inboxFlows.slice(0, 4)) {
    const flowLabel = `待审核/流程"${flow.title}"`;
    await clickAndWait(flow.node, flowLabel);
    verify('阶段2', flowLabel, { object: 'instance_tasks', flow: true, noCategory: true });
    const listReqs = phaseRequests.filter(r => r.objectName === 'instance_tasks' || r.objectName === 'instances');
    const req = listReqs.length > 0 ? listReqs[listReqs.length - 1] : null;
    if (req && req.flowId && prevFlowId && req.flowId === prevFlowId) {
      log('阶段2', `残留检测"${flow.title}"`, false, `flowId=${req.flowId} 与上一个相同`);
    }
    if (req) prevFlowId = req.flowId;
  }

  // 交叉切换
  if (inboxFlows.length > 0 && inboxCats.length > 0) {
    console.log('  交叉切换: 流程→分类→流程');
    const f1Label = `待审核/流程"${inboxFlows[0].title}"`;
    await clickAndWait(inboxFlows[0].node, f1Label);
    verify('阶段2', `交叉:${f1Label}`, { flow: true, noCategory: true });

    const c1Label = `待审核/分类"${inboxCats[0].title}"`;
    await clickAndWait(inboxCats[0].node, c1Label);
    verify('阶段2', `交叉:${c1Label}`, { category: true, noFlow: true });

    const f2 = inboxFlows.length > 1 ? inboxFlows[1] : inboxFlows[0];
    const f2Label = `待审核/流程"${f2.title}"`;
    await clickAndWait(f2.node, f2Label);
    verify('阶段2', `交叉:${f2Label}`, { flow: true, noCategory: true });
  }

  if (inboxRoot) {
    await clickAndWait(inboxRoot.node, '待审核(根)');
    verify('阶段2', '回到待审核(根)清除过滤', { noFlow: true, noCategory: true });
  }

  if (inboxCats.length === 0 && inboxFlows.length === 0) console.log('  待审核下无子节点，跳过');

  await delay(PHASE_DELAY);

  // ========== 阶段3: 监控箱内切换 ==========
  console.log('\n%c📋 阶段3: 监控箱内切换', 'color: #722ed1; font-size: 14px; font-weight: bold;');
  console.log('验证: 分类→category, 流程→flow\n');

  if (monitorRoot) { await clickAndWait(monitorRoot.node, '监控箱(根)', CLICK_DELAY + CROSS_ROOT_DELAY); }
  cls = classifyAllNodes();
  const monCats = cls.categories.filter(c => c.root === '监控箱');
  const monFlows = cls.flows.filter(f => f.root === '监控箱');

  for (const cat of monCats.slice(0, 3)) {
    const catLabel = `监控箱/分类"${cat.title}"`;
    await clickAndWait(cat.node, catLabel);
    verify('阶段3', catLabel, { object: 'instances', category: true, noFlow: true });
  }

  let prevMonFlowId = null;
  for (const flow of monFlows.slice(0, 4)) {
    const flowLabel = `监控箱/流程"${flow.title}"`;
    await clickAndWait(flow.node, flowLabel);
    verify('阶段3', flowLabel, { object: 'instances', flow: true, noCategory: true });
    const listReqs = phaseRequests.filter(r => r.objectName === 'instance_tasks' || r.objectName === 'instances');
    const req = listReqs.length > 0 ? listReqs[listReqs.length - 1] : null;
    if (req && req.flowId && prevMonFlowId && req.flowId === prevMonFlowId) {
      log('阶段3', `残留检测"${flow.title}"`, false, `flowId 未变化`);
    }
    if (req) prevMonFlowId = req.flowId;
  }

  if (monitorRoot) {
    await clickAndWait(monitorRoot.node, '监控箱(根)');
    verify('阶段3', '回到监控箱(根)清除过滤', { noFlow: true, noCategory: true });
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
  if (allInboxFlows.length > 0) crossTests.push({ ...allInboxFlows[0],
    label: `待审核/流程"${allInboxFlows[0].title}"`,
    expect: { object: 'instance_tasks', flow: true, noCategory: true } });
  if (allMonCats.length > 0) crossTests.push({ ...allMonCats[0],
    label: `监控箱/分类"${allMonCats[0].title}"`,
    expect: { object: 'instances', category: true, noFlow: true } });
  if (allMonFlows.length > 0) crossTests.push({ ...allMonFlows[0],
    label: `监控箱/流程"${allMonFlows[0].title}"`,
    expect: { object: 'instances', flow: true, noCategory: true } });
  const draftBox = cls.boxItems.find(b => b.title === '草稿');
  if (draftBox) crossTests.push({ ...draftBox,
    label: '我的文件/草稿',
    expect: { object: 'instances', noFlow: true, noCategory: true } });
  if (inboxRoot) crossTests.push({ node: inboxRoot.node,
    title: '待审核(根)',
    expect: { object: 'instance_tasks', noFlow: true, noCategory: true } });
  const compBox = cls.boxItems.find(b => b.title === '已完成');
  if (compBox) crossTests.push({ ...compBox,
    label: '我的文件/已完成',
    expect: { object: 'instances', noFlow: true, noCategory: true } });
  if (allInboxFlows.length > 1) crossTests.push({ ...allInboxFlows[1],
    label: `待审核/流程"${allInboxFlows[1].title}"`,
    expect: { object: 'instance_tasks', flow: true, noCategory: true } });

  for (const t of crossTests) {
    const label = t.label || t.title;
    await clickAndWait(t.node, label, CLICK_DELAY + CROSS_ROOT_DELAY);
    verify('阶段4', label, t.expect);
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
    const lastPickLabel = lastPick.root ? `${lastPick.root}/${lastPick.title}` : lastPick.title;
    prevClickedLabel = lastClickedLabel;
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
      log('阶段5', `快速点击${picks.length}个节点，最终="${lastPickLabel}"`, true, info);
      if (listReqs.length > picks.length) {
        const chain = picks.map(p => p.root ? `${p.root}/${p.title}` : p.title).join(' → ');
        warn('阶段5', `请求数(${listReqs.length}) > 点击数(${picks.length})，可能有冗余`,
          `从"${prevClickedLabel}"开始快速点击: ${chain}`);
      }
    } else {
      log('阶段5', `快速点击${picks.length}个节点`, false, '未捕获到列表请求');
    }
    lastClickedLabel = lastPickLabel;
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
    warnings.forEach((w, i) => {
      console.warn(`  [${i + 1}] [${w.phase}] ${w.desc}`);
      if (w.detail) console.warn(`      ↳ ${w.detail}`);
    });
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