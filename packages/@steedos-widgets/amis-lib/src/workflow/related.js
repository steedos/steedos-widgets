/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-16 17:26:12
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-08-31 09:46:58
 * @Description: 
 */
import { map, isEmpty } from 'lodash'
import { getSteedosAuth } from '@steedos-widgets/amis-lib';
import i18next from "i18next";
export const getRelatedRecords = async (instance)=>{
    if(!instance.record_ids || isEmpty(instance.record_ids)){
        return ;
    }
    return map(instance.record_ids, (item)=>{
        return {
            type: 'tpl',
            tpl: `<a href='/app/-/${item.o}/view/${item.ids[0]}' target='_blank'>${i18next.t('frontend_workflow_related_records_link_title')}</a>`
        }
    })
}

export const getRelatedInstances = async (instance)=>{
    const instanceId = instance._id;
    const title = i18next.t('frontend_workflow_related_file');
    return {
        "type": "panel",
        className: "instance-related-list border-none bg-none shadow-none",
        headerClassName: "p-0 border-none mb-1",
        bodyClassName: "p-0",
        "title": {
            type: 'tpl',
            tpl: `<span class="antd-List-heading">${title}</span>`,
            visibleOn: "${related_instances && related_instances.length > 0}"
        },
        visibleOn: "${related_instances && related_instances.length > 0}",
        "body": [
            {
                "type": "liquid",
                "template": `<div id="related-instances-data" data-instances='{% assign json_arr = "[]" %}{% if related_instances.size > 0 %}[{% for item in related_instances %}{"_id":"{{ item._id }}","name":"{{ item.name }}"}{% unless forloop.last %},{% endunless %}{% endfor %}]{% else %}[]{% endif %}' style="display:none"></div>\n<div class="w-full bg-white divide-y divide-gray-100 instance-scrollable-list">\n    {% for item in related_instances %}\n    <div class="flex items-center justify-between p-2 hover:bg-gray-50 transition-colors">\n        <div class="flex items-center space-x-2 truncate flex-1 mr-4">\n            <svg class="w-4 h-4 text-blue-500 shrink-0 no-print" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>\n            </svg>\n            <a href="/app/approve_workflow/page/page_instance_view?embed=1&recordId={{ item._id }}" target="_blank"\n                class="text-base font-medium text-gray-700 hover:text-blue-600 hover:underline truncate text-left"\n                title="{{ item.name }}">{{ item.name }}</a>\n        </div>\n        <div class="flex items-center space-x-3">\n            {% if record.box == 'draft' or record.box == 'inbox' %}{% if record.step.can_edit_main_attach or record.step.can_edit_normal_attach or record.step.can_edit_normal_attach == nil %}<button onclick="window.deleteRelatedInstance('{{ item._id }}', '{{ item.name }}')"\n                class="text-gray-400 hover:text-red-500 transition-colors no-print" title="删除">\n                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>\n                </svg>\n            </button>{% endif %}{% endif %}\n        </div>\n    </div>\n    {% endfor %}\n</div>\n<script>\nwindow.deleteRelatedInstance = function(deleteId, name) {\n    SteedosUI.Modal.confirm({\n        title: '确认删除',\n        content: '确定要删除相关文件 "' + name + '" 吗？',\n        okText: '删除',\n        okType: 'danger',\n        cancelText: '取消',\n        onOk() {\n            var el = document.getElementById('related-instances-data');\n            var related = [];\n            try { related = JSON.parse(el.getAttribute('data-instances') || '[]'); } catch(e) {}\n            var newRelated = [];\n            for(var i = 0; i < related.length; i++){\n                if(related[i]._id !== deleteId){\n                    newRelated.push(related[i]._id);\n                }\n            }\n            Steedos.authRequest('/api/workflow/v2/instance/change/related', {\n                type: 'POST',\n                data: JSON.stringify({ id: '${instanceId}', related_instances: newRelated }),\n                contentType: 'application/json',\n                async: false\n            });\n            $(".instance-related-reload").trigger("click");\n        }\n    });\n};\n</script>`,
                "id": "u:related_instances_liquid"
            },
            {
                "type": "button",
                "className": "hidden instance-related-reload",
                "onEvent": {
                    "click": {
                        "weight": 0,
                        "actions": [
                            {
                                "componentId": "u:instancePage",
                                "args": {},
                                "actionType": "reload"
                            }
                        ]
                    }
                }
            }
        ],
        "id": "related_instances"
    }
}