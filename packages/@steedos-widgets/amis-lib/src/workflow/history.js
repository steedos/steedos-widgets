/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-24 16:48:28
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-11-03 11:16:43
 * @Description: 
 */

import _, { each } from 'lodash';
import i18next from "i18next";

export const getInstanceApprovalHistory = async ()=>{
    return {
        "type": "liquid",
        "className": "m-b-none instance-approve-history",
        "template": `
            <div class="text-base font-bold pb-2">签批历程</div>
            <table class="w-full text-sm text-left border-collapse border-2 border-black">
                <tbody class="text-gray-900">
                    {% for trace in historyApproves %}
                        {% assign children_count = trace.children | size %}
                        {% if children_count > 0 %}
                            {% assign row_span = children_count | times: 2 %}
                            {% for item in trace.children %}
                                {% if item.opinion and item.opinion != '' %}
                                    <!-- 有意见: 分两行显示 -->
                                    <!-- Row 1: 意见 -->
                                    <tr class="bg-white">
                                        <!-- 步骤名称 -->
                                        {% if forloop.first %}
                                        <td class="p-2 border-r border-b border-black text-center align-middle font-normal" style="width: 130px;" rowspan="{{ row_span }}">
                                            {{ trace.name }}
                                        </td>
                                        {% endif %}
                                        
                                        <!-- 意见 (跨3列) -->
                                        <td class="p-2 align-middle text-left" colspan="3">
                                            <div class="mb-1">{{ item.opinion }}</div>
                                        </td>
                                    </tr>
                                    
                                    <!-- Row 2: 人员、时间、结果 -->
                                    <tr class="bg-white">
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
                                                {% if item.judgeValue == 'approved' %}
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
                                    <tr class="bg-white">
                                        <!-- 步骤名称 -->
                                        {% if forloop.first %}
                                        <td class="p-2 border-r border-b border-black text-center align-middle font-normal" style="width: 130px;" rowspan="{{ row_span }}">
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
                                                {% if item.judgeValue == 'approved' %}
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
                                <td class="p-2 border-r border-black text-center align-middle font-normal" style="width: 130px;">
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