/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-16 17:27:24
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-08-31 09:53:48
 * @Description: 
 */
import { getSteedosAuth } from '@steedos-widgets/amis-lib'
import i18next from "i18next";
import React from 'react';

// 
const AmisOfficeViewer = ({ src, mode = 'excel' }) => {
    const ref = React.useRef(null);
    React.useEffect(() => {
        let scope = null;
        if (ref.current) {
            let amis = window.amisRequire && window.amisRequire('amis/embed');
            if (amis && amis.embed) {
                // 使用独立 session 避免污染全局 amis env。
                // amis-core 的 AMISRenderer 在已有同名 session 时会通过 Object.assign 覆盖现有 env 的
                // jumpTo/updateLocation/isCurrentUrl 等导航处理函数，从而把外层页面 SPA 友好的
                // 导航实现替换成 sdk 默认的 location.href，导致预览关闭后切换审批单触发整页刷新。
                // 详见 steedos/steedos-plugins#702。
                const session = 'steedos-office-viewer-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
                scope = amis.embed(
                    ref.current,
                    {
                        type: 'office-viewer',
                        src: src,
                    className: mode === 'word' ? 'h-full' : 'w-full h-full',
                    style: {
                      height: '100%'
                    }
                    },
                    null,
                    { session: session }
                );

                // 注入 CSS 覆盖 office-viewer 内部固定的 500px 高度，
                // 同时让中间容器也传递 100% 高度。
                if (mode === 'excel' && !document.getElementById('steedos-ov-excel-fix')) {
                    const style = document.createElement('style');
                    style.id = 'steedos-ov-excel-fix';
                    style.textContent = [
                        '.amis-scope .amis-routes-wrapper,',
                        '.amis-scope .amis-routes-wrapper > div,',
                        '.office-viewer.ov-excel { height: 100% !important; }'
                    ].join('');
                    document.head.appendChild(style);
                }
            }
        }
        return () => {
            if (scope && scope.unmount) {
                scope.unmount();
            }
        }
    }, [src, mode]);

    if (mode === 'word') {
        return React.createElement('div', { className: 'w-full h-full overflow-auto flex justify-center bg-gray-50 p-4 md:p-0' },
            React.createElement('div', { ref: ref, className: 'h-full' })
        );
    }

    return React.createElement('div', {
      ref: ref,
      className: "w-full h-full min-h-0",
      style: { height: '100%' }
    });
};

