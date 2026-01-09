Steedos 前端资产包
===

> 💡 **新功能**: 现在支持自动重新编译！运行 `yarn dev` 即可启动开发服务器，无需每次手动 build。
> 
> 📖 查看 [快速开始指南](./QUICKSTART.md) | [完整开发文档](./DEVELOPMENT.md)

## 快速开始

> 运行此项目应使用 Nodejs 18.x 版本。

### 方式一：开发模式（推荐）

使用开发模式可以自动监听文件变化并重新编译，无需手动执行 `yarn build`。

```bash
yarn
yarn dev
```

该命令会自动完成以下操作：
1. 启动 unpkg 本地服务（端口 8080）
2. 启动所有包的 watch 模式，自动监听并编译源代码变化
3. 当你修改源代码时，自动重新编译

然后在华炎魔方项目中配置环境变量：

```shell
# 资产包地址，需要配置为unpkg服务中assets-dev.json文件访问地址。
STEEDOS_PUBLIC_PAGE_ASSETURLS=http://127.0.0.1:8080/@steedos-widgets/amis-object/dist/assets-dev.json
```

Gitpod 运行时环境变量配置示例：
```
STEEDOS_PUBLIC_PAGE_ASSETURLS=https://8080-steedos-steedoswebappne-pm96cp6i82c.ws-us73.gitpod.io/@steedos-widgets/amis-object/dist/assets-dev.json
```

### 方式二：传统方式

如果你更喜欢手动控制编译过程，可以使用传统方式：

#### 编译资产包

```bash
yarn
yarn build
```

该命令会自动执行`packages`下每个项目的build指令编译打包。

#### 启动unpkg服务

```bash
yarn unpkg
```

执行该命令可以把packages下的文件，即资产包文件公开为静态资源，可通过8080访问。

下面的Experience Webapp和storybook都依赖了该服务，每次修改packages下的源代码后需要手动执行 `yarn build` 编译资产包，这样8080端口公开的才是最新修改后的资产包内容。

启动远程开发环境会自动启动该服务。

### 调试资产包

在华炎魔方服务端，配置以下环境变量，可以将资产包指向开发环境：

```shell
# 资产包地址，需要配置为unpkg服务中assets-dev.json文件访问地址。
STEEDOS_PUBLIC_PAGE_ASSETURLS=http://127.0.0.1:8080/@steedos-widgets/amis-object/dist/assets-dev.json
```

Gitpod运行时环境变量配置示例：
```
STEEDOS_PUBLIC_PAGE_ASSETURLS=https://8080-steedos-steedoswebappne-pm96cp6i82c.ws-us73.gitpod.io/@steedos-widgets/amis-object/dist/assets-dev.json
```

## 开发建议

### 推荐的开发工作流

1. **一次性启动**：运行 `yarn dev` 启动开发服务器
2. **专注编码**：直接修改 `packages/@steedos-widgets/*/src` 下的源代码
3. **自动编译**：保存文件后，系统会自动重新编译
4. **即时测试**：刷新浏览器即可看到更新（已配置 `STEEDOS_PUBLIC_PAGE_ASSETURLS` 的华炎魔方项目）

### 常见问题

**Q: 为什么修改代码后没有看到变化？**
A: 请检查：
1. 开发服务器是否正在运行（`yarn dev`）
2. 控制台是否显示编译成功
3. 浏览器是否已刷新页面
4. `STEEDOS_PUBLIC_PAGE_ASSETURLS` 环境变量是否正确配置

**Q: 如何只编译特定的包？**
A: 可以使用 `lerna` 命令，例如：
```bash
lerna run watch --scope=@steedos-widgets/amis-object
```

**Q: 开发模式和传统方式有什么区别？**
A: 
- **开发模式** (`yarn dev`)：自动监听文件变化并重新编译，适合频繁修改代码
- **传统方式** (`yarn build` + `yarn unpkg`)：手动控制编译，适合一次性打包或 CI/CD

## 技术架构

本项目使用以下技术栈：
- **Lerna**: 管理多包仓库
- **Rollup**: 打包各个组件为 UMD 格式
- **TypeScript**: 类型安全的开发体验
- **Watch Mode**: 自动监听源代码变化
- **Local Unpkg Server**: 本地模拟 unpkg.com 服务
