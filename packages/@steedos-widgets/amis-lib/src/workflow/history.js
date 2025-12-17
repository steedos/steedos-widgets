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
        "type": "table",
        "headerClassName": "hidden",
        "title": i18next.t('frontend_workflow_approval_history'),
        "source": "${historyApproves}",
        "className": "m-b-none instance-approve-history",
        "columnsTogglable": false,
        "rowClassNameExpr": "step-type-${step_type} ${type}-step-type-${step_type} ${type}-step-id-${step_id} ${type}-judge-${judgeValue} ${type==='approve' ? 'approve-type-' + approve_type : ''}",
        "footable": {
            "expand": "all"
        },
        "columns": [
          {
            "name": "name",
            "label": "name",
            "className": "name"
          },
          {
            "name": "user_name",
            "label": "user_name",
            "type": "tpl",
            "tpl": "<div><div>${opinion}</div>${user_name|raw}</div>",
            "className": "user_name"
          },
          {
            "name": "finish_date",
            "label": "finish_date",
            "classNameExpr": `<%= data.finish_date == '${i18next.t('frontend_workflow_approval_history_read')}' ? 'text-[blue]' : (data.finish_date == '${i18next.t('frontend_workflow_approval_history_unprocessed')}' ? 'finish_date text-[red]' : 'finish_date') %>`
            // "type": "datetime",
            // "format": "YYYY-MM-DD HH:mm"
          },
          {
            "name": "judge",
            "label": "judge",
            "classNameExpr": `<%= data.judge == '${i18next.t('frontend_workflow_approval_judge_approved')}' ? 'text-green-600' : (data.judge == '${i18next.t('frontend_workflow_approval_judge_rejected')}' ? 'judge text-[red]' : 'judge') %>`
          }
        ]
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