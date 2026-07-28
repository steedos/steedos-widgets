/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-16 17:27:24
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2026-06-01 14:36:54
 * @Description: 
 */
import { fetchAPI, getSteedosAuth } from '@steedos-widgets/amis-lib'
import i18next from "i18next";
import React from 'react';

const getFlowId = (instance) => {
    const flow = instance?.flow;
    if (!flow) {
        return '';
    }
    return typeof flow === 'string' ? flow : flow._id;
};

export const shouldShowFlowTemplateFiles = (instance) => {
    return instance?.box === 'draft' && !!instance?.space && !!getFlowId(instance);
};

export const buildFlowTemplateFilesQuery = (instance) => {
    const filters = [
        ["metadata.space", "=", instance.space],
        ["metadata.object_name", "=", "flows"],
        ["metadata.record_id", "=", getFlowId(instance)]
    ];
    return `query{flowTemplateFiles:cfs_files_filerecord(filters: ${JSON.stringify(filters)}){ _id,original,metadata,uploadedAt}}`;
};

const isFlowTemplateDebugEnabled = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    const params = new URLSearchParams(window.location.search || '');
    return params.get('debugFlowTemplate') === '1';
  } catch (e) {
    return false;
  }
};

const bindFlowTemplateMenuEvents = () => {
  if (typeof window === 'undefined') {
    return;
  }
  if (window.__flowTemplateMenuEventsBoundForClick) {
    return;
  }
  window.__flowTemplateMenuEventsBoundForClick = true;

  // 点击模板按钮后直接弹窗展示文件列表，避免下拉交互在不同运行环境中不稳定。
  window.openFlowTemplateFilesModal = function (btn) {
    try {
      const raw = btn && btn.getAttribute ? btn.getAttribute('data-files') : '[]';
      const files = JSON.parse(raw || '[]');
      const listItems = (files || []).map((file, index) => {
        const fileName = file?.original?.name || '未命名文件';
        const href = `/api/v6/files/download/cfs.files.filerecord/${file._id}/${encodeURIComponent(fileName)}?download=true`;
        return React.createElement('li', {
          key: file?._id || index,
          className: 'py-2.5 border-b border-gray-100 last:border-0'
        }, React.createElement('a', {
          href,
          target: '_blank',
          title: fileName,
          className: 'text-base text-gray-700 hover:text-blue-600 hover:underline truncate block'
        }, fileName));
      });

      const content = React.createElement('div', { className: 'py-1' },
        React.createElement('ul', { className: 'max-h-80 overflow-y-auto' },
          listItems.length > 0
            ? listItems
            : React.createElement('div', { className: 'text-center py-10 text-gray-400 text-sm' }, '暂无模板文件')
        )
      );

      const modal = SteedosUI.Modal({
        title: i18next.t('frontend_workflow_attachment_templates', 'Templates'),
        width: '420px',
        name: 'modal-flow-template-files-list',
        children: content,
        footer: null,
        destroyOnClose: true
      });
      modal && modal.show();
    } catch (e) {
      console.error('[flow-template-files] 打开模板文件弹窗失败:', e);
    }
  };
};

export const getFlowTemplateFilesService = (instance) => {
    if (!shouldShowFlowTemplateFiles(instance)) {
        return null;
    }
  bindFlowTemplateMenuEvents();

    const templateLabel = i18next.t('frontend_workflow_attachment_templates', 'Templates');

    return {
        type: 'service',
        className: 'instance-flow-template-files-service',
        api: {
            method: 'post',
            url: '${context.rootUrl}/graphql',
            dataType: 'json',
            headers: {
                Authorization: 'Bearer ${context.tenantId},${context.authToken}',
            },
            requestAdaptor: `
                api.data.query = '${buildFlowTemplateFilesQuery(instance)}';
                return api;
            `,
            adaptor: function (payload) {
              const flowTemplateFiles = Array.isArray(payload?.data?.flowTemplateFiles)
                ? payload.data.flowTemplateFiles
                : [];
              if (isFlowTemplateDebugEnabled()) {
                console.log('[flow-template-files] graphql payload:', payload);
                try {
                  const msg = `流程模板文件查询成功1，返回 ${flowTemplateFiles.length} 条`;
                  if (window.SteedosUI?.message?.info) {
                    window.SteedosUI.message.info(msg);
                  } else if (window.amisNotify) {
                    window.amisNotify('info', msg);
                  }
                } catch (e) {
                  console.warn('[flow-template-files] toast 日志显示失败:', e);
                }
              }

                return {
                    data: {
                  flowTemplateFiles,
                  hasFlowTemplateFiles: flowTemplateFiles.length > 0
                    }
                };
            }
        },
        body: [
            {
                type: 'liquid',
              visibleOn: '${hasFlowTemplateFiles}',
                template: `<div class="instance-flow-template-files no-print">
          {% capture files_json %}{{ flowTemplateFiles | json }}{% endcapture %}
          <div class="instance-flow-template-files__dropdown">
            <button type="button" class="antd-Button antd-Button--default antd-Button--size-default instance-flow-template-files__button instance-flow-template-files__toggle" data-files='{{ files_json | escape }}' onclick="window.openFlowTemplateFilesModal(this)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>${templateLabel}</span>
            </button>
          </div>
        </div>`
            }
        ]
    };
};

