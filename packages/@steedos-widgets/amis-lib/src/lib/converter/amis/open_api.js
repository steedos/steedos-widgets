import { OMIT_FIELDS } from './fields';
import { absoluteUrl } from '../../steedos.client'
import * as graphql from './graphql'
import * as openql from './openql';
import * as _ from 'lodash';
import { i18next } from "../../../i18n"
import { getScriptForRewriteValueForFileFields, getScriptForAddUrlPrefixForImgFields } from './api';

const API_CACHE = 100;

function getReadonlyFormAdaptor(object, fields, options){
    let scriptStr = '';
    const selectFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && ((field.type == 'select' && field.options) || ((field.type == 'lookup' || field.type == 'master_detail') && !field.reference_to))});
    const gridAndObjectFieldsName = _.map(_.filter(fields, function(field){return field.name.indexOf('.') < 0 && (field.type === 'object' || field.type === 'grid')}), 'name');
    _.each(selectFields, function(field){
        if(!_.includes(OMIT_FIELDS, field.name)){
            const valueField = field.name;
            if(field.options){
                const options = JSON.stringify({options: field.options});
                scriptStr = scriptStr + `var ${field.name}Options= (${options}).options;`;
            }else if(field.optionsFunction){
                scriptStr = scriptStr + `var ${field.name}Options = eval(${field.optionsFunction.toString()})(api.data);`
            }else if(field._optionsFunction){
                scriptStr = scriptStr + `var ${field.name}Options = eval(${field._optionsFunction})(api.data);`
            }
            if(field.multiple){
                scriptStr = scriptStr + `data.${field.name}__label = _.map(_.filter(${field.name}Options, function(option){return _.includes(data.${field.name}, option.value)}), 'label');`
            }else{
                scriptStr = scriptStr + `var ${field.name}Selected = _.find(${field.name}Options, function(option){return data.${field.name} == option.value});`
                scriptStr = scriptStr + `data.${field.name}__label = ${field.name}Selected ? ${field.name}Selected.label:null;`
            }
        }
    });

    // const refFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && (field.type == 'lookup' || field.type == 'master_detail') && !field.reference_to});
    // _.each(refFields, function(field){
    //     if(!_.includes(OMIT_FIELDS, field.name)){
    //         const valueField = field.reference_to_field || '_id';
    //         scriptStr = scriptStr + `var ${field.name}Options = eval(${field.optionsFunction.toString()})(api.data);`
    //         if(field.multiple){
    //             scriptStr = scriptStr + `data.${field.name}__label = _.map(_.filter(${field.name}Options, function(option){return _.includes(data.${field.name}, option.value)}), 'label');`
    //         }else{
    //             scriptStr = scriptStr + `var ${field.name}Selected = _.find(${field.name}Options, function(option){return data.${field.name} == option.value});`
    //             scriptStr = scriptStr + `data.${field.name}__label = ${field.name}Selected ? ${field.name}Selected.label:null;`
    //         }
    //     }
    // })

    var fieldNames = _.map(fields, function(n){return n.name});
    return  `
    if(payload.data.data.length === 0){
        var isEditor = !!${options && options.isEditor};
        if(isEditor){
            var fieldNames = ${JSON.stringify(fieldNames)};
            var emptyDoc = {};//这里如果不把每个字段值设置为空的话，表单上会显示上一次表单上的字段值
            fieldNames.forEach(function(n){
                emptyDoc[n] = null;
            });
            // 设计器中始终显示表单，有记录则显示第一条记录，没记录时显示为空表单
            payload.data.data = [emptyDoc];
        }
        else{
            return {
                status: 2,
                msg: "${i18next.t('frontend_no_records_found')}"
            }
        }
    }
    if(payload.data.data){
        var data = payload.data.data[0];
        var gridAndObjectFieldsName = ${JSON.stringify(gridAndObjectFieldsName)};
        try{
            ${scriptStr}
            ${getScriptForAddUrlPrefixForImgFields(fields)}
            ${getScriptForRewriteValueForFileFields(fields)}
        }catch(e){
            console.error(e)
        }
        // 原始记录
        var record = _.cloneDeep(data);
        try{
            _.each(gridAndObjectFieldsName, function(name){
                data[name] = data._display && data._display[name];
            })
        }catch(e){
            console.error(e)
        }
        payload.data = data;
        payload.data.__objectName = "${object.name}";
        payload.data.record = record;

        payload.data.NAME_FIELD_VALUE = record.${object.NAME_FIELD_KEY || 'name'};
        payload.data._master = {
            record: record,
            objectName: "${object.name}",
            recordId: record._id
        }
        window.postMessage(Object.assign({type: "record.loaded"}, {record: record}), "*")
    }
    if(payload.errors){
        payload.status = 2;
        payload.msg = payload.errors[0].message;
    }else{
        payload.data.recordLoaded = true;
    }
    ${options && options.initApiAdaptor || ''}
    return payload;
`
}

export async function getReadonlyFormInitApi(object, recordId, fields, options){
    let findOneOptions;
    if (!recordId && options && options.isEditor) {
        // 设计器中只读表单返回第一条记录
        findOneOptions = {
            filters: [],
            queryOptions: "top: 1"
        };
    }
    return {
        method: "post",
        url: graphql.getApi() + '&objectName=${objectName}' + "&recordId=${recordId}",
        cache: API_CACHE,
        requestAdaptor: `
            ${options && options.initApiRequestAdaptor || ''}
            return api;
        `,
        adaptor: getReadonlyFormAdaptor(object, fields, options),
        data: await graphql.getFindOneQuery(object, recordId, fields, findOneOptions),
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    }
}

