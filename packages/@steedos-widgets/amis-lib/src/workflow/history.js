/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-24 16:48:28
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-11-03 11:16:43
 * @Description: 
 */

import _, { each } from 'lodash';
import i18next from "i18next";

const getMobileInstanceApprovalHistory = async () => {
    return {
        "type": "liquid",
        "className": "m-b-none bg-white",
        "template": `
            <div class="instance-approve-history w-full bg-white border-t border-gray-100 mt-2">
                <div class="text-base font-bold py-3 px-4 text-gray-800 border-b border-gray-100">签批历程</div>
                <div class="flex flex-col w-full text-sm text-left pb-4">
                    {% for trace in historyApproves %}
                        {% assign children_count = trace.children | size %}
                        {% if children_count > 0 %}
                            
                            <!-- Step Name as Section Title -->
                            <div class="px-4 pt-4 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {{ trace.name }}
                            </div>

                            {% for item in trace.children %}
                                <div class="px-4 py-3 mx-4 bg-gray-50 rounded mb-2 border border-gray-100 shadow-sm">
                                    <!-- Opinion -->
                                    {% if item.opinion and item.opinion != '' %}
                                    <div class="mb-3 pb-2 border-b border-gray-200 text-sm text-gray-700 leading-relaxed">
                                        {{ item.opinion }}
                                    </div>
                                    {% endif %}
                                    <div class="flex justify-between items-start">
                                        <!-- User Name & Status -->
                                        <div class="flex flex-col w-full">
                                            <div class="flex items-center justify-between gap-2 w-full">
                                                <span class="font-bold text-gray-900 text-[15px]">{{ item.user_name }}</span>
                                                <!-- Status Badge (text only) -->
                                                {% if item.judge and item.judge != '' %}
                                                <span class="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex items-center
                                                    {% if item.auto_submitted %}bg-orange-100 text-orange-600 border border-orange-200
                                                    {% elsif item.judgeValue == 'approved' %}bg-green-100 text-green-700 border border-green-200
                                                    {% elsif item.judgeValue == 'rejected' %}bg-red-100 text-red-700 border border-red-200
                                                    {% elsif item.finish_date == '${i18next.t('frontend_workflow_approval_history_read')}' %}bg-blue-50 text-blue-600 border border-blue-200
                                                    {% else %}bg-gray-100 text-gray-600 border border-gray-200{% endif %}">
                                                    {% if item.auto_submitted %}<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 mr-1"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{% endif %}{{ item.judge }}
                                                </span>
                                                {% endif %}
                                            </div>
                                            <!-- Date -->
                                            <div class="text-xs text-gray-400 mt-1.5 flex items-center">
                                                {% if item.finish_date == '${i18next.t('frontend_workflow_approval_history_read')}' or item.finish_date == '${i18next.t('frontend_workflow_approval_history_unprocessed')}' %}
                                                    <!-- Special status text replacing date -->
                                                    <span class="{% if item.finish_date == '${i18next.t('frontend_workflow_approval_history_read')}' %}text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded{% elsif item.finish_date == '${i18next.t('frontend_workflow_approval_history_unprocessed')}' %}text-red-500 bg-red-50 px-1.5 py-0.5 rounded{% endif %}">
                                                        {{ item.finish_date }}
                                                    </span>
                                                {% else %}
                                                    <!-- Regular Date -->
                                                    <svg class="w-3 h-3 mr-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    {{ item.finish_date }}
                                                {% endif %}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {% endfor %}
                        {% endif %}
                    {% endfor %}
                </div>
            </div>
        `
    }
}

