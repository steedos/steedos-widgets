/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-26 18:07:37
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-10-29 18:26:05
 * @Description: 
 */
import { Field, getReferenceTo } from '@steedos-widgets/amis-lib';
import { isArray, isEmpty, isString, pick } from 'lodash';

export const AmisSteedosField = async (props)=>{

    let steedosField = null;
    let { field, readonly = false, ctx = {}, config, $schema, static: fStatic } = props;
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
                label: steedosField.label,
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
            // console.log(`AmisSteedosField return schema`, schema)
            return schema;
        }else{
            const schema = await Field.convertSFieldToAmisField(steedosField, readonly, ctx);
            // console.log(`AmisSteedosField return schema`, schema)
            return schema
        }
        
    } catch (error) {
        console.log(`error`, error)
    }
    return null;
}