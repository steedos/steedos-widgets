import { getUISchema } from '../../../objects';
import * as _ from 'lodash'
import * as graphql from '../graphql'
import * as Tpl from '../tpl';
import * as Field from './index';
import * as Table from './table';
import * as List from './list';
import { getSelectUserSchema } from './user';

const getReferenceTo = async (field)=>{
    let referenceTo = field.reference_to;
    if(!referenceTo){
        return ;
    }

    if(referenceTo === 'users'){
        referenceTo = 'space_users';
        field.reference_to_field = 'user'
    }

    const refObjectConfig = await getUISchema(referenceTo);
    let valueField = null;
    let valueFieldName = field.reference_to_field;
    if(!valueFieldName){
        valueFieldName = refObjectConfig.idFieldName || '_id';
    }
    if(valueFieldName === '_id'){
        valueField = {name: '_id', label: 'ID', type: 'text', toggled: false};
    }else{
        valueField = refObjectConfig.fields[valueFieldName] || {name: valueFieldName};
    }
    return {
        objectName: referenceTo,
        valueField: valueField,
        labelField: refObjectConfig.fields[refObjectConfig.NAME_FIELD_KEY || 'name']
    }
}


export async function lookupToAmisPicker(field, readonly, ctx){
    let referenceTo = await getReferenceTo(field);
    if(!referenceTo){
        return ;
    }
    const refObjectConfig = await getUISchema(referenceTo.objectName);
    const tableFields = [];
    let i = 0;
    const searchableFields = [];

    const fieldsArr = [];
	_.each(refObjectConfig.fields , (field, field_name)=>{
        if(field_name != '_id' && !field.hidden){
            if(!_.has(field, "name")){
                field.name = field_name
            }
            fieldsArr.push(field)
        }
    })
    _.each(_.sortBy(fieldsArr, "sort_no"),function(field){
        if(i < 5){
            if(!_.find(tableFields, function(f){
                return f.name === field.name
            })){
                i++;
                tableFields.push(field)
                if(field.searchable){
                    searchableFields.push(field.name);
                }
            }
        }
    });

    const fields = {
        [referenceTo.labelField.name]: referenceTo.labelField,
        [referenceTo.valueField.name]: referenceTo.valueField
    };

    _.each(tableFields, (tableField)=>{
        if(!tableField.hidden){
            fields[tableField.name] = tableField;
        }
    });

    const source = await getApi({
        name: referenceTo.objectName
    }, null, fields, {expand: true, alias: 'rows', queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"`});
    source.data.$term = "$term";
    source.data.$self = "$$";
   
    source.requestAdaptor = `
        const selfData = JSON.parse(JSON.stringify(api.data.$self));
        var filters = [];
        var pageSize = api.data.pageSize || 10;
        var pageNo = api.data.pageNo || 1;
        var skip = (pageNo - 1) * pageSize;
        var orderBy = api.data.orderBy || '';
        var orderDir = api.data.orderDir || '';
        var sort = orderBy + ' ' + orderDir;
        var allowSearchFields = ${JSON.stringify(searchableFields)};
        if(api.data.$term){
            filters = [["name", "contains", "'+ api.data.$term +'"]];
        }else if(selfData.op === 'loadOptions' && selfData.value){
            if(selfData.value?.indexOf(',') > 0){
                filters = [["${referenceTo.valueField.name}", "=", selfData.value.split(',')]];
            }else{
                filters = [["${referenceTo.valueField.name}", "=", selfData.value]];
            }
        }
        if(allowSearchFields){
            allowSearchFields.forEach(function(key){
                const keyValue = selfData[key];
                if(keyValue){
                    filters.push([key, "contains", keyValue]);
                }
            })
        }

        const filtersFunction = ${field._filtersFunction};
        
        if(filtersFunction){
            const _filters = filtersFunction();
            if(_filters && _filters.length > 0){
                filters.push(_filters);
            }
        }

        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim());
        return api;
    `

    let top = 20;

    if(refObjectConfig.paging && refObjectConfig.paging.enabled === false){
        top = 1000;
    };

    let pickerSchema = null;
    if(ctx.formFactor === 'SMALL'){
        pickerSchema = await List.getListSchema(tableFields, {
            top:  top,
            ...ctx,
            actions: false
        })
    }else{
        pickerSchema = await Table.getTableSchema(tableFields, {
            top:  top,
            ...ctx
        })
    }

    const data = {
        type: Field.getAmisStaticFieldType('picker', readonly),
        labelField: referenceTo.labelField.name,
        valueField: referenceTo.valueField.name,
        modalMode: 'dialog', //TODO 设置 dialog 或者 drawer，用来配置弹出方式
        source: source,
        size: "lg",
        pickerSchema: pickerSchema,
        joinValues: false,
        extractValue: true
    }
    if(field.multiple){
        data.multiple = true
        data.extractValue = true
    }

    if(readonly){
        data.tpl = await Tpl.getLookupTpl(field, ctx)
    }

    return data;
}

export async function lookupToAmisSelect(field, readonly, ctx){
    let referenceTo = await getReferenceTo(field);

    let apiInfo;

    if(referenceTo){
        apiInfo = await getApi({
            name: referenceTo.objectName
        }, null, {
            [referenceTo.labelField.name]: Object.assign({}, referenceTo.labelField, {alias: 'label'}),
            [referenceTo.valueField.name]: Object.assign({}, referenceTo.valueField, {alias: 'value'})
        }, {expand: false, alias: 'options', queryOptions: `filters: {__filters}, top: {__top}`})
    }else{
        apiInfo = {
            method: "post",
            url: graphql.getApi(),
            data: {query: '{objects(filters: ["_id", "=", "-1"]){_id}}', $: "$$"}
        }
    }

    
    apiInfo.data.$term = "$term";
    apiInfo.data.$value = `$${field.name}.${referenceTo ? referenceTo.valueField.name : '_id'}`;
    _.each(field.depend_on, function(fName){
        apiInfo.data[fName] = `$${fName}`;
    })
    apiInfo.data['$'] = `$$`;
    apiInfo.data['rfield'] = `\${object_name}`;
    // [["_id", "=", "$${field.name}._id"],"or",["name", "contains", "$term"]]
    apiInfo.requestAdaptor = `
        var filters = '[]';
        var top = 10;
        if(api.data.$term){
            filters = '["name", "contains", "'+ api.data.$term +'"]';
        }else if(api.data.$value){
            filters = '["_id", "=", "'+ api.data.$value +'"]';
        }
        api.data.query = api.data.query.replace(/{__filters}/g, filters).replace('{__top}', top);
        return api;
    `
    let labelField = referenceTo ? referenceTo.labelField.name : '';
    let valueField = referenceTo ? referenceTo.valueField.name : '';
    if(field._optionsFunction){
        apiInfo.adaptor = `
        payload.data.options = eval(${field._optionsFunction})(api.data);
        return payload;
        `
        labelField = 'label';
        valueField = 'value';
    }

    const data = {
        type: Field.getAmisStaticFieldType('select', readonly),
        joinValues: false,
        extractValue: true,
        // labelField: labelField,
        // valueField: valueField,
        autoComplete: apiInfo,
    }
    if(_.has(field, 'defaultValue') && !(_.isString(field.defaultValue) && field.defaultValue.startsWith("{"))){
        data.value = field.defaultValue
    }
    if(field.multiple){
        data.multiple = true
        data.extractValue = true
    }

    if(readonly){
        data.tpl = await Tpl.getLookupTpl(field, ctx)
    }

    return data;
}

async function getApi(object, recordId, fields, options){
    const data = await graphql.getFindQuery(object, recordId, fields, options);
    return {
        method: "post",
        url: graphql.getApi(),
        data: data,
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    }
}

export async function lookupToAmis(field, readonly, ctx){
    if(readonly){
        return {
            type: Field.getAmisStaticFieldType('picker', readonly),
            tpl: Tpl.getRelatedFieldTpl(field, ctx)
        }
    }
    // console.log(`referenceTo.objectName====`, field)
    if(!_.isString(field.reference_to) && !readonly){
        return {
            type: 'steedos-field-lookup',
            field,
            readonly,
            ctx: {},
            "onEvent": {
                "change": {
                  "weight": 0,
                  "actions": [
                    {
                      "actionType": "custom",
                      script: `console.log('======', event)`
                    }
                  ]
                }
              }
        }
        // return await lookupToAmisGroup(field, readonly, ctx);
    }

    let referenceTo = await getReferenceTo(field);
    if(!referenceTo){
        return await lookupToAmisSelect(field, readonly, ctx);
    }

    const refObject = await getUISchema(referenceTo.objectName);

    if(referenceTo.objectName === "space_users"){
        return await lookupToAmisSelectUser(field, readonly, ctx);
    }

    // 此处不参考 steedos 的 enable_enhanced_lookup 规则. 如果默认是开启弹出选择,用户选择过程操作太繁琐, 所以默认是关闭弹出选择.
    if(refObject.enable_enhanced_lookup == true){
        return await lookupToAmisPicker(field, readonly, ctx);
    }else{
        return await lookupToAmisSelect(field, readonly, ctx);
    }
}

export async function lookupToAmisSelectUser(field, readonly, ctx){
    return getSelectUserSchema(field, readonly, ctx);
}