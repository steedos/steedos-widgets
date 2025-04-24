/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-26 18:07:37
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-13 15:12:53
 * @Description: 
 */
import "./AmisSteedosField.less";
import { Field, getUISchema, getSelectMap, getPage } from '@steedos-widgets/amis-lib';
import { sampleSize, has, isArray, isEmpty, isString, pick, includes, clone, forEach, each, isObject, get } from 'lodash';

const defaultImageValue = "data:image/svg+xml,%3C%3Fxml version='1.0' standalone='no'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg t='1631083237695' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2420' xmlns:xlink='http://www.w3.org/1999/xlink' width='1024' height='1024'%3E%3Cdefs%3E%3Cstyle type='text/css'%3E%3C/style%3E%3C/defs%3E%3Cpath d='M959.872 128c0.032 0.032 0.096 0.064 0.128 0.128v767.776c-0.032 0.032-0.064 0.096-0.128 0.128H64.096c-0.032-0.032-0.096-0.064-0.128-0.128V128.128c0.032-0.032 0.064-0.096 0.128-0.128h895.776zM960 64H64C28.8 64 0 92.8 0 128v768c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64V128c0-35.2-28.8-64-64-64z' p-id='2421' fill='%23bfbfbf'%3E%3C/path%3E%3Cpath d='M832 288c0 53.024-42.976 96-96 96s-96-42.976-96-96 42.976-96 96-96 96 42.976 96 96zM896 832H128V704l224-384 256 320h64l224-192z' p-id='2422' fill='%23bfbfbf'%3E%3C/path%3E%3C/svg%3E";

const AmisFormInputs = [
    'text',
    'date',
    // 'file',
    // "avatar",
    // 'image',
    'datetime',
    'time',
    'number',
    // 'password',
    'url',
    'email'
]

function getAmisStaticFieldType(type: string, data_type?: string, options?: any) {
    if (includes(AmisFormInputs, type)) {
        return `input-${type}`;
    } else if (type === 'boolean') {
        return "checkbox";
    } else if (type === 'toggle') {
        return "switch";
    } else if (type === 'currency') {
        return "input-number";
    } else if (type === 'autonumber') {
        return "input-text" //不可以用text，因为会出现字段label显示不出来的问题
    } else if (type === 'percent') {
        return "input-number";
    } else if (type === 'formula' || type === 'summary') {
        return getAmisStaticFieldType(data_type, null, options);
    } else if (type === 'location') {
        return "location-picker";
    } else if (type === 'image') {
        if (options && options.multiple) {
            return `static-images`;
        }
        return `static-image`;
    } else if (type === 'textarea' || type === 'password') {
        return 'static';
    } else if (type === 'html') {
        return 'input-rich-text';
    } else if (type === 'markdown') {
        return 'static-markdown';
    } else if (type === 'select') {
        return 'static-mapping';
    } else if (type === 'color') {
        return 'static-color';
    } else if (type === 'file') {
        return 'control';
    }
    return type;
};


const REFERENCE_VALUE_ITEM_ONCLICK = {
    "click": {
      "actions": [
        {
            "actionType": "drawer",
            "drawer": {
              "type": "drawer",
              "title": "&nbsp;",
              "headerClassName": "hidden",
              "size": "lg",
              "width": (window as any).drawerWidth || "70%",
              "bodyClassName": "p-0 m-0 bg-gray-100",
              "closeOnEsc": true,
              "closeOnOutside": true,
              "resizable": true,
              "actions": [],
              "body": [
                {
                    "type": "steedos-record-detail",
                    "objectApiName": "${objectName}",
                    "recordId": "${value}",
                    "showBackButton": false,
                    "showButtons": true,
                    "data": {
                      "_inDrawer": true,  // 用于判断是否在抽屉中
                      "recordLoaded": false, // 重置数据加载状态
                    }
                }
              ],
              "className": "steedos-record-detail-drawer app-popover",
              "id": "u:fc5f055afa8c"
            },
            "preventDefault": true
        }
      ]
    }
}

