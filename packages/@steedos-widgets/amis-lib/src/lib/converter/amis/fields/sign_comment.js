/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-11-04 12:00:23
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-11-05 23:01:39
 */
import * as _ from 'lodash'
export function signCommentToAmis(field, readonly, ctx) {
    if (!ctx) {
        ctx = {};
    }

    let signComment = `
        '<div class="instance-sign-item' +  (item.is_finished ? ' mt-1' : ' text-gray-500 border-l-2 px-1 border-blue-500 my-approve not-finished') + '">' + 
            '<p class="m-0 p-0">' + item.description + '</p>' + 
            '&emsp;&emsp;' + global.user.name + 
        '</div>'`;
    let html = `
        \${JOIN(ARRAYMAP(record.signCommentFields["${field.name}"].comments, item => ${signComment}), '')}
    `;
    let amisSchema = {
        "type": "wrapper",
        "className": "instance-sign",
        "body": [
            {
                "type": "tpl",
                "tpl": html,
                "className": "instance-sign-content block m-2.5"
            }
            // TODO:签批链接，点击弹出填写签批意见，readonly时不显示签批链接
        ],
        "size": "none"
    };
    return amisSchema;
}
