# Liveblocks

Liveblocks is the platform for adding collaborative editing, comments, and notifications into your application.

https://github.com/liveblocks/liveblocks

## 测试资产包

启动 资产包测试 服务

```shell
cd apps/builder6
yarn
yarn dev
```

浏览器访问： http://localhost:5173/?assetUrls=http://127.0.0.1:8080/@steedos-widgets/liveblocks/dist/assets-dev.json

输入以下amis schema测试：

```json
{
  "type": "rooms-provider",
  "baseUrl": "${context.rootUrl}",
  "body": [
    {
      "type": "rooms-comments",
      "className": "flex flex-col m-3 gap-3",
      "roomId": "test",
    }
  ]
}
```

集成到Steedos记录详情页

```json
{
  "type": "rooms-provider",
  "baseUrl": "${context.rootUrl}",
  "body": [
    {
      "type": "rooms-comments",
      "className": "flex flex-col m-3 gap-3",
      "roomId": "objects:${objectName}:{recordId}",
    }
  ]
}
```


## Steedos 加载资产包

```
STEEDOS_WIDGETS_ADDITIONAL=@steedos-widgets/liveblocks
```