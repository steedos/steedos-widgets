/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:55:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-23 17:52:10
 * @Description: 
 */
import { fetchAPI } from './steedos.client';
import { getObjectList, getObjectDetail, getObjectForm } from './converter/amis/index';
import { list } from 'postcss';
import { slice, isEmpty } from 'lodash';

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

export async function getUISchema(objectName){
    if(!objectName){
        return ;
    }
    if(hasUISchemaCache(objectName)){
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

export async function getFormSchema(objectName, ctx){
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectForm(uiSchema, ctx);
    return {
        uiSchema,
        amisSchema
    }
}

export async function getViewSchema(objectName, recordId, ctx){
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectDetail(uiSchema, recordId, ctx);
    return {
        uiSchema,
        amisSchema
    }
}

function getListViewColumns(listView, formFactor){
    let listViewColumns = [];

    if(formFactor === 'SMALL'){
        listViewColumns = !isEmpty(listView.mobile_columns) ? listView.mobile_columns :  slice(listView.columns, 0, 4);
    }else{
        listViewColumns = listView.columns;
    }

    return listViewColumns;
}

export async function getListSchema(appName, objectName, listViewName = 'all', options = {}){
    const uiSchema = await getUISchema(objectName);

    const listView = _.find(uiSchema.list_views, (listView, name) => name === listViewName);

    if(!listView){
        return {};
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
    const amisSchema = await getObjectList(uiSchema, fields, {tabId: objectName, appId: appName, objectName: objectName, ...options});
    return {
        uiSchema,
        amisSchema
    }
}

export async function getField(objectName, fieldName){
    const uiSchema = await getUISchema(objectName);
    return uiSchema?.fields[fieldName];
}

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
            object_name: arr[0], 
            foreign_key: arr[1],
            schema: await getListSchema(appName, arr[0], 'all', {filter: filter, formFactor: formFactor})
        })
    }
    console.log(related);
    return related;
}