import { OMIT_FIELDS } from './fields';
import { absoluteUrl } from '../../steedos.client'
import * as graphql from './graphql'
import * as _ from 'lodash';

const API_CACHE = 100;

function getReadonlyFormAdaptor(fields){
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

    return  `
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

        try{
            _.each(gridAndObjectFieldsName, function(name){
                data[name] = data._display[name];
            })
        }catch(e){
            console.error(e)
        }
        payload.data = data;
        window.postMessage(Object.assign({type: "record.loaded"}, {record: data}), "*")
    }
    if(payload.errors){
        payload.status = 2;
        payload.msg = payload.errors[0].message;
    }
    return payload;
`
}

export async function getReadonlyFormInitApi(object, recordId, fields, options){
    return {
        method: "post",
        url: graphql.getApi()+"?rf="+ (new Date()).getTime(),
        cache: API_CACHE,
        adaptor: getReadonlyFormAdaptor(fields),
        data: await graphql.getFindOneQuery(object, recordId, fields, options),
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
function getScriptForAddUrlPrefixForImgFields(fields){
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
                                data[item] = imgFieldDisplayValue.map((i)=>{ return i.url });
                            }
                        }else{
                            data[item] = imgFieldDisplayValue && imgFieldDisplayValue.url;
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
                                    return {
                                        value: fileFieldValue[index],
                                        name: item.name,
                                        url: item.url + "?download=true",
                                        state: "uploaded"
                                    }
                                });
                            }
                        }else{
                            data[item] = {
                                value: fileFieldValue,
                                name: fileFieldDisplayValue.name,
                                url: fileFieldDisplayValue.url + "?download=true",
                                state: "uploaded"
                            };
                        }
                    }
                })
    `
}

export async function getEditFormInitApi(object, recordId, fields){
    const data = await graphql.getFindOneQuery(object, recordId, fields);
    data.recordId = "${recordId}";
    data.objectName = "${objectName}";
    data.uiSchema = "${uiSchema}";
    data.global = "${global}";
    data.context = "${context}";
    return {
        method: "post",
        url: graphql.getApi(),
        // sendOn: "!!this.recordId",
        cache: API_CACHE,
        requestAdaptor: `
            // 所有不想在network请求中发送的数据都应该从data中分离出来，data变量只需要留下query才需要发送出去
            var { recordId, objectName, uiSchema, global, context, ...data} = api.data;
            if(!recordId){
                // 新建则不请求任何数据
                data.query = "{data:" + objectName + "(filters: " + JSON.stringify(["_id", "=", null]) + ", top: 1){_id}}";
            }
            api.data = data;
            return api;
        `,
        adaptor: `
            const recordId = api.body.recordId;
            if(recordId && payload.data.data){
                var data = payload.data.data[0];
                if(data){
                    ${getScriptForAddUrlPrefixForImgFields(fields)}
                    ${getScriptForRewriteValueForFileFields(fields)}
                    //初始化接口返回的字段移除字段值为null的字段
                    for (key in data){
                        if(data[key] === null){
                            delete data[key];
                        }
                    }
                };
                payload.data = data;
            }
            else{
                var uiSchema = api.body.uiSchema;
                var defaultValues = {};
                _.each(uiSchema?.fields, function(field){
                    var value = SteedosUI.getFieldDefaultValue(field, api.body.global);
                    if(value){
                        defaultValues[field.name] = value;
                    }
                });
                console.log("defaultValues:", defaultValues);
                payload.data = defaultValues;
            }
            payload.data.editFormInited = true;
            delete payload.extensions;
            return payload;
        `,
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
        requestAdaptor: graphql.getSaveRequestAdaptor(fields),
        responseData: {
            "recordId": "${record._id}"
        },
        adaptor: `
            if(payload.errors){
                payload.status = 2;
                payload.msg = window.t ? window.t(payload.errors[0].message) : payload.errors[0].message;
            }
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