/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-23 09:53:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-02-21 17:19:30
 * @Description: 
 */
import { Router } from '../../router'
 import { getUISchema } from '../../objects'
import { forEach } from 'lodash';
import { getContrastColor } from './util'

export function getCreatedInfoTpl(formFactor){
    const href = Router.getObjectDetailPath({
        formFactor, appId: "admin", objectName: 'users', recordId: '${created_by._id}'
    })
    return `<span><a href='${href}'>\${_display.created_by.label}</a>\${_display.created}</span>`
}

export function getModifiedInfoTpl(formFactor){
    const href = Router.getObjectDetailPath({
        formFactor, appId: "admin", objectName: 'users', recordId: '${modified_by._id}'
    })
    return `<span><a href='${href}'>\${_display.modified_by.label}</a>\${_display.modified}</span>`
}

export function getNumberTpl(field){
    return `<span>\${_display.${field.name}}</span>`
}

export function getTimeTpl(field){
    return `<span>\${_display.${field.name}}</span>`
}

export function getDateTpl(field){
    return `<span>\${_display.${field.name}}</span>`
}


export function getDateTimeTpl(field){
    return `<span>\${_display.${field.name}}</span>`
}

export function getUiFieldTpl(field){
    return `<span>\${_display.${field.name}}</span>`
}

export function getUiFileSizeTpl(field){
    return `<span>\${_display.${field.name}}</span>`
}

//TODO 处理name字段
export async function getRefObjectNameFieldName(field){
    const refUiSchema = await getUISchema(field.reference_to)
    const NAME_FIELD_KEY = refUiSchema.NAME_FIELD_KEY || 'name';
    return NAME_FIELD_KEY;
}

export function getSelectTpl(field){
    return `<span>\${_display.${field.name}}</span>`
}
export function getSelectMap(selectOptions){
    let map = {};
    forEach(selectOptions,(option)=>{
        const optionValue = option.value + '';
        const optionColor = option.color + '';
        if(optionColor && optionColor != "undefined"){
            const background = optionColor.charAt(0) === '#' ? optionColor : '#'+optionColor;
            const color = getContrastColor(background);
            const optionColorStyle = 'background:'+background+';color:'+color+';line-height:1.5rem';
            map[optionValue] = `<span class="rounded-xl px-2 py-1" style='${optionColorStyle}'>${option.label}</span>`
        }else{
            map[optionValue] = option.label;
        }
    })
    return map;
}

export function getNameTplUrl(field, ctx){
    // if(ctx.objectName === 'cms_files'){
    //     return "${(versions[0] && versions[0].url) ? versions[0].url+'?download=true' : context.rootUrl+'/api/files/files/'+versions[0]+'?download=true'}"
    // }
    const href = Router.getObjectDetailPath({
        ...ctx,  formFactor: ctx.formFactor, appId: "${appId}", objectName: ctx.objectName || "${objectName}", recordId: `\${${ctx.idFieldName}}`
    })
    return href;
}

export function getNameTpl(field, ctx){
    const href = getNameTplUrl(field, ctx);
    let linkTarget = "";
    if(ctx && ctx.isLookup){
        linkTarget = "target='_blank'"
    }
    let nameLabel = field.name;
    //若字段类型是lookup，则按照相关表tpl的label规则显示；若是其它类型，则显示_display或字段本身的值
    if (field.type == "lookup" || field.type == "master_detail") {
        if(!field.reference_to && (field.optionsFunction || field._optionsFunction || field.options)){
            if(!field.isTableField){
                nameLabel = `\${${field.name}__label}`;
            }
        } else {
            nameLabel = `\${_display.${field.name}.label}`;
        }
    } else {
        nameLabel = `\${_display.${field.name} || ${field.name}}`
    }
    if(ctx.isRelated && window.innerWidth >= 768){
        return `<a href="${href}" ${linkTarget} onclick="return false;">\${${nameLabel} | raw}</a>`
    }else{
        return `<a href="${href}" ${linkTarget}>\${${nameLabel} | raw}</a>`
    }
}

