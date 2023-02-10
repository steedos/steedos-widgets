/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-23 09:53:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-10 11:53:44
 * @Description: 
 */
import { Router } from '../../router'
 import { getUISchema } from '../../objects'

export function getCreatedInfoTpl(formFactor){
    const href = Router.getObjectDetailPath({
        formFactor, appId: "admin", objectName: 'users', recordId: '${created_by._id}'
    })
    return `<div><a href='${href}'>\${_display.created_by.label}</a>\${_display.created}</div>`
}

export function getModifiedInfoTpl(formFactor){
    const href = Router.getObjectDetailPath({
        formFactor, appId: "admin", objectName: 'users', recordId: '${modified_by._id}'
    })
    return `<div><a href='${href}'>\${_display.modified_by.label}</a>\${_display.modified}</div>`
}

export function getNumberTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}

export function getTimeTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}

export function getDateTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}


export function getDateTimeTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}

export function getUiFieldTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}

export function getUiFileSizeTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}

//TODO 处理name字段
export async function getRefObjectNameFieldName(field){
    const refUiSchema = await getUISchema(field.reference_to)
    const NAME_FIELD_KEY = refUiSchema.NAME_FIELD_KEY || 'name';
    return NAME_FIELD_KEY;
}

export function getSelectTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}

export function getNameTplUrl(field, ctx){
    if(ctx.objectName === 'cms_files'){
        return `\${context.rootUrl}/api/files/files/\${versions[0]}?download=true`
    }
    const href = Router.getObjectDetailPath({
        ...ctx,  formFactor: ctx.formFactor, appId: "${appId}", objectName: ctx.objectName || "${objectName}", recordId: `\${${ctx.idFieldName}}`
    })
    return href;
}

export function getNameTpl(field, ctx){
    const href = getNameTplUrl(field, ctx);
    return `<a href="${href}">\${${field.name}}</a>`
}

export function getRelatedFieldTpl(field, ctx){
    let tpl = '';
    if(!field.reference_to && (field.optionsFunction || field._optionsFunction)){
        return `\${${field.name}__label}`
    }

    const onlyDisplayLabel = ctx.onlyDisplayLabel;
    if(_.isString(field.reference_to) || !field.reference_to){
        if(field.multiple){
            let labelTpl = `<%=item.label%>`;
            if(!onlyDisplayLabel){
                const href = Router.getObjectDetailPath({
                    formFactor: ctx.formFactor, appId: ctx.appId, objectName: `<%=item.objectName%>`, recordId: `<%=item.value%>`, _templateType: "JavaScript"
                })
                labelTpl = `<a href="${href}"><%=item.label%></a>`;
            }
            tpl = `
            <% if (data._display.${field.name} && data._display.${field.name}.length) { %><% data._display.${field.name}.forEach(function(item) { %> ${labelTpl}  <% }); %><% } %>
            `
        }else{
            let labelTpl = `\${_display.${field.name}.label}`;
            if(!onlyDisplayLabel){
                const href = Router.getObjectDetailPath({
                    formFactor: ctx.formFactor, appId: ctx.appId, objectName: `\${_display.${field.name}.objectName}`, recordId: `\${_display.${field.name}.value}`
                })
                labelTpl = `<a href="${href}">\${_display.${field.name}.label}</a>`;
            }
            tpl = labelTpl;
        }

        
    }else{
        let labelTpl = `<%=item.label%>`;
        if(!onlyDisplayLabel){
            const href = Router.getObjectDetailPath({
                formFactor: ctx.formFactor, appId: ctx.appId, objectName: `<%=item.objectName%>`, recordId: `<%=item.value%>`, _templateType: "JavaScript"
            })
            labelTpl = `<a href="${href}"><%=item.label%></a>`;
        }
        tpl = `
        <% if (data._display.${field.name} && data._display.${field.name}.length) { %><% data._display.${field.name}.forEach(function(item) { %> ${labelTpl}  <% }); %><% } %>
        `
    }
    return tpl
}

export async function getLookupTpl(field, ctx){
    if(!field.reference_to){
        return getSelectTpl(field)
    }
    const NAME_FIELD_KEY = await getRefObjectNameFieldName(field);
    if(field.multiple){
        const href = Router.getObjectDetailPath({
            formFactor: ctx.formFactor, appId: ctx.appId, objectName: field.reference_to, recordId: `<%=item._id%>`, _templateType: "JavaScript"
        })
        return `
        <% if (data.${field.name} && data.${field.name}.length) { %><% data.${field.name}.forEach(function(item) { %> <a href="${href}"><%=item.${NAME_FIELD_KEY}%></a>  <% }); %><% } %>
        `
    }else{
        const href = Router.getObjectDetailPath({
            formFactor: ctx.formFactor, appId: ctx.appId, objectName: field.reference_to, recordId: `\${${field.name}._id}`
        })
        return `<a href="${href}">\${${field.name}.${NAME_FIELD_KEY}}</a>`
    }
    
}

export function getSwitchTpl(field){
    return `<% if (data.${field.name}) { %>
    <span class="slds-icon_container slds-icon-utility-check slds-current-color" title="<%=data._display.${field.name}%>">
        <span ><%= data._display.${field.name} === "√" ? "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-4 h-4'><path stroke-linecap='round' stroke-linejoin='round' d='M4.5 12.75l6 6 9-13.5' /></svg>" : data._display.${field.name} %></span>
    </span>
    <% } %>`
}

export function getPasswordTpl(field){
    return `<% if (data.${field.name}) { %>
        <span>······</span>
        <% } %>`
}


export async function getFieldTpl (field, options){
    if((field.is_name || field.name === options.labelFieldName) && !options.onlyDisplayLabel){
        return getNameTpl(field, options)
    }
    switch (field.type) {
        case 'password':
            return getPasswordTpl(field);
        case 'boolean':
            return getSwitchTpl(field);
        case 'toggle':
            return getSwitchTpl(field);
        case 'select':
            return getSelectTpl(field);
        case 'time':
            return getTimeTpl(field);
        case 'date':
            return getDateTpl(field);
        case 'datetime':
            return getDateTimeTpl(field);
        case 'lookup':
            return await getRelatedFieldTpl(field, options);
        case 'master_detail':
            return await getRelatedFieldTpl(field, options);
        case 'number':
        case 'currency':
            return await getNumberTpl(field);
        case 'formula':
        case 'summary':
            return getUiFieldTpl(field)
        case 'filesize':
            return getUiFileSizeTpl(field)
        default:
            break;
    }
};