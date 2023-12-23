/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-26 18:07:37
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-12-21 18:59:57
 * @Description: 
 */
import { Field } from '@steedos-widgets/amis-lib';
import { isArray, isEmpty, isString, pick, includes, clone } from 'lodash';

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
    'password',
    'url',
    'email'
]

function getAmisStaticFieldType(type: string, data_type?: string, options?: any){
    if(includes(AmisFormInputs, type)){
        return `input-${type}`;
    }else if(type === 'boolean'){
        return "checkbox";
    }else if(type === 'toggle'){
        return "switch";
    }else if(type === 'currency'){
        return "number";
    }else if(type === 'autonumber'){
        return "text"
    }else if(type === 'percent'){
        return "number";
    }else if(type === 'formula' || type === 'summary'){
        return getAmisStaticFieldType(data_type, null, options);
    }else if(type === 'location'){
        return "location-picker";
    }else if(type === 'image'){
        if(options && options.multiple){
            return `static-images`;
        }
        return `static-image`;
    }
    return type;
};

export const AmisSteedosField = async (props)=>{
    // console.log(`AmisSteedosField===props===`, props);

    let steedosField = null;
    let { field, readonly = false, ctx = {}, config, $schema, static: fStatic, hideLabel } = props;
    // console.log(`AmisSteedosField`, props)

    // if($schema.config && isString($schema.config)){
    //     $schema.config = JSON.parse($schema.config)
    //     props.config = $schema.config
    // }

    if(isString(ctx)){
        ctx = JSON.parse(ctx);
    }

    steedosField = config ? config : field;
    if(isString(steedosField)){
        steedosField = JSON.parse(steedosField);
    }
    else{
        // 这里要clone是因为后面图片字段类型执行steedosField.amis = ...的时候会造成input-table中的图片字段在弹出编辑表单点击确认后整个input-table组件重新渲染了，从而导致其翻页功能异常
        steedosField = clone(steedosField);
    }
    
    if(!fStatic && steedosField.readonly && !props.data.hasOwnProperty("_display")){
        // 字段配置为只读，强制走fStatic模式，加上_display判断是为了不影响历史代码，比如直接在ObjectForm中调用steedos-field组件
        fStatic = true;
    }

    try {
        if(fStatic && (steedosField.type === 'lookup' || steedosField.type === 'master_detail')){
            let defaultSource: any = {
                "method": "post",
                "url": "${context.rootUrl}/graphql",
                "requestAdaptor": `
                    var steedosField = ${JSON.stringify(steedosField)};
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
                        if(objectName == "object_fields"){
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
                    api.data = {
                        query: '{options:' + objectName + '(filters: ' + JSON.stringify(filters) + '){label: ' + labelFieldKey + ',value: ' + valueFieldKey + '}}'
                    }
                    return api;
                `,
                "trackExpression": "${" + steedosField.name + "}",
                "cache": 3000
            };
            if(!steedosField.reference_to){
                // 兼容lookup字段未配置reference_to属性的情况，当普通下拉框字段用
                defaultSource = {
                    "url": "${context.rootUrl}/api/v1/spaces/none",
                    data: {$: "$$"},
                };
                if(steedosField.optionsFunction || steedosField._optionsFunction){
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
                else if(steedosField.options){
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
            const schema = Object.assign({}, {
                type: 'select',
                multiple: steedosField.multiple,
                name: steedosField.name,
                label: steedosField.label,
                static: true,
                className: steedosField.amis?.className,
                source: source,
            }, pick(steedosField.amis || {}, ['className', 'inline', 'label', 'labelAlign', 'name', 'labelRemark', 'description', 'placeholder', 'staticClassName', 'staticLabelClassName', 'staticInputClassName', 'staticSchema']));
            schema.placeholder = "";
            if(hideLabel){
                delete schema.label;
            }
            return schema;
        }
        else if(fStatic){
            if(props.data.hasOwnProperty("_display")){
                // 有_display时保持原来的逻辑不变，不走以下新的逻辑，审批王中会特意传入_display以跳过后面新加的代码
                return await Field.convertSFieldToAmisField(steedosField, readonly, ctx);
            }
            const schema = Object.assign({}, steedosField, {
                type: getAmisStaticFieldType(steedosField.type, steedosField.data_type, steedosField),
                static: true,
                label: steedosField.label
            });
            if(steedosField.type === "time"){
                Object.assign(schema, {
                    inputFormat: 'HH:mm',
                    timeFormat:'HH:mm',
                    format:'1970-01-01THH:mm:00.000[Z]',
                });
            } else if(steedosField.type === "percent"){
                Object.assign(schema, {
                    "percent": steedosField.scale ? steedosField.scale : true
                });
            } else if(steedosField.type === "password"){
                Object.assign(schema, {
                    "revealPassword": false //没生效，需要用样式隐藏
                });
            } else if(steedosField.type === "select"){
                Object.assign(schema, {
                    "placeholder": ""
                });
            } else if(steedosField.type === "color"){
                Object.assign(schema, {
                    "defaultColor": null
                });
            }
            else if(steedosField.type === "image"){
                Object.assign(schema, {
                    enlargeAble: true,
                    showToolbar: true,
                    pipeIn: (value, data) => {
                        if(steedosField.multiple){
                            if(!value){
                                value = [defaultImageValue];
                            }
                            value = value.map(function(item: string){
                                if(item && item.split("/").length === 1){
                                    // 不是url格式时转为url格式显示
                                    return (window as any).getImageFieldUrl((window as any).Meteor.absoluteUrl(`/api/files/images/${item}`))
                                }
                                else{
                                    return item;
                                }
                            });
                        }
                        else{
                            if(isArray(value)){
                                value = value[0];
                            }
                            if(value && value.split("/").length === 1){
                                // 不是url格式时转为url格式显示
                                return (window as any).getImageFieldUrl((window as any).Meteor.absoluteUrl(`/api/files/images/${value}`))
                            }
                        }
                        return value;
                    }
                });
            }
            else if(steedosField.type === "file"){
                // 附件static模式先保持原来的逻辑，依赖_display，审批王中相关功能在creator中
                // convertSFieldToAmisField中会合并steedosField.amis，所以也不需要再次合并steedosField.amis，直接return就好
                return await Field.convertSFieldToAmisField(steedosField, readonly, ctx);
            }
            Object.assign(schema, steedosField.amis || {});
            if(hideLabel){
                delete schema.label;
            }
            return schema;
        } else{
            let fieldAmis = steedosField.amis || {};
            if(!props.data.hasOwnProperty("_display")){
                // 有_display时保持原来的逻辑不变，不走以下新的逻辑，审批王中会特意传入_display以跳过后面新加的代码
                // 重写amis中相关属性，但是允许用户通过配置组件的config.amis覆盖下面重写的逻辑
                if(steedosField.type === "image"){
                    fieldAmis = Object.assign({}, {
                        pipeIn: (value, data) => {
                            if(steedosField.multiple){
                                value = value && value.map(function(item: string){
                                    if(item && item.split("/").length === 1){
                                        // 不是url格式时转为url格式显示
                                        return (window as any).getImageFieldUrl((window as any).Meteor.absoluteUrl(`/api/files/images/${item}`))
                                    }
                                    else{
                                        return item;
                                    }
                                });
                            }
                            else{
                                if(isArray(value)){
                                    value = value[0];
                                }
                                if(value && value.split("/").length === 1){
                                    // 不是url格式时转为url格式显示
                                    return (window as any).getImageFieldUrl((window as any).Meteor.absoluteUrl(`/api/files/images/${value}`))
                                }
                            }
                            return value;
                        },
                        pipeOut: (value, data) => {
                            if(steedosField.multiple){
                                value = value && value.map(function(item: string){
                                    if(item && item.split("/").length > 1){
                                        // 是url格式时转_id值输出用于保存
                                        return item.split("/").pop();
                                    }
                                    else{
                                        return item;
                                    }
                                });
                            }
                            else{
                                if(isArray(value)){
                                    value = value[0];
                                }
                                if(value && value.split("/").length > 1){
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
            if(hideLabel){
                delete schema.label;
            }
            // console.log(`AmisSteedosField return schema`, schema)
            return schema
        }
        
    } catch (error) {
        console.log(`error`, error)
    }
    return null;
}