async function getLookupLinkOnClick(field: any, options: any) {
    const recordPage = await getPage({ type: 'record', appId: options.appId, objectName: options.objectName, formFactor: options.formFactor });
    const drawerRecordDetailSchema = recordPage ? Object.assign({}, recordPage.schema, {
        "recordId": "${value}",
        "data": {
            ...recordPage.schema.data,
            "_inDrawer": true,  // 用于判断是否在抽屉中
            "recordLoaded": false, // 重置数据加载状态
        }
    }) : {
        "type": "steedos-record-detail",
        "objectApiName": "${objectName}",
        "recordId": "${value}",
        "showBackButton": false,
        "showButtons": true,
        "data": {
            "_inDrawer": true,  // 用于判断是否在抽屉中
            "recordLoaded": false, // 重置数据加载状态
        }
    }
    return {
        "click": {
            "actions": [
                {
                    "actionType": "drawer",
                    "drawer": {
                        "type": "drawer",
                        "title": "&nbsp;",
                        "headerClassName": "hidden",
                        "size": "lg",
                        "width": (window as any).drawerWidth || "70%",
                        "bodyClassName": "p-0 m-0 bg-gray-100",
                        "closeOnEsc": true,
                        "closeOnOutside": true,
                        "resizable": true,
                        "actions": [],
                        "body": [
                            drawerRecordDetailSchema
                        ],
                        "className": "steedos-record-detail-drawer app-popover"
                    },
                    "preventDefault": true
                }
            ]
        }
    }
}

function addEditorClass(schema = {className: ""}, editorClassName){
    if(schema.className && typeof schema.className == 'string'){
        schema.className+= ` ${editorClassName}`;
    }else if(schema.className && typeof schema.className == 'object'){
        (schema as any).className[editorClassName] = "true";
    }else{
        schema.className = editorClassName;
    }
}

function generateRandomString(length = 5) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return sampleSize(characters, length).join('');
}

