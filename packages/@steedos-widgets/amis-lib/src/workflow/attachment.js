/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-16 17:27:24
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-08-31 09:53:48
 * @Description: 
 */
import { getSteedosAuth } from '@steedos-widgets/amis-lib'
import i18next from "i18next";

export const getAttachments = async (instance)=>{

    return {
        "type": "panel",
        className: "instance-file-list border-none bg-none shadow-none",
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
                `,
                adaptor: function (payload, response, api, context) {
                  function allowAddAttachmentVersion({ instance, current, currentStep, isCC, ccStep, box }) {
                    if (!instance || instance.state === "completed") return false;
                    if (!current) return false;

                    // 分发后的正文、附件不可编辑/删除/上传新版本
                    if (instance.distribute_from_instances && instance.distribute_from_instances.includes(current.metadata.instance)) {
                      return false;
                    }

                    // 附件被锁定不可操作
                    if (current.metadata && current.metadata.locked_by) return false;

                    // cc的单子，只有在当前步骤才能修改附件
                    if (box === "draft" || box === "inbox") {
                      if (isCC) {
                        // CC 步骤
                        if (current.metadata.main === true) {
                          if (ccStep && ccStep.can_edit_main_attach === true) return true;
                        } else {
                          if (ccStep && (ccStep.can_edit_normal_attach === true || ccStep.can_edit_normal_attach === undefined)) return true;
                        }
                      } else {
                        // 普通步骤
                        if (current.metadata.main === true) {
                          if (currentStep && currentStep.can_edit_main_attach === true) return true;
                        } else {
                          if (currentStep && (currentStep.can_edit_normal_attach === true || currentStep.can_edit_normal_attach === undefined)) return true;
                        }
                      }
                    }

                    return false;
                  }

                  function allowRemoveAttachment({ instance, attachment, currentStep, userId, box }) {
                      if (!instance || !attachment) return false;

                      // 已经结束的单子不能改附件
                      if (instance.state === "completed") return false;

                      // 分发后的附件不可编辑/删除
                      if (instance.distribute_from_instances && instance.distribute_from_instances.includes(attachment.metadata.instance)) {
                        return false;
                      }

                      // cc的单子，只有在当前步骤才能修改附件
                      if (instance.approve && instance.approve.type === "cc") {
                        const currentTrace = _.find(instance.traces, t => t._id === instance.approve.trace);
                        if (currentTrace && currentTrace._id !== instance.approve.trace) {
                          return false;
                        }
                      }

                      // 草稿或待办箱
                      const isDraftOrInbox = box === "draft" || box === "inbox";

                      // 流程启用
                      const isFlowEnable = instance.flow?.state === "enabled";

                      // 附件历史版本只有一个
                      const isHistoryLenthZero = attachment.history_versions && attachment.history_versions.length === 1;

                      // 附件未锁定
                      const isLocked = !!attachment.metadata.locked_by;

                      // 当前用户是否为附件所有者
                      const isOwner = attachment.metadata.owner === userId;

                      // 步骤权限判断
                      let canRemove = false;
                      if (attachment.metadata.main === true) {
                        if (currentStep && currentStep.can_edit_main_attach === true && isOwner) {
                          canRemove = true;
                        }
                      } else {
                        if (currentStep && (currentStep.can_edit_normal_attach === true || currentStep.can_edit_normal_attach === undefined) && isOwner) {
                          canRemove = true;
                        }
                      }
                      return canRemove && isDraftOrInbox && isFlowEnable && isHistoryLenthZero && !isLocked;
                  }

                  function transformAttachments(data) {
                    const groups = {};

                    data.forEach(item => {
                        const parentId = item.metadata.parent;
                        
                        if (!groups[parentId]) {
                            groups[parentId] = {
                                _id: "",
                                name: "",
                                original: {},
                                metadata: {},
                                all_versions: [] // 先收集所有版本
                            };
                        }
                        groups[parentId].all_versions.push(item);
                    });

                    return Object.values(groups).map(group => {
                        // 1. 在集合中找到那个 current 为 true 的版本
                        const currentVersion = group.all_versions.find(v => v.metadata.current === true) 
                                              || group.all_versions[0]; // 如果没标记，默认取第一个

                        // 2. 将主对象属性指向当前版本
                        group._id = currentVersion._id;
                        group.name = currentVersion.original.name;
                        group.original = currentVersion.original;
                        group.metadata = currentVersion.metadata;

                        group.history_versions = group.all_versions.sort((a, b) => {
                            return new Date(b.original.created || 0) - new Date(a.original.created || 0);
                        });
                       
                        group.allowAddVersion = allowAddAttachmentVersion({
                              instance: context.record,
                              current: group,
                              currentStep: context.record.currentStep,
                              isCC: context.record.approve?.type === "cc",
                              ccStep: context.record.currentStep,
                              box: context.record.box
                          });
                        group.allowRemoveAttachment = allowRemoveAttachment({
                            instance: context.record,
                            attachment: group,
                            currentStep: context.record.currentStep,
                            userId: context.context.user.userId,
                            box: context.record.box
                        });

                        // 删除临时辅助字段
                        delete group.all_versions;
                        
                        return group;
                    });
                  }
                  const attachments = transformAttachments(payload.data.attachments);
                  return {
                    data: {
                      attachments: attachments
                    }
                  }
                }
            },
            body: [
                {
                  "type": "liquid",
                  "template": "<div class=\"w-full bg-white divide-y divide-gray-100\">\n    {% for attachment in attachments %}\n    <div class=\"flex items-center justify-between p-2 hover:bg-gray-50 transition-colors\">\n        <div class=\"flex items-center space-x-2 truncate flex-1 mr-4\">\n            <svg class=\"w-4 h-4 text-blue-500 shrink-0  no-print\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"\n                    d=\"M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13\">\n                </path>\n            </svg>\n            <a href=\"/api/v6/files/download/cfs.instances.filerecord/{{ attachment._id }}/{{ attachment.original.name }}?download=true\"\n                target=\"_blank\" class=\"text-sm font-medium text-gray-700 hover:text-blue-600 hover:underline truncate\"\n                title=\"点击下载: {{ attachment.name }}\">{{ attachment.original.name }}</a>\n        </div>\n\n        <div class=\"flex items-center space-x-3\">\n            {% capture v_data %}{{ attachment.history_versions | json }}{% endcapture %}\n            <button data-versions='{{ v_data | escape }}' onclick=\"openHistoryModal('{{ attachment.original.name }}', '{{ attachment.metadata.instance }}', '{{ attachment._id }}', '{{ attachment.metadata.parent }}', {{ attachment.allowAddVersion | default: false }}, this)\"\n                class=\"text-gray-400 hover:text-blue-600 transition-colors no-print\" title=\"历史版本\">\n                <svg class=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                    <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" \n                        d=\"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z\">\n                    </path>\n                </svg>\n            </button>\n            {% if attachment.allowRemoveAttachment %}\n            <button onclick=\"confirmDelete('{{ attachment.original.name }}','{{attachment.metadata.instance}}','{{ attachment._id }}')\"\n                class=\"text-gray-400 hover:text-red-500 transition-colors no-print\" title=\"彻底删除\">\n                <svg class=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                    <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16\"></path>\n                </svg>\n            </button>\n            {% endif %}\n        </div>\n    </div>\n    {% endfor %}\n</div>\n\n<script>\n    // 主附件删除确认\nwindow.confirmDelete = function(name, insId, id) {\n    SteedosUI.Modal.confirm({\n        title: '确认删除附件',\n        content: `您确定要彻底删除 \"\\${name}\" 吗？此操作不可恢复。`,\n        okText: '删除',\n        okType: 'danger',\n        cancelText: '取消',\n        onOk() {\n            console.log('正在删除:', name);\n            Steedos.authRequest('/api/workflow/v2/attachment/'+insId+'/'+id, {method: 'delete',async: false});\n            $(\".instance-attachments-reload\").trigger('click');\n            // 这里执行你的删除 API 调用\n        }\n    });\n};\n\n    // 处理文件上传函数\n    window.handleUploadNewVersion = function(insId, id, parentId) {\n        const fileInput = document.createElement('input');\n        fileInput.type = 'file';\n        fileInput.onchange = e => {\n        const file = e.target.files[0];\n        if (!file) return;\n        \n        const formData = new FormData();\n        // 这里的 key 通常是 'file'，请根据后端接口要求确认\n        formData.append('file', file);\n        formData.append('parent', parentId);\n        formData.append('space', '{{context.tenantId}}');\n        formData.append('instance', insId);\n        formData.append('approve', '{{record.approve._id}}');\n        formData.append('owner', '{{context.user.userId}}');\n        formData.append('owner_name', '{{context.user.name}}');\n        formData.append('isAddVersion', true);\n        \n        \n        // 这里的逻辑至关重要：覆盖 Steedos.authRequest 的默认行为\n        Steedos.authRequest('/api/instance/'+insId+'/file', {\n        type: 'POST',\n        data: formData, // jQuery 上传文件需要用 data 属性\n        processData: false, // 必填：告诉 jQuery 不要处理数据\n        contentType: false, // 必填：告诉 jQuery 不要设置 Content-Type\n        async: true, // 建议异步\n        beforeSend: function (XHR) {\n        // 重新覆盖 beforeSend 以免被源码里的 Content-Type: application/json 覆盖\n        const userSession = Steedos.User.get();\n        const spaceId = userSession.spaceId;\n        const authToken = userSession.authToken || userSession.user.authToken;\n        const authorization = \"Bearer \" + spaceId + \",\" + authToken;\n        \n        // 只设置认证头，千万不要设置 Content-Type\n        XHR.setRequestHeader(\"Authorization\", authorization);\n        },\n        success: function(res) {\n        // SteedosUI.message.success('新版本上传成功');\n        console.log(\"上传成功\", res);\n        // 刷新列表\n        $(\".instance-attachments-reload\").trigger('click');\n        if (SteedosUI.refs[\"modal-history-list\"]) {\n        SteedosUI.refs[\"modal-history-list\"].close();\n        }\n        },\n        error: function(xhr) {\n        console.error(\"上传失败\", xhr);\n        // SteedosUI.message.error('上传失败');\n        }\n        });\n        };\n        fileInput.click();\n    };\n\n    window.openHistoryModal = function(fileName, insId, id, parentId, allowAddVersion, btn) {\n        const modalName = \"modal-history-list\";\n        // 从按钮属性中恢复完整的 JSON 数组结构\n        let versions = [];\n        try {\n        const rawData = btn.getAttribute('data-versions');\n        versions = JSON.parse(rawData || \"[]\");\n        } catch (e) {\n        console.error(\"解析完整版本数据失败:\", e);\n        }\n\n        // 历史记录列表项\n        const listItems = versions.map((v, index) => {\n        const vNum = versions.length - index;\n\n        // 构造当前版本的下载链接\n        // 注意：这里使用的是 v._id 而不是外层的 id\n        const downloadUrl = `/api/v6/files/download/cfs.instances.filerecord/\\${v._id}/\\${v.original.name}?download=true`;\n\n        return React.createElement(\"li\", {\n        key: index,\n        className: \"flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 rounded transition-colors\"\n        }, [\n        React.createElement(\"div\", { className: \"flex items-center space-x-3 truncate flex-1\" }, [\n        // 版本号标识\n        React.createElement(\"span\", {\n        className: \"text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded shrink-0\"\n        }, 'v' + vNum),\n\n        // 文件名点击链接\n        React.createElement(\"a\", {\n        href: downloadUrl,\n        target: \"_blank\",\n        title: \"点击下载此版本\",\n        className: \"text-sm text-gray-600 hover:text-blue-600 hover:underline truncate\"\n        }, v.original.name)\n        ]),\n\n        // 右侧显示文件大小\n        React.createElement(\"span\", { className: \"text-[10px] text-gray-300 ml-2 shrink-0\" },\n        v.original.size ? (v.original.size / 1024).toFixed(1) + ' KB' : ''\n        )\n        ]);\n        });\n\n        // 2. 根据权限构建右上角上传按钮\n        const uploadButton = allowAddVersion ? React.createElement(\"button\", {\n        className: \"flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-all text-xs font-medium\",\n        onClick: () => window.handleUploadNewVersion(insId, id, parentId)\n        }, [\n        React.createElement(\"svg\", { className: \"w-3.5 h-3.5\", fill: \"none\", stroke: \"currentColor\", viewBox: \"0 0 24 24\" },\n        React.createElement(\"path\", { strokeLinecap: \"round\", strokeLinejoin: \"round\", strokeWidth: \"2\", d: \"M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12\" })\n        ),\n        React.createElement(\"span\", null, \"更新版本\")\n        ]) : null;\n        \n        // 3. 构建 Modal 内容\n        const modalContent = React.createElement(\"div\", { className: \"py-1\" }, [\n        React.createElement(\"div\", { className: \"flex justify-between items-center mb-4 pb-2 border-b border-gray-100\" }, [\n        React.createElement(\"div\", { className: \"text-[11px] text-gray-400 pl-2 border-l-2 border-blue-400 italic\" },\n        `文件: \\${fileName}`\n        ),\n        uploadButton // 这里只在 allowAddVersion 为 true 时显示\n        ]),\n        React.createElement(\"ul\", { className: \"max-h-80 overflow-y-auto\" },\n        listItems.length > 0 ? listItems : React.createElement(\"div\", {\n        className: \"text-center py-10 text-gray-400 text-xs\"\n        }, \"暂无历史版本记录\")\n        )\n        ]);\n\n        const modal = SteedosUI.Modal({\n            title: \"版本历史\",\n            width: \"420px\",\n            name: modalName,\n            children: modalContent,\n            footer: null,\n            destroyOnClose: true\n        });\n        modal && modal.show();\n    };\n</script>",
                  "id": "u:4b9c2fbf6fe3"
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
            tpl: i18next.t('frontend_workflow_attachment')
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
            "label": i18next.t('frontend_workflow_attachment'),
            mode:"inline",
            "name": "file",
            "id": "u:a58d02614e04",
            "btnLabel": i18next.t('frontend_workflow_attachment_upload'),
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
                      "msg": i18next.t('frontend_workflow_attachment_upload_success'),//"上传成功"
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
          },
          {
            "type": "button",
            "className": "hidden instance-attachments-reload",
            "onEvent": {
              "click": {
                "weight": 0,
                "actions": [
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