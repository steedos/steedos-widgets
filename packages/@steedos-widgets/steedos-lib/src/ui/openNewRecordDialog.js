/*
 * @Author: 廖大雪 2291335922@qq.com
 * @Date: 2023-03-01 14:18:08
 * @LastEditors: 廖大雪 2291335922@qq.com
 * @LastEditTime: 2023-03-01 15:51:46
 * @FilePath: /steedos-webapp-nextjs/packages/@steedos-widgets/steedos-lib/src/ui/standard_new_custom_script.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export const openNewRecordDialog = (data, doAction) => {
    const appId = data.appId;
    const objectName = data.objectName;
    const label = data.uiSchema.label;
    const isLookup = data.isLookup;
    const page = Steedos.Page.getPage('form', appId, null, null, objectName);

    let formSchema = {
      "type": "steedos-object-form",
      "label": "对象表单",
      "objectApiName": "\${objectName}",
      "recordId": "",
      "mode": "edit",
      "layout": "normal"
    };

    const title = "新建 " + label;
    if (page && page.schema) {
      const pageSchema = JSON.parse(page.schema);
      formSchema = pageSchema.body[0];
      // 设置form的canAccessSuperData属性防止弹出窗口从父级取字段默认值
      formSchema.canAccessSuperData = false;
      // 设置form的wrapWithPanel属性隐藏其底部保存取消按钮
      formSchema.wrapWithPanel = false;
      formSchema.className = "steedos-amis-form";

    }
    if(isLookup){
      formSchema.onEvent = {
            submitSucc: {
                "weight": 0,
                "actions": [
                    {
                        "actionType": "custom",
                        "script": " const scope = event.context.scoped; const listView = scope.parent.parent.parent.parent.getComponents().find(function(n){ return n.props.type === 'crud'; }); listView.reload();"
                    }
                ]
            }
        }
    }
    doAction({
      "actionType": "dialog",
      "dialog": {
        "type": "dialog",
        "title": title,
        "body": [{
          "type": "service",
          "body": [formSchema],
          "data": {
            "$master": "$$",
            "defaultData": "\${defaultData}",
            "appId": "\${appId}",
            "objectName": "\${objectName}",
            "context": "\${context}",
            "global": "\${global}",
            "listViewId": "\${listViewId}",
            "uiSchema": "\${uiSchema}"
          }
        }],
        "size": "lg"
      }
    });
}