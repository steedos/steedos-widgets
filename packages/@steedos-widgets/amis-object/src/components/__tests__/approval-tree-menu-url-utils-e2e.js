/**
 * ApprovalTreeMenu E2E 导航回归测试脚本
 *
 * 在浏览器 F12 控制台中粘贴运行，或通过 MCP Chrome evaluate_script 执行。
 * 前提：已登录审批中心页面（/app/approve_workflow/...）。
 *
 * 测试覆盖：
 * - 根节点间切换（同对象 / 跨对象）
 * - 根节点 ↔ 子节点切换（L2 分类 / L3 流程）
 * - 子节点间切换（同根 / 跨根）
 * - 二栏(grid) 和 三栏(view) 模式
 *
 * @see https://github.com/steedos/steedos-widgets/issues/619
 * @see https://github.com/steedos/steedos-plugins/issues/428
 * @version 1.0
 */

(async function ApprovalTreeMenuE2ETest() {
  'use strict';

  // ===================== 配置 =====================
  const CLICK_DELAY = 1800; // 点击后等待 URL 更新的时间（ms）
  const LOG_PREFIX = '[E2E]';

  // ===================== 工具函数 =====================

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  function getCurrentUrl() {
    return window.location.pathname + window.location.search;
  }

  function isGridMode() {
    return /\/app\/[^/]+\/[^/]+\/grid\/[^/?#]+/.test(window.location.pathname);
  }

  function isViewMode() {
    return /\/app\/[^/]+\/[^/]+\/view\/[^/?#]+/.test(window.location.pathname);
  }

  /**
   * 从 antd Tree 中找到指定 label 的节点并点击
   * @param {string} label - 节点文本
   * @returns {boolean} 是否找到并点击
   */
  function clickTreeNode(label) {
    const tree = document.querySelector('.approval-tree-menu .ant-tree');
    if (!tree) {
      console.error(LOG_PREFIX, '未找到 .approval-tree-menu .ant-tree');
      return false;
    }
    const nodes = tree.querySelectorAll('.ant-tree-node-content-wrapper');
    for (const node of nodes) {
      const titleEl = node.querySelector('.ant-tree-title');
      if (!titleEl) continue;
      // 获取纯文本（排除 badge 数字）
      const textParts = [];
      titleEl.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          textParts.push(child.textContent.trim());
        } else if (child.classList && !child.classList.contains('ant-badge')) {
          textParts.push(child.textContent.trim());
        }
      });
      const nodeText = textParts.join('').trim() || titleEl.textContent.trim().split(/\s+/)[0];
      if (nodeText === label || titleEl.textContent.trim().startsWith(label)) {
        node.click();
        return true;
      }
    }
    console.warn(LOG_PREFIX, `未找到节点: "${label}"`);
    return false;
  }

  /**
   * 展开 antd Tree 节点（如果处于折叠状态）
   */
  function expandTreeNode(label) {
    const tree = document.querySelector('.approval-tree-menu .ant-tree');
    if (!tree) return false;
    const items = tree.querySelectorAll('.ant-tree-treenode');
    for (const item of items) {
      const titleEl = item.querySelector('.ant-tree-title');
      if (!titleEl) continue;
      if (titleEl.textContent.trim().startsWith(label)) {
        const switcher = item.querySelector('.ant-tree-switcher');
        if (switcher && switcher.classList.contains('ant-tree-switcher_close')) {
          switcher.click();
          return true;
        }
        return false; // 已展开
      }
    }
    return false;
  }

  // ===================== 断言 =====================

  const results = [];

  function assert(testId, description, condition, actual, expected) {
    const status = condition ? 'PASS' : 'FAIL';
    results.push({ testId, description, status, actual, expected });
    if (!condition) {
      console.error(LOG_PREFIX, `❌ ${testId}: ${description}`, { actual, expected });
    } else {
      console.log(LOG_PREFIX, `✅ ${testId}: ${description}`);
    }
  }

  function assertUrlContains(testId, description, substring) {
    const url = getCurrentUrl();
    assert(testId, description, url.includes(substring), url, `should contain "${substring}"`);
  }

  function assertUrlNotContains(testId, description, substring) {
    const url = getCurrentUrl();
    assert(testId, description, !url.includes(substring), url, `should NOT contain "${substring}"`);
  }

  function assertGridMode(testId, description) {
    const url = getCurrentUrl();
    const ok = isGridMode();
    assert(testId, description + ' (grid mode)', ok, url, 'should match /grid/ pattern');
    assertUrlContains(testId + '.1', description + ' (display=grid)', 'display=grid');
    assertUrlNotContains(testId + '.2', description + ' (no side_object)', 'side_object=');
    assertUrlNotContains(testId + '.3', description + ' (no side_listview_id)', 'side_listview_id=');
  }

  function assertViewMode(testId, description) {
    const url = getCurrentUrl();
    const ok = isViewMode();
    assert(testId, description + ' (view mode)', ok, url, 'should match /view/ pattern');
    assertUrlContains(testId + '.1', description + ' (side_object)', 'side_object=');
    assertUrlContains(testId + '.2', description + ' (side_listview_id)', 'side_listview_id=');
  }

  // ===================== 测试执行器 =====================

  async function clickAndWait(label) {
    const clicked = clickTreeNode(label);
    if (!clicked) return false;
    await sleep(CLICK_DELAY);
    return true;
  }

  async function expandAndWait(label) {
    expandTreeNode(label);
    await sleep(500);
  }

  // ===================== 检测当前模式 =====================

  const startingMode = isGridMode() ? 'grid' : 'view';
  console.log(LOG_PREFIX, `当前模式: ${startingMode}`, getCurrentUrl());

  // ===================== 测试用例 =====================

  // 确保待审核展开
  await expandAndWait('待审核');
  // 确保监控箱展开
  await expandAndWait('监控箱');
  await sleep(500);

  // --- A: 根节点间切换 ---

  // A1: 待审核 → 已审核（同对象 instance_tasks）
  if (await clickAndWait('待审核')) {
    await sleep(300);
  }
  if (await clickAndWait('已审核')) {
    if (startingMode === 'grid') {
      assertGridMode('A1', '待审核→已审核');
      assertUrlContains('A1.obj', '对象为 instance_tasks', '/instance_tasks/');
    } else {
      assertViewMode('A1', '待审核→已审核');
      assertUrlContains('A1.lv', 'listview=outbox', 'side_listview_id=outbox');
    }
  }

  // A2: 已审核 → 草稿（跨对象 instance_tasks → instances）
  if (await clickAndWait('草稿')) {
    if (startingMode === 'grid') {
      assertGridMode('A2', '已审核→草稿');
      assertUrlContains('A2.obj', '对象为 instances', '/instances/');
    } else {
      assertViewMode('A2', '已审核→草稿');
      assertUrlContains('A2.lv', 'listview=draft', 'side_listview_id=draft');
    }
  }

  // A3: 草稿 → 进行中（同对象 instances）
  if (await clickAndWait('进行中')) {
    if (startingMode === 'grid') {
      assertGridMode('A3', '草稿→进行中');
    } else {
      assertViewMode('A3', '草稿→进行中');
      assertUrlContains('A3.lv', 'listview=pending', 'side_listview_id=pending');
    }
  }

  // A4: 进行中 → 监控箱（同对象 instances）
  if (await clickAndWait('监控箱')) {
    if (startingMode === 'grid') {
      assertGridMode('A4', '进行中→监控箱');
      assertUrlContains('A4.obj', '对象为 instances', '/instances/');
    } else {
      assertViewMode('A4', '进行中→监控箱');
      assertUrlContains('A4.lv', 'listview=monitor', 'side_listview_id=monitor');
    }
  }

  // A5: 监控箱 → 待审核（跨对象 instances → instance_tasks）
  if (await clickAndWait('待审核')) {
    if (startingMode === 'grid') {
      assertGridMode('A5', '监控箱→待审核');
      assertUrlContains('A5.obj', '对象为 instance_tasks', '/instance_tasks/');
    } else {
      assertViewMode('A5', '监控箱→待审核');
      assertUrlContains('A5.lv', 'listview=inbox', 'side_listview_id=inbox');
    }
  }

  // --- B: 根节点 → 子节点 ---

  // 确保展开
  await expandAndWait('待审核');
  await sleep(300);

  // 检查是否有分类子节点
  const hasCategories = !!document.querySelector('.approval-tree-menu .ant-tree-treenode[class*="level"]');

  // B1: 待审核 → 待审核下第一个分类 (L2)
  const firstCategory = document.querySelectorAll('.approval-tree-menu .ant-tree .ant-tree-treenode');
  let categoryLabel = null;
  let flowLabel = null;

  // 找到待审核下的第一个分类节点
  for (const node of firstCategory) {
    const indent = node.querySelectorAll('.ant-tree-indent-unit').length;
    const title = node.querySelector('.ant-tree-title');
    if (indent === 1 && title) {
      const text = title.textContent.trim().split(/\s+/)[0];
      if (!['已审核', '监控箱', '我的文件', '草稿', '进行中', '已完成'].includes(text) && text !== '待审核') {
        categoryLabel = text;
        break;
      }
    }
  }

  if (categoryLabel) {
    if (await clickAndWait(categoryLabel)) {
      const url = getCurrentUrl();
      if (startingMode === 'grid') {
        assertGridMode('B1', `待审核→分类"${categoryLabel}"`);
        assertUrlContains('B1.filter', 'additionalFilters 非空', "additionalFilters=%5B'category'");
      } else {
        assertViewMode('B1', `待审核→分类"${categoryLabel}"`);
        assertUrlContains('B1.filter', 'additionalFilters 非空', "additionalFilters=[");
      }
      assertUrlContains('B1.catId', '有 categoryId', 'categoryId=');

      // B2: 展开分类，找流程节点 (L3)
      await expandAndWait(categoryLabel);
      await sleep(500);

      // 找 L3 流程节点
      for (const node of document.querySelectorAll('.approval-tree-menu .ant-tree .ant-tree-treenode')) {
        const indent = node.querySelectorAll('.ant-tree-indent-unit').length;
        const title = node.querySelector('.ant-tree-title');
        if (indent === 2 && title) {
          flowLabel = title.textContent.trim().split(/\s+/)[0];
          break;
        }
      }

      if (flowLabel) {
        // D2: 分类(L2) → 流程(L3) 同根
        if (await clickAndWait(flowLabel)) {
          if (startingMode === 'grid') {
            assertGridMode('D2', `分类→流程"${flowLabel}"`);
            assertUrlContains('D2.filter', 'additionalFilters 含 flow', "flow");
          } else {
            assertViewMode('D2', `分类→流程"${flowLabel}"`);
          }
          assertUrlContains('D2.flowId', '有 flowId', 'flowId=');

          // D3: 流程(L3) → 分类(L2) 同根
          if (await clickAndWait(categoryLabel)) {
            if (startingMode === 'grid') {
              assertGridMode('D3', `流程→分类"${categoryLabel}"`);
              assertUrlContains('D3.filter', 'additionalFilters 含 category', "category");
            } else {
              assertViewMode('D3', `流程→分类"${categoryLabel}"`);
            }
          }
        }
      } else {
        console.warn(LOG_PREFIX, '未找到 L3 流程节点，跳过 D2/D3');
      }

      // C1: 分类(L2) → 已审核(根)（跨根同对象）
      if (await clickAndWait('已审核')) {
        if (startingMode === 'grid') {
          assertGridMode('C1', '分类→已审核');
        } else {
          assertViewMode('C1', '分类→已审核');
        }
        assertUrlContains('C1.empty', 'additionalFilters 为空', 'additionalFilters=');
        // additionalFilters= 且后面没有 [
        const u = getCurrentUrl();
        const afIdx = u.indexOf('additionalFilters=');
        const afterAf = afIdx >= 0 ? u.substring(afIdx + 18, afIdx + 19) : '';
        assert('C1.clean', 'additionalFilters 值为空', afterAf === '' || afterAf === '&', afterAf, 'empty or &');
      }

      // C4: 已审核(根) → 监控箱/分类(L2)（跨根跨对象子节点）
      await expandAndWait('监控箱');
      await sleep(500);
      let monitorCategory = null;
      for (const node of document.querySelectorAll('.approval-tree-menu .ant-tree .ant-tree-treenode')) {
        const indent = node.querySelectorAll('.ant-tree-indent-unit').length;
        const title = node.querySelector('.ant-tree-title');
        if (indent === 1 && title) {
          const text = title.textContent.trim().split(/\s+/)[0];
          // 监控箱下的子分类不在已知根节点列表中，且不在待审核子节点列表中
          if (text !== categoryLabel && !['待审核', '已审核', '监控箱', '我的文件', '草稿', '进行中', '已完成'].includes(text)) {
            // 检查是否在监控箱区域下
            monitorCategory = text;
          }
        }
      }
      if (monitorCategory) {
        if (await clickAndWait(monitorCategory)) {
          if (startingMode === 'grid') {
            assertGridMode('D5', `已审核→监控箱分类"${monitorCategory}"`);
            assertUrlContains('D5.obj', '对象为 instances', '/instances/');
          } else {
            assertViewMode('D5', `已审核→监控箱分类"${monitorCategory}"`);
          }
        }
      }
    }
  } else {
    console.warn(LOG_PREFIX, '待审核下无分类子节点，跳过子节点相关测试');
  }

  // --- 回到待审核，准备复位 ---
  await clickAndWait('待审核');

  // ===================== 测试报告 =====================

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;

  console.log('\n' + '='.repeat(60));
  console.log(`${LOG_PREFIX} 测试报告 — ${startingMode} 模式`);
  console.log('='.repeat(60));
  console.log(`总计: ${total}  通过: ${passed}  失败: ${failed}`);
  console.log('='.repeat(60));

  if (failed > 0) {
    console.log('\n失败用例:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  ❌ ${r.testId}: ${r.description}`);
      console.log(`     实际: ${r.actual}`);
      console.log(`     期望: ${r.expected}`);
    });
  }

  console.log('\n所有用例:');
  results.forEach(r => {
    console.log(`  ${r.status === 'PASS' ? '✅' : '❌'} ${r.testId}: ${r.description}`);
  });

  return { mode: startingMode, total, passed, failed, results };
})();
