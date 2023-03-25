/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-01 15:49:58
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-03-25 17:22:00
 * @Description:
 */

import { getPage } from '../lib/page'

export const getSchema = async (uiSchema, ctx) => {
  const title = "编辑 " + uiSchema.label;

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

  return {
    type: "service",
    body: [
      {
        type: "button",
        label: "编辑",
        id: "u:standard_edit",
        onEvent: {
          click: {
            actions: [
              {
                actionType: "dialog",
                dialog: {
                  type: "dialog",
                  "data": {
                    "&": "$$",
                    "$master": "$$"
                  },
                  title: title,
                  bodyClassName: "",
                  body: [formSchema],
                  id: "u:ee95697baa4f",
                  closeOnEsc: false,
                  closeOnOutside: false,
                  showCloseButton: true,
                  size: "lg",
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
