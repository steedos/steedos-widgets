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
  "defaultMentionSuggestionsApi": "/api/example/records/${recordId}/mention-users",
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
      "roomId": "objects:${objectName}:${recordId}",
      "readonly": "${true}",
    }
  ]
}
```

`defaultMentionSuggestionsApi` 可选。输入 `@` 且尚未输入关键词时，组件调用该接口并将返回的用户 ID 数组作为默认候选人；输入关键词后仍调用 `/v2/c/users/search` 搜索全部用户。接口可直接返回数组，也可返回 `{ "data": [] }`。

如果配置了 readonly ，隐藏了所有的编辑框和按钮，相当于 

```json
  "showActions": false,
  "showComposer": false
```

rooms-comments 高级控制：

```json
  "indentCommentContent": true,
  "showActions": "hover",   // or false
  "showDeletedComments": false,
  "showResolveAction": true,
  "showReactions": true,
  "showComposer": "collapsed",  // or false
  "showAttachments": true,
  "showComposerFormattingControls": true
```

## Steedos 加载资产包

```
STEEDOS_WIDGETS_ADDITIONAL=@steedos-widgets/liveblocks
```
