/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-24 16:48:28
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-11-03 11:16:43
 * @Description: 
 */

import _, { each } from 'lodash';
import i18next from "i18next";

// 签批历程行点击弹出明细对话框：通过 liquid 模板内 <script> 触发外层 service 的 broadcast 事件
const APPROVAL_DETAIL_EVENT = 'approval.detail.show';
// 表格容器唯一 id：click 委托用它定位审批历程的行
const APPROVAL_HISTORY_CONTAINER_ID = 'steedosInstanceApproveHistory';
// service wrapper className：click 委托绑到此 div 上，随 div 销毁自动释放，无需全局标记
const APPROVAL_HISTORY_WRAPPER_CLASS = 'instance-approve-history-wrapper';

// 行内点击桥：将 click 委托绑定到 service wrapper div（而非 document）
// - wrapper.__approvalBound 去重：防 liquid 重渲时同一 wrapper 重复绑定
// - capture 阶段：liquid 子节点存在 stopPropagation，bubble 阶段到不了 wrapper
// - wrapper 随 SPA 路由销毁时 listener 自动释放，无需手动 removeEventListener
const getRowClickScript = () => `
<script>
(function(){
    var wrapper = document.querySelector('.${APPROVAL_HISTORY_WRAPPER_CLASS}');
    if (!wrapper || wrapper.__approvalBound) return;
    wrapper.__approvalBound = true;
    var scoped = data && data._scoped;
    wrapper.addEventListener('click', function(e){
        var target = e.target;
        if (!target || !target.closest) return;
        if (target.closest('.cursor-default')) return;
        var tr = target.closest('#${APPROVAL_HISTORY_CONTAINER_ID} tr[data-user-name]');
        if (!tr) return;
        // 底部签批栏（drawer）打开或正在关闭时不弹出明细对话框：
        // amis 在 drawer 外侧 mousedown 即开始关闭，由于关闭由本次 click 触发，
        // 检查 .antd-Drawer-content.in 会在 click 阶段恰好为 false，因此改为检查
        // drawer 容器是否仍存在于 DOM（关闭动画结束后会被移除）。
        if (document.querySelector('.amis-dialog-widget.antd-Drawer, .amis-dialog-widget.cxd-Drawer')) return;
        var dataset = Object.assign({}, tr.dataset);
        setTimeout(function(){
            try {
                scoped.doAction([
                    {
                        actionType: 'broadcast',
                        args: { eventName: '${APPROVAL_DETAIL_EVENT}' },
                        data: dataset
                    }
                ]);
            } catch (err) {
                console.warn('签批历程行点击事件触发失败:', err);
            }
        }, 0);
    }, true);
})();
</script>
`;