export function getRelatedFieldTpl(field, ctx){
    let tpl = '';
    if(!field.reference_to && (field.optionsFunction || field._optionsFunction || field.options)){
        if(field.isTableField){
            return `\${${field.name}}`
        }else{
            return `\${${field.name}__label}`
        }
    }

    let linkTarget = "";
    if(ctx && ctx.isLookup){
        linkTarget = "target='_blank'"
    }

    const onlyDisplayLookLabel = ctx.onlyDisplayLookLabel;

    let fieldDataStrTpl = `data._display.${field.name}`;

    if(field.isTableField){
        fieldDataStrTpl = `data.${field.name}`;
    }

    if(_.isString(field.reference_to) || !field.reference_to){
        if(field.multiple){
            let labelTpl = `<%=item.label%>`;
            if(ctx.isRelated){
                linkTarget = "target='_blank'"
            }
            if(!onlyDisplayLookLabel){
                const href = Router.getObjectDetailPath({
                    formFactor: ctx.formFactor, appId: "<%=data.appId%>", objectName: `<%=item.objectName%>`, recordId: `<%=item.value%>`, _templateType: "JavaScript"
                })
                labelTpl = `<a href="${href}" ${linkTarget}><%=item.label%></a>`;
            }
            tpl = `
            <% if (${fieldDataStrTpl} && ${fieldDataStrTpl}.length) { %><% ${fieldDataStrTpl}.forEach(function(item,index) { %> <% if(index>0 && index<${fieldDataStrTpl}.length){ %> , <% } %> ${labelTpl}  <% }); %><% } %>
            `
        }else{
            let labelTpl = `\${_display.${field.name}.label}`;
            let objectNameTpl = `\${_display.${field.name}.objectName}`;
            let recordIdTpl = `\${_display.${field.name}.value}`;
            if(field.isTableField){
                labelTpl = `\${${field.name}.label}`;
                objectNameTpl = `\${${field.name}.objectName}`;
                recordIdTpl = `\${${field.name}.value}`;
            }
            if(!onlyDisplayLookLabel){
                const href = Router.getObjectDetailPath({
                    formFactor: ctx.formFactor, appId: "${appId}", objectName: `${objectNameTpl}`, recordId: `${recordIdTpl}`
                })
                if(ctx.isRelated && window.innerWidth >= 768){
                    labelTpl = `<a href="${href}" ${linkTarget} onclick="return false;">${labelTpl}</a>`;
                }else{
                    labelTpl = `<a href="${href}" ${linkTarget}>${labelTpl}</a>`;
                }
                
            }
            tpl = labelTpl;
        }

        
    }else{
        let labelTpl = `<%=item.label%>`;
        if(!onlyDisplayLookLabel){
            const href = Router.getObjectDetailPath({
                formFactor: ctx.formFactor, appId: "<%=data.appId%>", objectName: `<%=item.objectName%>`, recordId: `<%=item.value%>`, _templateType: "JavaScript"
            })
            labelTpl = `<a href="${href}" ${linkTarget}><%=item.label%></a>`;
        }
        tpl = `
        <% if (${fieldDataStrTpl} && ${fieldDataStrTpl}.length) { %><% ${fieldDataStrTpl}.forEach(function(item) { %> ${labelTpl}  <% }); %><% } %>
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
    let fieldDataStrTpl = `data._display.${field.name}`;
    if(field.isTableField){
        fieldDataStrTpl = `data.${field.name}`;
    }
    return `<% if (data.${field.name}) { %>
    <span class="slds-icon_container slds-icon-utility-check slds-current-color" title="<%=${fieldDataStrTpl}%>">
        <span ><%= ${fieldDataStrTpl} === "√" ? "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-4 h-4'><path stroke-linecap='round' stroke-linejoin='round' d='M4.5 12.75l6 6 9-13.5' /></svg>" : ${fieldDataStrTpl} %></span>
    </span>
    <% } %>`
}

export function getPasswordTpl(field){
    return `<% if (data.${field.name}) { %>
        <span>******</span>
        <% } %>`
}

export function getLocationTpl(field){
    return `\${${field.name} ? ${field.name}.address : ''}`
}

export async function getFieldTpl (field, options){
    if((field.is_name || field.name === options.labelFieldName) && !options.onlyDisplayLookLabel && field.multiple !== true){
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
        case 'location':
            return await getLocationTpl(field);
        case 'number':
        case 'currency':
            return await getNumberTpl(field);
        case 'percent':
        case 'formula':
        case 'summary':
            return getUiFieldTpl(field)
        case 'filesize':
            return getUiFileSizeTpl(field)
        default:
            break;
    }
};