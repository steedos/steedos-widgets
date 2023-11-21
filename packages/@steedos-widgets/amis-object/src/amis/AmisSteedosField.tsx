/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-26 18:07:37
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-11-21 17:59:33
 * @Description: 
 */
import { Field } from '@steedos-widgets/amis-lib';
import { isArray, isEmpty, isString, pick, includes } from 'lodash';

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

    let steedosField = null;
    let { field, readonly = false, ctx = {}, config, $schema, static: fStatic, isTableColumn } = props;
    // console.log(`AmisSteedosField`, props)

    // if($schema.config && isString($schema.config)){
    //     $schema.config = JSON.parse($schema.config)
    //     props.config = $schema.config
    // }

    if(isString(ctx)){
        ctx = JSON.parse(ctx);
    }

    if(config){
        steedosField = config;
        if(isString(steedosField)){
            steedosField = JSON.parse(config);
        }
    }else{
        steedosField = field;
        if(isString(field)){
            steedosField = JSON.parse(field);
        }
    }
    try {
        if(fStatic && (steedosField.type === 'lookup' || steedosField.type === 'master_detail')){
            const schema = Object.assign({}, {
                type: 'select',
                multiple: steedosField.multiple,
                name: steedosField.name,
                label: isTableColumn ? undefined : steedosField.label,
                static: true,
                className: steedosField.amis?.className,
                source: {
                    "method": "post",
                    "url": "${context.rootUrl}/graphql",
                    "requestAdaptor": `
                        var steedosField = ${JSON.stringify(steedosField)};
                        var objectName, filters, valueFieldKey, labelFieldKey;
                        if(_.isString(steedosField.reference_to)){
                            const referenceTo = getReferenceToSync(steedosField);
                            const referenceToField = steedosField.reference_to_field || '_id';

                            objectName = referenceTo.objectName
                            valueFieldKey = referenceTo && referenceTo.valueField?.name || '_id' ;
                            labelFieldKey = referenceTo && referenceTo.labelField?.name || 'name';
                            let value = api.data[steedosField.name];
                            if(_.isString(value)){
                                value = [value]
                            }
                            filters = [referenceToField, "in", value || []];
                        }else{
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
                    "trackExpression": "${" + steedosField.name + "}"
                },
            }, pick(steedosField.amis || {}, ['className', 'inline', 'label', 'labelAlign', 'name', 'labelRemark', 'description', 'placeholder', 'staticClassName', 'staticLabelClassName', 'staticInputClassName', 'staticSchema']));
            if(isTableColumn){
                schema.placeholder = "";
            }
            return schema;
        }
        else if(fStatic){
            const schema = Object.assign({}, steedosField, {
                type: getAmisStaticFieldType(steedosField.type, steedosField.data_type, steedosField),
                static: true,
                label: isTableColumn ? undefined : steedosField.label
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
            } 
            else if(steedosField.type === "image"){
                Object.assign(schema, {
                    enlargeAble: true,
                    showToolbar: true,
                    pipeIn: (value, data) => {
                        // return (window as any).getImageFieldUrl((window as any).Meteor.absoluteUrl(`/api/files/images/${value}`))
                        console.log("===pipeIn==steedosField.multiple====", steedosField.multiple);
                        console.log("===pipeIn==typeof====", typeof value);
                        console.log("===pipeIn===", value);
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
            return schema;
        } else{
            const schema = await Field.convertSFieldToAmisField(steedosField, readonly, ctx);
            if(steedosField.type === "image"){
                Object.assign(schema, {
                    pipeIn: (value, data) => {
                        console.log("=edit==pipeIn==steedosField.multiple====", steedosField.multiple);
                        console.log("=edit==pipeIn==typeof====", typeof value);
                        console.log("=edit==pipeIn===", value);
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
                        console.log("=edit==pipeOut==steedosField.multiple====", steedosField.multiple);
                        console.log("=edit==pipeOut==typeof====", typeof value);
                        console.log("=edit==pipeOut===", value);
                        // if(value && value.split("/").length > 1){
                        //     return value.split("/").pop();
                        // }

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
                });
            }
            console.log(`AmisSteedosField return schema`, schema)
            return schema
        }
        
    } catch (error) {
        console.log(`error`, error)
    }
    return null;
}