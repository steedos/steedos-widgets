import * as _ from 'lodash'
import * as Tpl from '../tpl';
import * as Fields from '../index';
import * as graphql from '../graphql';
import config from '../../../../config'
import { each, forEach, isBoolean, isEmpty } from 'lodash';
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
            const previewFileScript = `
                var data = event.data;
                var file_name = data.versions ? data.name : "${field.label}";
                var file_id = data._id;
                SteedosUI.previewFile && SteedosUI.previewFile({file_name, file_id});
            `;
            columns.push({
                "type": "button",
                "label": `<%=data.versions ? data.name : "${field.label}"%>`,
                "className": "whitespace-nowrap",
                "level": "link",
                "onEvent": {
                  "click": {
                    "actions": [
                        {
                            "args": {
                                "api": {
                                    "url": "${context.rootUrl}/api/files/files/${versions[0]}?download=true",
                                    "method": "get",
                                    "headers": {
                                        "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                    }
                                }
                            },
                            "actionType": "download",
                            "expression": "!!!window?.nw?.require"//浏览器上直接下载
                        },
                        {
                          "args": {},
                          "actionType": "custom",
                          "script": previewFileScript,
                          "expression": "!!window?.nw?.require" //PC客户端预览附件
                        }
                    ]
                  }
                }
            })
        }else if(field.type === 'toggle'){
            columns.push(Object.assign({}, {
                type: "switch",
                name: field.name,
                label: field.label,
                width: field.width,
                toggled: field.toggled,
                disabled: true,
                className:"whitespace-nowrap",
            }, field.amis, {name: field.name}))
        }else if(field.type === 'avatar' || field.type === 'image' || field.type === 'file'){
            columns.push(Object.assign({}, {
                type: "switch",
                name: field.name,
                label: field.label,
                width: field.width,
                toggled: field.toggled,
                disabled: true,
                className:"whitespace-nowrap",
                ...getAmisFileReadonlySchema(field)
            }, field.amis, {name: field.name}))
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
                columns.push(Object.assign({}, {
                    name: field.name,
                    label: field.label,
                    sortable: field.sortable,
                    // searchable: field.searchable,
                    width: field.width,
                    type: type,
                    tpl: tpl,
                    toggled: field.toggled,
                    className: field.type === 'textarea' ? 'min-w-56 whitespace-pre-wrap textarea' :  "whitespace-nowrap",
                    html: field.type === 'html' ? true : null
                    // toggled: true 
                }, field.amis, {name: field.name}))
            }
        }
        
    };

    // columns.push(getOperation(fields));

    return columns;
}

/**
 * 生成移动端列表每行显示的amis行
 * @param {*} tpls 要显示的每个字段的tpl
 * @returns {
        "type": "wrapper",
        "body": [{
            "type": "tpl",
            "tpl": tpls[index].tpl,
            "className": "truncate"//左侧样式类
        },{
            "type": "tpl",
            "tpl": tpls[index + 1].tpl,
            "className": "truncate ml-2 flex flex-shrink-0"//右侧样式类
        }],
        "size": "none",
        "className": "flex items-center justify-between"//每行样式类
    }
 */
function getMobileLines(tpls){
    let lines = [];
    let maxLineCount = 2;
    let lineChildren = [];
    let isNewLine = false;
    let isLeft = true;
    let lineChildrenClassName = "";
    let lineClassName = "flex items-center justify-between h-[20px]";
    tpls.forEach(function(item){
        if(isNewLine && lines.length < maxLineCount){
            lines.push({
                "type": "wrapper",
                "body": lineChildren,
                "size": "none",
                "className": lineClassName
            });
            lineChildren = [];
        }
        if(isLeft){
            // 左侧半行
            lineChildrenClassName = "steedos-listview-item-left truncate";
            if(item.field.is_wide){
                // 左侧全行样式可以单独写
                lineChildrenClassName = "steedos-listview-item-wide truncate";
            }
            if(lines.length === 0){
                // 第一个字段加粗黑色显示
                lineChildrenClassName += " font-bold text-gray-800";
            }
        }
        else{
            // 右侧半行
            lineChildrenClassName = "steedos-listview-item-right truncate ml-2 flex flex-shrink-0";
        }
        lineChildren.push({
            "type": "tpl",
            "tpl": item.tpl,
            "className": lineChildrenClassName
        });

        if(item.field.is_wide){
            // 宽字段占整行
            isLeft = true;
            isNewLine = true;
        }
        else{
            isLeft = !isLeft;
            isNewLine = isLeft;
        }
    });
    
    if(lineChildren.length && lines.length < maxLineCount){
        lines.push({
            "type": "wrapper",
            "body": lineChildren,
            "size": "none",
            "className": lineClassName
        });
    }
    
    return lines;
}