// 签批明细对话框 schema：dialog body 通过 amis 表达式读取从 broadcast 透传过来的数据
// 字段对齐老系统：处理人 / 部门 / 操作 / 处理意见 / 开始时间 / 结束时间
const getApprovalDetailDialogAction = () => {
    const t = (key) => i18next.t(key);
    const L = {
        title: t('frontend_workflow_approval_history_detail_title'),
        handler: t('frontend_workflow_approval_history_detail_handler'),
        organization: t('frontend_workflow_approval_history_detail_organization'),
        judge: t('frontend_workflow_approval_history_detail_judge'),
        opinion: t('frontend_workflow_approval_history_detail_opinion'),
        startDate: t('frontend_workflow_approval_history_detail_start_date'),
        finishDate: t('frontend_workflow_approval_history_detail_finish_date'),
        isRead: t('frontend_workflow_approval_history_detail_is_read'),
        yes: t('frontend_workflow_approval_history_detail_yes'),
        no: t('frontend_workflow_approval_history_detail_no'),
        close: t('frontend_workflow_approval_history_detail_close')
    };
    return ({
    actionType: 'dialog',
    // 显式将 event.data 注入 dialog 的数据作用域，保证 ${...} 表达式能取到值
    data: {
        stepName: '${event.data.stepName}',
        userName: '${event.data.userName}',
        organizationName: '${event.data.organizationName}',
        signatureUrl: '${event.data.signatureUrl}',
        startDate: '${event.data.startDate}',
        finishDate: '${event.data.finishDate}',
        finishDateDisplay: '${event.data.finishDateDisplay}',
        judge: '${event.data.judge}',
        judgeValue: '${event.data.judgeValue}',
        judgeDisplay: '${event.data.judgeDisplay}',
        isFinished: '${event.data.isFinished}',
        isRead: '${event.data.isRead}',
        opinion: '${event.data.opinion}',
        autoSubmitted: '${event.data.autoSubmitted}',
        approveType: '${event.data.approveType}'
    },
    dialog: {
        type: 'dialog',
        // amis dialog title 支持 ${} 表达式，无效则降级显示「签批明细」
        title: '${stepName ? stepName : "' + L.title + '"}',
        size: 'md',
        showCloseButton: true,
        closeOnEsc: true,
        actions: [
            { type: 'button', label: L.close, actionType: 'cancel', level: 'primary' }
        ],
        body: {
            type: 'wrapper',
            className: 'p-0',
            body: [
                {
                    type: 'tpl',
                    tpl: '<div class="mb-2"><span class="font-semibold text-gray-700">' + L.handler + '：</span><span class="text-gray-900">${userName | html}</span></div>'
                },
                {
                    type: 'tpl',
                    visibleOn: '${organizationName && organizationName != ""}',
                    tpl: '<div class="mb-2"><span class="font-semibold text-gray-700">' + L.organization + '：</span><span class="text-gray-900">${organizationName | html}</span></div>'
                },
                {
                    type: 'tpl',
                    visibleOn: '${judgeDisplay && judgeDisplay != "" && autoSubmitted == "true"}',
                    tpl: '<div class="mb-2"><span class="font-semibold text-gray-700">' + L.judge + '：</span>'
                        + '<span class="inline-flex items-center align-middle" style="color:#f97316">'
                        + '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:16px;height:16px;margin-right:4px;display:inline-block;vertical-align:-3px;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
                        + '${judgeDisplay | html}</span></div>'
                },
                {
                    type: 'tpl',
                    visibleOn: '${judgeDisplay && judgeDisplay != "" && autoSubmitted != "true" && judgeValue == "approved"}',
                    tpl: '<div class="mb-2"><span class="font-semibold text-gray-700">' + L.judge + '：</span>'
                        + '<span class="inline-flex items-center align-middle" style="color:#16a34a">'
                        + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;margin-right:4px;display:inline-block;vertical-align:-3px;"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd"/></svg>'
                        + '${judgeDisplay | html}</span></div>'
                },
                {
                    type: 'tpl',
                    visibleOn: '${judgeDisplay && judgeDisplay != "" && autoSubmitted != "true" && judgeValue == "rejected"}',
                    tpl: '<div class="mb-2"><span class="font-semibold text-gray-700">' + L.judge + '：</span>'
                        + '<span class="inline-flex items-center align-middle" style="color:#dc2626">'
                        + '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:16px;height:16px;margin-right:4px;display:inline-block;vertical-align:-3px;"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>'
                        + '${judgeDisplay | html}</span></div>'
                },
                {
                    type: 'tpl',
                    visibleOn: '${judgeDisplay && judgeDisplay != "" && autoSubmitted != "true" && judgeValue != "approved" && judgeValue != "rejected"}',
                    tpl: '<div class="mb-2"><span class="font-semibold text-gray-700">' + L.judge + '：</span><span style="color:#374151">${judgeDisplay | html}</span></div>'
                },
                {
                    type: 'tpl',
                    visibleOn: '${opinion && opinion != ""}',
                    tpl: '<div class="mb-2"><span class="font-semibold text-gray-700">' + L.opinion + '：</span><span class="text-gray-900 whitespace-pre-wrap break-words">${opinion | html}</span></div>'
                },
                {
                    type: 'tpl',
                    visibleOn: '${startDate && startDate != ""}',
                    tpl: '<div class="mb-2"><span class="font-semibold text-gray-700">' + L.startDate + '：</span><span class="text-gray-900">${startDate | substring:0:16}</span></div>'
                },
                {
                    type: 'tpl',
                    visibleOn: '${isFinished == "true" && finishDate && finishDate != ""}',
                    tpl: '<div class="mb-2"><span class="font-semibold text-gray-700">' + L.finishDate + '：</span><span class="text-gray-900">${finishDate | substring:0:16}</span></div>'
                },
                {
                    type: 'tpl',
                    visibleOn: '${isFinished != "true"}',
                    tpl: '<div class="mb-2"><span class="font-semibold text-gray-700">' + L.isRead + '：</span><span class="text-gray-900">${isRead == "true" ? "' + L.yes + '" : "' + L.no + '"}</span></div>'
                }
            ]
        }
    }
});
};

// 用 service 包裹真实的 liquid 表格，监听行点击 broadcast 事件
const wrapWithDetailDialog = (tableSchema) => ({
    type: 'service',
    id: 'instance_approve_history_service',
    className: APPROVAL_HISTORY_WRAPPER_CLASS,
    onEvent: {
        [APPROVAL_DETAIL_EVENT]: {
            weight: 0,
            actions: [getApprovalDetailDialogAction()]
        }
    },
    body: [tableSchema]
});

