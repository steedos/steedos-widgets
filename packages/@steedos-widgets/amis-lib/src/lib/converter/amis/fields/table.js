import * as _ from 'lodash'
import * as Tpl from '../tpl';
import * as Fields from '../index';
import * as graphql from '../graphql';
import config from '../../../../config'
import { each, isBoolean } from 'lodash';
import { getAmisFileReadonlySchema } from './file'

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

async function getTableColumns(fields, options){
    const columns = [{name: '_index',type: 'text', width: 32, placeholder: ""}];
    for (const field of fields) {
        if((field.is_name || field.name === options.labelFieldName) && options.objectName === 'cms_files'){
            columns.push({
                "type": "button",
                className:"whitespace-nowrap",
                "label": `${field.label}`,
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
        }else if(field.type === 'toggle'){
            columns.push({
                type: "switch",
                name: field.name,
                label: field.label,
                width: field.width,
                toggled: field.toggled,
                disabled: true,
                className:"whitespace-nowrap",
            })
        }else if(field.type === 'avatar' || field.type === 'image' || field.type === 'file'){
            columns.push({
                type: "switch",
                name: field.name,
                label: field.label,
                width: field.width,
                toggled: field.toggled,
                disabled: true,
                className:"whitespace-nowrap",
                ...getAmisFileReadonlySchema(field)
            })
        }
        
        else{
            const tpl = await Tpl.getFieldTpl(field, options);

            let type = 'text';
            if(tpl){
                type = 'tpl';
            }else if(field.type === 'html'){
                type = 'markdown';
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
                    toggled: field.toggled,
                    className: field.type === 'textarea' ? 'w-56 whitespace-pre-wrap textarea' :  "whitespace-nowrap",
                    html: field.type === 'html' ? true : null
                    // toggled: true 
                })
            }
        }
        
    };

    // columns.push(getOperation(fields));

    return columns;
}

function getDefaultParams(options){
    return {
        perPage: options.top || config.listView.perPage
    }
}

function getButtonVisibleOn(button){
    let visible= button.visible;

    if(button._visible){
        visible = button._visible;
    }

    if(isBoolean(visible)){
        visible = visible.toString();
    }

    if(visible){
        // if(visible.indexOf("Meteor.") > 0 || visible.indexOf("Creator.") > 0 || visible.indexOf("Session.") > 0){
        //     console.warn('无效的visible', visible)
        //     return 'false';
        // }
        if(visible.trim().startsWith('function')){
            return `${visible}(objectName, _id, recordPermissions, data)`
        }
        return visible;
    }

    if(button.type === 'amis_button'){
        const amisSchema = button.amis_schema;
        if(amisSchema && amisSchema.body && amisSchema.body.length > 0){
            const btn1 = amisSchema.body[0];
            return btn1.visibleOn
        }
    }
}

async function getTableOperation(ctx){
    const buttons = ctx.buttons;
    const operationButtons = [];
    each(buttons, (button)=>{
        if(isBoolean(button.visible)){
            button.visible = button.visible.toString();
        }
        // operationButtons.push({
        //     type: 'button',
        //     label: button.label,
        //     visibleOn: button.visible ? `${button.visible}` : (button._visible ? `${button._visible}` : null),
        //     onEvent: {
        //         click: {
        //             actions: []
        //         }
        //     }
        // })

        operationButtons.push({
            type: 'steedos-object-button',
            name: button.name,
            objectName: button.objectName,
            visibleOn: getButtonVisibleOn(button),
            className: 'antd-Button--default'
        })
    })
    if(operationButtons.length < 1){
        return ;
    }
    return {
        type: 'operation',
        label: '操作',
        fixed: 'right',
        labelClassName: 'text-center',
        className: 'text-center steedos-listview-operation',
        buttons: [
              {
                "type": "steedos-dropdown-button",
                "label": "xxx",
                "buttons": operationButtons,
                "placement": "bottomLeft",
                // "trigger": "hover",
                "id": "u:c2140a365019",
                onOpenApi: {
                    url: `\${context.rootUrl}/service/api/@\${objectName}/recordPermissions/\${_id}`,
                    method: "get",
                    data: {
                        $: "$$",
                        objectName: "${objectName}",
                        listViewId: "${listViewId}",
                        appId: "${appId}",
                        formFactor: "${formFactor}",
                        context: `\${context}`
                    },
                    "responseData": {
                        "recordPermissions": "$$"
                    },
                    headers: {
                        Authorization: "Bearer ${context.tenantId},${context.authToken}"
                    },
                    adaptor: `
                        payload.recordPermissions = payload;
                        return payload;
                    `,
                }
              }
        ]
    }
}

export async function getTableSchema(fields, options){
    if(!options){
        options = {};
    }
    const columns = await getTableColumns(fields, options);
    columns.push(await getTableOperation(options))
    return {
        mode: "table",
        name: "thelist",
        draggable: false,
        headerToolbar: [ 'reload'],
        defaultParams: getDefaultParams(options),
        columns: columns,
        syncLocation: false,
        keepItemSelectionOnPageChange: true,
        checkOnItemClick: false,
        labelTpl: `\${${options.labelFieldName}}`,
        autoFillHeight: false, // 自动高度效果不理想,先关闭
    }
}

