# GitHub Copilot Instructions for Steedos Widgets

## Project Overview

This is the **steedos-widgets** repository — the frontend UI component library for Steedos Platform.
It builds custom amis components (Steedos ObjectGrid, ObjectForm, FullCalendar, ReactFlow, Kanban, AG-Grid, etc.).

## Technology Stack

- **UI Framework**: amis v6.3.0 (Baidu low-code UI framework)
- **amis Source Code**: https://github.com/baidu/amis (use this to read amis internals, NOT documentation websites)
- **Language**: TypeScript + JavaScript
- **Build Tool**: Rollup
- **Package Manager**: Yarn 1.x (workspaces)
- **Monorepo**: Lerna
- **CSS**: Less + Tailwind CSS

## Branch Information

- **Main development branch**: `6.10`
- **Default branch**: `master` (may be outdated)
- When asked to fix issues, always work on the `6.10` branch unless explicitly instructed otherwise in the task description

## Related Repositories

- **steedos-platform** (`steedos/steedos-platform`, branch `3.0`): Backend + shell UI components (AppHeader etc.)
- **amis** (`baidu/amis`): The upstream UI framework — read its source when debugging rendering issues

## Project Structure

```
packages/
├── @steedos-widgets/amis-object/    # ⭐ Core package - amis schema generators
│   └── src/amis/
│       ├── AmisAppMenu.tsx          # Left sidebar menu component
│       ├── AmisGlobalHeader.tsx     # Global header component
│       ├── AmisObjectForm.tsx       # Object form component
│       ├── AmisObjectGrid.tsx       # Object grid/list component
│       ├── AmisObjectListview.tsx   # Object listview component
│       └── ...
├── @steedos-widgets/amis-lib/       # Shared amis utility library
├── @steedos-widgets/steedos-lib/    # Steedos platform utility library
├── @steedos-widgets/ag-grid/        # AG-Grid integration
├── @steedos-widgets/full-calendar/  # FullCalendar integration
└── ...
```

## Package Placement Rules

If the provided branch or package name is invalid, respond with an error message specifying the correct options.

When creating new components, choose the target package based on the component's nature:

| Package | Purpose | Examples |
|---------|---------|----------|
| `@steedos-widgets/antd` | Generic antd UI component wrappers, no business logic | Select, Liquid, Inject |
| `@steedos-widgets/amis-object` | ⭐ Business components that call Steedos APIs | SteedosUserSelector, SteedosOrgSelector, ApprovalTreeMenu |
| `@steedos-widgets/ag-grid` | AG-Grid integration | AmisAirtableGrid |
| `@steedos-widgets/full-calendar` | FullCalendar integration | FullCalendar |

**⚠️ Rule**: If a component calls any Steedos business API (e.g., `/api/approve_workflow/...`, `/api/v1/...`),
it belongs in `amis-object`, NOT in `antd` — even if it uses antd UI components internally.
The `antd` package is strictly for generic antd component wrappers with no business logic.

When adding a new business component to `amis-object`, follow the registration pattern of existing components
like `SteedosUserSelector` or `SteedosOrgSelector`:
- Component file: `src/components/YourComponent.tsx`
- Meta file: `src/metas/YourComponent.ts`
- Export in `src/components/index.tsx`
- Register meta in `src/meta.ts`

## ⚠️ Critical: amis Framework Knowledge

### How amis Schema Works in This Repo

The code in this repo does **NOT** directly render React components. Instead, it **generates amis JSON schema**
at build time, which amis renders at runtime. This means:

1. **String-based expressions**: `"${tabId == 'xxx'}"` — these are amis template expressions, NOT JavaScript
2. **Event system**: amis uses `onEvent` with custom event names like `@history_paths.changed`, `@tabId.changed`
3. **Action system**: `doAction`, `setValue`, `custom` scripts run in amis's sandboxed environment
4. **Schema adaptor**: Functions like `schemaApi.adaptor` run at request time and can modify the returned schema

### amis Expression Engine Limitations

- amis expressions use `${...}` syntax
- **Method calls like `.indexOf()`, `.startsWith()` are NOT reliably supported** in amis expressions
- The `window:` prefix (e.g., `window:location.pathname`) can access window properties but calling methods on nested objects may fail
- If an expression contains unsupported syntax, the **ENTIRE expression silently fails** (returns undefined/false)
- If an expression silently fails, check the amis formula engine source code (`packages/amis-formula/src/evalutor.ts`) or debug using simplified expressions to isolate the issue
- Use `|` pipe filters instead of method calls where possible
- When in doubt, keep expressions simple: `${variable == 'value'}` is safe

### amis Nav Component Behavior

