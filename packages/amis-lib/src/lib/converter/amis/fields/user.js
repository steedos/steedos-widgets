import * as graphql from '../graphql';
import * as Field from './index';
import * as Tpl from '../tpl';

async function getSource(){
    // data.query 最终格式 "{ \tleftOptions:organizations(filters: {__filters}){value:_id,label:name,children},   children:organizations(filters: {__filters}){ref:_id,children} }"
    const data = await graphql.getFindQuery({name: "organizations"}, null, [{name: "_id", alias: "value"},{name: "name", alias: "label"},{name: "children"}],{
        alias: "leftOptions",
        filters: "{__filters}"
    });
    data.query = data.query.replace(/,count\:.+/,"}");
    const childrenData = await graphql.getFindQuery({name: "organizations"}, null, [{name: "_id", alias: "ref"},{name: "children"}],{
        alias: "children",
        filters: "{__filters}"
    });
    childrenData.query = childrenData.query.replace(/,count\:.+/,"}");
    data.query = data.query.replace(/}$/, "," + childrenData.query.replace(/{(.+)}/,"$1}"))
    const requestAdaptor = `
        var filters = [['parent', '=', null]];
        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters));
        return api;
    `;
    const adaptor = `
        const data = payload.data;
        data.children = data.children.map(function (child) { 
            child.defer = !!(child.children && child.children.length);
            delete child.children;
            return child;
        });
        data.leftOptions = data.leftOptions.map(function (leftOption) {
            leftOption.defer = !!(leftOption.children && leftOption.children.length);
            delete leftOption.children;
            return leftOption;
        });
        payload.data = { options: [data] }
        return payload;
    `;
    return {
        "method": "post",
        "url": graphql.getApi(),
        "requestAdaptor": requestAdaptor,
        "adaptor": adaptor,
        "data": data,
        "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
        },
    }
}

async function getDeferApi(){
    // data.query 最终格式 "{ \toptions:{__object_name}(filters:{__filters}){{__fields}} }"
    const data = await graphql.getFindQuery({name: "{__object_name}"}, null, [],{
        alias: "options",
        filters: "{__filters}"
    });
    data.query = data.query.replace(/,count\:.+/,"}");
    // 字段要根据请求参数动态生成，写死为__fields后续在发送适配器中替换
    data.query = data.query.replace("{_id}","{{__fields}}");
    const requestAdaptor = `
        var dep = api.query.dep;
        var ref = api.query.ref;
        var term = api.query.term;
        var filters;
        var objectName;
        var fields;
        if (dep) {
            objectName = "organizations";
            fields = "value:_id,label:name,children";
            filters = [['parent', '=', dep]];
        }
        else if (ref || term) { 
            objectName = "space_users";
            fields = "value:user,label:name";
            filters = [['user_accepted', '=', true]];
            if (term) {
                var fieldsForSearch = ["name", "username", "email", "mobile"];
                var termFilters = [];
                fieldsForSearch.forEach(function (field) {
                    termFilters.push([field, 'contains', term]);
                    termFilters.push("or");
                });
                termFilters.pop();
                filters.push(termFilters);
            }
            else {
                filters.push(['organizations_parents', '=', ref]);
            }
        }
        api.data.query = api.data.query.replace(/{__object_name}/g, objectName).replace(/{__fields}/g, fields).replace(/{__filters}/g, JSON.stringify(filters));
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
        "url": graphql.getApi() + "?ref=${ref}&dep=${value}",
        "requestAdaptor": requestAdaptor,
        "adaptor": adaptor,
        "data": data,
        "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
        }
    }
}

async function getSearchApi(){
    // data.query 最终格式 "{ \toptions:space_users(filters: {__filters}){value:user,label:name}}"
    const data = await graphql.getFindQuery({name: "space_users"}, null, [{name: "user", alias: "value"},{name: "name", alias: "label"}],{
        alias: "options",
        filters: "{__filters}"
    });
    data.query = data.query.replace(/,count\:.+/,"}");
    const requestAdaptor = `
        var term = api.query.term;
        var filters;
        if (term) { 
            filters = [['user_accepted', '=', true]];
            if (term) {
                var fieldsForSearch = ["name", "username", "email", "mobile"];
                var termFilters = [];
                fieldsForSearch.forEach(function (field) {
                    termFilters.push([field, 'contains', term]);
                    termFilters.push("or");
                });
                termFilters.pop();
                filters.push(termFilters);
            }
        }
        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters));
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

export async function getSelectUserSchema(field, readonly, ctx) {
    if (!field) {
        return {}
    }

    if (!ctx) {
        ctx = {};
    }
    const defaultOpt = {
        multiple: field.multiple,
        searchable: true,
        label: field.label,
        name: field.name
    };
    const opt = Object.assign({}, defaultOpt, ctx);
    // 底层转换函数无需处理label 、name
    const amisSchema = {
        "type": Field.getAmisStaticFieldType('select', readonly),
        // "label": opt.label,
        // "name": opt.name,  
        "multiple": opt.multiple,
        "searchable": opt.searchable,
        "selectMode": "associated",
        "leftMode": "tree",
        "joinValues": false,
        "extractValue": true,
        "source": await getSource(),
        "deferApi": await getDeferApi(),
        "searchApi": await getSearchApi()
    };
    if(_.has(field, 'defaultValue') && !(_.isString(field.defaultValue) && field.defaultValue.startsWith("{"))){
        amisSchema.value = field.defaultValue
    }

    if(readonly){
        amisSchema.tpl = Tpl.getLookupTpl(field, ctx)
    }

    return amisSchema;
}
