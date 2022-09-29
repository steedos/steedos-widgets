# Builder Widgets

Adds widgets for Steedos Page editing.

## How to use it

在华炎魔方项目中把开发好并发布到npm仓库的资产包地址配置到环境变量STEEDOS_PUBLIC_PAGE_ASSETURLS中即可。

```bash
STEEDOS_PUBLIC_PAGE_ASSETURLS=https://unpkg.com/@steedos-widgets/example@0.0.4/dist/assets.json
```

资产包的地址只要可以访问即可，它可以是发布到npm的包(unpkg.com)地址，也可以是其他任何可以被当前服务访问的地址，比如在远程开发环境中公开的资产包地址。

示例项目 [with-amis-custom-components](https://github.com/steedos/steedos-examples/tree/main/with-amis-custom-components) 完整演示了如何在魔方项目中引用自定义资产包来实现自定义 amis 组件。

## 资产包开发

资产包最终输出的是一个可访问的静态json文件，一般命名为 `assets.json`。

### 资产包内容

以下是一个引用了自定义组件的资产包内容示例。

```json
// https://unpkg.com/@steedos-widgets/example@0.0.4/dist/assets.json
{
    "packages": [
        {
            "package": "@steedos-widgets/example",
            "urls": [
                "https://unpkg.com/@steedos-widgets/example@0.0.6/dist/example.umd.min.js",
                "https://unpkg.com/@steedos-widgets/example@0.0.6/dist/example.umd.css"
            ],
            "library": "BuilderExample"
        }
    ],
    "components": [
        {
            "exportName": "BuilderExampleWidgetsMeta",
            "npm": {
                "package": "@steedos-widgets/example"
            },
            "url": "https://unpkg.com/@steedos-widgets/example@0.0.6/dist/meta.js",
            "urls": {
                "default": "https://unpkg.com/@steedos-widgets/example@0.0.6/dist/meta.js",
                "design": "https://unpkg.com/@steedos-widgets/example@0.0.6/dist/meta.js"
            }
        }
    ]
}
```

资产包分为组件本身和组件可配置属性(meta.js)两部分的资源地址，可以为它们配置npm包名称以及发布到npm仓库的静态访问地址，如果本地已经安装了npm包的话，默认会直接访问本地安装的npm包中的资源文件，否则将重定向到 `urls` 属性中配置的远程资源文件。

#### 输出自定义组件

在 `packages` 节点配置的是自定义组件资源。
- package: 发布到npm仓库中的包名称。
- urls: 自定义组件发布到npm仓库后的地址，需要使用 [rollupjs](https://rollupjs.org/) 打包为 `umd` 格式的资源文件。
- library: 输出的全局变量名称，可以在`window`下访问到该变量。

#### 输出自定义组件可配置属性

在 `components` 节点配置的是自定义组件在设计器中的可配置属性资源，用于把自定义组件集成到微页面引擎，比如amis中。
- exportName: 输出的全局变量名称，可以在`window`下访问到该变量。
- npm.package: 发布到npm仓库中的包名称。
- url: `meta.js` 发布到npm仓库后的地址，需要使用 [rollupjs](https://rollupjs.org/) 打包为 `umd` 格式的资源文件。
- urls: 同url，区分了设计器和渲染器地址，一般配置为url属性一样的地址。

### 开发

资产包开发主要是需要通过导出配置文件把自定义组件注册到微页面引擎，比如amis中。

本示例中对应的配置文件源码在 `src/metas/Hello.ts`。

关于如何配置相关属性请参考对应的微页面引擎官网文档，比如以下是配置amis引擎时的参考资料：

- https://github.com/aisuda/amis-editor-demo/blob/master/README.md
- https://github.com/aisuda/amis-widget/blob/master/README.md

### 打包

资产包开发最终输出的 `assets.json` 文件中引用的所有静态资源文件都需要打包为umd格式的模块，我们推荐使用工具 [rollupjs](https://rollupjs.org/)。

本示例中只需要执行以下命令即可打包输出相关模块打包后的umd格式文件。

```bash
yarn build
```

### 调式

因为资产包最终输出的静态json文件需要发包到npm仓库后才可以被访问到，这意味着每次改动都需要重新发包才能测试，非常不方便。

所以建议专门输出一个 `assets-dev.json` 文件用于调式，然后使用 `http-server` 这种工具把它公开为静态资源，这样环境变量 `STEEDOS_PUBLIC_PAGE_ASSETURLS` 就可以设置为这个静态资源来测试效果，测试通过后再发版本到npm仓库中。

本示例项目中执行以下指令即可把 `assets-dev.json` 文件公开为可访问的静态资源了。

```bash
yarn http
```

### 发包

开发完成后，请执行 [npm publish](https://docs.npmjs.com/cli/v8/commands/npm-publish) 把打包后的资源文件发布为一个npm包到npm仓库中。

## 组件开发

本示例中开发了一个名为 `Hello` 的组件作为示例说明，为了方便演示示例效果，其源码就放在示例项目的 `src/components` 文件夹中，并且打包脚本会把其源码打包为umd格式的资源文件。

但是我们并不推荐大家在实际项目开发中把组件源码与 widgets 项目源码放在一起，widgets 项目是用来把组件注册到微页面引擎中的，组件本身应该在独立的项目中进行开发、打包和发布，只要最终能像本示例一样通过类似 [rollupjs](https://rollupjs.org/) 的工具打包为umd格式的资源文件即可。