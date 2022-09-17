/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-16 17:27:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-17 15:14:08
 * @Description: 
 */
import { isEmpty } from 'lodash'
import { getSteedosAuth } from '@steedos-widgets/amis-lib'
// TODO attachments
export const getAttachments = async (instance)=>{

    const query = ``

    return {
        "type": "panel",
        className: "border-none",
        headerClassName: "p-0 border-none mb-1",
        bodyClassName: "p-0",
        "title": [
        //   {
        //       type: 'tpl',
        //       tpl: "附件"
        //   },
          await getAttachmentUploadInput(instance)
        ],
        "body": [
          {
            type: 'service',
            id: 'u:attachmentsService',
            api: {
                "method": "post",
                "url": "${context.rootUrl}/graphql",
                dataType: "json",
                headers: {
                    Authorization: "Bearer ${context.tenantId},${context.authToken}",
                },
                requestAdaptor: `
                    api.data.query = 'query{attachments:cfs_instances_filerecord(filters: [["metadata.instance", "=", "${instance._id}"], "metadata.current", "=", true]){ _id,original,metadata}}';
                    console.log("api", api)
                    return api;
                `
            },
            body: [
                {
                    "type": "list",
                    "source": "${attachments}",
                    title: false,
                    "listItem": {
                      "body": [
                        {
                            type: 'tpl',
                            inline: true,
                            tpl: `<a href='\${context.rootUrl}/api/files/instances/\${_id}?download=true' target='_blank'>\${original.name}</a>`
                        }
                      ],
                      "actions": [
                        {
                          "icon": "fa fa-eye",
                          "type": "button",
                          "id": "u:ef52fa8940a8"
                        }
                      ],
                      "id": "u:550b3fdc8788"
                    },
                    "id": "u:f538be693fad"
                }
            ]
          }
        ]
      }
}

export const getAttachmentUploadInput = async (instance)=>{
    const auth = getSteedosAuth();
    return {
        "type": "form",
        "title": "表单",
        "body": [
          {
            "type": "input-file",
            "label": "附件",
            mode:"inline",
            "name": "file",
            "id": "u:a58d02614e04",
            "btnLabel": "上传",
            "btnClassName": "m-0", 
            "multiple": true,
            "maxLength": 10,
            "submitType": "asUpload",
            "uploadType": "fileReceptor",
            "proxy": false,
            "drag": false,
            "autoUpload": true,
            "useChunk": false,
            "joinValues": false,
            "extractValue": false,
            "valueField": "version_id",
            "receiver": {
              "url": "${context.rootUrl}/api/v4/instances/s3",
              headers: {
                Authorization: "Bearer ${context.tenantId},${context.authToken}"
              },
              "method": "post",
              "messages": {},
              "dataType": "form-data",
              "requestAdaptor": `
                api.data.append('space', '${instance.space}');
                api.data.append('instance', '${instance._id}');
                api.data.append('approve', '${instance.approve._id}');
                api.data.append('owner', '${auth.userId}');
                api.data.append('owner_name', '${auth.name}');
                return api;
              `
            },
            "onEvent": {
              "success": {
                "weight": 0,
                "actions": [
                  {
                    "componentId": "u:5f901c0b917b",
                    "args": {},
                    "actionType": "clear"
                  },
                  {
                    "componentId": "",
                    "args": {
                      "msgType": "success",
                      "position": "top-right",
                      "closeButton": true,
                      "showIcon": true,
                      "msg": "上传成功"
                    },
                    "actionType": "toast"
                  },
                  {
                    "componentId": "u:attachmentsService",
                    "args": {},
                    "actionType": "reload",
                  }
                ]
              }
            }
          }
        ],
        "id": "u:5f901c0b917b",
        "wrapWithPanel": false
      }
}