// 手机端紧凑表格：步骤名独占一整行 + 审批明细三列（审批人 / 时间 / 结果）
// + 可选意见行，对齐旧系统“签核历程”信息密度。
const getMobileInstanceApprovalHistory = async () => {
    return wrapWithDetailDialog({
        "type": "liquid",
        "className": "m-b-none bg-white",
        "template": `
            <div id="${APPROVAL_HISTORY_CONTAINER_ID}" class="instance-approve-history w-full bg-white mt-2">
                <div class="text-base font-bold pb-2 text-gray-800">签批历程</div>
                <table class="w-full table-fixed border-collapse text-xs text-left text-gray-900">
                    <colgroup>
                        <col style="width:28%" />
                        <col style="width:44%" />
                        <col style="width:28%" />
                    </colgroup>
                    <tbody>
                    {% for trace in historyApproves %}
                        {% assign children_count = trace.children | size %}
                        {% if children_count > 0 %}
                            <!-- 步骤名行：独占一整行 -->
                            <tr class="step-type-{{trace.step_type}} bg-gray-100">
                                <td class="px-1.5 py-1 font-medium text-gray-700 border-b border-gray-200" colspan="3">
                                    {{ trace.name }}
                                </td>
                            </tr>
                            {% for item in trace.children %}
                                {% capture row_class_name %}step-type-{{trace.step_type}} {{item.type}}-step-type-{{trace.step_type}} {{item.type}}-step-id-{{trace.step_id}} {{item.type}}-judge-{{item.judgeValue}}{% if item.type == 'approve' %} approve-type-{{item.approve_type}}{% endif %}{% endcapture %}
                                {% capture row_data_attrs %}data-step-name="{{ trace.name | escape }}" data-user-name="{{ item.user_name_text | escape }}" data-signature-url="{{ item.signature_url | escape }}" data-finish-date="{{ item.finish_date_raw | escape }}" data-finish-date-display="{{ item.finish_date | escape }}" data-judge="{{ item.judge | escape }}" data-judge-value="{{ item.judgeValue | escape }}" data-opinion="{{ item.opinion | escape }}" data-auto-submitted="{{ item.auto_submitted }}" data-approve-type="{{ item.approve_type | escape }}" data-organization-name="{{ item.organization_name | escape }}" data-start-date="{{ item.start_date_raw | escape }}" data-judge-display="{{ item.judge_display | escape }}" data-is-finished="{{ item.is_finished }}" data-is-read="{{ item.is_read }}"{% endcapture %}
                                <!-- 审批明细行：审批人 / 时间 / 结果 -->
                                <tr class="bg-white {{ row_class_name }}" {{ row_data_attrs }}>
                                    <td class="px-1.5 py-1 align-middle border-b border-gray-100 truncate">{{ item.user_name }}</td>
                                    <td class="px-1.5 py-1 align-middle border-b border-gray-100 whitespace-nowrap text-gray-600">
                                        {% if item.finish_date == '${i18next.t('frontend_workflow_approval_history_read')}' %}
                                            <span class="text-sky-500">{{ item.finish_date }}</span>
                                        {% elsif item.finish_date == '${i18next.t('frontend_workflow_approval_history_unprocessed')}' %}
                                            <span class="text-red-500">{{ item.finish_date }}</span>
                                        {% else %}
                                            {{ item.finish_date | slice: 5, 11 }}
                                        {% endif %}
                                    </td>
                                    <td class="px-1.5 py-1 align-middle border-b border-gray-100 text-center">
                                        {% if item.judge and item.judge != '' %}
                                            {% if item.auto_submitted %}
                                                <span class="inline-flex items-center font-bold whitespace-nowrap" style="color: orange;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 mr-0.5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {{ item.judge }}
                                                </span>
                                            {% elsif item.judgeValue == 'approved' %}
                                                <span class="inline-flex items-center text-green-600 font-bold whitespace-nowrap">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 mr-0.5">
                                                        <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" />
                                                    </svg>
                                                    {{ item.judge }}
                                                </span>
                                            {% elsif item.judgeValue == 'rejected' %}
                                                <span class="inline-flex items-center text-red-600 font-bold whitespace-nowrap">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 mr-0.5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    {{ item.judge }}
                                                </span>
                                            {% else %}
                                                {{ item.judge }}
                                            {% endif %}
                                        {% endif %}
                                    </td>
                                </tr>
                                {% if item.opinion and item.opinion != '' %}
                                    <!-- 意见行：跨 3 列，最多 2 行省略 -->
                                    <tr class="bg-white {{ row_class_name }}" {{ row_data_attrs }}>
                                        <td class="px-1.5 py-1 border-b border-gray-100 text-gray-700" colspan="3">
                                            <div style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-all;">{{ item.opinion }}</div>
                                        </td>
                                    </tr>
                                {% endif %}
                            {% endfor %}
                        {% endif %}
                    {% endfor %}
                    </tbody>
                </table>
            </div>
            ${getRowClickScript()}
        `
    });
}

