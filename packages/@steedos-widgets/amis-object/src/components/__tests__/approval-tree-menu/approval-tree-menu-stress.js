/**
 * ApprovalTreeMenu 左侧审批菜单 Stress Test 脚本
 *
 * @version 2.0
 * @see https://github.com/steedos/steedos-plugins/issues/491  - 待审核列表乱跳主 issue
 * @see https://github.com/steedos/steedos-widgets/issues/594   - 前端菜单修复 issue
 * @see https://github.com/steedos/steedos-plugins/issues/523   - 后端分类重复 issue
 * @see https://github.com/steedos/steedos-widgets/issues/598   - 本脚本收录 issue
 *
 * 检测项：
 *   1. 重复分类节点（同一根节点下同名分类出现多次，跨根节点同名合法）
 *   2. 叶子节点点击后选中态不匹配（点了 A 但选中的是 B）
 *   3. 叶子节点点击后 URL 未变化（可能是乱跳回原位）
 *   4. 同一叶子节点连续点击两次 URL 发生意外变化（幂等性）
 *   5. 随机展开/折叠节点
 * 
 * 检测意义：
 * 脚本的真正价值是修正后的回归防护——确保未来改代码不会重新引入乱跳、选中态错误等问题。如果未来有人改坏了前端菜单逻辑，这个脚本大概率能抓到。
 *
 * 使用方式：
 *   1. 在浏览器中打开审批中心页面（如 /app/approve_workflow/...）
 *   2. 按 F12 打开 DevTools → Console 标签页
 *   3. 粘贴本脚本全部内容并按回车执行
 *   4. 等待脚本执行完毕，查看控制台输出的测试报告
 *   5. 建议连续运行 2-3 次，全部 0 异常才算通过
 *
 * 可调参数：
 *   - CLICK_COUNT: 总随机点击次数，默认 50。快速冒烟用 20，充分回归用 100-200
 *   - MIN_DELAY:   两次点击之间的最小间隔(ms)，默认 300。模拟快速操作可改为 100
 *   - MAX_DELAY:   两次点击之间的最大间隔(ms)，默认 1500。网络慢的环境建议改为 3000
 *   实际间隔 = MIN_DELAY + random * (MAX_DELAY - MIN_DELAY)
 * 
 * 检测项及能力边界：
 *   1. 重复分类节点（同一根节点下同名分类出现多次）
 *      ⚠️ 无法检测"同一分类改名后新旧名并存"的情况，该场景依赖后端修复
 *   2. 叶子节点点击后选中态不匹配（确定性检测，每次点击叶子都会验证）
 *   3. 叶子节点点击后 URL 未变化（warn 级别，仅供参考）
 *   4. 同一叶子节点连续点击 URL 发生意外变化（确定性检测）
 *   5. 随机展开/折叠节点
 *
 * 本脚本属于 fuzz testing（模糊测试），靠随机性和执行次数覆盖边界场景，
 * 建议连续运行 2-3 次、每次 50-100 次点击，全部 0 异常才算通过。
 * 单次全部通过不代表没有问题，单次有异常则一定有问题。
 * 
 * 注意事项：
 *   - 本脚本仅操作 DOM，不调用后端 API、不修改任何数据
 *   - 不依赖特定数据库或环境，任何有审批中心页面的环境均可运行
 *   - 不适用于 Node.js / Jest / Vitest 等测试框架直接运行
 *   - 如需 E2E 自动化，建议后续迁移为 Playwright 测试用例
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

  // 判断节点是否为叶子节点（可点击跳转的菜单项）
  const isLeafNode = (node) => {
    return !!node.querySelector('.approval-tree-menu__label--item');
  };

  // 检测1: 按根节点分组检测重复分类
  // 跨根节点的同名分类是合法的（如"待审核"和"监控箱"下都有"信息管理部"）
  // 只有同一个根节点下出现同名分类才是 bug（后端 groupBy category_name 导致）
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
  console.log(`%c检测项: 重复分类 | 选中态匹配 | URL一致性 | 幂等性`, 'color: #666;');

  let prevUrl = location.href;
  let prevClickTitle = '';
  let prevClickUrl = '';

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
    const isLeaf = isLeafNode(targetNode);

    if (clickTarget) {
      clickTarget.click();
    }

    await randomDelay();

    const selectedTitle = getSelectedTitle();
    const currentUrl = location.href;
    const dupes = checkDuplicateCategories();
    const listInfo = getListInfo();
    let stepErrors = [];

    // 检测1: 重复分类
    if (dupes.length > 0) {
      stepErrors.push(`重复分类: ${dupes.join(', ')}`);
    }

    // 检测2: 叶子节点选中态不匹配
    if (isLeaf && clickTarget) {
      const isSelected = targetNode.classList.contains('ant-tree-treenode-selected');
      if (!isSelected) {
        stepErrors.push(`选中态不匹配: 点击了"${targetTitle}"但未被选中，当前选中="${selectedTitle}"`);
      }
    }

    // 检测3: 叶子节点点击后 URL 应该变化（点了不同叶子但 URL 没变）
    if (isLeaf && targetTitle !== prevClickTitle && currentUrl === prevUrl) {
      console.warn(`  ⚠️ [${i+1}] 点击了不同叶子"${targetTitle}"但URL未变化`);
    }

    // 检测4: 幂等性 - 同一叶子节点连续点击两次，URL不应该变
    if (isLeaf && targetTitle === prevClickTitle && currentUrl !== prevClickUrl) {
      stepErrors.push(`幂等性异常: 连续点击"${targetTitle}"但URL变化了 (${prevClickUrl} → ${currentUrl})`);
    }

    // 记录错误
    if (stepErrors.length > 0) {
      stepErrors.forEach(err => {
        errors.push({ click: i + 1, target: targetTitle, error: err });
      });
      console.error(`[${i+1}/${CLICK_COUNT}] ❌ ${targetTitle}: ${stepErrors.join(' | ')}`);
    } else {
      console.log(
        `[${i+1}/${CLICK_COUNT}] ✅ 点击: "${targetTitle}" | 选中: "${selectedTitle}" | URL变化: ${currentUrl !== prevUrl} | 行数: ${listInfo.rowCount}`
      );
    }

    prevUrl = currentUrl;
    if (isLeaf) {
      prevClickTitle = targetTitle;
      prevClickUrl = currentUrl;
    }

    // 20% 概率随机展开/折叠
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

  // === 最终报告 ===
  console.log('\n%c📊 测试报告', 'color: #1677ff; font-size: 16px; font-weight: bold;');
  console.log(`总点击次数: ${CLICK_COUNT}`);
  console.log(`发现异常数: ${errors.length}`);

  // 按错误类型分组统计
  const errorTypes = {};
  errors.forEach(e => {
    const type = e.error.split(':')[0];
    errorTypes[type] = (errorTypes[type] || 0) + 1;
  });
  if (Object.keys(errorTypes).length > 0) {
    console.log('%c异常分类统计:', 'font-weight: bold;');
    Object.entries(errorTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} 次`);
    });
    console.table(errors);
  } else {
    console.log('%c✅ 全部通过，未发现异常', 'color: #52c41a; font-size: 14px;');
  }
})();