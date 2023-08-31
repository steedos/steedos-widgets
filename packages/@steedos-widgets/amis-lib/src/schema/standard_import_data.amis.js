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
                      type: "form",
                      mode: "edit",
                      persistData: false,
                      promptPageLeave: true,
                      name: "form_edit_data_import",
                      debug: false,
                      title: "",
                      submitText: "",
                      initApi: {
                        url: '/api/v1/queue_import_history/${recordId}?fields=["state"]',
                        sendOn: 'this.recordId',
                        responseData: {
                          importState: "${state}",
                        }
                      },
                      interval: 3000,
                      stopAutoRefreshWhen: "this.importState === 'finished'",
                      api: {
                        method: "post",
                        url: "${context.rootUrl}/graphql",
                        data: {
                          objectName: "queue_import_history",
                          $: "$$",
                        },
                        requestAdaptor:
                          "\n        const formData = api.data.$;\n        for (key in formData){\n            // image、select等字段清空值后保存的空字符串转换为null。\n            if(formData[key] === ''){\n                formData[key] = null;\n            }\n        }\n        const objectName = api.data.objectName;\n        const fieldsName = Object.keys(formData);\n        delete formData.created;\n        delete formData.created_by;\n        delete formData.modified;\n        delete formData.modified_by;\n        delete formData._display;\n        delete formData.success_count;\ndelete formData.failure_count;\ndelete formData.total_count;\ndelete formData.start_time;\ndelete formData.end_time;\ndelete formData.state;\ndelete formData.error;\ndelete formData.created;\ndelete formData.created_by;\ndelete formData.modified;\ndelete formData.modified_by;\n        \n        \n        let fileFieldsKeys = [\"file\"];\n        let fileFields = {\"file\":{\"name\":\"file\"}};\n        fileFieldsKeys.forEach((item)=>{\n            let fileFieldValue = formData[item];\n            if(fileFieldValue){\n                // 因为表单初始化接口的接收适配器中为file字段值重写了值及格式（为了字段编辑时正常显示附件名、点击附件名正常下载），所以保存时还原（为了字段值保存时正常保存id）。\n                if(fileFields[item].multiple){\n                    if(fileFieldValue instanceof Array && fileFieldValue.length){\n                        formData[item] = fileFieldValue.map((value)=>{ \n                            if(typeof value === 'object'){\n                                return value.value;\n                            }else{\n                                return value;\n                            }\n                        });\n                    }\n                }else{\n                    formData[item] = typeof fileFieldValue === 'object' ? fileFieldValue.value : fileFieldValue;\n                }\n            }\n        })\n    \n        let query = `mutation{record: ${objectName}__insert(doc: {__saveData}){_id}}`;\n        if(formData.recordId && formData.recordId !='new'){\n            query = `mutation{record: ${objectName}__update(id: \"${formData._id}\", doc: {__saveData}){_id}}`;\n        };\n        delete formData._id;\n        let __saveData = JSON.stringify(JSON.stringify(formData));\n    \n        api.data = {query: query.replace('{__saveData}', __saveData)};\n        return api;\n    ",
                        responseData: {
                          recordId: "${record._id}",
                        },
                        adaptor:
                          "console.log('payload', payload)\n            return payload;\n        ",
                        headers: {
                          Authorization:
                            "Bearer ${context.tenantId},${context.authToken}",
                        },
                        dataType: "json",
                      },
                      initFetch: false,
                      body: [
                        {
                          type: "fieldSet",
                          title: i18next.t('frontend_field_group_generalization'),
                          collapsable: true,
                          body: [
                            {
                              "type": "steedos-field",
                              "config": {
                                  "type": "lookup",
                                  "label": i18next.t('frontend_import_data_object_name'),
                                  "reference_to": "objects",
                                  "name": "object_name",
                                  "required": true,
                                  "amis":{
                                    "hidden": true
                                  }
                              }
                            },
                            {
                              "type": "steedos-field",
                              "config": {
                                  "type": "lookup",
                                  "label": i18next.t('frontend_import_data_queue_import_description'),
                                  "reference_to": "queue_import",
                                  "name": "queue_import",
                                  "required": true
                              }
                            },
                            {
                              "type": "steedos-field",
                              "config": {
                                  "type": "file",
                                  "label": i18next.t('frontend_import_data_file'),
                                  "name": "file",
                                  "required": true,
                                  "amis": {
                                    accept: ".xlsx,.xls"
                                  }
                              }
                            },
                          ],
                          id: "u:4899c260d667",
                        },
                      ],
                      panelClassName: "m-0 sm:rounded-lg shadow-none",
                      bodyClassName: "p-0",
                      className: "p-4 sm:p-0 steedos-amis-form",
                      label: "对象表单",
                      objectApiName: "queue_import_history",
                      id: "u:e4ef598eed61",
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
                    },
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
