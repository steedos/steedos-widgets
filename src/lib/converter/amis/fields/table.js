const Tpl = require('../tpl');
const Fields = require('./index');
const _ = require('lodash');
const graphql = require('../graphql');
import config from '@/config'
function getOperation(fields){
    const controls = [];
    _.each(fields, function(field){
        controls.push(Fields.convertSFieldToAmisField(field, true));
    })
    return {
        "type": "operation",
        "label": "操作",
        "width": 100,
        fixed: "right",
        "buttons": [
          {
            "type": "button",
            "icon": "fa fa-eye",
            "actionType": "dialog",
            "tooltip": "查看",
            "dialog": {
              "title": "查看",
              "body": {
                "type": "form",
                "controls": controls
              }
            }
        }]
    }
}

//获取name字段，如果没有，则_index字段添加链接
function getDetailColumn(){}

function getTableColumns(fields, options){
    const columns = [{name: '_index',type: 'text', width: 32, placeholder: ""}];
    _.each(fields, function(field){
        if((field.is_name || field.name === options.labelFieldName) && options.objectName === 'cms_files'){
            columns.push({
                "type": "button",
                "label": `\${${field.name}}`,
                "type": "button",
                "actionType": "ajax",
                "api": {
                    "url": "${context.rootUrl}/api/files/files/${versions[0]}?download=true",
                    "method": "get",
                    "headers": {
                        "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                    },
                    "responseType": "blob",
                    "dataType": "form-data"
                  },
                "id": "u:6c8291d1029f",
                "level": "link"
              })
        }else{
            const tpl = Tpl.getFieldTpl(field, options);

            let type = 'text';
            if(tpl){
                type = 'tpl';
            }
            if(!field.hidden && !field.extra){
                columns.push({
                    name: field.name,
                    label: field.label,
                    sortable: field.sortable,
                    // searchable: field.searchable,
                    width: field.width,
                    type: type,
                    tpl: tpl,
                    toggled: field.toggled
                    // toggled: true 
                })
            }
        }
        
    });

    // columns.push(getOperation(fields));

    return columns;
}

function getDefaultParams(options){
    return {
        perPage: options.top || config.listView.perPage
    }
}

export function getTableSchema(fields, options){
    if(!options){
        options = {};
    }
    return {
        mode: "table",
        name: "thelist",
        draggable: false,
        headerToolbar: [ 'reload'],
        defaultParams: getDefaultParams(options),
        columns: getTableColumns(fields, options),
        syncLocation: false,
        keepItemSelectionOnPageChange: true,
        checkOnItemClick: true,
        labelTpl: `\${${options.labelFieldName}}`,
        autoFillHeight: false, // 自动高度效果不理想,先关闭
    }
}

export async function getTableApi(mainObject, fields, options){
    const searchableFields = [];
    let { globalFilter, filter } = options;

    if(_.isArray(filter)){
        filter = _.map(filter, function(item){
            if(item.operation){
                return [item.field, item.operation, item.value];
            }else{
                return item
            }
        })
    }

    _.each(fields,function(field){
        if(field.searchable){
            searchableFields.push(field.name);
        }
    })
    let valueField = mainObject.key_field || '_id';
    const api = await getApi(mainObject, null, fields, {alias: 'rows', queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"`});
    api.data.$term = "$term";
    api.data.$self = "$$";
    api.data.filter = "$filter"
    api.requestAdaptor = `
        const selfData = JSON.parse(JSON.stringify(api.data.$self));
        ${globalFilter ? `var filters = ${JSON.stringify(globalFilter)};` : 'var filters = [];'}
        if(_.isEmpty(filters)){
            filters = api.data.filter || [${JSON.stringify(filter)}];
        }else{
            filters = [filters, 'and', api.data.filter || [${JSON.stringify(filter)}]]
        }
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
            filters = [["${valueField.name}", "=", selfData.value]];
        }

        var searchableFilter = [];
        _.each(selfData, (value, key)=>{
            if(!_.isEmpty(value) || _.isBoolean(value)){
                if(_.startsWith(key, '__searchable__between__')){
                    searchableFilter.push([\`\${key.replace("__searchable__between__", "")}\`, "between", value])
                }else if(_.startsWith(key, '__searchable__')){
                    if(_.isString(value)){
                        searchableFilter.push([\`\${key.replace("__searchable__", "")}\`, "contains", value])
                    }else{
                        searchableFilter.push([\`\${key.replace("__searchable__", "")}\`, "=", value])
                    }
                }
            }
        });

        if(searchableFilter.length > 0){
            if(filters.length > 0 ){
                filters = [filters, 'and', searchableFilter];
            }else{
                searchableFilter = filters;
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

        if(selfData.__keywords && allowSearchFields){
            const keywordsFilters = [];
            allowSearchFields.forEach(function(key, index){
                const keyValue = selfData.__keywords;
                if(keyValue){
                    keywordsFilters.push([key, "contains", keyValue]);
                    if(index < allowSearchFields.length - 1){
                        keywordsFilters.push('or');
                    }
                }
            })
            filters.push(keywordsFilters);
        }
        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim());
        return api;
    `
    api.adaptor = `
    _.each(payload.data.rows, function(item, index){
        item._index = index + 1;
    })
    window.postMessage(Object.assign({type: "listview.loaded"}), "*")
    return payload;
    `;
    return api;
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