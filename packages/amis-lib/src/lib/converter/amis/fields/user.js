import * as graphql from '../graphql';
import * as Field from './index';
import * as Tpl from '../tpl';

async function getSource(field, multiple){
    // data.query 最终格式 "{ \tleftOptions:organizations(filters: {__filters}){value:_id,label:name,children},   children:organizations(filters: {__filters}){ref:_id,children}, defaultValueOptions:space_users(filters: {__options_filters}){user,name} }"
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
    data.query = data.query.replace(/}$/, "," + childrenData.query.replace(/{(.+)}/,"$1}"));
    const defaultValueOptionsData = await graphql.getFindQuery({name: "space_users"}, null, [{name: "user"},{name: "name"}],{
        alias: "defaultValueOptions",
        filters: "{__options_filters}"
    });
    defaultValueOptionsData.query = defaultValueOptionsData.query.replace(/,count\:.+/,"}");
    data.query = data.query.replace(/}$/, "," + defaultValueOptionsData.query.replace(/{(.+)}/,"$1}"))
    data.$value = `$${field.name}`;
    const requestAdaptor = `
        var filters = [['parent', '=', null]];
        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters));
        var defaultValue = api.data.$value;
        var optionsFiltersOp = "${multiple ? "in" : "="}";
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
            child.defer = !!(child.children && child.children.length);
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
        "url": graphql.getApi() + "?_id=${_id}",
        "requestAdaptor": requestAdaptor,
        "adaptor": adaptor,
        "data": data,
        "sendOn": `!!this._id || !!!this.${field.name}`,
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
            // 这里要额外把字段转为value和label是因为valueField和labelField在deferApi/searchApi中不生效，所以字段要取两次
            fields = "user,name,value:user,label:name";
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
    // data.query 最终格式 "{ \toptions:space_users(filters: {__filters}){user,name,value:user,label:name}}"
    // 这里要额外把字段转为value和label是因为valueField和labelField在deferApi/searchApi中不生效，所以字段要取两次
    const data = await graphql.getFindQuery({name: "space_users"}, null, [{name: "user"},{name: "name"},{name: "user", alias: "value"},{name: "name", alias: "label"}],{
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
        searchable: true
    };
    const opt = Object.assign({}, defaultOpt, ctx);
    const amisSchema = {
        "type": Field.getAmisStaticFieldType('select', readonly),
        "labelField": "name",
        "valueField": "user",
        "multiple": opt.multiple,
        "searchable": opt.searchable,
        "selectMode": "associated",
        "leftMode": "tree",
        "joinValues": false,
        "extractValue": true,
        "source": await getSource(field, opt.multiple),
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
