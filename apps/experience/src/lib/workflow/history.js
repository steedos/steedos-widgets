/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-24 16:48:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-27 16:45:58
 * @Description: 
 */

import _, { each } from 'lodash';

export const getInstanceApprovalHistory = async ()=>{
    return {
        "type": "table",
        "headerClassName": "hidden",
        "title": "签批历程",
        "source": "${historyApproves}",
        "className": "m-b-none instance-approve-history",
        "columnsTogglable": false,
        "footable": {
            "expand": "all"
        },
        "columns": [
          {
            "name": "name",
            "label": "name"
          },
          {
            "name": "user_name",
            "label": "user_name",
            "type": "tpl",
            "tpl": "<div><div>${opinion}</div>${user_name}</div>"
          },
          {
            "name": "finish_date",
            "label": "finish_date",
            "classNameExpr": "<%= data.finish_date == '已读' ? 'text-[blue]' : (data.finish_date == '未处理' ? 'text-[red]' : '') %>"
            // "type": "datetime",
            // "format": "YYYY-MM-DD HH:mm"
          },
          {
            "name": "judge",
            "label": "judge",
            "classNameExpr": "<%= data.judge == '已核准' ? 'text-green-600' : (data.judge == '已驳回' ? 'text-[red]' : '') %>"
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