export const AmisSteedosField = async (props) => {
    if(has(props, '$$editor')){
        setTimeout(()=>{
            const fieldEditDiv = document.getElementsByName(props.id)[0];
            if(fieldEditDiv){
                if(props.config.is_wide){
                    fieldEditDiv.style.gridColumn = 'span 2 / span 2';;
                }else{
                    fieldEditDiv.style.gridColumn="";
                }
                const amisFieldEditDiv = fieldEditDiv.children[0];
                //拖动字段后, 也要清理amis字段的编辑属性.
                setInterval(()=>{
                    if(amisFieldEditDiv){
                        amisFieldEditDiv.removeAttribute("data-editor-id");
                        amisFieldEditDiv.removeAttribute("name");
                        amisFieldEditDiv.removeAttribute("data-visible");
                        amisFieldEditDiv.removeAttribute("data-hide-text");
                    }
                }, 200)
            }
        }, 200)
    }

    if(!props.config){
        props.config = props.field || {}
    };

    if(!props.config.object){
        props.config.object = props.data?.objectName || '';
    }

    if(!props.config.name){
        props.config.name = `f${generateRandomString(5)}`;
    }

    let steedosField = null;
    let { field, readonly = false, ctx = {}, config, $schema, static: fStatic, env, inInputTable, className } = props;
    const { appId, formFactor } = props.data || {};
    // console.log(`AmisSteedosField`, props)

    let editorClassName = "";
    if(props.$$editor) {
        if(config.amis) {
            if(config.amis.name !== config.name) {
                 config.amis.name = config.name
            } 
        }
        // editorClassName = "mb-6";

        if(config.type === 'formula' || config.type === 'summary'){
            return {
                type: 'input-text',
                label: `${config.label}(新建、编辑时不可见)`,
                // className: 'mb-6',
                readonly: true
            }
        }
        
    }

    if (isString(ctx)) {
        ctx = JSON.parse(ctx);
    }

    steedosField = config ? config : field;
    if (isString(steedosField)) {
        steedosField = JSON.parse(steedosField);
    }
    else {
        // 这里要clone是因为后面图片字段类型执行steedosField.amis = ...的时候会造成input-table中的图片字段在弹出编辑表单点击确认后整个input-table组件重新渲染了，从而导致其翻页功能异常
        steedosField = clone(steedosField);
    }

    // if (props.label && !steedosField.label) {
    //     steedosField.label = props.label;
    // }
    if (typeof props.label === "string" || props.label === false) {
        // 始终优先取组件上配置的label，且可以通过配置组件的label属性值为false来隐藏字段label
        steedosField.label = props.label;
    }

    if (!fStatic && steedosField.readonly && !props.data.hasOwnProperty("_display")) {
        // 字段配置为只读，强制走fStatic模式，加上_display判断是为了不影响历史代码，比如直接在ObjectForm中调用steedos-field组件
        fStatic = true;
    }

    try {
        if (fStatic && (steedosField.type === 'lookup' || steedosField.type === 'master_detail')) {

            let lookupATagClick = 'onclick="return false;"';

            if(window.innerWidth < 768){
                lookupATagClick = ""
            }

            let defaultSource: any = {
                "method": "post",
                "url": "${context.rootUrl}/graphql",
                "requestAdaptor": `
                    var steedosField = ${JSON.stringify(steedosField)};
                    // console.log('defaultSource====>steedosField', steedosField);
                    var objectName, filters, valueFieldKey, labelFieldKey;
                    if(_.isString(steedosField.reference_to)){
                        // reference_to为单选
                        const referenceTo = getReferenceToSync(steedosField);
                        const referenceToField = steedosField.reference_to_field || '_id';

                        objectName = referenceTo.objectName
                        valueFieldKey = referenceTo && referenceTo.valueField?.name || '_id' ;
                        labelFieldKey = referenceTo && referenceTo.labelField?.name || 'name';
                        let value = _.get(api.data, steedosField.name);
                        if(_.isString(value)){
                            value = [value]
                        }
                        filters = [referenceToField, "in", value || []];
                        if(objectName == "object_fields" || objectName == "object_actions"){
                            //对象为object_fields时，必须加上object的过滤条件
                            const filtersFunction = ${steedosField.filtersFunction || steedosField._filtersFunction};
                            if(filtersFunction){
                                const _filters = filtersFunction(filters, api.data);
                                if(_filters && _filters.length > 0){
                                    filters = [filters,_filters]
                                }
                            }
                        }
                    }else{
                        // reference_to为多选
                        const _steedosField = {
                            ...steedosField,
                            reference_to: api.data[steedosField.name].o
                        }
                        const referenceTo = getReferenceToSync(_steedosField);
                        const referenceToField = _steedosField.reference_to_field || '_id';

                        objectName = referenceTo.objectName
                        valueFieldKey = referenceTo && referenceTo.valueField?.name || '_id' ;
                        labelFieldKey = referenceTo && referenceTo.labelField?.name || 'name';
                        let value = api.data[_steedosField.name] && api.data[_steedosField.name].ids;
                        filters = [referenceToField, "in", value || []];
                    }

                    // 额外返回_id字段
                    api.data = {
                        query: '{options:' + objectName + '(filters: ' + JSON.stringify(filters) + '){label: ' + labelFieldKey + ',value: ' + valueFieldKey + ', _id}}'
                    }
                    return api;
                `,
                "trackExpression": "${" + steedosField.name + "}",
                "cache": 3000
            };
            if (!steedosField.reference_to) {
                // 兼容lookup字段未配置reference_to属性的情况，当普通下拉框字段用
                defaultSource = {
                    "url": "${context.rootUrl}/api/v1/spaces/none",
                    data: { $: "$$" },
                };
                if (steedosField.optionsFunction || steedosField._optionsFunction) {
                    defaultSource.adaptor = `
                        var options = eval(${steedosField.optionsFunction || steedosField._optionsFunction})(api.body.$);
                        if(api.body.$term){
                            options = _.filter(options, function(o) {
                                var label = o.label;
                                return label.toLowerCase().indexOf(api.body.$term.toLowerCase()) > -1;
                            });
                        }
                        if(!payload.data){
                            payload.data = {};
                        }
                        payload.data.options = options;
                        return payload;
                    `;
                }
                else if (steedosField.options) {
                    defaultSource.adaptor = `
                        var options = ${JSON.stringify(steedosField.options)}
                        if(api.body.$term){
                            options = _.filter(options, function(o) {
                                var label = o.label;
                                return label.toLowerCase().indexOf(api.body.$term.toLowerCase()) > -1;
                            });
                        }
                        if(!payload.data){
                            payload.data = {};
                        }
                        payload.data.options = options;
                        return payload;
                    `;
                }
            }
            const source = steedosField.amis?.source || steedosField.amis?.autoComplete || defaultSource;
            // 这里有_display时不可以不走以下的static逻辑代码，因为审批王会特意传入_display，且其中lookup字段static时需要走下面的代码
            let fieldBaseProps = {
                multiple: steedosField.multiple,
                name: steedosField.name,  
                label: steedosField.label,
                static: true,
                required: steedosField.required,
                className: `${className || ''} ${steedosField.amis?.className || ''}`
            };
            if(inInputTable){
                fieldBaseProps = Object.assign({}, fieldBaseProps, { type: 'select', source: source});
            }else{
                let referenceTo = steedosField.reference_to;
                if(referenceTo){
                    if(isArray(referenceTo)){
                        const fieldValue = props.data?.[steedosField.name];
                        if(fieldValue && fieldValue.o){
                            referenceTo = fieldValue.o;
                        }else{
                            referenceTo = referenceTo[0];
                        }
                    }
                    let referenceToField = steedosField.reference_to_field;
                    if(referenceTo === 'users'){
                        referenceTo = 'space_users';
                        referenceToField = 'user';
                    }
                    let fieldRefObject = await getUISchema(referenceTo);
                    if(props.data._display && has(props.data._display, steedosField.name)){
                        fieldBaseProps = Object.assign({}, fieldBaseProps, {
                            type: 'control',
                            name: null, //name 会导致底层的each异常,无法从数据链中获取数据. 如果给了name 会导致下层的each多了value 属性, value属性会引起each无法从数据链中获取数据
                            body: [{
                                type: 'wrapper',
                                className: `steedos-field-lookup-wrapper p-0`,
                                "wrapWithPanel": false,
                                "actions": [],
                                visibleOn: `\${_display.${steedosField.name}}`,
                                body: [
                                    {
                                        type: 'each',
                                        placeholder: "",
                                        className: `steedos-field-lookup-each flex flex-wrap gap-2`,
                                        source: `\${_display.${steedosField.name}|asArray}`,
                                        items: {
                                            type: 'static',
                                            labelClassName: "hidden",
                                            label: false,
                                            className: 'm-0',
                                            tpl: `<a href="/app/-/\${objectName}/view/\${value}" target="_blank" ${lookupATagClick}>\${label}</a>`,
                                            popOver: fieldRefObject.compactLayouts && window.innerWidth >= 768 ? {
                                                "trigger": "hover",
                                                "className": "steedos-record-detail-popover",
                                                "position": "left-bottom",
                                                "showIcon": false,
                                                "title": false,
                                                "offset": {
                                                    "top": 0,
                                                    "left": 20
                                                },
                                                "body": [
                                                    {
                                                        "type": "steedos-record-mini",
                                                        "objectApiName": "${objectName}",
                                                        "recordId": "${value}",
                                                        "showButtons": false,
                                                        "showBackButton": false,
                                                        "data": {
                                                            "objectName": "${objectName}",
                                                            "recordId": "${value}",
                                                        }
                                                    }
                                                ]
                                            } : null,
                                            // onEvent: window.innerWidth < 768 ? null : REFERENCE_VALUE_ITEM_ONCLICK
                                            onEvent: window.innerWidth < 768 ? null : await getLookupLinkOnClick(steedosField, {
                                                appId,
                                                objectName: referenceTo,
                                                formFactor
                                            })
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'static',
                                tpl: '-',
                                className: `${fieldBaseProps.className || ''} text-muted !border-b-0`,
                                hiddenOn: `\${_display.${steedosField.name}}`,
                            },
                            {
                                type: 'tpl', 
                                tpl: `<span class='antd-TplField antd-Form-description'><span>${steedosField.description}</span></span>`
                            }
                            ]
                        });
                    }else{
                        const res = await env.fetcher(source, props.data);
                        const valueOptions = res?.data?.options || [];
                        const fieldValue = props.data?.[steedosField.name];

                        // console.log(`fieldValue`, fieldValue, steedosField, valueOptions);
                        let values = fieldValue
                        if(isString(values)){
                            values = [values]
                        }

                        if(values && values.length > 0){

                            const disPlayValue = []
                            each(values, (value)=>{
                                const option = valueOptions.find((item)=>item.value === value);
                                if(option){
                                    disPlayValue.push({
                                        objectName: referenceTo,
                                        value: option._id || option.value,
                                        label: option.label
                                    })
                                }
                            })

                            fieldBaseProps = Object.assign({}, fieldBaseProps, { type: 'control', name: null, body: {
                                type: 'form',
                                className: `steedos-field-lookup-wrapper p-0`,
                                "wrapWithPanel": false,
                                "actions": [],
                                data: {
                                    [steedosField.name]: disPlayValue
                                },
                                body: [
                                    {
                                        type: 'each',
                                        placeholder: "",
                                        className: `steedos-field-lookup-each flex flex-wrap gap-2`,
                                        source: `\${${steedosField.name}}`,
                                        items: { 
                                            type: 'static', 
                                            className: 'm-0',
                                            tpl: `<a href="/app/-/\${objectName}/view/\${value}" target="_blank" ${lookupATagClick}>\${label}</a>`, 
                                            popOver: fieldRefObject.compactLayouts && window.innerWidth >= 768 ? {
                                                "trigger": "hover",
                                                "className": "steedos-record-detail-popover",
                                                "position": "left-bottom",
                                                "showIcon": false,
                                                "title": false,
                                                "offset": {
                                                    "top": 0,
                                                    "left": 20
                                                },
                                                "body": [
                                                    {
                                                        "type": "steedos-record-mini",
                                                        "objectApiName": "${objectName}",
                                                        "recordId": "${value}",
                                                        "showButtons": false,
                                                        "showBackButton": false,
                                                        "data": {
                                                            "objectName": "${objectName}",
                                                            "recordId": "${value}",
                                                        }
                                                    }
                                                ]
                                            } : null,
                                            // onEvent: window.innerWidth < 768 ? null : REFERENCE_VALUE_ITEM_ONCLICK
                                            onEvent: window.innerWidth < 768 ? null : await getLookupLinkOnClick(steedosField, {
                                                appId,
                                                objectName: referenceTo,
                                                formFactor
                                            })
                                        }
                                    }
                                ]
                            }});
                        }else{
                            fieldBaseProps = Object.assign({}, fieldBaseProps, { type: 'static', tpl: '-', className: `${fieldBaseProps.className || ''} text-muted`});
                        }
                    }
                }else{
                    fieldBaseProps = Object.assign({}, fieldBaseProps, { type: 'select', source: source});
                }
            }
            const schema = Object.assign({}, fieldBaseProps, pick(steedosField.amis || {}, ['className', 'inline', 'label', 'labelAlign', 'name', 'labelRemark', 'description', 'placeholder', 'staticClassName', 'staticLabelClassName', 'staticInputClassName', 'staticSchema']));
            schema.placeholder = "";
            addEditorClass(schema, editorClassName);
            // console.log(`steedos field [lookup] schema:`, schema)
            return schema;
        }
        else if (fStatic) {
            if (props.data.hasOwnProperty("_display")) {
                // 有_display时保持原来的逻辑不变，不走以下新的逻辑，审批王中会特意传入_display以跳过后面新加的代码
                const fieldSchema = await Field.convertSFieldToAmisField(steedosField, true, ctx);
                if (steedosField.type === 'file' && fieldSchema.disabled) {
                    const fieldValue = fieldSchema.value;
                    if (fieldValue && fieldValue.length) {
                        let hasImageOrFile = false;
                        forEach(fieldValue, (item) => {
                            const fileName = item.name;
                            const match = fileName.match(/\.([^\.]+)$/);
                            const fileType = match ? match[0] : '';
                            if ([".pdf", ".jpg", ".jpeg", ".png", ".gif"].indexOf(fileType) > -1) {
                                hasImageOrFile = true;
                            }
                        })
                        // if (!hasImageOrFile) {
                        //     return fieldSchema;
                        // }
                        let fieldHtml = "";
                        forEach(fieldValue, (item) => {
                            const fileName = item.name;
                            const fileUrl = item.url;
                            const match = fileName.match(/\.([^\.]+)$/);
                            const fileType = match ? match[0] : '';
                            let filePreviewHtml = '';
                            if ([".pdf", ".jpg", ".jpeg", ".png", ".gif"].indexOf(fileType) > -1) {
                                const indexOfQuestionMark = fileUrl.indexOf('?');
                                if (indexOfQuestionMark > -1) {
                                    const filePreviewUrl = fileUrl.substring(0, indexOfQuestionMark);
                                    filePreviewHtml = `&ensp;<a href="${filePreviewUrl}" target="_blank" class="antd-Link"><span class="antd-TplField"><span>预览</span></span></a>`
                                }
                            }
                            const tpl = `
                                <div class="antd-FileControl-itemInfo flex-wrap">
                                    <span class="antd-FileControl-itemInfoIcon flex justify-center items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 16" class="icon icon-file"><path d="M0 0v16h14V4.001L9.939 0H0Zm1 1h8v4h4v10H1V1Zm9 .464 2.575 2.537H10V1.464Z"></path><path d="M4 12h6v-1H4zM4 9h6V8H4z"></path></svg></span>
                                    <a class="antd-FileControl-itemInfoText" target="_blank" rel="noopener" href="${fileUrl}">${fileName}</a>
                                    ${filePreviewHtml ? filePreviewHtml : ''}
                                </div>
                            `;
                            fieldHtml += tpl;
                        })
                        return {
                            "type": "tpl",
                            "tpl": fieldHtml
                        }
                    }
                }
                addEditorClass(fieldSchema, editorClassName);
                return fieldSchema;
            }
            const schema = Object.assign({}, steedosField, {
                type: getAmisStaticFieldType(steedosField.type, steedosField.data_type, steedosField),
                static: true,
                label: steedosField.label
            });
            if (steedosField.type === "time" || steedosField.type === "input-time-range") {
                Object.assign(schema, {
                    inputFormat: 'HH:mm',
                    timeFormat: 'HH:mm',
                    format: '1970-01-01THH:mm:00.000[Z]',
                });
            } else if (steedosField.type === "percent") {
                Object.assign(schema, {
                    "percent": steedosField.scale ? steedosField.scale : true
                });
            } else if (steedosField.type === "password") {
                Object.assign(schema, {
                    "tpl": "******" 
                });
            } else if (steedosField.type === "select") {
                const map = getSelectMap(steedosField.options);
                Object.assign(schema, {
                    "placeholder": "",
                    "map": map
                });
            } else if (steedosField.type === "color") {
                Object.assign(schema, {
                    "defaultColor": null
                });
            } else if (steedosField.type === "number" || steedosField.type === 'currency') {
                // amis input-number和number组件中的precision表示小数位数，并不是魔方平台的精度概念，要转换下，否则小数点后会显示很多的0
                Object.assign(schema, {
                    "precision": steedosField.scale || 0,
                    "kilobitSeparator": steedosField.enable_thousands //识别enable_thousands，控制千分位分隔符
                });
            } else if (steedosField.type === "table") {
                if (steedosField.subFields) {
                    // console.log(`convertData ======>`, steedosField, convertData)
                    let tableFields = [];
                    for (const subField of steedosField.subFields) {
                        if (!subField.name.endsWith(".$")) {
                            const subFieldName = subField.name.replace(`${steedosField._prefix || ''}${steedosField.name}.$.`, '').replace(`${steedosField.name}.`, '');
                            // const gridSub = await convertSFieldToAmisField(Object.assign({}, subField, {name: subFieldName, isTableField: true}), readonly, ctx);
                            tableFields.push(Object.assign({}, subField, { name: subFieldName }))
                        }
                    }
                    Object.assign(schema, {
                        type: 'steedos-input-table',
                        editable: false,
                        addable: false,
                        removable: false,
                        draggable: false,
                        fields: tableFields,
                        amis: {
                            columnsTogglable: false
                        }
                    });
                }
            } else if (steedosField.type === "image") {
                Object.assign(schema, {
                    enlargeAble: true,
                    showToolbar: true,
                    pipeIn: (value, data) => {
                        if (steedosField.multiple) {
                            if (!value) {
                                value = [defaultImageValue];
                            }
                            value = value.map(function (item: string) {
                                if (item && item.split("/").length === 1) {
                                    // 不是url格式时转为url格式显示
                                    return (window as any).getImageFieldUrl((window as any).Meteor.absoluteUrl(`/api/files/images/${item}`))
                                }
                                else {
                                    return item;
                                }
                            });
                        }
                        else {
                            if (isArray(value)) {
                                value = value[0];
                            }
                            if (value && value.split("/").length === 1) {
                                // 不是url格式时转为url格式显示
                                return (window as any).getImageFieldUrl((window as any).Meteor.absoluteUrl(`/api/files/images/${value}`))
                            }
                        }
                        return value;
                    }
                });
            } else if (steedosField.type === "file") {
                Object.assign(schema, {
                    "body": [
                        {
                            "type": "service",
                            "api": {
                                "method": "post",
                                "url": `\${context.rootUrl}/graphql?file=\${${steedosField.name}}`,
                                "headers": {
                                    "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                },
                                "data": {
                                    "query": `{fileData:cfs_files_filerecord(filters:["_id","in",\${${steedosField.name}|asArray|json}]){_id,original}}`
                                }
                            },
                            "body": [
                                {
                                    "type": "each",
                                    "source": "${fileData}",
                                    "className": "flex flex-col",
                                    "items": {
                                        "type": "tpl",
                                        "tpl": "<a href='/api/v6/files/download/cfs.files.filerecord/${_id}/${original.name}' target='_blank'>${original.name}</a>"
                                    }
                                }
                            ]
                        }
                    ]
                },{name: ""});
            } else if (steedosField.type === 'formula' || steedosField.type === 'summary'){
                if(steedosField.data_type === 'number' || steedosField.data_type === 'currency'){
                    Object.assign(schema, {
                        "precision": steedosField.scale || 0
                    });
                }
            } else if (steedosField.type === 'textarea') {
                Object.assign(schema, {
                    tpl: `<%=(data.${steedosField.name} || "").split("\\n").join('<br>')%>`
                })
            } else if (steedosField.type === 'html') {
                Object.assign(schema, {
                    "receiver": "${context.rootUrl}/s3/images",
                    "options": {
                        "menu": {
                            "insert": {
                                "title": "Insert",
                                "items": "image link media addcomment pageembed codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime"
                            }
                        },
                        "plugins": [
                            "autoresize"
                        ],
                        // "max_height": 2000,
                        "statusbar": false,
                        "readonly": true,
                        "toolbar": false,
                        "menubar": false
                    }
                });
            } else if (steedosField.type === 'markdown') {
                Object.assign(schema, {
                    "options": {
                        "linkify": true,
                        "html": true,
                        "breaks": true
                    }
                });
            } else if (steedosField.type === 'input-date-range' || steedosField.type === 'date') {
                Object.assign(schema, {
                    inputFormat: "YYYY-MM-DD",
                    format:'YYYY-MM-DDT00:00:00.000[Z]'
                });
            } else if (steedosField.type === 'input-datetime-range' || steedosField.type === 'datetime') {
                Object.assign(schema, {
                    inputFormat: "YYYY-MM-DD HH:mm",
                    format:'YYYY-MM-DDTHH:mm:ss.SSSZ'
                });
            } else if (steedosField.type === 'toggle') {
                Object.assign(schema, {
                    static: false,
                    disabled: true
                });
            } else if (steedosField.type === 'url' && steedosField.show_as_qr) {
                Object.assign(schema, {
                    type: "control",
                    body: [
                        {
                            "type": "qr-code",
                            "codeSize": inInputTable?64:128,
                            "name": steedosField.name
                        }
                    ]
                });
            }
            Object.assign(schema, steedosField.amis || {});
            addEditorClass(schema, editorClassName);
            return schema;
        } else {
            if(!ctx.className){
                ctx.className = className;
            }
            let fieldAmis = steedosField.amis || {};
            if (!props.data.hasOwnProperty("_display")) {
                // 有_display时保持原来的逻辑不变，不走以下新的逻辑，审批王中会特意传入_display以跳过后面新加的代码
                // 重写amis中相关属性，但是允许用户通过配置组件的config.amis覆盖下面重写的逻辑
                if (steedosField.type === "image") {
                    fieldAmis = Object.assign({}, {
                        pipeIn: (value, data) => {
                            if (steedosField.multiple) {
                                value = value && value.map(function (item: string) {
                                    if (item && item.split("/").length === 1) {
                                        // 不是url格式时转为url格式显示
                                        return (window as any).getImageFieldUrl((window as any).Meteor.absoluteUrl(`/api/files/images/${item}`))
                                    }
                                    else {
                                        return item;
                                    }
                                });
                            }
                            else {
                                if (isArray(value)) {
                                    value = value[0];
                                }
                                if (value && value.split("/").length === 1) {
                                    // 不是url格式时转为url格式显示
                                    return (window as any).getImageFieldUrl((window as any).Meteor.absoluteUrl(`/api/files/images/${value}`))
                                }
                            }
                            return value;
                        },
                        pipeOut: (value, data) => {
                            if (steedosField.multiple) {
                                value = value && value.map(function (item: string) {
                                    if (item && item.split("/").length > 1) {
                                        // 是url格式时转_id值输出用于保存
                                        return item.split("/").pop();
                                    }
                                    else {
                                        return item;
                                    }
                                });
                            }
                            else {
                                if (isArray(value)) {
                                    value = value[0];
                                }
                                if (value && value.split("/").length > 1) {
                                    // 是url格式时转_id值输出用于保存
                                    return value.split("/").pop();
                                }
                            }
                            return value;
                        }
                    }, fieldAmis);
                    steedosField.amis = fieldAmis;
                }
            }

            const schema = await Field.convertSFieldToAmisField(steedosField, readonly, ctx);
            addEditorClass(schema, editorClassName);
            // console.log(`AmisSteedosField return schema`, schema)
            return schema
        }

    } catch (error) {
        console.log(`error`, error)
    }
    return null;
}