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
            <table class="w-full text-sm text-left border-collapse border-2 border-black">
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
                                            <div class="font-[SimSun]">{{ item.user_name }}</div>
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
                                            <div class="font-[SimSun]">{{ item.user_name }}</div>
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