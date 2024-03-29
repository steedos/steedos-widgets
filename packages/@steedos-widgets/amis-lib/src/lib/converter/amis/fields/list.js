/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-23 09:12:14
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-25 13:28:35
 * @Description: 
 */

import * as Tpl from '../tpl';
import { Router } from '../../../router'
import { i18next } from '../../../../i18n'

async function getListBody(fields, options){
    const columns = [];
    for (const field of fields) {

        const tpl = await Tpl.getFieldTpl(field, options);

        let type = 'text';
        if(tpl){
            type = 'tpl';
        }
        if(!field.hidden && !field.extra){
            columns.push({
                name: field.name,
                label: field.label,
                sortable: field.sortable,
                // searchable: field.searchable,
                width: field.width,
                type: type,
                tpl: tpl,
                toggled: field.toggled
                // toggled: true 
            })
        }
    };

    return {
        "type": "hbox",
        "columns": columns
      };
}

function getDefaultParams(options){
    return {
        perPage: options.top || options.perPage || 20
    }
}

export async function getListSchema(fields, options){
    const listBody = await getListBody(fields, options);
    const columns = listBody.columns;
    return {
        mode: "list",
        name: "thelist",
        draggable: false,
        headerToolbar: ['reload'],
        syncLocation: false,
        keepItemSelectionOnPageChange: true,
        checkOnItemClick: false,
        labelTpl: `\${name}`, //TODO 获取name字段
        listItem: {
            body: [...columns],
            actions: options.actions === false ? null : [
                {
                    icon: "fa fa-eye",
                    label: i18next.t('frontend_form_view'),
                    type: "button",
                    actionType: "link",
                    link: Router.getObjectDetailPath({
                        formFactor: options.formFactor, 
                        appId: options.appId, 
                        objectName: options.tabId, 
                        listView: options.listView,
                        recordId: `\${_id}`
                    })
                }
            ]
        },
        ...getDefaultParams(options) //不可以使用crud的defaultParams属性，会造成翻页bug，https://github.com/steedos/steedos-platform/issues/6576
    }
}


export async function getCardSchema(fields, options){
    let title = null;
    const titleField = _.find(fields, (f)=>{
        return f.name === options.labelFieldName;
    });
    if(titleField){
        title = await Tpl.getFieldTpl(titleField, options)
    }
    const listBody = await getListBody(_.filter(fields, (f)=>{
        return f.name != options.labelFieldName
    }), options);
    return {
        mode: "cards",
        name: "cards",
        draggable: false,
        headerToolbar: ['statistics', 'pagination'],
        syncLocation: false,
        keepItemSelectionOnPageChange: false,
        checkOnItemClick: false,
        labelTpl: `\${${options.labelFieldName}}`,
        card: {
            "type": "card",
            "header": {
                "title": title
              },
            "body": [...listBody.columns]
          },
        ...getDefaultParams(options)
    }
}