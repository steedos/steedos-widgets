/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:55:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-16 11:42:13
 * @Description: 
 */
import { fetchAPI } from './steedos.client';
import { getObjectList, getObjectDetail, getObjectForm } from './converter/amis/index';
import { slice, isEmpty, each } from 'lodash';
import { getFieldSearchable } from '@/lib/converter/amis/fields/index';

const _ = require('lodash');

const UI_SCHEMA_CACHE = {};

const setUISchemaCache = (key, value)=>{
    UI_SCHEMA_CACHE[key] = value;
}

const getUISchemaCache = (key)=>{
    return _.cloneDeep(UI_SCHEMA_CACHE[key]);
}

const hasUISchemaCache = (key)=>{
    return _.has(UI_SCHEMA_CACHE, key);
}

const getListViewColumns = (listView, formFactor)=>{
    let listViewColumns = [];
    if(formFactor === 'SMALL'){
        listViewColumns = !isEmpty(listView.mobile_columns) ? listView.mobile_columns :  slice(listView.columns, 0, 4);
    }else{
        listViewColumns = listView.columns;
    }
    return listViewColumns;
}

export async function getUISchema(objectName, force){
    if(!objectName){
        return ;
    }
    if(hasUISchemaCache(objectName) && !force){
        return getUISchemaCache(objectName);
    }
    const url = `/service/api/@${objectName.replace(/\./g, "_")}/uiSchema`;
    let uiSchema = null;
    try {
        uiSchema = await fetchAPI(url, {method: 'get'});
        setUISchemaCache(objectName, uiSchema);
        for(const fieldName in uiSchema.fields){
            if(uiSchema.fields){
                const field = uiSchema.fields[fieldName];

                if((field.type === 'lookup' || field.type === 'master_detail') && field.reference_to){
                    const refUiSchema = await getUISchema(field.reference_to);
                    if(!refUiSchema){
                        delete uiSchema.fields[fieldName];
                    }
                }
            }
        }
    } catch (error) {
        console.error(`getUISchema`, objectName, error);
        setUISchemaCache(objectName, null);
    }
    return getUISchemaCache(objectName) ;
}

export async function getField(objectName, fieldName){
    const uiSchema = await getUISchema(objectName);
    return uiSchema?.fields[fieldName];
}

// 获取表单页面
export async function getFormSchema(objectName, ctx){
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectForm(uiSchema, ctx);
    return {
        uiSchema,
        amisSchema
    }
}

// 获取只读页面
export async function getViewSchema(objectName, recordId, ctx){
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectDetail(uiSchema, recordId, ctx);
    return {
        uiSchema,
        amisSchema
    }
}

// 获取列表视图
export async function getListSchema(appName, objectName, listViewName, options = {}){
    const uiSchema = await getUISchema(objectName);
    const listView = _.find(uiSchema.list_views, (listView, name) => name === listViewName);

    if(!listView){
        return {uiSchema};
    }
    let fields = uiSchema.fields;
    const listViewFields = [];

    let listViewColumns = getListViewColumns(listView, options.formFactor);

    if(listView && listViewColumns){
        _.each(listViewColumns, function(column){
            if(_.isString(column) && uiSchema.fields[column]){
                listViewFields.push(uiSchema.fields[column])
            }else if(_.isObject(column) && uiSchema.fields[column.field]){
                listViewFields.push(Object.assign({}, uiSchema.fields[column.field], {width: column.width, wrap: column.wrap}))
            }
        })
    }

    if(listView &&  listView.extra_columns){
        _.each(listView.extra_columns, function(column){
            if(_.isString(column)){
                listViewFields.push({extra: true, name: column})
            }else if(_.isObject(column)){
                listViewFields.push({extra: true, name: column.field})
            }
        })
    }

    fields = listViewFields;
    const amisSchema = await getObjectList(uiSchema, fields, {tabId: objectName, appId: appName, objectName: objectName, ...options, filter: listView.filters});
    
    return {
        uiSchema,
        amisSchema
    }
}

// 获取所有相关表
export async function getObjectRelateds(appName, objectName, recordId, formFactor){
    const uiSchema = await getUISchema(objectName);

    const related = [];

    const details = [].concat(uiSchema.details || [])

    if(uiSchema.enable_files){
        details.push(`cms_files.parent`)
    }

    for (const detail of details) {
        const arr = detail.split('.');

        let filter = null;
        const refField = await getField(arr[0], arr[1]);
        if(refField._reference_to || (refField.reference_to && !_.isString(refField.reference_to))){
            filter =  [[`${arr[1]}/o`, '=', objectName], [`${arr[1]}/ids`, '=', recordId]];
        }else{
            filter = [`${arr[1]}`, '=', recordId] ;
        }

        related.push({
            masterObjectName: objectName,
            object_name: arr[0], 
            foreign_key: arr[1],
            schema: await getListSchema(appName, arr[0], 'all', {globalFilter: filter, formFactor: formFactor})
        })
    }
    return related;
}

// 获取单个相关表
export async function getObjectRelated(appName, masterObjectName, objectName, relatedFieldName, recordId, formFactor){
    let filter = null;
    const refField = await getField(objectName, relatedFieldName);
    if(refField._reference_to || (refField.reference_to && !_.isString(refField.reference_to))){
        filter =  [[`${relatedFieldName}/o`, '=', objectName], [`${relatedFieldName}/ids`, '=', recordId]];
    }else{
        filter = [`${relatedFieldName}`, '=', recordId] ;
    }
    const masterObjectUISchema = await getUISchema(masterObjectName, formFactor)
    return {
        masterObjectName: masterObjectName,
        object_name: objectName, 
        foreign_key: relatedFieldName,
        schema: await getListSchema(appName, objectName, 'all', {globalFilter: filter, formFactor: formFactor}),
        record: await SteedosUI.Object.getRecord(masterObjectName, recordId, [masterObjectUISchema.NAME_FIELD_KEY]),
        masterObjectUISchema: masterObjectUISchema
    };
}

export async function getSearchableFieldsFilterSchema(fields){
    const body = [];
    for (const field of fields) {
        const amisField = await getFieldSearchable(field, fields, {})
        if(amisField){
            amisField.className = "min-w-[200px] pr-4 max-w-[350px] grow"
            body.push(amisField)
        }
    }
    return {
        "title": "",
        "type": "form",
        "name": "form",
        "wrapWithPanel": false,
        "className": "flex flex-row w-full flex-wrap",
        "body": body,
    }
}