export async function getTableApi(mainObject, fields, options){
    const searchableFields = [];
    let { globalFilter, filter, sort, top } = options;

    if(_.isArray(filter)){
        filter = _.map(filter, function(item){
            if(item.operation){
                return [item.field, item.operation, item.value];
            }else{
                return item
            }
        })
    }
    if(!filter){
        filter = [];
    }

    _.each(fields,function(field){
        if(field.searchable){
            searchableFields.push(field.name);
        }
    })

    const fileFields = {};
    const fileFieldsKeys = [];
    fields.forEach((item)=>{
        if(_.includes(['image','avatar','file'], item.type)){
            fileFieldsKeys.push(item.name);
            fileFields[item.name] = {
                name: item.name,
                type: item.type,
                multiple: item.multiple
            };
        }
    })

    let valueField = mainObject.key_field || '_id';
    const api = await getApi(mainObject, null, fields, {alias: 'rows', limit: top, queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"`});
    api.data.$term = "$term";
    api.data.$self = "$$";
    api.data.filter = "$filter"
    api.data.loaded = "${loaded}"
    api.requestAdaptor = `
        let selfData = JSON.parse(JSON.stringify(api.data.$self));
        try{
            // TODO: 不应该直接在这里取localStorage，应该从外面传入
            const selfSupperData = api.data.$self.__super.__super;
            const listViewId = selfSupperData.listViewId;
            const listViewPropsStoreKey = location.pathname + "/crud/" + listViewId ;
            let localListViewProps = localStorage.getItem(listViewPropsStoreKey);
            if(localListViewProps){
                localListViewProps = JSON.parse(localListViewProps);
                selfData = Object.assign({}, localListViewProps, selfData);
                if(!api.data.filter){
                    api.data.filter = localListViewProps.filter;
                }
                if(!api.data.loaded){
                    // 第一次加载组件，比如刷新浏览器时因为api.data.pageNo有默认值1
                    // 所以会把localSearchableFilter中已经存过的页码覆盖
                    // 如果是第一次加载组件始终让翻页页码从本地存储中取值
                    api.data.pageNo = localListViewProps.page || 1;
                }
            }
        }
        catch(ex){
            console.error("本地存储中crud参数解析异常：", ex);
        }
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
        sort = orderBy ? sort : "${sort}";
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
                filters = searchableFilter;
            }
        }

        if(allowSearchFields){
            allowSearchFields.forEach(function(key){
                const keyValue = selfData[key];
                if(_.isString(keyValue)){
                    filters.push([key, "contains", keyValue]);
                }else if(_.isArray(keyValue) || _.isBoolean(keyValue) || keyValue){
                    filters.push([key, "=", keyValue]);
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
    const enable_tree = ${mainObject.enable_tree};
    if(!enable_tree){
        _.each(payload.data.rows, function(item, index){
            item._index = index + 1;
        })
    }
    window.postMessage(Object.assign({type: "listview.loaded"}), "*");
    let fileFields = ${JSON.stringify(fileFields)};
    _.each(payload.data.rows, function(item, index){
        _.each(fileFields , (field, key)=>{
            if(item[key] && item._display && item._display [key]){
                let value = item._display[key];
                if(!_.isArray(value)){
                    value = [value]
                };
                if(field.type === 'file'){
                    item[key] = value
                }else{
                    item[key] = _.map(value, 'url')
                }
            }
        })
    })
    
    if(enable_tree){
        const records = payload.data.rows;
        const treeRecords = [];
        const getChildren = (records, childrenIds)=>{
            if(!childrenIds){
                return;
            }
            const children = _.filter(records, (record)=>{
                return _.includes(childrenIds, record._id)
            });
            _.each(children, (item)=>{
                if(item.children){
                    item.children = getChildren(records, item.children)
                }
            })
            return children;
        }

        _.each(records, (record)=>{
            if(!record.parent){
                treeRecords.push(Object.assign({}, record, {children: getChildren(records, record.children)}));
            }
        });
        payload.data.rows = treeRecords;
    }


    try{
        // TODO: 不应该直接在这里取localStorage，应该从外面传入
        const selfSupperData = api.data.$self.__super.__super;
        const listViewId = selfSupperData.listViewId;
        const listViewPropsStoreKey = location.pathname + "/crud/" + listViewId ;
        /**
         * localListViewProps规范来自crud请求api中api.data.$self参数值的。
         * 比如：{"perPage":20,"page":1,"__searchable__name":"7","__searchable__between__n1__c":[null,null],"filter":[["name","contains","a"]]}
         * __searchable__...:顶部放大镜搜索条件
         * filter:右侧过滤器
         * perPage:每页条数
         * page:当前页码
         * orderBy:排序字段
         * orderDir:排序方向
         */
        let localListViewProps = localStorage.getItem(listViewPropsStoreKey);
        let selfData = JSON.parse(JSON.stringify(api.data.$self));
        if(localListViewProps){
            localListViewProps = JSON.parse(localListViewProps);
            selfData = Object.assign({}, localListViewProps, selfData, { filter: api.data.filter });
            if(!api.data.loaded){
                // 第一次加载组件，比如刷新浏览器时因为api.data.pageNo有默认值1
                // 所以会把localSearchableFilter中已经存过的页码覆盖
                // 如果是第一次加载组件始终让翻页页码从本地存储中取值
                selfData.page = localListViewProps.page || 1;
            }
        }
        delete selfData.context;
        delete selfData.global;
        localStorage.setItem(listViewPropsStoreKey, JSON.stringify(selfData));
        // 返回页码到UI界面
        payload.data.page= selfData.page;
    }
    catch(ex){
        console.error("本地存储中crud参数解析异常：", ex);
    }
    // 标记加载过，后续优先从本地存储中加载相关参数
    payload.data.loaded= true;
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