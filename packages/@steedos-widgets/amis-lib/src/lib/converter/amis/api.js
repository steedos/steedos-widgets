import { OMIT_FIELDS } from './fields';
import { absoluteUrl } from '../../steedos.client'
import * as graphql from './graphql'
import * as _ from 'lodash';
import { i18next } from "../../../i18n"
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
            }else if(scriptStr != ''){
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
    var nameField = object.fields[object.NAME_FIELD_KEY];
    let nameLabel = nameField && nameField.name;
    if (nameField && (nameField.type == "lookup" || nameField.type == "master_detail")) {
        if(!nameField.reference_to && (nameField.optionsFunction || nameField._optionsFunction || nameField.options)){
            if(!nameField.isTableField){
                nameLabel = `record.${nameField.name}__label`;
            }
        } else {
            nameLabel = `record._display.${nameField.name}.label`;
        }
    } else if (nameField){
        nameLabel = `(record._display && record._display.${nameField.name}) || record.${nameField.name}`
    }
    return  `
    if(!payload.data.data || payload.data.data.length === 0){
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
            console.log('无法找到记录', api, payload, context)
            return {
                status: 0,
                // msg: "${i18next.t('frontend_no_records_found')}"
            }
        }
    }
    if(payload.data.data){
        var data = payload.data.data[0];
        var gridAndObjectFieldsName = ${JSON.stringify(gridAndObjectFieldsName)};
        try{
            ${scriptStr}
            ${getScriptForAddUrlPrefixForImgFields(fields, true)}
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
        payload.data.record = record;
        payload.data.NAME_FIELD_VALUE = ${nameLabel} || record.name;
        payload.data._master = {
            record: record,
            objectName: "\${objectName}",
            recordId: "\${recordId}"
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

function getConvertDataScriptStr(fields){
    const refFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && (field.type == 'lookup' || field.type == 'master_detail') && field.reference_to});
    let scriptStr = '';
    _.each(refFields, function(field){
        if(!_.includes(OMIT_FIELDS, field.name)){
            const valueField = field.reference_to_field || '_id';
            if(field.multiple){
                scriptStr = scriptStr + `data.${field.name} = _.map(data.${field.name}, '${valueField}');`
            }else{
                scriptStr = scriptStr + `data.${field.name} = data.${field.name} ? data.${field.name}.${valueField}:null;`
            }
        }
    })
    return scriptStr;
}

/*
    img/avatar字段值添加URL前缀使其在amis中正常显示图片。
*/
export function getScriptForAddUrlPrefixForImgFields(fields, readonly){
    let imgFieldsKeys = [];
    let imgFields = {};
    fields.forEach((item)=>{
        if(_.includes(['image','avatar'], item.type)){
            imgFieldsKeys.push(item.name);
            imgFields[item.name] = {
                name: item.name,
                type: item.type,
                multiple: item.multiple
            };
        }
    })
    if(!imgFieldsKeys.length){
        return '';
    }
    return `
                // image字段值添加URL前缀
                let imgFieldsKeys = ${JSON.stringify(imgFieldsKeys)};
                let imgFields = ${JSON.stringify(imgFields)};
                imgFieldsKeys.forEach((item)=>{
                    let imgFieldValue = data[item];
                    let imgFieldDisplayValue = data._display && data._display[item];
                    if(imgFieldValue && imgFieldValue.length){
                        let fieldProps = imgFields[item];
                        if(fieldProps.multiple){
                            if(imgFieldDisplayValue instanceof Array){
                                data[item] = imgFieldDisplayValue.map((i)=>{ 
                                    const url = window.getImageFieldUrl(i.url, ${readonly});
                                    return url;
                                });
                            }
                        }else{
                            const url = imgFieldDisplayValue && window.getImageFieldUrl(imgFieldDisplayValue.url, ${readonly});
                            data[item] = url;
                        }
                    }
                })
    `
}

/*
    file字段值重写使其在amis中正常显示附件名、点击附件名下载文件。
*/
function getScriptForRewriteValueForFileFields(fields){
    let fileFieldsKeys = [];
    let fileFields = {};
    fields.forEach((item)=>{
        if(item.type === 'file'){
            fileFieldsKeys.push(item.name);
            fileFields[item.name] = {
                name: item.name,
                multiple: item.multiple
            };
        }
    })
    if(!fileFieldsKeys.length){
        return '';
    }
    return `
                // file字段值重写以便编辑时正常显示附件名、点击附件名正常下载附件
                let fileFieldsKeys = ${JSON.stringify(fileFieldsKeys)};
                let fileFields = ${JSON.stringify(fileFields)};
                fileFieldsKeys.forEach((item)=>{
                    let fileFieldValue = data[item];
                    let fileFieldDisplayValue = data._display && data._display[item];
                    if(fileFieldValue && fileFieldValue.length){
                        if(fileFields[item].multiple){
                            if(fileFieldDisplayValue instanceof Array){
                                data[item] = fileFieldDisplayValue.map((item, index)=>{ 
                                    item.value = fileFieldValue[index];
                                    return {
                                        value: fileFieldValue[index],
                                        name: item.name,
                                        url: item.url,
                                        state: "uploaded"
                                    }
                                });
                            }
                        }else{
                            fileFieldDisplayValue.value = fileFieldValue;
                            data[item] = [{
                                value: fileFieldValue,
                                name: fileFieldDisplayValue.name,
                                url: fileFieldDisplayValue.url,
                                state: "uploaded"
                            }];
                        }
                    }
                })
    `
}

export async function getEditFormInitApi(object, recordId, fields, options){
    const data = await graphql.getFindOneQuery(object, recordId, fields);
    data.recordId = "${recordId}";
    data.objectName = "${objectName}";
    data.uiSchema = "${uiSchema}";
    data.global = "${global}";
    data.context = "${context}";
    data.defaultData = "${defaultData}";
    data._master = "${_master}";
    
    return {
        method: "post",
        url: graphql.getApi(),
        // sendOn: "!!this.recordId",
        cache: API_CACHE,
        requestAdaptor: `
            // 所有不想在network请求中发送的数据都应该从data中分离出来，data变量只需要留下query才需要发送出去
            var { recordId, objectName, uiSchema, global, context, _master, ...data} = api.data;
            if(!recordId){
                // 新建则不请求任何数据
                data.query = "{data:" + objectName + "(filters: " + JSON.stringify(["_id", "=", null]) + ", top: 1){_id}}";
            }
            api.data = data;
            ${options.initApiRequestAdaptor || ''}
            return api;
        `,
        adaptor: `
            const recordId = api.body.recordId;
            let initialValues={};
            if(recordId && payload.data.data){
                var data = payload.data.data[0];
                const dataKeys = _.keys(data);
                const uiSchema = api.body.uiSchema;
                const fieldKeys = uiSchema && _.keys(uiSchema.fields);

                if(data){
                    ${getScriptForAddUrlPrefixForImgFields(fields, false)}
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


export function getSaveApi(object, recordId, fields, options){
    return {
        method: 'post',
        url: graphql.getApi(),
        data: graphql.getSaveQuery(object, recordId, fields, options),
        requestAdaptor: graphql.getSaveRequestAdaptor(fields, options),
        responseData: {
            "recordId": "${record._id}"
        },
        adaptor: `
            if(payload.errors){
                delete payload.data;
                payload.status = 2;
                payload.msg = window.t ? window.t(payload.errors[0].message) : payload.errors[0].message;
            }
            ${options.apiAdaptor || ''}
            return payload;
        `,
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    }
}

export function getBatchDelete(objectName){
    return {
        method: 'post',
        url: graphql.getApi(),
        adaptor: `
            if(payload.errors){
                payload.data.deleteErrorMessage = [];
                payload.errors.forEach(function(error){
                    let errorRecord = error.path.map(function (item) {
                        return item.split('delete__')[1].to_float() + 1;
                    }).toString();
                    payload.data.deleteErrorMessage.push("第" + errorRecord + "条记录删除出现异常，报错信息为(" + (window.t ? window.t(error.message) : error.message) + ")");
                })
            }
            return payload;
        `,
        requestAdaptor: `
            var ids = api.data.ids.split(",");
            var deleteArray = [];
            ids.forEach((id,index)=>{
                deleteArray.push(\`delete__\${index}:${objectName}__delete(id: "\${id}")\`);
            })
            api.data = {query: \`mutation{\${deleteArray.join(',')}}\`};
            return api;
        `,
        data: {
            ids: `\${ids}`
        },
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    }
}