export const getInstanceApprovalHistory = async (box, isMobile)=>{
    if(box === 'draft'){
        return 
    }
    if (isMobile) {
        return await getMobileInstanceApprovalHistory();
    }
    return {
        "type": "liquid",
        "className": "m-b-none",
        "template": `
            <div class="instance-approve-history">
            <div class="text-base font-bold pb-2">签批历程</div>
            <table class="w-full text-base text-left border-collapse border-2 border-black">
                <tbody class="text-gray-900">
                    {% for trace in historyApproves %}
                        {% assign children_count = trace.children | size %}
                        {% if children_count > 0 %}
                            {% assign row_span = children_count | times: 2 %}
                            {% for item in trace.children %}
                                {% capture row_class_name %}step-type-{{trace.step_type}} {{item.type}}-step-type-{{trace.step_type}} {{item.type}}-step-id-{{trace.id}} {{item.type}}-judge-{{item.judgeValue}}{% if item.type == 'approve' %} approve-type-{{item.approve_type}}{% endif %}{% endcapture %}
                                {% if item.opinion and item.opinion != '' %}
                                    <!-- 有意见: 分两行显示 -->
                                    <!-- Row 1: 意见 -->
                                    <tr class="bg-white {{ row_class_name }}">
                                        <!-- 步骤名称 -->
                                        {% if forloop.first %}
                                        <td class="p-2 border-r border-b border-black text-center align-middle font-normal" style="width: 130px; border-right: 1px solid black; border-bottom: 1px solid black;" rowspan="{{ row_span }}">
                                            {{ trace.name }}
                                        </td>
                                        {% endif %}
                                        
                                        <!-- 意见 (跨3列) -->
                                        <td class="p-2 align-middle text-left" colspan="3">
                                            <div class="mb-1">{{ item.opinion }}</div>
                                        </td>
                                    </tr>
                                    
                                    <!-- Row 2: 人员、时间、结果 -->
                                    <tr class="bg-white {{ row_class_name }}">
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
                                    <tr class="bg-white {{ row_class_name }}">
                                        <!-- 步骤名称 -->
                                        {% if forloop.first %}
                                        <td class="p-2 border-r border-b border-black text-center align-middle font-normal" style="width: 130px; border-right: 1px solid black; border-bottom: 1px solid black;" rowspan="{{ row_span }}">
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
                                <td class="p-2 border-r border-black text-center align-middle font-normal" style="width: 130px; border-right: 1px solid black; border-bottom: 1px solid black;">
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
        `
    }
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

// 去除HTML标签，保留纯文本
const stripHtml = (str) => {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, '').trim();
}

