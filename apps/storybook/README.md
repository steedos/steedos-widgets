
# 启动 storybook

这是一个前端组件示例项目，对应stories目录。

启动远程开发环境会自动配置相关环境变量并启动该服务。

#### 环境变量配置

需要在根目录文件`.env.local`中配置环境变量：
```
STEEDOS_PUBLIC_PAGE_ASSETURLS=http://127.0.0.1:8080/@steedos-widgets/amis-object/dist/assets-dev.json
``` 

#### 启动
```
cd apps/storybook
yarn storybook
```

修改storybook本身的示例代码并不需要停止服务并执行`yarn storybook`重启，但是修改了资产包源码，即`packages`文件夹下的源码需要执行yarn build来重新编译资产包。

