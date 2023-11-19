/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-26 18:07:37
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-11-19 19:25:24
 * @Description: 
 */
import { Field, getReferenceTo } from '@steedos-widgets/amis-lib';
import { isArray, isEmpty, isString, pick, includes } from 'lodash';

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

function getAmisStaticFieldType(type: string, data_type?: string){
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
        return getAmisStaticFieldType(data_type);
    }else if(type === 'location'){
        return "location-picker";
    }else if(type === 'image'){
        return "static-images";
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
            let objectName, filters, valueFieldKey, labelFieldKey;
            if(!props.data[steedosField.name]){
                return {};
            }
            if(isString(steedosField.reference_to)){
                const referenceTo = await getReferenceTo(steedosField);
                const referenceToField = steedosField.reference_to_field || '_id';

                objectName = referenceTo.objectName
                valueFieldKey = referenceTo && referenceTo.valueField?.name || '_id' ;
                labelFieldKey = referenceTo && referenceTo.labelField?.name || 'name';
                let value = props.data[steedosField.name];
                if(isString(value)){
                    value = [value]
                }
                filters = [referenceToField, "in", value];
            }else{
                const _steedosField = {
                    ...steedosField,
                    reference_to: props.data[steedosField.name].o
                }
                const referenceTo = await getReferenceTo(_steedosField);
                const referenceToField = _steedosField.reference_to_field || '_id';

                objectName = referenceTo.objectName
                valueFieldKey = referenceTo && referenceTo.valueField?.name || '_id' ;
                labelFieldKey = referenceTo && referenceTo.labelField?.name || 'name';
                
                filters = [referenceToField, "in", props.data[_steedosField.name].ids];
            }
            
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
                        api.data = {
                            query: '{options:${objectName}(filters: ${JSON.stringify(filters)}){label: ${labelFieldKey},value: ${valueFieldKey}}}'
                        }
                        return api;
                    `
                }
            }, pick(steedosField.amis || {}, ['className', 'inline', 'label', 'labelAlign', 'name', 'labelRemark', 'description', 'placeholder', 'staticClassName', 'staticLabelClassName', 'staticInputClassName', 'staticSchema']));
            console.log(`AmisSteedosField return schema===lookup====`, schema)
            return schema;
        }
        else if(fStatic){
            const schema = Object.assign({}, steedosField, {
                type: getAmisStaticFieldType(steedosField.type, steedosField.data_type),
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
            return schema;
        } else{
            const schema = await Field.convertSFieldToAmisField(steedosField, readonly, ctx);
            // console.log(`AmisSteedosField return schema`, schema)
            return schema
        }
        
    } catch (error) {
        console.log(`error`, error)
    }
    return null;
}