async function getMobileTableColumns(fields, options){
    const columns = [];
    let nameField = {};
    let tpls = [];
    for (const field of fields) {
        let tpl = "";
        if(field.is_name || field.name === options.labelFieldName){
            nameField = field;
            options.onlyDisplayLabel = true;
            tpl = await Tpl.getFieldTpl(field, options);
        }
        else if(field.type === 'avatar' || field.type === 'image' || field.type === 'file'){
            // 图片和附件类型字段暂时显示为附件名称，后续需要再优化
            tpl = `\${_display.${field.name}.name}`;
        }
        else{
            if(field.type === 'lookup' || field.type === 'master_detail'){
                options.onlyDisplayLabel = true;
            }
            tpl = await Tpl.getFieldTpl(field, options);
        }
        if(!tpl){
            tpl = `\${${field.name}}`;
        }
        if(!field.hidden && !field.extra){
            tpls.push({ field, tpl });
        }
    };

    const url = Tpl.getNameTplUrl(nameField, options)

    const columnLines = getMobileLines(tpls);
    
    columns.push({
        name: nameField.name,
        label: nameField.label,
        sortable: nameField.sortable,
        type: "button",
        level: "link",
        actionType: "link",
        link: url,
        innerClassName: "steedos-listview-item block text-gray-500",
        body:{
            "type": "wrapper",
            "body": columnLines,
            "size": "none",
            "className": "p-1"
        }
    });

    return columns;
}

