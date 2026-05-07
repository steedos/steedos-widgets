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