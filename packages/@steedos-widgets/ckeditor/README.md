# CKEditor

CKEditor 5 provides every type of WYSIWYG editing solution imaginable. From editors similar to Google Docs and Medium to Slack or Twitter-like applications, all is possible within a single editing framework. It is an ultra-modern JavaScript rich-text editor with MVC architecture, custom data model, and virtual DOM, written from scratch in TypeScript with excellent webpack and Vite support. Find out the most convenient way to start using it!


https://github.com/ckeditor/ckeditor

## 许可证

此资产包使用 CKEditor 企业版功能，使用此资产包需要先购买许可证。

## 开发环境加载资产包

```
STEEDOS_PUBLIC_PAGE_ASSETURLS=http://127.0.0.1:8080/@steedos-widgets/amis-object/dist/assets-dev.json,http://127.0.0.1:8080/@steedos-widgets/ckeditor/dist/assets-dev.json
```

## 生产环境加载资产包

```shell
STEEDOS_WIDGETS_ADDITIONAL=@steedos-widgets/ckeditor
STEEDOS_WIDGETS_VERSION=3.6.11-beta.3
```

## 启用 ckeditor

创建富文本类型字段，配置字段 amis 属性，启用 ckeditor 或 ckeditor-commercial，如果是商业版，需要配置 licenseKey 。

```
{
  "type": "ckeditor-commercial",
  "config": {
    "licenseKey": "UEg5WEh3R3ZaL2EwLzZBY1dHSGR5NGhMVCtNYUVHQStwZTFoM0VRVzNlN2h5YWRtcHJmWXk3RDZoU0hmLU1qQXlOREExTURNPQ=="
  }
}
```