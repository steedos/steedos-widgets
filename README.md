Steedos 前端资产包
===

## 快速开始

### 编译资产包

```
yarn
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

### 生产环境启用资产包

```shell
STEEDOS_WIDGETS_ADDITIONAL=@steedos-widgets/ckeditor
STEEDOS_WIDGETS_VERSION=3.6.11-beta.3
```

### 启用 ckeditor

配置字段 amis 属性，启用 ckeditor 或 ckeditor-commercial，如果是商业版，需要配置 licenseKey 。

```
{
  "type": "ckeditor-commercial",
  "config": {
    "licenseKey": "UEg5WEh3R3ZaL2EwLzZBY1dHSGR5NGhMVCtNYUVHQStwZTFoM0VRVzNlN2h5YWRtcHJmWXk3RDZoU0hmLU1qQXlOREExTURNPQ=="
  }
}
```