export async function getEditFormInitApi(object, recordId, fields, options){
    const data = await openql.getFindOneQuery(object, recordId, fields);
    data.recordId = "${recordId}";
    data.objectName = "${objectName}";
    data.uiSchema = "${uiSchema}";
    data.global = "${global}";
    data.context = "${context}";
    data.defaultData = "${defaultData}";
    data._master = "${_master}";

    const apiRequestAdaptor = getEditFormInitApiRequestAdaptor(data);
    const apiAdaptor = getEditFormInitApiAdaptor(data);
    
    return {
        method: "get",
        url: openql.getApi(object.name) + '&objectName=${objectName}' ,
        // sendOn: "!!this.recordId",
        cache: API_CACHE,
        requestAdaptor: `
            // 所有不想在network请求中发送的数据都应该从data中分离出来，data变量只需要留下query才需要发送出去
            var { recordId, objectName, uiSchema, global, context, _master } = api.body;
            ${apiRequestAdaptor || ''}
            ${options.initApiRequestAdaptor || ''}
            return api;
        `,
        adaptor: `
            ${apiAdaptor || ''};
            const recordId = api.body.recordId;
            let initialValues={};
            if(recordId && payload.data.data){
                var data = payload.data.data[0];
                const dataKeys = _.keys(data);
                const uiSchema = api.body.uiSchema;
                const fieldKeys = uiSchema && _.keys(uiSchema.fields);

                if(data){
                    ${getScriptForAddUrlPrefixForImgFields(fields)}
                    ${getScriptForRewriteValueForFileFields(fields)}

                    _.each(dataKeys, function(key){
                        if(fieldKeys.indexOf(key)<0 && key !== "_display"){
                            delete data[key];
                        }
                    })
                    
                    //初始化接口返回的字段移除字段值为null的字段
                    for (key in data){
                        if(data[key] === null){
                            delete data[key];
                        }
                    }
                };
                initialValues = data;
            }
            else{
                var uiSchema = api.body.uiSchema;
                var defaultData = api.body.defaultData;
                var defaultValues = {};
                _.each(uiSchema && uiSchema.fields, function(field){
                    var value = SteedosUI.getFieldDefaultValue(field, api.body.global);
                    if(!_.isNil(value)){
                        defaultValues[field.name] = value;
                    }
                });
                if(defaultData && _.isObject(defaultData) && !_.isArray(defaultData)){
                    defaultValues = Object.assign({}, defaultValues, defaultData)
                }
                if(uiSchema.form){
                    try{
                        var objectFormConfig = JSON.parse(uiSchema.form);
                        var formInitialValuesFun = objectFormConfig.initialValues;
                        if(formInitialValuesFun){
                            formInitialValuesFun = new Function("return " + formInitialValuesFun)();
                        }
                        if(typeof formInitialValuesFun === "function"){
                            initialValues = formInitialValuesFun.apply({doc: defaultValues || {} , global: api.body.global, master: api.body._master })
                        }
                    }
                    catch(ex){
                        console.warn(ex);
                    }
                }
                if(_.isObject(initialValues)){
                    // uiSchema.form.initialValues为函数且执行后为json，则优先取initialValues中的默认值
                    initialValues = Object.assign({}, defaultValues, initialValues);
                }
                else{
                    initialValues = defaultValues;
                }
            }
            // data下的变量需要在保存接口（getSaveApi）中被删除。
            payload.data = {
                ...initialValues
            }
            ${options.initApiAdaptor || ''}
            // console.log('getEditFormInitApi======>', payload);
            return payload;
        `,
        responseData: {
            "&": "$$",
            editFormInited: true
        },
        data: data,
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    }
}

function getEditFormInitApiRequestAdaptor(data){
    // open api发送适配器url参数
    return `
        if(recordId){
            api.data = {
                fields: JSON.stringify(api.body.fields),
                uiFields: JSON.stringify(api.body.uiFields),
                expandFields: JSON.stringify(api.body.expandFields),
                filters: JSON.stringify(api.body.filters),
                top: 1
            }
        }
        else{
            // 新建则不请求任何数据
            api.data = {
                fields: JSON.stringify(["_id"]),
                filters: JSON.stringify(["_id", "=", null]),
                top: 1
            }
        }
        if(api.body){
            // amis bug，接口为Get请求时，url上的data参数无法删除，只能手动把url重写掉，见：https://github.com/baidu/amis/issues/9813
            let rootURL = api.body.context && api.body.context.rootUrl || "";
            let objectName = api.body.objectName || "";
            let additionalFilters = api.body.additionalFilters || "";
            // url按表单初始化url返回，比如/api/v1/test__c?reload=
            api.url = rootURL = "/api/v1/" + objectName + "?reload=" + additionalFilters + "&objectName=" + objectName;
        }
    `;
}

function getEditFormInitApiAdaptor(data){
    // open api接收适配器中，在最开头把返回值的items转为data，_ui转为_display,total转为count，这样后续脚本就可以跟GraphQL一样
    return `
        if(api.body.recordId && payload.data.items){
            payload.data.data = (payload.data.items || []).map(function(n){
                return Object.assign({}, n, {
                    _display: n._ui
                });
            });
            payload.data.count = payload.data.total;
            delete payload.data.items;
            delete payload.data.total;
        }
    `;
}