const isNarrowAndroid = (windowLike) => {
  const userAgent = String(windowLike?.navigator?.userAgent || '');
  return /Android/i.test(userAgent)
    && Number(windowLike?.innerWidth) <= 768;
};

const isNarrowAndroidDingTalk = (windowLike) => {
  const userAgent = String(windowLike?.navigator?.userAgent || '');
  return isNarrowAndroid(windowLike)
    && /AliApp\(DingTalk/i.test(userAgent);
};

export const getAmisOfficeViewerWordContainerClass = (windowLike) => {
  const horizontalAlignment = isNarrowAndroid(windowLike)
    ? 'justify-start'
    : 'justify-center';

  return `w-full h-full overflow-auto flex ${horizontalAlignment} bg-gray-50 p-4 md:p-0`;
};

export const getAttachmentPdfViewerBaseUrl = (windowLike) => (
  windowLike?.Steedos?.settings?.public?.webservices?.pdfOnline?.url
);

export const getAttachmentPdfPreviewUrl = (
  fileUrl,
  windowLike,
  viewerBaseUrl
) => {
  if (!isNarrowAndroidDingTalk(windowLike)
    || !viewerBaseUrl
    || typeof windowLike?.URL !== 'function'
    || !windowLike?.location?.href) {
    return fileUrl;
  }

  try {
    const pageUrl = new windowLike.URL(windowLike.location.href);
    const viewerUrl = new windowLike.URL(viewerBaseUrl, pageUrl);
    const parsedFileUrl = new windowLike.URL(fileUrl, pageUrl);
    if (viewerUrl.origin !== pageUrl.origin
      || parsedFileUrl.origin !== pageUrl.origin) {
      return fileUrl;
    }
    viewerUrl.searchParams.set('file', fileUrl);
    return `${viewerUrl.pathname}${viewerUrl.search}${viewerUrl.hash}`;
  } catch (e) {
    return fileUrl;
  }
};

/**
 * AMIS 6.3 derives lazy SDK package URLs from Error.stack. Android DingTalk's
 * WebView uses a stack format that can point those packages at the wrong base.
 * Backport AMIS's currentScript-based behavior only for the affected client and
 * only immediately before an attachment Office Viewer is mounted.
 */
export const ensureAmisOfficeViewerPackageUrls = (windowLike) => {
  const documentLike = windowLike?.document;
  const amisRequire = windowLike?.amis?.require;
  if (!isNarrowAndroidDingTalk(windowLike)
    || !documentLike
    || typeof documentLike.querySelector !== 'function'
    || !amisRequire
    || typeof amisRequire.resourceMap !== 'function'
    || typeof windowLike.URL !== 'function') {
    return false;
  }

  const sdkScript = documentLike.querySelector(
    'script[src*="/@steedos-widgets/amis@"][src*="/sdk/sdk.js"]'
  );
  if (!sdkScript?.src) {
    return false;
  }

  let sdkUrl;
  try {
    sdkUrl = new windowLike.URL(sdkScript.src, windowLike.location?.href);
  } catch (e) {
    return false;
  }

  const sdkDirectory = sdkUrl.pathname.replace(/\/sdk\.js$/, '');
  if (sdkDirectory === sdkUrl.pathname) {
    return false;
  }

  amisRequire.resourceMap({
    res: {},
    pkg: {
      '5aae26c-p4': {
        url: `${sdkDirectory}/papaparse.js`,
        type: 'js'
      },
      '5aae26c-p12': {
        url: `${sdkDirectory}/charts.js`,
        type: 'js'
      },
      '5aae26c-p13': {
        url: `${sdkDirectory}/office-viewer.js`,
        type: 'js'
      }
    }
  });
  return true;
};

// 
const AmisOfficeViewer = ({ src, mode = 'excel' }) => {
    const ref = React.useRef(null);
    React.useEffect(() => {
        let scope = null;
        if (ref.current) {
            ensureAmisOfficeViewerPackageUrls(window);
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
                        loading: true,
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
        return React.createElement('div', { className: getAmisOfficeViewerWordContainerClass(window) },
            React.createElement('div', { ref: ref, className: 'h-full' })
        );
    }

    return React.createElement('div', {
      ref: ref,
      className: "w-full h-full min-h-0",
      style: { height: '100%' }
    });
};

// 外部 Office 预览服务（如 kkFileView）在服务端拉取附件时不带 Cookie，
// 下载接口也不支持 query token 鉴权，直接把用户长期 authToken 拼进 URL
// 还会把令牌泄露给第三方预览服务，所以先通过 presigned-urls 换取临时下载地址。
export const getAttachmentOfficePreviewUrl = async (file, officeViewerUrl, fetcher = fetchAPI) => {
    const result = await fetcher('/api/v6/files/cfs.instances.filerecord/presigned-urls', {
        method: 'POST',
        body: JSON.stringify({ records: [file._id] })
    });
    const presignedUrl = result && result.urls && result.urls[0];
    if (!presignedUrl) {
        throw new Error('未获取到附件的临时下载地址');
    }
    return officeViewerUrl + encodeURIComponent(presignedUrl);
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

    const openPreviewDrawer = function (content) {
        const previewWrapper = React.createElement('div', {
            className: 'w-full flex-1 min-h-0 overflow-hidden',
            style: {
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }
        }, content);

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

    const buildBuiltinPreviewContent = function () {
        if (fileExt === 'docx') {
            return React.createElement(AmisOfficeViewer, { src: fileUrl, mode: 'word' });
        }
        if (fileExt === 'xlsx') {
            return React.createElement(AmisOfficeViewer, { src: fileUrl, mode: 'excel' });
        }
        return React.createElement('div', { className: "flex flex-col items-center justify-center h-full text-gray-500" }, [
            React.createElement('svg', { className: "w-16 h-16 mb-4 text-gray-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24"},
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})
            ),
            React.createElement('p', null, "目前系统仅支持docx、xlsx、pdf和图片类型文件在线预览。"),
            React.createElement('a', {
                href: fileUrl + "?download=true",
                className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            }, "下载文件")
        ]);
    };

    // 针对不同类型生成 Content
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp'].includes(fileExt)) {
        previewContent = React.createElement('div', { className: "flex justify-center items-center h-full bg-gray-100" }, 
            React.createElement('img', { src: fileUrl, className: "max-w-full max-h-full shadow-lg" })
        );
    } else if (['pdf', 'txt', 'json', 'md', 'xml', 'log', 'css', 'js', 'html', 'sql'].includes(fileExt)) {
        const previewUrl = fileExt === 'pdf'
            ? getAttachmentPdfPreviewUrl(
                fileUrl,
                window,
                getAttachmentPdfViewerBaseUrl(window)
            )
            : fileUrl;
        previewContent = React.createElement('iframe', {
            src: previewUrl,
            className: "w-full h-full border-none"
        });
    } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileExt) && Builder.settings.PUBLIC_OFFICE_VIEWER_URL) {
        // 尝试使用 Office Online
        const officeViewerUrl = Builder.settings.PUBLIC_OFFICE_VIEWER_URL;
        const openInNewWindow = Builder.settings.PUBLIC_OFFICE_PREVIEW_IN_NEW_WINDOW === 'true';
        // 在用户点击的同步调用栈里先开窗口，异步拿到地址后再跳转，避免被弹窗拦截
        const officeWindow = openInNewWindow ? window.open('', '_blank') : null;
        getAttachmentOfficePreviewUrl(file, officeViewerUrl)
            .then(function (officeUrl) {
                if (openInNewWindow) {
                    if (officeWindow) {
                        officeWindow.location.href = officeUrl;
                    } else {
                        window.open(officeUrl, '_blank');
                    }
                    return;
                }
                openPreviewDrawer(React.createElement('div', { className: "w-full h-full flex flex-col" }, [
                    React.createElement('iframe', {
                        src: officeUrl,
                        className: "w-full flex-1 border-none"
                    })
                ]));
            })
            .catch(function (error) {
                console.error('获取附件临时下载地址失败，回退到内置预览:', error);
                if (officeWindow) {
                    officeWindow.close();
                }
                openPreviewDrawer(buildBuiltinPreviewContent());
            });
        return;
    } else {
        previewContent = buildBuiltinPreviewContent();
    }

    openPreviewDrawer(previewContent);
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
    const flowTemplateFilesService = getFlowTemplateFilesService(instance);
    return {
        "type": "form",
        "title": "表单",
        "body": [
          {
            "type": "wrapper",
            "size": "none",
            "className": "instance-attachment-toolbar",
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
              ...(flowTemplateFilesService ? [flowTemplateFilesService] : [])
            ]
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
