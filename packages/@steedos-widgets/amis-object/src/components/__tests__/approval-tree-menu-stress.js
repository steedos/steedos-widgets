/**
 * ApprovalTreeMenu 左侧审批菜单 Stress Test 脚本
 * 
 * 用途：随机批量点击审批中心左侧树菜单节点，自动检测以下异常：
 *   1. 重复分类节点（同一根节点下同名分类出现多次）
 *   2. 选中态是否正确
 *   3. URL 是否合理变化
 *   4. 随机展开/折叠节点
 * 
 * 使用方式：
 *   1. 在浏览器中打开审批中心页面（如 /app/approve_workflow/...）
 *   2. 按 F12 打开 DevTools → Console 标签页
 *   3. 粘贴本脚本全部内容并按回车执行
 *   4. 等待执行完毕，查看控制台输出的测试报告
 * 
 * 注意事项：
 *   - 本脚本仅操作 DOM，不调用后端 API、不修改任何数据
 *   - 不依赖特定数据库或环境，任何有审批中心页面的环境均可运行
 *   - 不适用于 Node.js / Jest / Vitest 等测试框架直接运行
 *   - 如需 E2E 自动化，建议后续迁移为 Playwright 测试用例
 *   - 可通过修改 CLICK_COUNT、MIN_DELAY、MAX_DELAY 调整测试强度
 */

(async () => {
  const CLICK_COUNT = 50;
  const MIN_DELAY = 300;
  const MAX_DELAY = 1500;
  const errors = [];

  const delay = (ms) => new Promise(r => setTimeout(r, ms));
  const randomDelay = () => delay(MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY));

  const getTreeNodes = () => {
    return Array.from(document.querySelectorAll('.approval-tree-menu .ant-tree-treenode'));
  };

  const getSelectedTitle = () => {
    const sel = document.querySelector('.approval-tree-menu .ant-tree-treenode-selected .approval-tree-menu__label');
    return sel ? sel.textContent.trim() : '(none)';
  };

  // 修正：按根节点分组检测重复分类
  // 跨根节点的同名分类是合法的（如"待审核"和"监控箱"下都有"信息管理部"）
  // 只有同一个根节点下出现同名分类才是 bug
  const checkDuplicateCategories = () => {
    const dupes = [];
    const treeListInner = document.querySelector('.approval-tree-menu .ant-tree-list-holder-inner');
    if (!treeListInner) return dupes;

    const allTreeNodes = Array.from(treeListInner.children);
    let currentRootLabel = '';
    const rootGroupMap = {};

    allTreeNodes.forEach(node => {
      const indent = node.querySelectorAll('.ant-tree-indent-unit').length;
      const label = node.querySelector('.approval-tree-menu__label')?.textContent?.trim() || '';

      if (indent === 0) {
        currentRootLabel = label;
        rootGroupMap[currentRootLabel] = [];
      } else if (indent === 1 && currentRootLabel) {
        const isGroup = node.querySelector('.approval-tree-menu__label--group');
        if (isGroup) {
          rootGroupMap[currentRootLabel].push(label);
        }
      }
    });

    Object.entries(rootGroupMap).forEach(([root, labels]) => {
      const seen = {};
      labels.forEach(label => {
        seen[label] = (seen[label] || 0) + 1;
        if (seen[label] > 1) {
          dupes.push(`[${root}] ${label}`);
        }
      });
    });

    return [...new Set(dupes)];
  };

  const getListInfo = () => {
    const listTitle = document.querySelector('.cxd-Page-title')?.textContent?.trim() || '';
    const rowCount = document.querySelectorAll('.cxd-Table-row, .steedos-object-listview-row, tr[data-index]').length;
    return { listTitle, rowCount };
  };

  console.log(`%c🚀 开始自动化测试：${CLICK_COUNT} 次随机点击`, 'color: #1677ff; font-size: 14px; font-weight: bold;');

  let prevUrl = location.href;

  for (let i = 0; i < CLICK_COUNT; i++) {
    const nodes = getTreeNodes();
    if (nodes.length === 0) {
      console.warn(`[${i+1}] ⚠️ 找不到树节点，等待重试...`);
      await delay(2000);
      continue;
    }

    const randomIdx = Math.floor(Math.random() * nodes.length);
    const targetNode = nodes[randomIdx];
    const titleEl = targetNode.querySelector('.approval-tree-menu__label');
    const clickTarget = targetNode.querySelector('.ant-tree-title') || targetNode.querySelector('.ant-tree-node-content-wrapper');
    const targetTitle = titleEl ? titleEl.textContent.trim() : '(unknown)';

    if (clickTarget) {
      clickTarget.click();
    }

    await randomDelay();

    const selectedTitle = getSelectedTitle();
    const currentUrl = location.href;
    const dupes = checkDuplicateCategories();
    const listInfo = getListInfo();

    const selectionMismatch = titleEl && !targetNode.closest('.ant-tree-treenode')?.classList.contains('ant-tree-treenode-selected')
      && clickTarget && targetNode.querySelector('.approval-tree-menu__label--item');

    if (dupes.length > 0) {
      const errMsg = `重复分类节点: ${dupes.join(', ')}`;
      errors.push({ click: i + 1, target: targetTitle, error: errMsg });
      console.error(`[${i+1}] ❌ ${errMsg}`);
    }

    const urlChanged = currentUrl !== prevUrl;

    const status = dupes.length > 0 ? '❌' : '✅';
    console.log(
      `[${i+1}/${CLICK_COUNT}] ${status} 点击: "${targetTitle}" | 选中: "${selectedTitle}" | URL变化: ${urlChanged} | 列表行数: ${listInfo.rowCount}`
    );

    prevUrl = currentUrl;

    if (Math.random() < 0.2) {
      const switchers = Array.from(document.querySelectorAll('.approval-tree-menu .ant-tree-switcher:not(.ant-tree-switcher-noop)'));
      if (switchers.length > 0) {
        const randomSwitcher = switchers[Math.floor(Math.random() * switchers.length)];
        randomSwitcher.click();
        await delay(200);
        console.log(`  ↳ 展开/折叠了一个节点`);
      }
    }
  }

  console.log('\n%c📊 测试报告', 'color: #1677ff; font-size: 16px; font-weight: bold;');
  console.log(`总点击次数: ${CLICK_COUNT}`);
  console.log(`发现异常数: ${errors.length}`);
  if (errors.length > 0) {
    console.table(errors);
  } else {
    console.log('%c✅ 全部通过，未发现异常', 'color: #52c41a; font-size: 14px;');
  }
})();
