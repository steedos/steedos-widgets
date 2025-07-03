/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-16 17:27:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-08 10:13:06
 * @Description: 
 */
import { getSteedosAuth } from '@steedos-widgets/amis-lib'
// TODO attachments
export const getAttachments = async (instance)=>{

    return {
        "type": "panel",
        className: "border-none bg-none shadow-none",
        headerClassName: "p-0 border-none mb-1",
        bodyClassName: "p-0",
        "title": [
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
                            tpl: `<a href='/api/v6/files/download/cfs.instances.filerecord/\${_id}/\${original.name}?download=true' target='_blank'>\${original.name}</a>`
                        }
                      ],
                      "actions": [
                        
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
    if(!instance.approve){
        return {
            type: 'tpl',
            tpl: "附件"
        }
    }
    const auth = getSteedosAuth();
    return {
        "type": "form",
        "title": "表单",
        "body": [
          {
            "type": "input-file",
            labelClassName: "antd-List-heading",
            className: "flex items-center",
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
              "url": "/api/instance/${context._id}/file",
              headers: {
                Authorization: "Bearer ${context.tenantId},${context.authToken}"
              },
              "method": "post",
              "messages": {},
              "dataType": "form-data",
              "requestAdaptor": `
                api.data.append('space', '${instance.space}');
                api.data.append('instance', '${instance._id}');
                api.data.append('approve', '${instance.approve?._id}');
                api.data.append('owner', '${auth.userId}');
                api.data.append('owner_name', '${auth.user.name}');
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