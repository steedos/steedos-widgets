import { i18next } from "../i18n";

export const getSchema = (uiSchema) => {
  return {
    type: "service",
    body: [
      {
        type: "button",
        label: i18next.t('frontend_import_data'),
        id: "u:import_data",
        onEvent: {
          click: {
            actions: [
              {
                actionType: "dialog",
                dialog: {
                  data: {
                    "&": "$$",
                    "object_name": "${objectName}"
                  },
                  type: "dialog",
                  title: i18next.t('frontend_import_data'),
                  body: [
                    {
                      "type": "steedos-object-form",
                      "label": "对象表单",
                      "objectApiName": "queue_import_history",
                      "recordId": "",
                      "mode": "edit",
                      "layout": "normal",
                      "defaultData":{
                        "object_name": "${objectName}"
                      },
                      "fieldsExtend":{
                        "object_name": {
                          "amis": {
                            "hidden": true
                          }
                        }
                      },
                      "form": {
                        debug: false,
                        resetAfterSubmit: false,
                        initApi: {
                          url: '/api/v1/queue_import_history/${recordId}?fields=["state"]',
                          sendOn: 'this.recordId',
                          responseData: {
                            importState: "${state}"
                          }
                        },
                        interval: 3000,
                        stopAutoRefreshWhen: "this.importState === 'finished'",
                        initFetch: false,
                        onEvent: {
                          inited: {
                            weight: 0,
                            actions: [
                              {
                                "actionType": "broadcast",
                                "args": {
                                  "eventName": `@data.changed.${uiSchema.name}`
                                },
                                "data": {
                                  "objectName": `${uiSchema.name}`,
                                  "displayAs": "${displayAs}",
                                  "recordId": "xxxx" //不可以省略，否则会进入进入记录详细页面
                                },
                                "expression": "this.importState === 'finished'"
                              },
                              {
                                "actionType": "closeDialog",
                                "expression": "this.importState === 'finished'"
                              }
                            ]
                          },
                          submitSucc: {
                            weight: 0,
                            actions: [
                              {
                                args: {
                                  api: {
                                    url: "${context.rootUrl}/api/data/initiateImport",
                                    method: "post",
                                    data: {
                                      eventData: "${event.data}",
                                    },
                                    dataType: "json",
                                    requestAdaptor:
                                      "\napi.data = {\n  importObjectHistoryId: api.body.eventData.result.data.recordId\n}\nreturn api;",
                                    adaptor:
                                      "payload.status = payload.status === 'success' ? 0 : payload.status;\nconsole.log(\"payload ssss==>\", payload)\nreturn payload;",
                                    headers: {
                                      Authorization:
                                        "Bearer ${context.tenantId},${context.authToken}",
                                    },
                                  },
                                  messages: {
                                    success: i18next.t('frontend_import_data_message_success'),
                                    failed: i18next.t('frontend_import_data_message_failed'),
                                  },
                                },
                                actionType: "ajax",
                                expression: "event.data.result",
                              },
                            ],
                          },
                        },
                        closeDialogOnSubmit: false,
                      }
                    }
                  ],
                  id: "u:dc05498d3bd4",
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
        level: "default",
      },
    ],
    regions: ["body"],
    className: "p-0",
    id: "u:bd2f9c4e986f",
  };
};