// 预览附件
window.previewAttachment = function(file) {
    console.log("previewAttachment", file);
  const isMobile = window.innerWidth < 768;
    
    // 优先调用自定义预览函数
    if (window.customPreviewAttachment) {
        window.customPreviewAttachment(file);
        return;
    }

    const fileName = file.original.name;
    const fileExt = fileName.split('.').pop().toLowerCase();
    let previewContent = null;
    // 构建完整 URL
    const encodedFileName = encodeURIComponent(fileName);
    let fileUrl = window.location.origin + `/api/v6/files/cfs.instances.filerecord/${file._id}/${encodedFileName}`;
    let downloadUrl = window.location.origin + `/api/v6/files/download/cfs.instances.filerecord/${file._id}/${encodedFileName}`;
    
    // 针对不同类型生成 Content
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp'].includes(fileExt)) {
        previewContent = React.createElement('div', { className: "flex justify-center items-center h-full bg-gray-100" }, 
            React.createElement('img', { src: fileUrl, className: "max-w-full max-h-full shadow-lg" })
        );
    } else if (['pdf', 'txt', 'json', 'md', 'xml', 'log', 'css', 'js', 'html', 'sql'].includes(fileExt)) {
        previewContent = React.createElement('iframe', { 
            src: fileUrl, 
            className: "w-full h-full border-none"
        });
    } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileExt) && Builder.settings.PUBLIC_OFFICE_VIEWER_URL) {
            // 尝试使用 Office Online
            let officeViewerUrl = Builder.settings.PUBLIC_OFFICE_VIEWER_URL;
            const officeUrl = officeViewerUrl + encodeURIComponent(downloadUrl + '?token=' + Builder.settings.context.user.authToken);
            if(Builder.settings.PUBLIC_OFFICE_PREVIEW_IN_NEW_WINDOW === 'true'){
                window.open(officeUrl, "_blank");
                return;
            }
            previewContent = React.createElement('div', { className: "w-full h-full flex flex-col" }, [
                React.createElement('iframe', { 
                src: officeUrl, 
                className: "w-full flex-1 border-none"
                })
            ]);
    } else if (fileExt === 'docx') {
        previewContent = React.createElement(AmisOfficeViewer, { src: fileUrl, mode: 'word' });
    } else if (fileExt === 'xlsx') {
        previewContent = React.createElement(AmisOfficeViewer, { src: fileUrl, mode: 'excel' });
    } else {
            previewContent = React.createElement('div', { className: "flex flex-col items-center justify-center h-full text-gray-500" }, [
                React.createElement('svg', { className: "w-16 h-16 mb-4 text-gray-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24"},
                React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})
                ),
                React.createElement('p', null, "目前系统仅支持docx、xsls、pdf和图片类型文件."),
                React.createElement('a', { 
                    href: fileUrl + "?download=true", 
                    className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" 
                }, "下载文件")
            ]);
    }

    const previewWrapper = React.createElement('div', {
        className: 'w-full flex-1 min-h-0 overflow-hidden',
        style: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }
    }, previewContent);

    SteedosUI.Drawer({
        title: fileName,
        width: isMobile ? '100vw' : '75%',
        placement: 'right',
        bodyStyle: {
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
            overflow: 'hidden'
        },
        contentWrapperStyle: isMobile ? {
            width: '100vw',
            maxWidth: '100vw'
        } : undefined,
        extra: React.createElement('a', {
            href: downloadUrl + "?download=true",
            target: "_blank",
            className: "flex items-center space-x-1 text-gray-600 hover:text-blue-600",
            title: "下载文件"
        }, [
            React.createElement('svg', { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, 
                React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" })
            ),
            React.createElement('span', null, "下载")
        ]),
        children: previewWrapper,
        destroyOnClose: true
    });
};

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
                    api.data.query = 'query{attachments:cfs_instances_filerecord(filters: [["metadata.instance", "=", "${instance._id}"], "metadata.current", "=", true]){ _id,original,metadata,uploadedAt}}';
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

                  function checkDeletePermission({ instance, attachment, currentStep, userId, box }) {
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
                      return canRemove && isDraftOrInbox && isFlowEnable && !isLocked;
                  }

                  function allowRemoveAttachment(params) {
                      const basePerm = checkDeletePermission(params);
                      const isHistoryLenthZero = params.attachment.history_versions && params.attachment.history_versions.length === 1;
                      return basePerm && isHistoryLenthZero;
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
                            return new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0);
                        });
                        
                        group.history_versions.forEach(v => {
                            v.allowDelete = checkDeletePermission({
                                instance: context.record,
                                attachment: v,
                                currentStep: context.record.currentStep,
                                userId: context.context.user.userId,
                                box: context.record.box
                            });
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
                  "template": "<div class=\"w-full bg-white divide-y divide-gray-100 instance-scrollable-list\">\n    {% for attachment in attachments %}\n    <div class=\"flex items-center justify-between py-1 hover:bg-gray-50 transition-colors\">\n        {% capture attachment_json %}{{ attachment | json }}{% endcapture %}\n        <div class=\"flex items-center space-x-2 truncate flex-1 mr-4\">\n            <svg class=\"w-4 h-4 text-blue-500 shrink-0  no-print\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"\n                    d=\"M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13\">\n                </path>\n            </svg>\n            <button data-file='{{ attachment_json | escape }}' onclick=\"window.previewAttachment(JSON.parse(this.getAttribute('data-file')))\"\n                class=\"text-base font-normal text-gray-700 hover:text-blue-600 hover:underline truncate text-left\"\n                title=\"点击预览: {{ attachment.name }}\">{{ attachment.original.name }}</button>\n        </div>\n\n        <div class=\"flex items-center space-x-3\">\n            <a href=\"/api/v6/files/download/cfs.instances.filerecord/{{ attachment._id }}/{{ attachment.original.name | url_encode }}?download=true\"\n                target=\"_blank\" class=\"text-gray-400 hover:text-blue-600 transition-colors no-print\" title=\"下载\">\n                <svg class=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                    <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4\"></path>\n                </svg>\n            </a>\n            {% capture v_data %}{{ attachment.history_versions | json }}{% endcapture %}\n            <button data-versions='{{ v_data | escape }}' onclick=\"openHistoryModal('{{ attachment.original.name }}', '{{ attachment.metadata.instance }}', '{{ attachment._id }}', '{{ attachment.metadata.parent }}', {{ attachment.allowAddVersion | default: false }}, this)\"\n                class=\"text-gray-400 hover:text-blue-600 transition-colors no-print\" title=\"历史版本\">\n                <svg class=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                    <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" \n                        d=\"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z\">\n                    </path>\n                </svg>\n            </button>\n            {% if attachment.allowRemoveAttachment %}\n            <button onclick=\"confirmDelete('{{ attachment.original.name }}','{{attachment.metadata.instance}}','{{ attachment._id }}')\"\n                class=\"text-gray-400 hover:text-red-500 transition-colors no-print\" title=\"彻底删除\">\n                <svg class=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                    <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16\"></path>\n                </svg>\n            </button>\n            {% endif %}\n        </div>\n    </div>\n    {% endfor %}\n</div>\n\n<script>\n    // 主附件删除确认\nwindow.confirmDelete = function(name, insId, id) {\n    SteedosUI.Modal.confirm({\n        title: '确认删除附件',\n        content: `您确定要彻底删除 \"\\${name}\" 吗？此操作不可恢复。`,\n        okText: '删除',\n        okType: 'danger',\n        cancelText: '取消',\n        onOk() {\n            console.log('正在删除:', name);\n            Steedos.authRequest('/api/workflow/v2/attachment/'+insId+'/'+id, {method: 'delete',async: false});\n            $(\".instance-attachments-reload\").trigger('click');\n            // 这里执行你的删除 API 调用\n        }\n    });\n};\n\n\n    // 附件版本删除确认\n    window.deleteAttachmentVersion = function(insId, id, name) {\n        SteedosUI.Modal.confirm({\n            title: '确认删除版本',\n            content: '您确定要删除版本 \"' + name + '\" 吗？此操作不可恢复。',\n            okText: '删除',\n            okType: 'danger',\n            cancelText: '取消',\n            onOk() {\n                Steedos.authRequest('/api/workflow/v2/attachment/' + insId + '/' + id, {\n                    method: 'delete',\n                    async: false\n                });\n                if (SteedosUI.refs[\"modal-history-list\"]) {\n                    SteedosUI.refs[\"modal-history-list\"].close();\n                }\n                $(\".instance-attachments-reload\").trigger('click');\n            }\n        });\n    };\n\n    // 处理文件上传函数\n    window.handleUploadNewVersion = function(insId, id, parentId) {\n        const fileInput = document.createElement('input');\n        fileInput.type = 'file';\n        fileInput.onchange = e => {\n        const file = e.target.files[0];\n        if (!file) return;\n        \n        const formData = new FormData();\n        // 这里的 key 通常是 'file'，请根据后端接口要求确认\n        formData.append('file', file);\n        formData.append('parent', parentId);\n        formData.append('space', '{{context.tenantId}}');\n        formData.append('instance', insId);\n        formData.append('approve', '{{record.approve._id}}');\n        formData.append('owner', '{{context.user.userId}}');\n        formData.append('owner_name', '{{context.user.name}}');\n        formData.append('isAddVersion', true);\n        \n        \n        // 这里的逻辑至关重要：覆盖 Steedos.authRequest 的默认行为\n        Steedos.authRequest('/api/instance/'+insId+'/file', {\n        type: 'POST',\n        data: formData, // jQuery 上传文件需要用 data 属性\n        processData: false, // 必填：告诉 jQuery 不要处理数据\n        contentType: false, // 必填：告诉 jQuery 不要设置 Content-Type\n        async: true, // 建议异步\n        beforeSend: function (XHR) {\n        // 重新覆盖 beforeSend 以免被源码里的 Content-Type: application/json 覆盖\n        const userSession = Steedos.User.get();\n        const spaceId = userSession.spaceId;\n        const authToken = userSession.authToken || userSession.user.authToken;\n        const authorization = \"Bearer \" + spaceId + \",\" + authToken;\n        \n        // 只设置认证头，千万不要设置 Content-Type\n        XHR.setRequestHeader(\"Authorization\", authorization);\n        },\n        success: function(res) {\n        // SteedosUI.message.success('新版本上传成功');\n        console.log(\"上传成功\", res);\n        // 刷新列表\n        $(\".instance-attachments-reload\").trigger('click');\n        if (SteedosUI.refs[\"modal-history-list\"]) {\n        SteedosUI.refs[\"modal-history-list\"].close();\n        }\n        },\n        error: function(xhr) {\n        console.error(\"上传失败\", xhr);\n        // SteedosUI.message.error('上传失败');\n        }\n        });\n        };\n        fileInput.click();\n    };\n\n    window.openHistoryModal = function(fileName, insId, id, parentId, allowAddVersion, btn) {\n        const modalName = \"modal-history-list\";\n        // 从按钮属性中恢复完整的 JSON 数组结构\n        let versions = [];\n        try {\n        const rawData = btn.getAttribute('data-versions');\n        versions = JSON.parse(rawData || \"[]\");\n        } catch (e) {\n        console.error(\"解析完整版本数据失败:\", e);\n        }\n\n        // 历史记录列表项\n        const listItems = versions.map((v, index) => {\n        const vNum = versions.length - index;\n\n        // 构造当前版本的下载链接\n        // 注意：这里使用的是 v._id 而不是外层的 id\n        const downloadUrl = `/api/v6/files/download/cfs.instances.filerecord/\\${v._id}/\\${encodeURIComponent(v.original.name)}?download=true`;\n\n        // 删除按钮\n        const deleteBtn = v.allowDelete ? React.createElement(\"button\", {\n            className: \"text-gray-400 hover:text-red-500 transition-colors ml-2\",\n            title: \"删除此版本\",\n            onClick: () => window.deleteAttachmentVersion(insId, v._id, v.original.name)\n        }, [\n            React.createElement(\"svg\", { className: \"w-3.5 h-3.5\", fill: \"none\", stroke: \"currentColor\", viewBox: \"0 0 24 24\" },\n                React.createElement(\"path\", { strokeLinecap: \"round\", strokeLinejoin: \"round\", strokeWidth: \"2\", d: \"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16\" })\n            )\n        ]) : null;\n\n        return React.createElement(\"li\", {\n        key: index,\n        className: \"flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 rounded transition-colors\"\n        }, [\n        React.createElement(\"div\", { className: \"flex items-center space-x-3 truncate flex-1\" }, [\n        // 版本号标识\n        React.createElement(\"span\", {\n        className: \"text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded shrink-0\"\n        }, 'v' + vNum),\n\n        // 文件名及上传信息\n        React.createElement(\"div\", { className: \"truncate flex-1\" }, [\n            React.createElement(\"a\", {\n            href: downloadUrl,\n            target: \"_blank\",\n            title: \"点击下载此版本\",\n            className: \"text-sm text-gray-600 hover:text-blue-600 hover:underline truncate block\"\n            }, v.original.name),\n            (v.metadata.owner_name || v.uploadedAt) ? React.createElement(\"div\", { className: \"text-[10px] text-gray-400 mt-0.5\" },\n            [v.metadata.owner_name || '', v.uploadedAt ? new Date(v.uploadedAt).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''].filter(Boolean).join(' \\u00b7 ')\n            ) : null\n        ])\n        ]),\n\n        React.createElement(\"div\", { className: \"flex items-center\" }, [\n            // 右侧显示文件大小\n            React.createElement(\"span\", { className: \"text-[10px] text-gray-300 ml-2 shrink-0\" },\n            v.original.size ? (v.original.size / 1024).toFixed(1) + ' KB' : ''\n            ),\n            deleteBtn\n        ])\n        ]);\n        });\n\n        // 2. 根据权限构建右上角上传按钮\n        const uploadButton = allowAddVersion ? React.createElement(\"button\", {\n        className: \"flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-all text-xs font-medium\",\n        onClick: () => window.handleUploadNewVersion(insId, id, parentId)\n        }, [\n        React.createElement(\"svg\", { className: \"w-3.5 h-3.5\", fill: \"none\", stroke: \"currentColor\", viewBox: \"0 0 24 24\" },\n        React.createElement(\"path\", { strokeLinecap: \"round\", strokeLinejoin: \"round\", strokeWidth: \"2\", d: \"M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12\" })\n        ),\n        React.createElement(\"span\", null, \"更新版本\")\n        ]) : null;\n        \n        // 3. 构建 Modal 内容\n        const modalContent = React.createElement(\"div\", { className: \"py-1\" }, [\n        React.createElement(\"div\", { className: \"flex justify-between items-center mb-4 pb-2 border-b border-gray-100\" }, [\n        React.createElement(\"div\", { className: \"text-[11px] text-gray-400 pl-2 border-l-2 border-blue-400 italic\" },\n        `文件: \\${fileName}`\n        ),\n        uploadButton // 这里只在 allowAddVersion 为 true 时显示\n        ]),\n        React.createElement(\"ul\", { className: \"max-h-80 overflow-y-auto\" },\n        listItems.length > 0 ? listItems : React.createElement(\"div\", {\n        className: \"text-center py-10 text-gray-400 text-xs\"\n        }, \"暂无历史版本记录\")\n        )\n        ]);\n\n        const modal = SteedosUI.Modal({\n            title: \"版本历史\",\n            width: \"420px\",\n            name: modalName,\n            children: modalContent,\n            footer: null,\n            destroyOnClose: true\n        });\n        modal && modal.show();\n    };\n</script>",
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
            "type": "steedos-file-upload",
            "label": i18next.t('frontend_workflow_attachment'),
            "btnLabel": i18next.t('frontend_workflow_attachment_upload'),
            "multiple": true,
            "maxCount": 10,
            "action": `/api/instance/${instance._id}/file`,
            "headers": {
              "Authorization": `Bearer ${auth.tenantId},${auth.authToken}`
            },
            "extraData": {
              "space": instance.space,
              "instance": instance._id,
              "approve": instance.approve?._id || '',
              "owner": auth.user?.userId || '',
              "owner_name": auth.user?.name || ''
            },
            "onEvent": {
              "uploadSuccess": {
                "weight": 0,
                "actions": [
                  {
                    "componentId": "",
                    "args": {
                      "msgType": "success",
                      "position": "top-right",
                      "closeButton": true,
                      "showIcon": true,
                      "msg": i18next.t('frontend_workflow_attachment_upload_success'),
                    },
                    "actionType": "toast"
                  },
                  {
                    "componentId": "u:attachmentsService",
                    "args": {},
                    "actionType": "reload",
                  },
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
                  },
                ]
              }
            }
          }
        ],
        "id": "u:5f901c0b917b",
        "wrapWithPanel": false
      }
}