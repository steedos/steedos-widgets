## NextJS Web App for Steedos

### 目录说明

- `apps/experience`：新版本Steedos UI项目，这是一个独立的NextJS项目，依赖了资产包及华炎魔方服务。
- `packages/@steedos-widgets`：资产包，目前只有@steedos-widgets这一个资产包，可以新建文件夹添加其他资产包。
- `steedos-ee`：华炎魔方服务，包括原生Web UI及服务端接口。
- `stories`：前端组件示例项目，这是一个storyook服务。

### 启动魔方服务

需要先配置以下环境变量：

```
ROOT_URL=魔方访问地址。
STEEDOS_PUBLIC_PAGE_ASSETURLS=资产包地址，需要配置为unpkg服务中assets-dev.json文件访问地址。
```

以下是环境变量配置示例：
```
ROOT_URL=https://5000-steedos-steedoswebappne-pm96cp6i82c.ws-us73.gitpod.io
STEEDOS_PUBLIC_PAGE_ASSETURLS=https://8080-steedos-steedoswebappne-pm96cp6i82c.ws-us73.gitpod.io/@steedos-widgets/amis-object/dist/assets-dev.json
```

可以通过执行以下指令来启动Docker下的魔方服务：

```
cd steedos-ee
docker-compose up
```

启动远程开发环境会自动配置相关环境变量并启动该服务。

### 编译资产包

```
yarn build
```

该命令会自动执行`packages`下每个项目的build指令编译打包。

### 启动unpkg服务

```
yarn unpkg
```

执行该命令可以把packages下的文件，即资产包文件公开为静态资源，可通过8080访问。

下面的Experience Webapp和storybook都依赖了该服务，每次修改packages下的源代码后需要手动执行 `yarn build` 编译资产包，这样8080端口公开的才是最新修改后的资产包内容。

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
STEEDOS_EXPERIENCE_ASSETURLS=资产包地址，需要配置为unpkg服务中assets-dev.json文件访问地址。
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

该指令可以启动NextJS项目开发模式，需要注意的事，修改`apps/experience`文件夹本身的代码码并不需要停止服务并执行`yarn dev`来重启，因为它会自动监测代码改动并热启动，但是修改了资产包源码，即`packages`文件夹下的源码需要执行`yarn build`来重新编译资产包。


当改动`packages`下的源码时需要执行`yarn build`重新编译。


### 启动 storybook

这是一个前端组件示例项目，对应stories目录。

启动远程开发环境会自动配置相关环境变量并启动该服务。

#### 环境变量配置

需要在根目录文件`.env.local`中配置环境变量：
```
STEEDOS_UNPKG_URL=unpkg服务地址，需要配置为unpkg服务地址。
STEEDOS_ROOT_URL=魔方后台服务地址，需要配置为华炎魔方ROOT_URL.
STEEDOS_EXPERIENCE_ASSETURLS=资产包地址，需要配置为unpkg服务中assets-dev.json文件访问地址。
```

以下是环境变量配置示例：
```
STEEDOS_UNPKG_URL=https://8080-steedos-steedoswebappne-pm96cp6i82c.ws-us73.gitpod.io
STEEDOS_ROOT_URL=https://5000-steedos-steedoswebappne-pm96cp6i82c.ws-us73.gitpod.io
STEEDOS_EXPERIENCE_ASSETURLS=https://8080-steedos-steedoswebappne-pm96cp6i82c.ws-us73.gitpod.io/@steedos-widgets/amis-object/dist/assets-dev.json
``` 

#### 启动
```
yarn storybook
```

修改storybook本身的示例代码并不需要停止服务并执行`yarn storybook`重启，但是修改了资产包源码，即`packages`文件夹下的源码需要执行yarn build来重新编译资产包。


### @steedos-labs/experience版本发布

1. 拉取最新代码后，在最外层目录执行yarn build编译；

2. 编译完成后，进入apps/experience文件夹，执行yarn build-app进行编译；

3. 编译完成后，执行yarn start进行环境测试；

4. 环境测试正常后，修改apps/experience文件夹下package.json文件@steedos-labs/experience软件包版本号；

5. 登录npm后，执行yarn release进行发包。


### 资产包发布版本

- latest: 切换分支到master,并执行以下命令
```
version:latest
publish:latest
```
- beta: 切换分支到dev,并执行以下命令
```
version:beta
publish:beta
```