export const getInstanceApprovalHistory = async (box, isMobile)=>{
    if(box === 'draft'){
        return 
    }
    if (isMobile) {
        return await getMobileInstanceApprovalHistory();
    }
    return await getDesktopInstanceApprovalHistory();
}

// 桌面端签批历程：四列 rowspan 表格，行点击弹出明细对话框
const getDesktopInstanceApprovalHistory = async () => {
    return wrapWithDetailDialog({
        "type": "liquid",
        "className": "m-b-none",
        "template": `
            <div id="${APPROVAL_HISTORY_CONTAINER_ID}" class="instance-approve-history">
            <div class="text-base font-bold pb-2">签批历程</div>
            <table class="w-full text-base text-left border-collapse border-2 border-black">
                <tbody class="text-gray-900">
                    {% for trace in historyApproves %}
                        {% assign children_count = trace.children | size %}
                        {% if children_count > 0 %}
                            {% assign row_span = children_count | times: 2 %}
                            {% for item in trace.children %}
                                {% capture row_class_name %}step-type-{{trace.step_type}} {{item.type}}-step-type-{{trace.step_type}} {{item.type}}-step-id-{{trace.id}} {{item.type}}-judge-{{item.judgeValue}}{% if item.type == 'approve' %} approve-type-{{item.approve_type}}{% endif %}{% endcapture %}
                                {% capture row_data_attrs %}data-step-name="{{ trace.name | escape }}" data-user-name="{{ item.user_name_text | escape }}" data-signature-url="{{ item.signature_url | escape }}" data-finish-date="{{ item.finish_date_raw | escape }}" data-finish-date-display="{{ item.finish_date | escape }}" data-judge="{{ item.judge | escape }}" data-judge-value="{{ item.judgeValue | escape }}" data-opinion="{{ item.opinion | escape }}" data-auto-submitted="{{ item.auto_submitted }}" data-approve-type="{{ item.approve_type | escape }}" data-organization-name="{{ item.organization_name | escape }}" data-start-date="{{ item.start_date_raw | escape }}" data-judge-display="{{ item.judge_display | escape }}" data-is-finished="{{ item.is_finished }}" data-is-read="{{ item.is_read }}"{% endcapture %}
                                {% if item.opinion and item.opinion != '' %}
                                    <!-- 有意见: 分两行显示 -->
                                    <!-- Row 1: 意见 -->
                                    <tr class="bg-white {{ row_class_name }}" {{ row_data_attrs }}>
                                        <!-- 步骤名称 -->
                                        {% if forloop.first %}
                                        <td class="cursor-default p-2 border-r border-b border-black text-center align-middle font-normal" style="width: 130px; border-right: 1px solid black; border-bottom: 1px solid black;" rowspan="{{ row_span }}">
                                            {{ trace.name }}
                                        </td>
                                        {% endif %}
                                        
                                        <!-- 意见 (跨3列) -->
                                        <td class="p-2 align-middle text-left" colspan="3">
                                            <div class="mb-1">{{ item.opinion }}</div>
                                        </td>
                                    </tr>
                                    
                                    <!-- Row 2: 人员、时间、结果 -->
                                    <tr class="bg-white {{ row_class_name }}" {{ row_data_attrs }}>
                                        <!-- 人员 -->
                                        <td class="p-2 align-middle border-b border-black" style="min-width: 200px;">
                                            <div>{{ item.user_name }}</div>
                                        </td>

                                        <!-- 时间 -->
                                        <td class="p-2 text-center align-middle whitespace-nowrap border-b border-black" style="width: 160px;">
                                            <span class="{% if item.finish_date == '${i18next.t('frontend_workflow_approval_history_read')}' %}text-sky-500{% elsif item.finish_date == '${i18next.t('frontend_workflow_approval_history_unprocessed')}' %}text-red-500{% endif %}">
                                                {{ item.finish_date }}
                                            </span>
                                        </td>

                                        <!-- 审批结果 -->
                                        <td class="p-2 align-middle text-center border-b border-black" style="width: 160px;"> 
                                            <div class="flex items-center justify-center">
                                                {% if item.auto_submitted %}
                                                    <span class="flex items-center font-bold" style="color: orange;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mr-1">
                                                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {{ item.judge }}
                                                    </span>
                                                {% elsif item.judgeValue == 'approved' %}
                                                    <span class="flex items-center text-green-600 font-bold">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mr-1 font-bold">
                                                        <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" />
                                                        </svg>
                                                        {{ item.judge }}
                                                    </span>
                                                {% elsif item.judgeValue == 'rejected' %}
                                                    <span class="flex items-center text-red-600 font-bold">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mr-1 font-bold">
                                                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        {{ item.judge }}
                                                    </span>
                                                {% else %}
                                                    {{ item.judge }}
                                                {% endif %}
                                            </div>
                                        </td>
                                    </tr>
                                {% else %}
                                    <!-- 无意见: 合并显示, 垂直居中 -->
                                    <tr class="bg-white {{ row_class_name }}" {{ row_data_attrs }}>
                                        <!-- 步骤名称 -->
                                        {% if forloop.first %}
                                        <td class="cursor-default p-2 border-r border-b border-black text-center align-middle font-normal" style="width: 130px; border-right: 1px solid black; border-bottom: 1px solid black;" rowspan="{{ row_span }}">
                                            {{ trace.name }}
                                        </td>
                                        {% endif %}
                                        
                                        <!-- 人员 (rowspan=2) -->
                                        <td class="p-2 align-middle border-b border-black" style="min-width: 200px;" rowspan="2">
                                            <div>{{ item.user_name }}</div>
                                        </td>

                                        <!-- 时间 (rowspan=2) -->
                                        <td class="p-2 text-center align-middle whitespace-nowrap border-b border-black" style="width: 160px;" rowspan="2">
                                            <span class="{% if item.finish_date == '${i18next.t('frontend_workflow_approval_history_read')}' %}text-sky-500{% elsif item.finish_date == '${i18next.t('frontend_workflow_approval_history_unprocessed')}' %}text-red-500{% endif %}">
                                                {{ item.finish_date }}
                                            </span>
                                        </td>

                                        <!-- 审批结果 (rowspan=2) -->
                                        <td class="p-2 align-middle text-center border-b border-black" style="width: 160px;" rowspan="2"> 
                                            <div class="flex items-center justify-center">
                                                {% if item.auto_submitted %}
                                                    <span class="flex items-center font-bold" style="color: orange;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mr-1">
                                                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {{ item.judge }}
                                                    </span>
                                                {% elsif item.judgeValue == 'approved' %}
                                                    <span class="flex items-center text-green-600 font-bold">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mr-1 font-bold">
                                                        <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" />
                                                        </svg>
                                                        {{ item.judge }}
                                                    </span>
                                                {% elsif item.judgeValue == 'rejected' %}
                                                    <span class="flex items-center text-red-600 font-bold">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mr-1 font-bold">
                                                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        {{ item.judge }}
                                                    </span>
                                                {% else %}
                                                    {{ item.judge }}
                                                {% endif %}
                                            </div>
                                        </td>
                                    </tr>
                                    <!-- 占位空行, 配合左侧 rowspan=children*2 和右侧 rowspan=2 -->
                                    <tr class="bg-white"></tr>
                                {% endif %}
                            {% endfor %}
                        {% else %}
                            <tr class="bg-white border-b border-black">
                                <td class="cursor-default p-2 border-r border-black text-center align-middle font-normal" style="width: 130px; border-right: 1px solid black; border-bottom: 1px solid black;">
                                    {{ trace.name }}
                                </td>
                                <td class="p-2 align-middle border-b border-black" style="min-width: 200px;"></td>
                                <td class="p-2 text-center align-middle whitespace-nowrap border-b border-black" style="width: 160px;"></td>
                                <td class="p-2 align-middle text-center border-b border-black" style="width: 160px;"></td>
                            </tr>
                        {% endif %}
                    {% endfor %}
                </tbody>
            </table>
            </div>
            ${getRowClickScript()}
        `
    });
}


const getTrs = (instance)=>{
    const { traces } = instance;
    _.each(traces, (trace)=>{
        console.log(`trace`, trace)
    })
}

export const getINstanceApproveHistory2 = async (instance)=>{
    
    return {
        type: "table-view",
        className: "instance-history",
        trs: await getTrs(instance),
        id: "u:instance-history",
      };
}