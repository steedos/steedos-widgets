# 开发指南 / Development Guide

本文档提供了详细的开发指南，帮助开发者更高效地使用本项目。

This document provides detailed development guidelines to help developers work more efficiently with this project.

## 目录 / Table of Contents

- [快速开始](#快速开始--quick-start)
- [开发工作流](#开发工作流--development-workflow)
- [项目结构](#项目结构--project-structure)
- [常用命令](#常用命令--common-commands)
- [调试技巧](#调试技巧--debugging-tips)
- [常见问题](#常见问题--faq)

---

## 快速开始 / Quick Start

### 环境要求 / Prerequisites

- Node.js 18.x
- Yarn 包管理器

### 安装依赖 / Installation

```bash
yarn install
```

### 启动开发服务器 / Start Development Server

```bash
yarn dev
```

这将启动：
- 本地 unpkg 服务器 (http://localhost:8080)
- 自动监听模式（文件变化时自动重新编译）

This will start:
- Local unpkg server (http://localhost:8080)
- Auto-watch mode (auto-recompile on file changes)

---

## 开发工作流 / Development Workflow

### 推荐工作流 / Recommended Workflow

1. **启动开发服务器**
   ```bash
   yarn dev
   ```

2. **配置华炎魔方环境变量**
   
   在你的华炎魔方项目中设置：
   ```bash
   STEEDOS_PUBLIC_PAGE_ASSETURLS=http://127.0.0.1:8080/@steedos-widgets/amis-object/dist/assets-dev.json
   ```

3. **开始开发**
   - 修改 `packages/@steedos-widgets/*/src` 下的源代码
   - 保存文件后自动重新编译
   - 刷新浏览器查看更改

4. **查看编译状态**
   - 开发服务器控制台会显示编译进度和结果
   - 检查是否有编译错误

### 传统工作流 / Traditional Workflow

如果需要手动控制编译过程：

```bash
# 编译所有包
yarn build

# 启动 unpkg 服务器
yarn unpkg
```

---

## 项目结构 / Project Structure

```
steedos-widgets/
├── apps/                           # 应用程序
│   ├── builder6/                   # Builder6 应用
│   ├── experience/                 # Experience 应用
│   └── storybook/                  # Storybook 演示
├── packages/                       # 包目录
│   └── @steedos-widgets/          # Steedos Widgets 包
│       ├── amis-lib/              # Amis 库
│       ├── amis-object/           # Amis 对象组件
│       ├── fullcalendar/          # 日历组件
│       ├── reactflow/             # 流程图组件
│       ├── sortable/              # 排序组件
│       └── ...                    # 其他组件
├── dev-server.js                  # 开发服务器（推荐）
├── unpkg-local.js                 # 传统 unpkg 服务器
├── package.json                   # 根包配置
└── lerna.json                     # Lerna 配置
```

### 包结构 / Package Structure

每个组件包的典型结构：

```
@steedos-widgets/[component-name]/
├── src/                           # 源代码
│   ├── index.ts                   # 入口文件
│   ├── meta.ts                    # 组件元数据
│   ├── assets.json                # 资产配置
│   └── components/                # React 组件
├── dist/                          # 编译输出（自动生成）
│   ├── [component].umd.js         # UMD 格式
│   ├── [component].umd.css        # 样式文件
│   ├── meta.js                    # 元数据文件
│   ├── assets.json                # 生产资产配置
│   └── assets-dev.json            # 开发资产配置
├── package.json                   # 包配置
├── rollup.config.ts               # Rollup 配置
└── tsconfig.json                  # TypeScript 配置
```

---

## 常用命令 / Common Commands

### 开发相关 / Development

```bash
# 启动开发服务器（推荐）
yarn dev

# 启动传统 unpkg 服务器
yarn unpkg

# 监听所有包的变化
yarn watch

# 启动 Storybook
yarn start
```

### 构建相关 / Build

```bash
# 构建所有包
yarn build

# 构建对象包
yarn build-object

# 构建应用包
yarn build-app

# 清理并重新构建特定包
cd packages/@steedos-widgets/[package-name]
yarn prebuild && yarn build
```

### Lerna 命令 / Lerna Commands

```bash
# 在特定包中运行命令
lerna run [command] --scope=@steedos-widgets/[package-name]

# 示例：只监听 amis-object 包
lerna run watch --scope=@steedos-widgets/amis-object

# 在所有包中并行运行命令
lerna run [command] --parallel

# 发布包到 npm
lerna publish
```

---

## 调试技巧 / Debugging Tips

### 1. 检查开发服务器状态

开发服务器启动后，你应该看到：

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  🚀 Steedos Widgets Development Server Started                ║
║                                                                ║
║  📦 Unpkg Server: http://localhost:8080                        ║
║  👀 Watch Mode: Active (auto-rebuild on file changes)         ║
║  ...                                                           ║
╚════════════════════════════════════════════════════════════════╝
```

### 2. 验证资产包可访问性

在浏览器中访问：
```
http://localhost:8080/@steedos-widgets/amis-object/dist/assets-dev.json
```

应该能看到 JSON 配置文件。

### 3. 查看编译日志

开发服务器会显示每个包的编译状态：
```
[amis-object] → Start
[amis-object] → End
```

### 4. 调试特定包

如果只需要调试某个包，可以单独启动它的 watch 模式：

```bash
cd packages/@steedos-widgets/[package-name]
yarn watch
```

然后在另一个终端启动 unpkg 服务器：
```bash
yarn unpkg
```

### 5. 使用浏览器开发工具

1. 打开浏览器开发者工具
2. 检查 Network 标签，确认资源是否正确加载
3. 检查 Console 标签，查看 JavaScript 错误
4. 使用 Source Maps 调试 TypeScript 源代码

---

## 常见问题 / FAQ

### Q1: 修改代码后没有看到变化？

**检查清单：**
- [ ] 开发服务器是否正在运行？(`yarn dev`)
- [ ] 控制台是否显示编译成功？
- [ ] 浏览器是否已刷新？
- [ ] 浏览器缓存是否已清除？(Ctrl+Shift+R 强制刷新)
- [ ] 环境变量 `STEEDOS_PUBLIC_PAGE_ASSETURLS` 是否正确？

### Q2: 编译失败怎么办？

**解决步骤：**
1. 查看控制台错误信息
2. 检查 TypeScript 类型错误
3. 确认所有依赖已安装 (`yarn install`)
4. 删除 `dist` 文件夹后重新编译
5. 检查 `rollup.config.ts` 配置

### Q3: 如何添加新的组件包？

1. 在 `packages/@steedos-widgets/` 下创建新文件夹
2. 复制现有包的 `package.json`、`rollup.config.ts` 等配置文件
3. 修改包名和相关配置
4. 运行 `yarn install` 安装依赖
5. 开始开发

### Q4: 端口 8080 已被占用？

设置环境变量使用其他端口：
```bash
PORT=3000 yarn dev
```

然后更新 `STEEDOS_PUBLIC_PAGE_ASSETURLS` 中的端口号。

### Q5: 如何在 Gitpod 中开发？

Gitpod 会自动生成公开 URL，配置示例：
```bash
STEEDOS_PUBLIC_PAGE_ASSETURLS=https://8080-[workspace-id].ws-[region].gitpod.io/@steedos-widgets/amis-object/dist/assets-dev.json
```

### Q6: 开发模式和传统方式的区别？

| 特性 | 开发模式 (`yarn dev`) | 传统方式 (`yarn build`) |
|------|----------------------|------------------------|
| 自动编译 | ✅ 是 | ❌ 否 |
| 需要手动重新编译 | ❌ 否 | ✅ 是 |
| 启动命令数 | 1 个 | 2 个 |
| 适用场景 | 频繁修改代码 | 一次性打包/CI |
| 资源占用 | 较高 | 较低 |

### Q7: 如何发布新版本？

```bash
# 1. 确保所有更改已提交
git add .
git commit -m "your message"

# 2. 使用 lerna 发布
lerna publish

# 3. 选择版本号（patch/minor/major）
# 4. Lerna 会自动推送 tag 和发布到 npm
```

### Q8: 如何处理依赖冲突？

```bash
# 清理所有依赖
rm -rf node_modules
rm -rf packages/*/node_modules
rm yarn.lock

# 重新安装
yarn install
```

---

## 最佳实践 / Best Practices

### 代码规范 / Code Standards

1. **使用 TypeScript** - 所有新代码应使用 TypeScript
2. **遵循现有模式** - 参考现有组件的结构和命名
3. **添加类型定义** - 为所有公共 API 添加类型
4. **编写文档** - 为新功能添加 README 和注释

### 性能优化 / Performance

1. **按需导入** - 使用 tree-shaking 减小包体积
2. **外部依赖** - React、lodash 等通用库设为 external
3. **代码分割** - 大型组件考虑代码分割
4. **压缩优化** - 生产环境使用 terser 压缩

### 测试建议 / Testing

1. **本地测试** - 在发布前在本地华炎魔方项目中测试
2. **多浏览器测试** - 检查主流浏览器兼容性
3. **版本测试** - 测试与不同 amis 版本的兼容性

---

## 获取帮助 / Getting Help

- **问题反馈**: 在 GitHub Issues 中提交
- **文档**: 查看各包的 README.md
- **示例**: 参考 `apps/storybook` 中的示例

---

## 贡献指南 / Contributing

欢迎贡献！提交 Pull Request 前请确保：

1. 代码通过 lint 检查
2. 所有测试通过
3. 已添加必要的文档
4. 提交信息清晰明确

---

**最后更新**: 2024-01-09