function getDefaultParams(options){
    return {
        perPage: options.top || options.perPage || config.listView.perPage
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
        className: 'text-center steedos-listview-operation w-20',
        buttons: [
              {
                "type": "steedos-dropdown-button",
                "label": "xxx",
                "buttons": operationButtons,
                "placement": "bottomRight",
                "overlayClassName": "shadow !min-w-[160px]",
                "trigger": ["click"],
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
    let columns = [];
    if(options.formFactor === 'SMALL'){
        columns = await getMobileTableColumns(fields, options);
    }
    else{
        columns = await getTableColumns(fields, options);
        columns.push(await getTableOperation(options));
    }
    return {
        mode: "table",
        name: "thelist",
        headerToolbarClassName: "py-2 px-2 border-gray-300 bg-gray-100 border-solid border-b",
        className: "",
        draggable: false,
        defaultParams: getDefaultParams(options),
        columns: columns,
        syncLocation: false,
        keepItemSelectionOnPageChange: true,
        checkOnItemClick: false,
        labelTpl: `\${${options.labelFieldName}}`,
        autoFillHeight: false, // 自动高度效果不理想,先关闭
        columnsTogglable: false,
    }
}



/**
 * 
 * @param {*} mainObject 
 * @param {*} fields 
 * @param {*} options = {filter: listview 过滤条件, ...}
 * @returns 
 */
export async function getTableApi(mainObject, fields, options){
    const searchableFields = [];
    let { filter, filtersFunction, sort, top, setDataToComponentId = '' } = options;

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
    let baseFilters = null;
    if(filter){
        baseFilters = filter;
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
    const api = await getApi(mainObject, null, fields, {count: options.queryCount, alias: 'rows', limit: top, queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"`});
    api.data.$term = "$term";
    api.data.$self = "$$";
    api.data.filter = "$filter"
    api.data.loaded = "${loaded}";
    api.data.listViewId = "${listViewId}";
    api.requestAdaptor = `
        // selfData 中的数据由 CRUD 控制. selfData中,只能获取到 CRUD 给定的data. 无法从数据链中获取数据.
        let selfData = JSON.parse(JSON.stringify(api.data.$self));
        try{
            // TODO: 不应该直接在这里取localStorage，应该从外面传入
            const listViewId = api.data.listViewId;
            const listViewPropsStoreKey = location.pathname + "/crud/" + listViewId ;
            let localListViewProps = sessionStorage.getItem(listViewPropsStoreKey);
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
                    let formFactor = "${options.formFactor}";
                    // 移动端不识别本地存储中的翻页页码，否则点击加载更多按钮后无法刷新回第一页
                    api.data.pageNo = formFactor === "SMALL" ? 1 : (localListViewProps.page || 1);
                }
            }
        }
        catch(ex){
            console.error("本地存储中crud参数解析异常：", ex);
        }
        ${baseFilters ? `var systemFilters = ${JSON.stringify(baseFilters)};` : 'var systemFilters = [];'}
        const filtersFunction = ${filtersFunction};
        if(filtersFunction){
            const _filters = filtersFunction(systemFilters, api.data.$self);
            if(_filters && _filters.length > 0){
                if(_.isEmpty(systemFilters)){
                    systemFilters = _filters || [];
                }else{
                    systemFilters = [systemFilters, 'and', _filters];
                }
            }
        }
        let userFilters =[];
        
        if(_.isEmpty(systemFilters)){
            systemFilters = api.data.filter || [];
        }else{
            if(!_.isEmpty(api.data.filter)){
                systemFilters = [systemFilters, 'and', api.data.filter];
            }
        }
        var pageSize = api.data.pageSize || 10;
        var pageNo = api.data.pageNo || 1;
        var skip = (pageNo - 1) * pageSize;
        var orderBy = api.data.orderBy || '';
        var orderDir = api.data.orderDir || '';
        var sort = orderBy + ' ' + orderDir;
        sort = orderBy ? sort : "${sort || ''}";
        var allowSearchFields = ${JSON.stringify(searchableFields)};
        if(api.data.$term){
            userFilters = [["name", "contains", "'+ api.data.$term +'"]];
        }else if(selfData.op === 'loadOptions' && selfData.value){
            userFilters = [["${valueField.name}", "=", selfData.value]];
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
            if(userFilters.length > 0 ){
                userFilters = [userFilters, 'and', searchableFilter];
            }else{
                userFilters = searchableFilter;
            }
        }

        if(allowSearchFields){
            allowSearchFields.forEach(function(key){
                const keyValue = selfData[key];
                if(_.isString(keyValue)){
                    userFilters.push([key, "contains", keyValue]);
                }else if(_.isArray(keyValue) || _.isBoolean(keyValue) || keyValue){
                    userFilters.push([key, "=", keyValue]);
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
            userFilters.push(keywordsFilters);
        };

        let filters = [];

        if(!_.isEmpty(systemFilters)){
            filters = systemFilters;
        };

        if(api.data.$self.additionalFilters){
            userFilters.push(api.data.$self.additionalFilters)
        }

        if(!_.isEmpty(userFilters)){
            if(_.isEmpty(filters)){
                filters = userFilters;
            }else{
                filters.push('and');
                filters.push(userFilters)
            }
        }
        api.data = {
            query: api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim())
        }
        ${options.requestAdaptor || ''}
        return api;
    `
    api.adaptor = `
    const enable_tree = ${mainObject.enable_tree};
    if(!enable_tree){
        _.each(payload.data.rows, function(item, index){
            const {pageNo, pageSize} = api.body;
            const skip = (pageNo - 1) * pageSize;
            item._index = skip + index + 1;
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
        const listViewId = api.body.listViewId;
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
        let localListViewProps = sessionStorage.getItem(listViewPropsStoreKey);
        let selfData = JSON.parse(JSON.stringify(api.body.$self));
        if(localListViewProps){
            localListViewProps = JSON.parse(localListViewProps);
            selfData = Object.assign({}, localListViewProps, selfData, { filter: api.body.filter });
            if(!api.body.loaded){
                // 第一次加载组件，比如刷新浏览器时因为api.data.pageNo有默认值1
                // 所以会把localSearchableFilter中已经存过的页码覆盖
                // 如果是第一次加载组件始终让翻页页码从本地存储中取值
                let formFactor = "${options.formFactor}";
                // 移动端不识别本地存储中的翻页页码，否则点击加载更多按钮后无法刷新回第一页
                selfData.page = formFactor === "SMALL" ? 1 : (localListViewProps.page || 1);
            }
        }
        delete selfData.context;
        delete selfData.global;
        sessionStorage.setItem(listViewPropsStoreKey, JSON.stringify(selfData));
        // 返回页码到UI界面
        payload.data.page= selfData.page;
    }
    catch(ex){
        console.error("本地存储中crud参数解析异常：", ex);
    }
    // 标记加载过，后续优先从本地存储中加载相关参数
    payload.data.loaded= true;

    const setDataToComponentId = "${setDataToComponentId}";
    if(setDataToComponentId){
        SteedosUI.getRef(api.body.$self.$scopeId)?.getComponentById(setDataToComponentId)?.setData({$count: payload.data.count})
    };
    ${options.adaptor || ''}
    return payload;
    `;
    return api;
}

export async function getApi(object, recordId, fields, options){
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

export function getRecordPermissionsApi(object, recordId, options){
    const data = graphql.getRecordPermissionsQuery(object, recordId, options);
    return {
        method: "post",
        url: graphql.getApi(),
        data: data,
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    }
}