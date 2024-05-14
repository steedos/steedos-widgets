/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-01 15:49:58
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-06-28 23:22:31
 * @Description:
 */
import { i18next } from "../i18n";
import { getPage } from '../lib/page'

export const getSchema = async (uiSchema, ctx) => {
  const title = i18next.t('frontend_form_edit') + " " + uiSchema.label;

  const defaultFormSchema = {
    type: "steedos-object-form",
    label: "对象表单",
    objectApiName: "${objectName}",
    recordId: "${recordId}",
    id: "u:d2b0c083c38f",
    mode: "edit",
  };

  let formSchema = defaultFormSchema;
  const page = await getPage({
    type: "form",
    appId: ctx.appId,
    objectName: ctx.objectName,
    formFactor: ctx.formFactor,
  });

  if (page) {
    formSchema = _.isString(page.schema)
      ? JSON.parse(page.schema)
      : page.schema;
  }
  
  const onDialogCancelScript = `
    // 这里加setTimeout是因为amis的Bug，它会先触发cancel事件执行此脚本关闭父窗口然后再关闭子窗口
    // 正确的顺序应该是先关闭子窗口再关闭父窗口，顺序错了会造成第二次点击编辑按钮的时候异常
    setTimeout(function(){
      doAction({
        "actionType": "cancel",
        "componentId": "object_actions_drawer_${uiSchema.name}"
      });
    }, 200);
  `;

  return {
    type: "service",
    body: [
      {
        type: "button",
        label: i18next.t('frontend_form_edit'),
        id: "u:standard_edit",
        onEvent: {
          click: {
            actions: [
              {
                actionType: "dialog",
                dialog: {
                  type: "dialog",
                  title: title,
                  bodyClassName: "",
                  body: [formSchema],
                  id: "u:ee95697baa4f",
                  closeOnEsc: false,
                  closeOnOutside: false,
                  showCloseButton: true,
                  size: "lg",
                  "onEvent": {
                    "cancel": {
                      "actions": [
                        {
                          "actionType": "custom",
                          "script": onDialogCancelScript,
                          "expression": "${window:innerWidth < 768}",
                        }
                      ]
                    }
                  },
                  "actions": [
                    {
                        type: 'button',
                        actionType: 'cancel',
                        label: i18next.t('frontend_form_cancel')
                    },
                    {
                        type: 'button',
                        actionType: 'confirm',
                        label: i18next.t('frontend_form_save'),
                        primary: true,
                        close: `object_actions_drawer_${uiSchema.name}`
                    },
                  ]
                },
              },
            ],
            weight: 0,
          },
        },
      },
    ],
    regions: ["body"],
    className: "",
    id: "u:3c5cbc0429bb",
  };
};
