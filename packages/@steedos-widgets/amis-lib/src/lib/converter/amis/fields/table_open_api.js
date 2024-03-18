import * as _ from 'lodash'
import * as Fields from './index';
import * as openAPI from '../open_api';

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

    _.each(mainObject.fields, function (field) {
        if (Fields.isFieldQuickSearchable(field, mainObject.NAME_FIELD_KEY)) {
            searchableFields.push(field.name);
        }
    })

    const fileFields = {};
    const fileFieldsKeys = [];
    // 含有optionsFunction属性， 无reference_to属性的lookup字段
    const lookupFields = {};
    fields.forEach((item)=>{
        if(_.includes(['image','avatar','file'], item.type)){
            fileFieldsKeys.push(item.name);
            fileFields[item.name] = {
                name: item.name,
                type: item.type,
                multiple: item.multiple
            };
        }
        if(_.includes(['lookup'], item.type) && !item.reference_to ){
            lookupFields[item.name] = item;
        }
    })

    let valueField = mainObject.key_field || '_id';
    const api = await getApi(mainObject, null, fields, {count: options.queryCount, alias: 'rows', limit: top, queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"`});

    const tableApiRequestAdaptor = getTableApiRequestAdaptor(api);
    const tableApiAdaptor = getTableApiAdaptor(api);

    api.url += "&objectName=${objectName}";//设计器上对象表格组件需要切换对象重新请求列表数据
    if(options.isRelated){
        api.url += "&recordId=${_master.recordId}";
    }
    api.cache = 3000; 
    api.data.$term = "$term";
    api.data.term = "$term";
    api.data.$self = "$$";
    api.data.self = "$$";
    api.data.filter = "$filter";
    api.data.loaded = "${loaded}";
    api.data.listViewId = "${listViewId}";
    api.data.listName = "${listName}";
    api.requestAdaptor = `
        let __changedFilterFormValues = api.body.$self.__changedFilterFormValues || {};
        let __changedSearchBoxValues = api.body.$self.__changedSearchBoxValues || {};
        // 把表单搜索和快速搜索中的change事件中记录的过滤条件也拼到$self中，是为解决触发搜索请求时，两边输入的过滤条件都带上，即：
        // 有时在搜索表单中输入过滤条件事，忘记点击回车键或搜索按钮，而是进一步修改快速搜索框中的关键字点击其中回车键触发搜索
        // 这种情况下，触发的搜索请求中没有带上搜索表单中输入的过滤条件。
        // 反过来先在快速搜索框中输入过滤条件却不点击其中回车键触发搜索，而是到搜索表单中触发搜索请求也是一样的。
        // 这里直接合并到api.data.$self，而不是后面定义的selfData变量，是因为可以省去在接收适配器中写一样的合并逻辑
        // 如果有问题可以改为合并到selfData变量中，但是要在接收适配器中写上一样的合并逻辑，否则里面的过滤条件不会存入本地存储中
        Object.assign(api.body.$self, __changedSearchBoxValues, __changedFilterFormValues);
        // selfData 中的数据由 CRUD 控制. selfData中,只能获取到 CRUD 给定的data. 无法从数据链中获取数据.
        let selfData = JSON.parse(JSON.stringify(api.body.$self));
        // 保留一份初始data，以供自定义发送适配器中获取原始数据。
        const data = _.cloneDeep(api.body);
        try{
            // TODO: 不应该直接在这里取localStorage，应该从外面传入
            const listName = api.body.listName;
            const listViewPropsStoreKey = location.pathname + "/crud";
            let localListViewProps = sessionStorage.getItem(listViewPropsStoreKey);
            if(localListViewProps){
                localListViewProps = JSON.parse(localListViewProps);
                selfData = Object.assign({}, localListViewProps, selfData);
                if(!api.body.filter){
                    api.body.filter = localListViewProps.filter;
                }
                if(!api.body.loaded){
                    // 第一次加载组件，比如刷新浏览器时因为api.data.pageNo有默认值1
                    // 所以会把localSearchableFilter中已经存过的页码覆盖
                    // 如果是第一次加载组件始终让翻页页码从本地存储中取值
                    let formFactor = "${options.formFactor}";
                    // 移动端不识别本地存储中的翻页页码，否则点击加载更多按钮后无法刷新回第一页
                    // api.body.pageNo = formFactor === "SMALL" ? 1 : (localListViewProps.page || 1);
                    // 移动端暂时去除加载更多，放开翻页
                    api.body.pageNo = localListViewProps.page || 1;
                }
            }
        }
        catch(ex){
            console.error("本地存储中crud参数解析异常：", ex);
        }
        ${baseFilters ? `var systemFilters = ${JSON.stringify(baseFilters)};` : 'var systemFilters = [];'}
        var _ids = []
        const filtersFunction = ${filtersFunction};
        if(filtersFunction){
            const _filters = filtersFunction(systemFilters, api.body.$self);
            if(api.body.listName == "recent"){
                _ids = _filters[2]
            }
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
            systemFilters = api.body.filter || [];
        }else{
            if(!_.isEmpty(api.body.filter)){
                systemFilters = [systemFilters, 'and', api.body.filter];
            }
        }
        var pageSize = api.body.pageSize || 10;
        var pageNo = api.body.pageNo || 1;
        var skip = (pageNo - 1) * pageSize;
        var orderBy = api.body.orderBy || '';
        var orderDir = api.body.orderDir || '';
        var sort = orderBy + ' ' + orderDir;
        sort = orderBy ? sort : "${sort || ''}";
        var allowSearchFields = ${JSON.stringify(searchableFields)};
        if(api.body.$term){
            userFilters = [["name", "contains", "'+ api.body.$term +'"]];
        }else if(selfData.op === 'loadOptions' && selfData.value){
            userFilters = [["${valueField.name}", "=", selfData.value]];
        }

        var searchableFilter = SteedosUI.getSearchFilter(selfData) || [];
        if(searchableFilter.length > 0){
            if(userFilters.length > 0 ){
                userFilters = [userFilters, 'and', searchableFilter];
            }else{
                userFilters = searchableFilter;
            }
        }

        // "搜索此列表"搜索框
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

        var keywordsFilters = SteedosUI.getKeywordsSearchFilter(selfData.__keywords, allowSearchFields);
        if(keywordsFilters && keywordsFilters.length > 0){
            userFilters.push(keywordsFilters);
        }

        let filters = [];

        if(!_.isEmpty(systemFilters)){
            filters = systemFilters;
        };
        if(api.body.$self.additionalFilters){
            if(_.isString(api.body.$self.additionalFilters)){
                userFilters.push(eval(api.body.$self.additionalFilters))
            }else{
                userFilters.push(api.body.$self.additionalFilters)
            }
        }

        if(api.body.$self._isRelated){
            const self = api.body.$self;
            const relatedKey = self.relatedKey;
            const refField = self.uiSchema.fields[relatedKey];
            const masterRecord = self._master.record;
            const masterObjectName = self._master.objectName;
            let relatedValue = self._master.recordId;
            if(refField && refField.reference_to_field && refField.reference_to_field != '_id'){
                relatedValue = masterRecord[refField.reference_to_field]
            }
            let relatedFilters;
            if (
                refField && (refField._reference_to ||
                (refField.reference_to && !_.isString(refField.reference_to)))
            ) {
                relatedFilters = [
                    [relatedKey + "/o", "=", masterObjectName],
                    [relatedKey + "/ids", "=", relatedValue],
                ];
            } else {
                relatedFilters = [relatedKey, "=", relatedValue];
            }
            userFilters.push(relatedFilters)
        }

        if(!_.isEmpty(userFilters)){
            if(_.isEmpty(filters)){
                filters = userFilters;
            }else{
                filters = [filters, 'and', userFilters]
            }
        }
        api.body._ids = _ids;
        // api.body = {
        //     query: api.body.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim())
        // }
        ${tableApiRequestAdaptor || ''};

        ${options.requestAdaptor || ''};

        //写入本次存储filters、sort
        const listViewPropsStoreKey = location.pathname + "/crud/query";
        sessionStorage.setItem(listViewPropsStoreKey, JSON.stringify({
            filters: filters,
            sort: sort.trim(),
            pageSize: pageSize,
            skip: skip,
            fields: ${JSON.stringify(_.map(fields, 'name'))}
        }));
        return api;
    `
    api.adaptor = `
    ${tableApiAdaptor || ''};
    let fields = ${JSON.stringify(_.map(fields, 'name'))};
    // 这里把行数据中所有为空的字段值配置为空字符串，是因为amis有bug：crud的columns中的列如果type为static-前缀的话，行数据中该字段为空的话会显示为父作用域中同名变量值，见：https://github.com/baidu/amis/issues/9556
    (payload.data.rows || []).forEach((itemRow) => {
        (fields || []).forEach((itemField) => {
            if(itemField && itemField.indexOf(".") > -1){
                return;
            }
            if(itemField && (itemRow[itemField] === undefined || itemRow[itemField] === null)){
                // 这里itemRow中不存在 itemField 属性，或者值为null时都会有“显示为父作用域中的同名变量值”的问题，所以null和undefined都要重置为空字符串
                // 实测数字、下拉框、多选lookup等字段类型重置为空字符串都不会有问题，而且实测amis from组件的清空表单字段值功能就是把表单中的各种字段类型设置为空字符串，所以看起来也符合amis规范
                itemRow[itemField] = "";
            }
        });
    });
    
    if(api.body.listName == "recent"){
        payload.data.rows = _.sortBy(payload.data.rows, function(item){
            return _.indexOf(api.body._ids, item._id)
        });
    }
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
    let lookupFields = ${JSON.stringify(lookupFields)};
    _.each(payload.data.rows, function(item, index){
        _.each(fileFields , (field, key)=>{
            if(item[key] && item._display && item._display[key]){
                let value = item._display[key];
                if(!_.isArray(value)){
                    value = [value]
                };
                if(field.type === 'file'){
                    // item[key] = value
                    // PC客户端附件子表列表点击标题预览附件功能依赖了_id，所以这里拼出来
                    let itemKeyValue = item[key];
                    item[key] = value.map(function(item, index){
                        item._id = itemKeyValue[index];
                        return item;
                    });
                }else{
                    item[key] = _.map(value, (item)=>{
                        if(field.type === 'image'){
                            const url = window.getImageFieldUrl(item.url);
                            return url;
                        }
                        return item.url;
                    })
                }
            }
        })
        _.each(lookupFields , (field, key)=>{
            if(item[key]){
                if(field._optionsFunction){
                    const optionsFunction = eval("(" + field._optionsFunction+ ")")(item);
                    item[key + '__label'] = _.map(_.filter(optionsFunction, function(option){return item[key] == option.value}), 'label').join(' ');
                }else if(field.options){
                    const options = field.options;
                    item[key + '__label'] = _.map(_.filter(options, function(option){return item[key] == option.value}), 'label').join(' ');
                }
            }
        })
    })
    
    if(enable_tree){
        const records = payload.data.rows || [];
        const getTreeOptions = SteedosUI.getTreeOptions;
        const assignIndexToTreeRecords = function(tree, parentIndex) {
            tree.forEach(function (node, index) {
                // 构建当前节点的 _index
                var currentIndex = parentIndex ? parentIndex + '-' + (index + 1) : '' + (index + 1);
        
                // 赋值给节点
                node._index = currentIndex;
        
                // 如果有子节点，递归调用函数
                if (node.children && node.children.length > 0) {
                    assignIndexToTreeRecords(node.children, currentIndex);
                }
            });
        };
        payload.data.rows = getTreeOptions(records,{"valueField":"_id"});
        assignIndexToTreeRecords(payload.data.rows, '');
    }


    try{
        // TODO: 不应该直接在这里取localStorage，应该从外面传入
        const listName = api.body.listName;
        const listViewPropsStoreKey = location.pathname + "/crud";
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
                // selfData.page = formFactor === "SMALL" ? 1 : (localListViewProps.page || 1);
                selfData.page = localListViewProps.page || 1;
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
        //https://github.com/baidu/amis/pull/6807 .parent的改动是为适应3.2getComponentById的规则改动，不影响2.9
        var scope = SteedosUI.getRef(api.body.$self.$scopeId);
        var scopeParent = scope && scope.parent;
        var setDataToComponent = scopeParent && scopeParent.getComponentById(setDataToComponentId);
        if(setDataToComponent){
            setDataToComponent.setData({$count: payload.data.count});
        }
        // SteedosUI.getRef(api.body.$self.$scopeId)?.parent?.getComponentById(setDataToComponentId)?.setData({$count: payload.data.count})
    };
    let formFactor = "${options.formFactor}";
    if(formFactor !== "SMALL"){
        const lisviewDom = document.querySelector(".steedos-object-listview .antd-Table-table");
        if(lisviewDom){
            setTimeout(()=>{
                lisviewDom.scrollIntoView();
            }, 600);
        }
    }
    ${options.adaptor || ''}
    return payload;
    `;
    return api;
}

function getTableApiRequestAdaptor(api){
    // open api发送适配器url参数
    return `
        api.data = {
            fields: JSON.stringify(${JSON.stringify(api.data.fields)}),
            uiFields: JSON.stringify(${JSON.stringify(api.data.uiFields)}),
            expandFields: JSON.stringify(${JSON.stringify(api.data.expandFields)}),
            filters: JSON.stringify(filters),
            top: pageSize,
            skip: skip,
            sort: sort.trim()
        }
        // api.query = api.data;
        if(api.body.$self){
            // amis bug，接口为Get请求时，url上的data参数无法删除，只能手动把url重写掉，见：https://github.com/baidu/amis/issues/9813
            let rootURL = api.body.$self.context && api.body.$self.context.rootUrl || "";
            let objectName = api.body.$self.objectName || "";
            let additionalFilters = api.body.$self.additionalFilters || "";
            // url按open.getApi(object.name)执行结果返回，比如/api/v1/test__c?reload=
            api.url = rootURL = "/api/v1/" + objectName + "?reload=" + additionalFilters;
        }
    `;
}


function getTableApiAdaptor(api){
    // open api接收适配器中，在最开头把返回值的items转为rows，_ui转为_display,total转为count，这样后续脚本就可以跟GraphQL一样
    return `
        payload.data.rows = (payload.data.items || []).map(function(n){
            return Object.assign({}, n, {
                _display: n._ui
            });
        });
        payload.data.count = payload.data.total;
        delete payload.data.items;
        delete payload.data.total;
    `;
}

export async function getApi(object, recordId, fields, options){
    const data = await openAPI.getFindQuery(object, recordId, fields, options);
    return {
        method: "get",
        url: openAPI.getApi(object.name), // + "&recordId=${recordId}",
        data: data,
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    }
}