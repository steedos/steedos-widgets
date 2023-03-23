import * as graphql from '../graphql';
import * as Field from './index';
import * as Tpl from '../tpl';
import * as _ from 'lodash';
import { getUISchema, getListViewSort } from '../../../objects';

const refUsersObjectName = "space_users";
const refOrgsObjectName = "organizations";

async function getSource(field, ctx) {
    // data.query 最终格式 "{ \tleftOptions:organizations(filters: {__filters}){value:_id,label:name,children},   children:organizations(filters: {__filters}){ref:_id,children}, defaultValueOptions:space_users(filters: {__options_filters}){user,name} }"
    const data = await graphql.getFindQuery({ name: refOrgsObjectName }, null, [{ name: "_id", alias: "value" }, { name: "name", alias: "label" }, { name: "children" }], {
        alias: "leftOptions",
        filters: "{__filters}"
    });
    data.query = data.query.replace(/,count\:.+/, "}");
    const childrenData = await graphql.getFindQuery({ name: refOrgsObjectName }, null, [{ name: "_id", alias: "ref" }], {
        alias: "children",
        filters: "{__filters}"
    });
    childrenData.query = childrenData.query.replace(/,count\:.+/, "}");
    data.query = data.query.replace(/}$/, "," + childrenData.query.replace(/{(.+)}/, "$1}"));
    const defaultValueOptionsData = await graphql.getFindQuery({ name: refUsersObjectName }, null, [{ name: "user", alias: "value" }, { name: "name", alias: "label" }], {
        alias: "defaultValueOptions",
        filters: "{__options_filters}"
    });
    defaultValueOptionsData.query = defaultValueOptionsData.query.replace(/,count\:.+/, "}");
    data.query = data.query.replace(/}$/, "," + defaultValueOptionsData.query.replace(/{(.+)}/, "$1}"))
    let valueField = `${field.name}`;
    if(field._prefix){
        // field._prefix一般来object类型字段的子字段的父字段api名称，比如流程对象的字段perms.users_can_add前缀为perms.
        valueField = `${field._prefix}${field.name}`;
    }
    if(ctx.fieldNamePrefix){
        // ctx.fieldNamePrefix一般来自列表搜索，值为__searchable__
        valueField = `${ctx.fieldNamePrefix}${valueField}`;
    }
    data.$value = `$${valueField}`;
    // data["&"] = "$$";

    const requestAdaptor = `
        var filters = [['parent', '=', null]];
        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters));
        var defaultValue = api.data.$value;
        var optionsFiltersOp = "${field.multiple ? "in" : "="}";
        var optionsFilters = [["user", optionsFiltersOp, []]];
        if (defaultValue) { 
            optionsFilters = [["user", optionsFiltersOp, defaultValue]];
        }
        api.data.query = api.data.query.replace(/{__options_filters}/g, JSON.stringify(optionsFilters));
        return api;
    `;
    const adaptor = `
        const data = payload.data;
        data.children = data.children.map(function (child) { 
            // child.defer = !!(child.children && child.children.length);
            child.defer = true;
            delete child.children;
            return child;
        });
        data.leftOptions = data.leftOptions.map(function (leftOption) {
            leftOption.defer = !!(leftOption.children && leftOption.children.length);
            delete leftOption.children;
            return leftOption;
        });
        var defaultValueOptions = data.defaultValueOptions;
        data.children = _.union(data.children, defaultValueOptions);
        delete data.defaultValueOptions;
        payload.data = { options: [data] };
        return payload;
    `;
    return {
        "method": "post",
        // 这里需要ObjectForm在api请求成功后才显示其中的amis form，否则就会有bug
        // 见issue: https://github.com/baidu/amis/issues/6065
        // "url": graphql.getApi() + `?value=\${${field.multiple ? valueField + "|join" : valueField}}`,
        // "url": graphql.getApi() + `?value=\${editFormInited}`,
        "url": graphql.getApi(),
        "requestAdaptor": requestAdaptor,
        "adaptor": adaptor,
        "data": data,
        // "sendOn": `this.editFormInited`,
        "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
        },
    }
}