// 获取审批历程竖向Timeline组件（桌面端右侧显示）
export const getInstanceApprovalSteps = (instance, box) => {
    if (box === 'draft') {
        return null;
    }

    const historyApproves = instance.historyApproves;
    if (!historyApproves || historyApproves.length === 0) {
        return null;
    }

    // 分析每个步骤的信息
    const stepsData = [];
    for (let i = 0; i < historyApproves.length; i++) {
        const trace = historyApproves[i];
        if (!trace.children || trace.children.length === 0) continue;

        const judgeValues = trace.children.map(c => c.judgeValue).filter(Boolean);
        const hasUnfinished = trace.children.some(child => {
            const jv = child.judgeValue;
            return !jv || jv === 'pending' || jv === 'inhand';
        });
        const hasRejected = judgeValues.includes('rejected');
        const hasReturned = judgeValues.includes('returned');
        const hasTerminated = judgeValues.includes('terminated');
        const hasRetrieved = judgeValues.includes('retrieved');

        // 步骤状态，按优先级判定
        // 流程已结束时，不再标记"当前环节"
        const instanceFinished = instance.state === 'completed' || instance.state === 'terminated';
        let status = 'submitted';
        if (hasUnfinished && !instanceFinished) {
            status = 'current';
        } else if (hasRejected) {
            status = 'rejected';
        } else if (hasReturned) {
            status = 'returned';
        } else if (hasTerminated) {
            status = 'terminated';
        } else if (hasRetrieved) {
            status = 'retrieved';
        } else if (trace.step_type === 'start') {
            status = 'submitted';
        } else {
            const lastJudge = judgeValues[judgeValues.length - 1];
            if (lastJudge === 'approved' || trace.step_type === 'sign' || trace.step_type === 'counterSign') {
                status = 'approved';
            } else {
                status = 'submitted';
            }
        }

        // 状态徽章
        let badge = '';
        let badgeClass = '';
        if (status === 'current') {
            badge = '处理中';
            badgeClass = 'tl-badge-current';
        } else if (status === 'rejected') {
            badge = '已驳回';
            badgeClass = 'tl-badge-rejected';
        } else if (status === 'returned') {
            badge = '已退回';
            badgeClass = 'tl-badge-returned';
        } else if (status === 'terminated') {
            badge = '已终止';
            badgeClass = 'tl-badge-terminated';
        } else if (status === 'retrieved') {
            badge = '已取回';
            badgeClass = 'tl-badge-retrieved';
        } else if (status === 'approved') {
            badge = '已核准';
            badgeClass = 'tl-badge-approved';
        } else {
            badge = '已提交';
            badgeClass = 'tl-badge-submitted';
        }

        stepsData.push({
            name: trace.name,
            status: status,
            badge: badge,
            badgeClass: badgeClass,
            stepType: trace.step_type,
            children: trace.children
        });
    }

    // 构建 Timeline HTML
    let timelineHtml = '';
    for (let i = 0; i < stepsData.length; i++) {
        const step = stepsData[i];
        const isLast = i === stepsData.length - 1;
        // 有结束节点时，最后一个步骤不算 last，需要保留连线到结束节点
        const hideConnectLine = isLast && instance.state !== 'completed';

        // 圆圈样式 —— 每种状态独立 icon
        let dotClass = 'tl-dot-submitted';
        // 已提交：纸飞机
        let dotIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
        if (step.status === 'approved') {
            // 已核准：对勾 ✓
            dotClass = 'tl-dot-approved';
            dotIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        } else if (step.status === 'current') {
            // 处理中：实心圆点 + 呼吸光晕
            dotClass = 'tl-dot-current';
            dotIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"></circle></svg>';
        } else if (step.status === 'rejected') {
            // 已驳回：X
            dotClass = 'tl-dot-rejected';
            dotIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        } else if (step.status === 'returned') {
            // 已退回：回退箭头
            dotClass = 'tl-dot-returned';
            dotIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>';
        } else if (step.status === 'terminated') {
            // 已终止：禁止 ⊘
            dotClass = 'tl-dot-terminated';
            dotIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>';
        } else if (step.status === 'retrieved') {
            // 已取回：撤回 ↺
            dotClass = 'tl-dot-retrieved';
            dotIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>';
        } else if (step.status === 'wait') {
            // 等待：时钟
            dotClass = 'tl-dot-wait';
            dotIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
        }

        // 卡片内容
        let cardContent = '';
        for (let j = 0; j < step.children.length; j++) {
            const child = step.children[j];
            const isSignImage = child.user_name && child.user_name.includes('image-sign');
            const userName = isSignImage ? child.user_name : stripHtml(child.user_name);

            // 个人级别的审批状态标签（当个人状态与步骤整体状态不同时显示）
            let personJudgeTag = '';
            const notableJudges = { 'rejected': 'tl-judge-rejected', 'returned': 'tl-judge-returned', 'terminated': 'tl-judge-terminated', 'retrieved': 'tl-judge-retrieved' };
            if (child.judgeValue && notableJudges[child.judgeValue]) {
                personJudgeTag = `<span class="tl-person-judge ${notableJudges[child.judgeValue]}">${stripHtml(child.judge)}</span>`;
            }

            cardContent += `<div class="tl-approve-person${j > 0 ? ' tl-approve-person-border' : ''}">`;
            // 人员头部：名字 + 日期同行
            if (isSignImage) {
                cardContent += `<div class="tl-person-row">`;
                cardContent += `<div class="tl-person-sign" style="flex:1;min-width:0;">${child.user_name}</div>`;
                if (child.finish_date) {
                    cardContent += `<span class="tl-person-date">${child.finish_date}</span>`;
                }
                cardContent += personJudgeTag;
                cardContent += `</div>`;
            } else {
                cardContent += `<div class="tl-person-row">`;
                cardContent += `<svg class="tl-person-avatar-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
                cardContent += `<span class="tl-person-name">${userName}</span>`;
                if (child.finish_date) {
                    cardContent += `<span class="tl-person-date">${child.finish_date}</span>`;
                }
                cardContent += personJudgeTag;
                cardContent += `</div>`;
            }
            // 意见
            if (child.opinion) {
                const opinionClass = child.judgeValue === 'rejected' ? 'tl-person-opinion tl-opinion-rejected' : 'tl-person-opinion';
                cardContent += `<div class="${opinionClass}">${stripHtml(child.opinion)}</div>`;
            }
            cardContent += `</div>`;
        }

        // 步骤标题栏（标题 + 徽章）+ 是否为当前环节
        const currentLabel = step.status === 'current' ? `<span class="tl-current-label">（当前环节）</span>` : '';

        timelineHtml += `
            <div class="tl-item${hideConnectLine ? ' tl-item-last' : ''}">
                <div class="tl-line-area">
                    <div class="tl-dot ${dotClass}">${dotIcon}</div>
                    ${!hideConnectLine ? '<div class="tl-line"></div>' : ''}
                </div>
                <div class="tl-card">
                    <div class="tl-card-header">
                        <span class="tl-step-name">${step.name}${currentLabel}</span>
                        <span class="tl-badge ${step.badgeClass}">${step.badge}</span>
                    </div>
                    <div class="tl-card-body">${cardContent}</div>
                </div>
            </div>
        `;
    }

    // 仅在审批单已结束时显示结束节点
    if (instance.state === 'completed') {
        timelineHtml += `
            <div class="tl-item tl-item-last">
                <div class="tl-line-area">
                    <div class="tl-dot tl-dot-end"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"></rect></svg></div>
                </div>
                <div class="tl-end-label">结束</div>
            </div>
        `;
    }

    const totalSteps = stepsData.length;

    return {
        type: "wrapper",
        size: "none",
        className: "instance-approval-steps-panel",
        body: [
            {
                type: "tpl",
                tpl: `<style>
                    .instance-timeline { padding: 0; }
                    .instance-timeline .tl-header {
                        padding-bottom: 12px;
                        border-bottom: 1px solid #e5e7eb;
                        margin-bottom: 16px;
                    }
                    .instance-timeline .tl-header-title {
                        font-size: 15px;
                        font-weight: 700;
                        color: #1f2937;
                    }
                    .instance-timeline .tl-header-sub {
                        font-size: 12px;
                        color: #9ca3af;
                        margin-top: 2px;
                    }
                    .instance-timeline .tl-item {
                        display: flex;
                        align-items: stretch;
                        position: relative;
                    }
                    .instance-timeline .tl-line-area {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 32px;
                        min-width: 32px;
                        position: relative;
                    }
                    .instance-timeline .tl-dot {
                        width: 24px;
                        height: 24px;
                        min-height: 24px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: bold;
                        z-index: 1;
                        flex-shrink: 0;
                    }
                    .instance-timeline .tl-dot-submitted {
                        background: #10b981;
                        color: #fff;
                    }
                    .instance-timeline .tl-dot-approved {
                        background: #10b981;
                        color: #fff;
                    }
                    .instance-timeline .tl-dot-current {
                        background: #3b82f6;
                        color: #fff;
                        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
                    }
                    .instance-timeline .tl-dot-rejected {
                        background: #ef4444;
                        color: #fff;
                    }
                    .instance-timeline .tl-dot-returned {
                        background: #f59e0b;
                        color: #fff;
                    }
                    .instance-timeline .tl-dot-terminated {
                        background: #6b7280;
                        color: #fff;
                    }
                    .instance-timeline .tl-dot-retrieved {
                        background: #8b5cf6;
                        color: #fff;
                    }
                    .instance-timeline .tl-dot-wait {
                        background: #d1d5db;
                        color: #6b7280;
                    }
                    .instance-timeline .tl-dot-end {
                        background: #9ca3af;
                        color: #fff;
                        font-size: 10px;
                    }
                    .instance-timeline .tl-line {
                        width: 2px;
                        flex: 1;
                        background: #e5e7eb;
                        min-height: 16px;
                    }
                    .instance-timeline .tl-card {
                        flex: 1;
                        margin-left: 12px;
                        margin-bottom: 12px;
                        background: #fff;
                        border: 1px solid #e2e8f0;
                        border-radius: 10px;
                        overflow: hidden;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                    }
                    .instance-timeline .tl-card-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 10px 14px;
                        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .instance-timeline .tl-step-name {
                        font-size: 13px;
                        font-weight: 600;
                        color: #1e293b;
                    }
                    .instance-timeline .tl-current-label {
                        font-size: 11px;
                        color: #3b82f6;
                        font-weight: 500;
                        margin-left: 4px;
                    }
                    .instance-timeline .tl-badge {
                        font-size: 11px;
                        padding: 1px 8px;
                        border-radius: 10px;
                        font-weight: 500;
                        white-space: nowrap;
                    }
                    .instance-timeline .tl-badge-submitted {
                        background: #d1fae5;
                        color: #059669;
                    }
                    .instance-timeline .tl-badge-approved {
                        background: #d1fae5;
                        color: #059669;
                    }
                    .instance-timeline .tl-badge-current {
                        background: #dbeafe;
                        color: #2563eb;
                    }
                    .instance-timeline .tl-badge-rejected {
                        background: #fee2e2;
                        color: #dc2626;
                    }
                    .instance-timeline .tl-badge-returned {
                        background: #fef3c7;
                        color: #d97706;
                    }
                    .instance-timeline .tl-badge-terminated {
                        background: #f3f4f6;
                        color: #4b5563;
                    }
                    .instance-timeline .tl-badge-retrieved {
                        background: #ede9fe;
                        color: #7c3aed;
                    }
                    .instance-timeline .tl-card-body {
                        padding: 10px 14px;
                    }
                    .instance-timeline .tl-approve-person {
                        padding: 8px 0;
                    }
                    .instance-timeline .tl-approve-person:first-child {
                        padding-top: 0;
                    }
                    .instance-timeline .tl-approve-person:last-child {
                        padding-bottom: 0;
                    }
                    .instance-timeline .tl-approve-person-border {
                        border-top: 1px dashed #e2e8f0;
                    }
                    .instance-timeline .tl-person-row {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        justify-content: space-between;
                    }
                    .instance-timeline .tl-person-avatar-icon {
                        color: #94a3b8;
                        flex-shrink: 0;
                    }
                    .instance-timeline .tl-person-name {
                        font-size: 14px;
                        font-weight: 600;
                        color: #1e293b;
                        flex: 1;
                    }
                    .instance-timeline .tl-person-sign .image-sign {
                        max-width: 100px;
                        max-height: 50px;
                        object-fit: contain;
                        display: block;
                        margin: 2px 0;
                    }
                    .instance-timeline .tl-person-date {
                        font-size: 12px;
                        color: #94a3b8;
                        white-space: nowrap;
                        flex-shrink: 0;
                    }
                    .instance-timeline .tl-person-judge {
                        font-size: 11px;
                        padding: 1px 6px;
                        border-radius: 4px;
                        white-space: nowrap;
                        flex-shrink: 0;
                        margin-left: 6px;
                        font-weight: 500;
                    }
                    .instance-timeline .tl-judge-rejected {
                        color: #dc2626;
                        background: #fef2f2;
                    }
                    .instance-timeline .tl-judge-returned {
                        color: #d97706;
                        background: #fffbeb;
                    }
                    .instance-timeline .tl-judge-terminated {
                        color: #6b7280;
                        background: #f3f4f6;
                    }
                    .instance-timeline .tl-judge-retrieved {
                        color: #7c3aed;
                        background: #f5f3ff;
                    }
                    .instance-timeline .tl-person-opinion {
                        margin-top: 8px;
                        padding: 8px 10px;
                        font-size: 13px;
                        color: #475569;
                        line-height: 1.6;
                        word-break: break-word;
                        background: #f8fafc;
                        border-left: 3px solid #cbd5e1;
                        border-radius: 0 6px 6px 0;
                    }
                    .instance-timeline .tl-opinion-rejected {
                        border-left-color: #ef4444;
                        background: #fef2f2;
                    }
                    .instance-timeline .tl-end-label {
                        margin-left: 12px;
                        font-size: 13px;
                        color: #9ca3af;
                        line-height: 24px;
                        font-weight: 500;
                    }
                    .instance-timeline .tl-item-last .tl-line-area {
                        min-height: auto;
                    }
                </style>`
            },
            {
                type: "tpl",
                tpl: `<div class="instance-timeline">
                    <div class="tl-header">
                        <div class="tl-header-title">签批历程</div>
                        <div class="tl-header-sub">总计 ${totalSteps} 个节点</div>
                    </div>
                    ${timelineHtml}
                </div>`
            }
        ]
    };
}