The Nav component has TWO highlight/active mechanisms — **this has caused bugs before (see issue #526)**:

1. **`activeOn` expression**: If set on a nav item, amis evaluates it. If it returns `false`, the item is NOT active.
   **`activeOn` BLOCKS the built-in URL matching** — it does NOT fall through to URL matching.
2. **Built-in URL matching** via `env.isCurrentUrl(link.to)`: Only used when `activeOn` is **NOT** set on the item.

**Rule**: Do NOT use `activeOn` on Nav items if you want URL-based highlighting.
The built-in URL matching correctly handles: initial page load, SPA navigation, direct URL input, and page refresh.

Reference: See `packages/amis/src/renderers/Nav.tsx` in the amis source code (`baidu/amis` repo).

### amis Service Component

- `schemaApi` adaptor runs when the service initializes or when its dependencies change
- `dataProvider.inited` uses `setData` which may NOT trigger the same re-rendering as `doAction/setValue`
- For reliable data updates after initialization, prefer `doAction({ actionType: 'setValue', componentId: '...' })`

### amis Event Names Used in Steedos

| Event | Where | Purpose |
|-------|-------|---------|
| `@history_paths.changed` | Global broadcast | Fired when SPA route changes |
| `@tabId.changed` | Nav component | Tab selection changed externally |
| `@data.changed.steedos_keyvalues` | Service | Steedos key-value store changed |

## amis Source Code References

When you need to understand amis component internals, read the source code at https://github.com/baidu/amis :

| Component | Source File | Key Logic |
|-----------|------------|-----------|
| Nav (renderer) | `packages/amis/src/renderers/Nav.tsx` | `activeOn` vs `isCurrentUrl` priority, link active state |
| Nav (UI component) | `packages/amis-ui/src/components/Nav.tsx` | `isActive` callback, render logic |
| Expression engine | `packages/amis-formula/src/evalutor.ts` | What syntax is supported in `${...}` |
| Service component | `packages/amis/src/renderers/Service.tsx` | `schemaApi` lifecycle, data scope |
| Action handler | `packages/amis-core/src/actions/` | `setValue`, `custom`, `reload` etc. |

**⚠️ Do NOT try to access `https://aisuda.bce.baidu.com` or `https://baidu.github.io`** because these are
either behind login walls, require JavaScript execution to render content, or are unavailable.
Always use the GitHub source code at `https://github.com/baidu/amis` directly.

## ⚠️ When to Suggest Switching to Local VS Code Copilot

**If you are running as a cloud-based Copilot coding agent**, you do NOT have access to:
- `node_modules/` directory (cannot read amis source code locally)
- Browser DevTools / F12 console output
- The running Steedos application for interactive debugging

**You MUST proactively suggest the user switch to local VS Code Copilot Chat when:**

1. **The fix requires understanding amis component internals** — e.g., how Nav, Service, Form,
   or other amis renderers behave at runtime. The user's local `node_modules/amis/` contains
   the full amis source code that local Copilot can read via `@workspace`.

2. **Your first fix attempt fails and the root cause is unclear** — If you cannot determine why
   your change doesn't work without seeing runtime behavior, suggest switching immediately
   rather than making multiple blind attempts.

3. **The issue involves amis expression evaluation** — The expression engine (`amis-formula`)
   has specific syntax limitations that are best understood by reading
   `node_modules/amis-formula/src/evalutor.ts` locally.

4. **The issue involves event timing or component lifecycle** — e.g., "init" vs "inited",
   `schemaApi` fetch timing, `setValue` vs `setData` differences. These are runtime behaviors
   that cannot be verified without either reading amis source or browser debugging.

**When suggesting, use a message like:**

> 💡 This issue involves amis framework internals that I cannot fully verify in the cloud environment.
> I recommend using local VS Code Copilot Chat for this fix, where you can:
> - Use `@workspace` to search `node_modules/amis/` for component source code
> - Paste F12 console/network output for analysis
> - Test changes immediately in your running Steedos instance
>
> Key files to reference locally:
> - `node_modules/amis/src/renderers/Nav.tsx` (Nav component behavior)
> - `node_modules/amis-core/src/utils/helper.ts` (expression evaluation)
> - `node_modules/amis-formula/src/evalutor.ts` (formula engine)

## Debugging Tips

When fixing UI behavior issues in this repo:

1. **Prefer simple solutions** — Remove problematic properties rather than adding complex workarounds.
   For example, removing `activeOn` is better than adding `@history_paths.changed` event listeners + path maps.
2. **Check amis source code** at https://github.com/baidu/amis when unsure about component behavior.
3. **Expression safety** — Always validate that amis expression syntax supports the operations you're using.
   Avoid method calls in expressions; keep them to simple comparisons.
4. **Test all scenarios** — When fixing menu/navigation issues, consider: initial page load, SPA navigation,
   direct URL input, page refresh, and click navigation.
5. **Clean up failed attempts** — If you iterate through multiple fix approaches, make sure the final commit
   removes all code from previous failed attempts.

## ⚠️ Build & Verification Commands

**ALWAYS run build commands from the repository root, NOT from inside a package directory.**
Root-level scripts go through Lerna 并按依赖顺序构建（例如先构 `amis-lib` 再构依赖它的 `amis-object`），子包里的 `yarn build:rollup` 会跳过这层拓扑排序。

| 场景 | 命令（在仓库根目录执行） | 说明 |
|------|-----------------------|------|
| 修改 `@steedos-widgets/amis-object`、`amis-lib`、`steedos-lib`、`antd` 等业务/通用组件包 | `yarn build-object` | 等价于 `lerna run build-object`，只构建对象类包，速度快，**这是修复 UI/样式/Schema 类 issue 后的默认验证命令** |
| 全量构建（发版前或不确定影响范围时） | `yarn build` | 等价于 `lerna run build`，耗时较长 |
| 联调本地 Steedos 时启动文件监听 | `yarn watch` | `lerna run watch --parallel`，配合 `yarn unpkg` 使用 |
| 本地 unpkg 资产服务（端口 8080） | `yarn unpkg` | Steedos 项目设置 `STEEDOS_PUBLIC_PAGE_ASSETURLS=http://127.0.0.1:8080/@steedos-widgets/<pkg>/dist/assets.json` 即可加载本地构建产物 |
| **手机真机通过局域网 IP 访问验证** | `STEEDOS_UNPKG_URL=http://<局域网IP>:8080 yarn build`（首次）/ `yarn build-object`（增量） | 必须带 `STEEDOS_UNPKG_URL` 环境变量，否则 `assets-dev.json` 内部 URL 指向 `127.0.0.1`，手机加载不到资源。**详细步骤参见仓库根目录的 `MOBILE_TESTING.md`，遇到真机测试需求请先阅读该文档** |

**禁止做法**：
- ❌ 不要进入 `packages/@steedos-widgets/<pkg>/` 后执行 `yarn build:rollup` 之类的子命令。
  这些是包内部脚本，跳过了 Lerna 拓扑排序，可能导致依赖包未先构建而出现版本不一致。
- ❌ 不要手动修改 `dist/` 下的产物来"快速验证"，必须改源码后通过 `yarn build-object` 重新生成。

**验证流程（修完 UI 类 bug 后必做）**：
1. 改源码（`src/` 下的 `.tsx` / `.less` / `.ts`）。
2. 在仓库根执行 `yarn build-object`（手机真机场景需带 `STEEDOS_UNPKG_URL`，见上表与 `MOBILE_TESTING.md`）。
3. 按原 issue 的复现路径打开页面，**禁用浏览器缓存后硬刷新**（Chrome DevTools → Network → 勾选 `Disable cache`，保持 DevTools 打开后 `Cmd/Ctrl+Shift+R`）。unpkg 静态资源 URL 写在 `assets.json` 里，手工拼 `?_t=时间戳` 没用，必须靠浏览器禁用缓存来强制重新拉取。
4. 同一个 issue 在不同 form factor 下表现可能不同（很多 UI bug 只在窄屏或某种布局下出现），所以验证时三栏 PC 模式（`?display=split` 或将浏览器宽度调到能触发三栏布局）和手机端（Chrome DevTools 设备模拟到 iPhone SE 等小屏，或真机走 `MOBILE_TESTING.md`）都要各看一遍。

## Code Standards

- Use TypeScript for all source files
- Use async/await (not callbacks)
- Follow existing code patterns in the file you're modifying
- Keep amis JSON schema generation readable (the schema objects can be very large)
- Use lodash (`_`) for utility operations (already imported in most files)

## 注释与提交说明语言

- **代码注释一律使用简体中文**，包括 `//` 行注释、`/** */` JSDoc、`console.warn` / `console.debug` 中的提示文案。
- **commit message、PR 标题与描述均使用简体中文**；commit 标题保留 Conventional Commit 前缀（如 `fix:`、`feat:`），冒号后正文用中文。
- 仅以下内容可使用英文：标识符（变量名、函数名、类型名、文件名）、第三方 API 字段名、错误码、URL、命令示例。
- 引用 issue / PR 时使用 `仓库#编号` 形式（例如 `steedos/steedos-plugins#668`），保证跨仓库链接可点击。
- 修改既有英文注释时，如顺手可改为中文；不要为了改语言而批量重写无关代码。