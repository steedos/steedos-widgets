<!--
 * @Author: yinlianghui yinlianghui@hotoa.com
 * @Date: 2026-03-19 15:20:40
 * @LastEditors: yinlianghui yinlianghui@hotoa.com
 * @LastEditTime: 2026-03-19 15:22:29
-->
# 手机真机访问本地开发环境配置指南

## 问题背景

手机通过局域网 IP 访问 Mac 上的 Steedos 开发服务时，`assets-dev.json` 内部的 JS/CSS 资源 URL 默认为 `http://127.0.0.1:8080`，手机上 `127.0.0.1` 指向手机自身，导致资源加载失败、页面报错：

```
null is not an object (evaluating 'uiSchema.list_views')
```

## 配置步骤

> 以下假设 Mac 局域网 IP 为 `192.168.0.155`，请按实际情况替换。

### 1. 配置 `steedos-plugins/.env.local`

确保 `ROOT_URL` 和 `STEEDOS_PUBLIC_PAGE_ASSETURLS` 使用局域网 IP：

```env
ROOT_URL=http://192.168.0.155:5100
STEEDOS_PUBLIC_PAGE_ASSETURLS=http://192.168.0.155:8080/@steedos-widgets/antd/dist/assets-dev.json,http://192.168.0.155:8080/@steedos-widgets/amis-object/dist/assets-dev.json,http://192.168.0.155:8080/@steedos-widgets/fullcalendar-scheduler/dist/assets-dev.json
```

### 2. 重新构建资产包

构建时**必须内联指定 `STEEDOS_UNPKG_URL`**，否则 `assets-dev.json` 内部资源 URL 仍指向 `127.0.0.1`：

```bash
cd steedos-widgets-6_10

# 构建 amis-object + amis-lib
STEEDOS_UNPKG_URL=http://192.168.0.155:8080 yarn build-object

# 构建 antd
STEEDOS_UNPKG_URL=http://192.168.0.155:8080 yarn lerna run build --scope=@steedos-widgets/antd

# 构建 fullcalendar-scheduler
STEEDOS_UNPKG_URL=http://192.168.0.155:8080 yarn lerna run build --scope=@steedos-widgets/fullcalendar-scheduler
```

### 3. 启动服务

```bash
# 终端 1：widgets dev server（端口 8080）
cd steedos-widgets-6_10 && yarn unpkg

# 终端 2：Steedos 服务（端口 5100）
cd steedos-plugins && yarn start
```

### 4. 手机访问

在手机浏览器中打开 `http://192.168.0.155:5100`

## 注意事项

| 事项 | 说明 |
|------|------|
| **环境变量位置** | `STEEDOS_UNPKG_URL` 不能放在 `steedos-widgets-6_10/.env.local`，rollup 的 `dotenv-flow` 从子包目录加载，读不到根目录 |
| **持久化方案** | 可在 `~/.zshrc` 中 `export STEEDOS_UNPKG_URL=http://192.168.0.155:8080`，对本机开发无负面影响 |
| **恢复本机模式** | 不带 `STEEDOS_UNPKG_URL` 重新 build 即可恢复为 `127.0.0.1` |
| **不涉及源码** | `dist/` 是构建产物，不提交 git，无需改任何代码 |
| **IP 变更** | 局域网 IP 变更后需重复以上步骤 |

## 原理说明

`assets-dev.json` 由 rollup 构建时通过 `rollup.config.ts` 中的 `generateBundle` 钩子生成，它将 `assets.json` 中的 `https://unpkg.com` 替换为 `STEEDOS_UNPKG_URL` 环境变量的值（默认 `https://unpkg.com`，本地开发时应设为 `http://127.0.0.1:8080` 或局域网 IP）。

平台加载流程：
1. 前端从后端 API 获取 `STEEDOS_PUBLIC_PAGE_ASSETURLS`（即 `assets-dev.json` 的地址）
2. 用 `fetch` 加载 `assets-dev.json`
3. 解析 JSON 中的 `urls` 字段，动态创建 `<script>` 标签加载 JS bundle
4. 如果 JS bundle URL 中的主机地址不可达（如手机上的 `127.0.0.1`），加载失败，组件未注册，页面报错
