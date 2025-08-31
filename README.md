Steedos 前端资产包
===

## 快速开始

> 运行此项目应使用 Nodejs 18.x 版本。

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



### 在设计器中国际化组件

将组件的meta文件内容以及下面的提示词一起提交给AI, 将AI返回的内容拷贝到meta、locales对应的文件中.
```
帮我使用t函数国际化下这个文件内容. targets、engines不需要国际化. 命名空间是widgets-meta, 前缀使用amis.name值. 使用_连接符, 使用扁平的key,不要嵌套. 最后需要提供i18n的 en.json, zh-CN.json.  我在注册json的时候已经处理了命名空间, json中不需要体现命名空间. 答复结果要完整, 不能出现略. 如果文件中没有定义t函数,则需要你在文件开始添加t函数的定义. const t = (window as any).steedosI18next.t. 使用方式例如t('widgets-meta:xxx', 默认值).  华炎魔方的非中文翻译始终为Steedos
```


