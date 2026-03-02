# 工作流表单公式 - Bug 修复指导手册

## 适用场景

当测试到新的工作流表单公式兼容性问题时，按此手册操作。

## 方式一：让 AI 自动修复（推荐）

在 Copilot Chat 中输入：

> 按照 `.github/prompts/workflow-formula-fix.prompt.md` 的流程，修复这个问题：[描述你发现的 Bug 现象]

描述时尽量包含：
- 老版本中字段/公式的原始配置值是什么
- 新版本中表单上的实际表现（显示空、显示错误值、报错等）
- 如果能判断，说明是默认值、公式、还是某个函数的问题

AI 会自动执行完整流程：写测试 → 验证失败 → 改代码 → 验证通过 → 写文档。

> 兼容性修复注意：如果修复涉及老公式转换规则，必须同步检查并更新表单设计器侧实现（`steedos-plugins/plugin-workflow`），不能只修改 widgets。

## 方式二：人工修复

### Step 1: 定位问题

1. 阅读规则文档：https://github.com/steedos/steedos-platform/blob/2.7/docs/workflow-formula-rules.md
2. 确定老版本公式原文
3. 在终端中测试当前转换结果：

```bash
cd packages/@steedos-widgets/amis-lib
node -e "
  const { mapFormula } = require('./src/workflow/formula-utils.js');
  console.log(mapFormula('你的公式', null));
"
```

4. 对比预期结果，确认是否为 bug

### Step 2: 写失败测试

编辑 `src/workflow/__tests__/formula-utils.test.js`，在末尾添加：

```javascript
describe('mapFormula - Bug N: [简述]', () => {
  test('[输入] → [预期输出]', () => {
    expect(mapFormula('[输入]', null)).toBe('[预期输出]');
  });
  // 添加同一根因的关联用例
});
```

运行测试确认新用例失败：

```bash
npm install --no-save jest babel-jest @babel/core @babel/preset-env
npx jest --verbose
```

### Step 3: 修复代码

只修改 `src/workflow/formula-utils.js`，不动 `flow.js`。

### Step 4: 验证

```bash
npx jest --verbose
```

全部通过才算修复完成。

如涉及老公式兼容，还要执行设计器侧回归：

```bash
cd steedos-packages/plugin-workflow
npm run test:formula-compat
```

### Step 5: 写文档

在 `docs/workflow/` 下创建 `plan-NNN-[short-name].md`，参照已有的 plan-001、plan-002 格式。

## Bug 编号管理

| 编号 | 描述 | Plan |
|------|------|------|
| Bug 1 | approver 上下文变量 | plan-001 |
| Bug 2 | {now} 复合表达式 | plan-001 |
| Bug 3 | 简单引用中文字符 | plan-001 |
| Bug 4 | 简单引用空白 trim | plan-001 |
| Bug 5 | 静态文本误判为公式 | plan-002 |
| Bug 6 | 字段名含半角括号未安全化 | plan-003 |

下一个 Bug 编号从 **Bug 7** 开始。

## 关键文件速查

| 文件 | 说明 |
|------|------|
| `src/workflow/formula-utils.js` | 公式转换核心逻辑（纯函数） |
| `src/workflow/flow.js` | 调用方（搜索 `mapFormula`） |
| `src/workflow/__tests__/formula-utils.test.js` | 测试用例 |
| `jest.config.js` | 测试配置 |
| `docs/workflow/plan-*.md` | 历史修复记录 |

### 跨仓库同步文件（设计器侧）

| 文件 | 说明 |
|------|------|
| `steedos-plugins/steedos-packages/plugin-workflow/main/default/routes/flow_form_design.ejs` | 设计器运行时公式转换逻辑 |
| `steedos-plugins/steedos-packages/plugin-workflow/main/default/utils/formula-compat.js` | 设计器转换工具函数 |
| `steedos-plugins/steedos-packages/plugin-workflow/main/default/test/test_formula_compat.js` | 设计器轻量回归脚本 |

## 规则文档
https://github.com/steedos/steedos-platform/blob/2.7/docs/workflow-formula-rules.md
