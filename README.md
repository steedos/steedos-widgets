## NextJS Web App for Steedos

### 目录说明

- `apps/experience`：新版本Steedos UI项目，这是一个独立的NextJS项目，依赖了资产包及华炎魔方服务。
- `packages/@steedos-widgets`：资产包，目前只有@steedos-widgets这一个资产包，可以新建文件夹添加其他资产包。
- `steedos-ee`：华炎魔方服务，包括原生Web UI及服务端接口。
- `stories`：前端组件示例项目，这是一个storyook服务。

### 编译资产包

```
yarn build
```

该命令会自动执行`packages`下每个项目的build指令编译打包。

### 启动unpkg服务

```
yarn unpkg
```

执行该命令可以把packages下的文件公开为静态资源，可通过8080访问。

启动远程开发环境会自动启动该服务。

### 启动 Experience Webapp

对应目录`apps/experience`，是一个NextJS服务。

启动远程开发环境会自动配置相关环境变量并启动该服务。

#### 环境变量配置

需要在文件`apps/experience/.env.local`中配置环境变量：
```
STEEDOS_EXPERIENCE_URL=NextJS服务地址。
NEXTAUTH_URL=NextJS登录验证接口地址，需要配置为NextJS服务地址。
STEEDOS_ROOT_URL=NextJS依赖的魔方后台服务地址，需要配置为华炎魔方ROOT_URL.
STEEDOS_EXPERIENCE_ASSETURLS=资产包地址。
```

以下是环境变量配置示例：
```
STEEDOS_EXPERIENCE_URL=https://3000-steedos-steedoswebappne-pm96cp6i82c.ws-us73.gitpod.io
NEXTAUTH_URL=https://3000-steedos-steedoswebappne-pm96cp6i82c.ws-us73.gitpod.io
STEEDOS_ROOT_URL=https://5000-steedos-steedoswebappne-pm96cp6i82c.ws-us73.gitpod.io
STEEDOS_EXPERIENCE_ASSETURLS=https://8080-steedos-steedoswebappne-pm96cp6i82c.ws-us73.gitpod.io/@steedos-widgets/amis-object/dist/assets-dev.json
``` 

#### 启动服务

```
yarn dev
```
该指令可以启动NextJS项目开发模式，需要注意的事，当改动`packages`下的源码时需要执行`yarn build`重新编译。


### 启动 storybook

这是一个前端组件示例项目，对应stories目录。
```
yarn storybook
```

