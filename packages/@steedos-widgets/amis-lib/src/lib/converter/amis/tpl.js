/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-23 09:53:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-14 14:34:36
 * @Description: 
 */
import { Router } from '../../router'

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

export function getDateTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}


export function getDateTimeTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}

//TODO 处理name字段
export function getRefObjectNameFieldName(field){
    // const refObject = objectql.getObject(field.reference_to);
    // return refObject.NAME_FIELD_KEY;
    return 'name';
}

export function getSelectTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}

export function getNameTpl(field, ctx){
    if(ctx.objectName === 'cms_files'){
        return `<a href="\${context.rootUrl}/api/files/files/\${versions[0]}?download=true">\${${field.name}}</a>`
    }
    const href = Router.getObjectDetailPath({
        ...ctx,  formFactor: ctx.formFactor, appId: ctx.appId, objectName: ctx.tabId, recordId: `\${${ctx.idFieldName}}`
    })
    return `<a href="${href}">\${${field.name}}</a>`
}

export function getRelatedFieldTpl(field, ctx){
    let tpl = '';
    if(_.isString(field.reference_to)){
        if(field.multiple){
            const href = Router.getObjectDetailPath({
                formFactor: ctx.formFactor, appId: ctx.appId, objectName: `<%=item.objectName%>`, recordId: `<%=item.value%>`
            })
            tpl = `
            <% if (data._display.${field.name} && data._display.${field.name}.length) { %><% data._display.${field.name}.forEach(function(item) { %> <a href="${href}"><%=item.label%></a>  <% }); %><% } %>
            `
        }else{
            const href = Router.getObjectDetailPath({
                formFactor: ctx.formFactor, appId: ctx.appId, objectName: `\${_display.${field.name}.objectName}`, recordId: `\${_display.${field.name}.value}`
            })
            tpl = `<a href="${href}">\${_display.${field.name}.label}</a>`
        }

        
    }else{
        const href = Router.getObjectDetailPath({
            formFactor: ctx.formFactor, appId: ctx.appId, objectName: `<%=item.objectName%>`, recordId: `<%=item.value%>`
        })
        tpl = `
        <% if (data._display.${field.name} && data._display.${field.name}.length) { %><% data._display.${field.name}.forEach(function(item) { %> <a href="${href}"><%=item.label%></a>  <% }); %><% } %>
        `
    }
    return tpl
}

export function getLookupTpl(field, ctx){
    if(!field.reference_to){
        return getSelectTpl(field)
    }
    const NAME_FIELD_KEY = getRefObjectNameFieldName(field);
    if(field.multiple){
        const href = Router.getObjectDetailPath({
            formFactor: ctx.formFactor, appId: ctx.appId, objectName: field.reference_to, recordId: `<%=item._id%>`
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
        <span ><%=data._display.${field.name}%></span>
    </span>
    <% } %>`
}

export function getPasswordTpl(field){
    return `<% if (data.${field.name}) { %>
        <span>······</span>
        <% } %>`
}


export function getFieldTpl (field, options){
    if(field.is_name || field.name === options.labelFieldName){
        return getNameTpl(field, options)
    }
    switch (field.type) {
        case 'password':
            return getPasswordTpl(field);
        case 'boolean':
            return getSwitchTpl(field);
        case 'select':
            return getSelectTpl(field);
        case 'date':
            return getDateTpl(field);
        case 'datetime':
            return getDateTimeTpl(field);
        case 'lookup':
            return getLookupTpl(field, options);
        case 'master_detail':
            return getLookupTpl(field, options);
        default:
            break;
    }
};