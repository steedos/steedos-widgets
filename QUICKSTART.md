# 快速开始指南

本指南将帮助你在 5 分钟内开始使用改进后的开发工作流。

## 📋 前置要求

- Node.js 18.x
- Yarn 包管理器
- 一个正在运行的华炎魔方项目

## 🚀 快速开始（三步完成）

### 第一步：安装依赖

```bash
cd steedos-widgets
yarn install
```

### 第二步：启动开发服务器

```bash
yarn dev
```

你将看到：
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

### 第三步：配置华炎魔方项目

在你的华炎魔方项目根目录的 `.env.local` 文件中添加：

```bash
STEEDOS_PUBLIC_PAGE_ASSETURLS=http://127.0.0.1:8080/@steedos-widgets/amis-object/dist/assets-dev.json
```

然后重启你的华炎魔方项目。

## ✅ 验证配置

### 1. 检查资产包是否可访问

在浏览器中打开：
```
http://localhost:8080/@steedos-widgets/amis-object/dist/assets-dev.json
```

如果能看到 JSON 配置，说明 unpkg 服务器正常工作。

### 2. 检查自动编译是否工作

1. 修改任意组件源文件（如 `packages/@steedos-widgets/amis-object/src/index.ts`）
2. 观察控制台输出，应该能看到类似：
   ```
   [amis-object] → Start
   [amis-object] → End
   ```
3. 刷新华炎魔方项目中使用该组件的页面，应该能看到变化

## 💡 常用开发场景

### 场景 1：开发新组件

```bash
# 1. 启动开发服务器
yarn dev

# 2. 在 packages/@steedos-widgets/你的组件/src 下开发

# 3. 保存文件后自动编译

# 4. 刷新浏览器查看效果
```

### 场景 2：调试现有组件

```bash
# 1. 启动开发服务器
yarn dev

# 2. 修改组件代码

# 3. 观察控制台编译输出

# 4. 刷新浏览器测试
```

### 场景 3：仅开发特定组件

如果你只想开发某个特定组件，可以：

```bash
# 终端 1: 启动 unpkg 服务器
yarn unpkg

# 终端 2: 只监听特定包
cd packages/@steedos-widgets/amis-object
yarn watch
```

## 🔧 常见问题解决

### Q: 端口 8080 被占用？

**解决方案：** 使用其他端口

```bash
PORT=3000 yarn dev
```

记得同时更新 `STEEDOS_PUBLIC_PAGE_ASSETURLS` 中的端口号：
```bash
STEEDOS_PUBLIC_PAGE_ASSETURLS=http://127.0.0.1:3000/@steedos-widgets/amis-object/dist/assets-dev.json
```

### Q: 修改代码后没看到变化？

**检查清单：**
1. ✅ 开发服务器是否在运行？
2. ✅ 控制台是否显示编译成功？
3. ✅ 浏览器是否已刷新？（试试 Ctrl+Shift+R 强制刷新）
4. ✅ 环境变量是否正确配置？

### Q: 编译报错怎么办？

**解决步骤：**
1. 查看控制台的详细错误信息
2. 检查 TypeScript 语法错误
3. 确保依赖已正确安装
4. 尝试清理并重新编译：
   ```bash
   # 停止开发服务器 (Ctrl+C)
   cd packages/@steedos-widgets/你的包名
   yarn prebuild  # 清理 dist 目录
   cd ../../..
   yarn dev       # 重新启动
   ```

### Q: 如何停止开发服务器？

按 `Ctrl + C` 即可停止。

## 📚 进一步学习

- **详细开发指南**: 查看 [DEVELOPMENT.md](./DEVELOPMENT.md)
- **项目文档**: 查看 [README.md](./README.md)
- **组件开发**: 查看各包的 README.md

## 🎯 开发工作流对比

### 改进前（旧方式）

```bash
# 1. 编译代码
yarn build

# 2. 启动服务器
yarn unpkg

# 3. 修改代码后...
# 4. 停止服务器 (Ctrl+C)
# 5. 重新编译
yarn build
# 6. 重新启动服务器
yarn unpkg
# 7. 刷新浏览器

# 每次修改都要重复步骤 3-7 😫
```

### 改进后（新方式）

```bash
# 1. 一次性启动
yarn dev

# 2. 修改代码
# 3. 自动编译 ✨
# 4. 刷新浏览器

# 享受自动化！ 🎉
```

**效率提升**: 
- ⏱️ 节省时间：每次修改节省 30-60 秒
- 🎯 专注编码：无需手动编译
- 😊 更好体验：即改即看

## 🌟 最佳实践

1. **保持开发服务器运行** - 在整个开发会话中只启动一次
2. **使用 Git 分支** - 为每个功能创建新分支
3. **频繁测试** - 每次小改动后都测试
4. **观察控制台** - 注意编译警告和错误
5. **清理浏览器缓存** - 遇到问题时使用强制刷新

## 🤝 获取帮助

遇到问题？

- 查看 [DEVELOPMENT.md](./DEVELOPMENT.md) 获取详细说明
- 在 GitHub Issues 中搜索类似问题
- 提交新的 Issue 描述你的问题

---

**开始编码吧！** 🚀

记住：`yarn dev` 就是你需要的全部！