async function getDeferApi(field, ctx) {
    // data.query 最终格式 "{ \toptions:{__object_name}(filters:{__filters}){{__fields}} }"
    const data = await graphql.getFindQuery({ name: "{__object_name}" }, null, [], {
        alias: "options",
        // filters: "{__filters}",
        queryOptions: `filters: {__filters}, sort: "{__sort}"`
    });
    // 传入的默认过滤条件，比如[["name", "contains", "三"]]，将会作为基本过滤条件
    let filters = field.filters;
    if(typeof filters === "string"){
        filters = new Function(`return ${filters}`);
        filters = filters();
    }
    if(typeof filters === "function"){
        filters = filters(field);
    }
    data.query = data.query.replace(/,count\:.+/, "}");
    // 字段要根据请求参数动态生成，写死为__fields后续在发送适配器中替换
    data.query = data.query.replace("{_id}", "{{__fields}}");
    const requestAdaptor = `
        var dep = api.query.dep;
        var ref = api.query.ref;
        var term = api.query.term;
        var filters;
        var objectName;
        var fields;
        var sort = "";
        if (dep) {
            objectName = "${refOrgsObjectName}";
            fields = "value:_id,label:name,children";
            filters = [['parent', '=', dep]];
            sort = "${ctx.orgsSort}";
        }
        else if (ref) { 
            objectName = "${refUsersObjectName}";
            // 这里要额外把字段转为value和label是因为valueField和labelField在deferApi/searchApi中不生效，所以字段要取两次
            fields = "_id,value:user,label:name";
            // fields = "user,name,value:user,label:name";
            filters = [['user_accepted', '=', true]];
            var defaultFilters = ${filters && JSON.stringify(filters)};
            if(defaultFilters){
                filters.push(defaultFilters);
            }
            filters.push(['organizations_parents', '=', ref]);
            sort = "${ctx.usersSort}";
        }
        api.data.query = api.data.query.replace(/{__object_name}/g, objectName).replace(/{__fields}/g, fields).replace(/{__filters}/g, JSON.stringify(filters)).replace('{__sort}', sort.trim());
        return api;
    `;
    const adaptor = `
        if (api.query.dep) {
            // 展开组织时才需要根据children值设置defer属性
            const data = payload.data;
            data.options = data.options.map(function (option) {
                option.defer = !!(option.children && option.children.length);
                delete option.children;
                return option;
            });
            payload.data = data;
        }
        return payload;
    `;
    return {
        "method": "post",
        "url": graphql.getApi() + "&ref=${ref}&dep=${value}",
        "requestAdaptor": requestAdaptor,
        "adaptor": adaptor,
        "data": data,
        "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
        }
    }
}

async function getSearchApi(field, ctx) {
    // data.query 最终格式 "{ \toptions:space_users(filters: {__filters}){user,name,value:user,label:name}}"
    // 这里要额外把字段转为value和label是因为valueField和labelField在deferApi/searchApi中不生效，所以字段要取两次
    const data = await graphql.getFindQuery({ name: refUsersObjectName }, null, [{ name: "user", alias: "value" }, { name: "name", alias: "label" }], {
        alias: "options",
        // filters: "{__filters}",
        queryOptions: `filters: {__filters}, sort: "{__sort}"`
    });
    data.query = data.query.replace(/,count\:.+/, "}");
    // 传入的默认过滤条件，比如[["name", "contains", "三"]]，将会作为基本过滤条件
    const filters = field.filters;
    const requestAdaptor = `
        var term = api.query.term;
        var filters;
        var sort = "";
        if (term) { 
            filters = [['user_accepted', '=', true]];
            var defaultFilters = ${filters && JSON.stringify(filters)};
            if(defaultFilters){
                filters.push(defaultFilters);
            }
            var fieldsForSearch = ["name", "username", "email", "mobile"];
            var termFilters = [];
            fieldsForSearch.forEach(function (field) {
                termFilters.push([field, 'contains', term]);
                termFilters.push("or");
            });
            termFilters.pop();
            filters.push(termFilters);
            sort = "${ctx.usersSort}";
        }
        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__sort}', sort.trim());
        return api;
    `;
    return {
        "method": "post",
        "url": graphql.getApi() + "?term=${term}",
        "requestAdaptor": requestAdaptor,
        "data": data,
        "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
        }
    }
}

function getRefListViewSort(refObject){
    const listView = _.find(
        refObject.list_views,
        (view, name) => name === "all"
    );
    let sort = "";
    if(listView){
        sort = getListViewSort(listView);
    }
    return sort;
}

export async function getSelectUserSchema(field, readonly, ctx) {
    if (!field) {
        return {}
    }

    if (!ctx) {
        ctx = {};
    }
    const amisSchema = {
        "type": Field.getAmisStaticFieldType('select', readonly)
    };

    if (readonly) {
        amisSchema.tpl = await Tpl.getLookupTpl(field, ctx)
    }
    else{
        const refUsersObjectConfig = await getUISchema(refUsersObjectName);
        ctx.usersSort = getRefListViewSort(refUsersObjectConfig);
        const refOrgsObjectConfig = await getUISchema(refOrgsObjectName);
        ctx.orgsSort = getRefListViewSort(refOrgsObjectConfig);
        Object.assign(amisSchema, {
            // "labelField": "name",
            // "valueField": "user",
            "multiple": field.multiple,
            "searchable": field.searchable,
            "selectMode": "associated",
            "leftMode": "tree",
            "extractValue": true,
            "clearable": true,
            "source": await getSource(field, ctx),
            "deferApi": await getDeferApi(field, ctx),
            "searchApi": await getSearchApi(field, ctx)
        });
        if(field.multiple){
            // 单选时如果配置joinValues为false，清空字段值会把字段值设置为空数组，这是amis人员单选功能的bug，普通的select没有这个问题
            Object.assign(amisSchema, {
                "joinValues": false,
            });
        }
        if (typeof amisSchema.searchable !== "boolean") {
            amisSchema.searchable = true;
        }

        if(ctx.value){
            amisSchema.value = ctx.value;
        }

        const onEvent = field.onEvent;
        if (onEvent) {
            amisSchema.onEvent = onEvent;
        }
    }
    return amisSchema;
}
