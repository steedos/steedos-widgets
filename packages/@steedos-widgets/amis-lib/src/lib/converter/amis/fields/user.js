import * as graphql from '../graphql';
import * as Field from './index';
import * as Tpl from '../tpl';
import * as _ from 'lodash';

async function getSource(field, ctx) {
    // data.query 最终格式 "{ \tleftOptions:organizations(filters: {__filters}){value:_id,label:name,children},   children:organizations(filters: {__filters}){ref:_id,children}, defaultValueOptions:space_users(filters: {__options_filters}){user,name} }"
    const data = await graphql.getFindQuery({ name: "organizations" }, null, [{ name: "_id", alias: "value" }, { name: "name", alias: "label" }, { name: "children" }], {
        alias: "leftOptions",
        filters: "{__filters}"
    });
    data.query = data.query.replace(/,count\:.+/, "}");
    const childrenData = await graphql.getFindQuery({ name: "organizations" }, null, [{ name: "_id", alias: "ref" }], {
        alias: "children",
        filters: "{__filters}"
    });
    childrenData.query = childrenData.query.replace(/,count\:.+/, "}");
    data.query = data.query.replace(/}$/, "," + childrenData.query.replace(/{(.+)}/, "$1}"));
    const defaultValueOptionsData = await graphql.getFindQuery({ name: "space_users" }, null, [{ name: "user" }, { name: "name" }], {
        alias: "defaultValueOptions",
        filters: "{__options_filters}"
    });
    defaultValueOptionsData.query = defaultValueOptionsData.query.replace(/,count\:.+/, "}");
    data.query = data.query.replace(/}$/, "," + defaultValueOptionsData.query.replace(/{(.+)}/, "$1}"))
    let valueField = `${field.name}`;
    if(ctx.fieldNamePrefix){
        valueField = `${ctx.fieldNamePrefix}${field.name}`;
    }
    data.$value = `$${valueField}`;
    data.__selectUserLoaded__ = "${__selectUserLoaded__}";
    // data["&"] = "$$";
    const requestAdaptor = `
        console.log("====requestAdaptor==api=", api);
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
        // "url": graphql.getApi() + "?_id=${_id}",
        // "url": graphql.getApi() + `?value=\${${valueField}}`,
        // 要加url参数是因为amis select组件人员点选功能有bug，一定要第一次请求才能在requestAdaptor函数中取的form表单字段值
        // 见issue: https://github.com/baidu/amis/issues/6065
        "url": graphql.getApi() + `?value=\${${field.multiple ? valueField + "|join" : valueField}}`,
        "requestAdaptor": requestAdaptor,
        "adaptor": adaptor,
        "data": data,
        // "sendOn": `!!this._id || !!!this.${valueField}`,
        "sendOn": `!this.__selectUserLoaded__`,
        "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
        },
    }
}

async function getDeferApi(field) {
    // data.query 最终格式 "{ \toptions:{__object_name}(filters:{__filters}){{__fields}} }"
    const data = await graphql.getFindQuery({ name: "{__object_name}" }, null, [], {
        alias: "options",
        filters: "{__filters}"
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
        if (dep) {
            objectName = "organizations";
            fields = "value:_id,label:name,children";
            filters = [['parent', '=', dep]];
        }
        else if (ref) { 
            objectName = "space_users";
            // 这里要额外把字段转为value和label是因为valueField和labelField在deferApi/searchApi中不生效，所以字段要取两次
            fields = "user,name,value:user,label:name";
            filters = [['user_accepted', '=', true]];
            var defaultFilters = ${filters && JSON.stringify(filters)};
            if(defaultFilters){
                filters.push(defaultFilters);
            }
            filters.push(['organizations_parents', '=', ref]);
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

async function getSearchApi(field) {
    // data.query 最终格式 "{ \toptions:space_users(filters: {__filters}){user,name,value:user,label:name}}"
    // 这里要额外把字段转为value和label是因为valueField和labelField在deferApi/searchApi中不生效，所以字段要取两次
    const data = await graphql.getFindQuery({ name: "space_users" }, null, [{ name: "user" }, { name: "name" }, { name: "user", alias: "value" }, { name: "name", alias: "label" }], {
        alias: "options",
        filters: "{__filters}"
    });
    data.query = data.query.replace(/,count\:.+/, "}");
    // 传入的默认过滤条件，比如[["name", "contains", "三"]]，将会作为基本过滤条件
    const filters = field.filters;
    const requestAdaptor = `
        var term = api.query.term;
        var filters;
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
    const amisSchema = {
        "type": Field.getAmisStaticFieldType('select', readonly)
    };

    if (readonly) {
        amisSchema.tpl = await Tpl.getLookupTpl(field, ctx)
    }
    else{
        Object.assign(amisSchema, {
            "labelField": "name",
            "valueField": "user",
            "multiple": field.multiple,
            "searchable": field.searchable,
            "selectMode": "associated",
            "leftMode": "tree",
            "joinValues": false,
            "extractValue": true,
            "clearable": true,
            "source": await getSource(field, ctx),
            "deferApi": await getDeferApi(field),
            "searchApi": await getSearchApi(field)
        });
        let defaultValue = field.defaultValue;
        if (_.has(field, 'defaultValue') && !(_.isString(defaultValue) && defaultValue.startsWith("{"))) {
            if(_.isString(defaultValue) && defaultValue.startsWith("{{")){
                defaultValue = `\$${defaultValue.substring(1, defaultValue.length -1)}`
            }
            amisSchema.value = defaultValue
        }
        if (typeof amisSchema.searchable !== "boolean") {
            amisSchema.searchable = true;
        }
        const onEvent = field.onEvent;
        if (onEvent) {
            amisSchema.onEvent = onEvent;
        }
        
        // 这里要加change事件逻辑设置form的__selectUserLoaded__是因为人员字段多选时，每次在界面上操作变量字段值时会重新请求source接口造成选人组件重新初始化
        // 见issue: https://github.com/baidu/amis/issues/6065
        const onChangeScript = `
            // 往上找到form，设置__selectUserLoaded__标记已经加载过选人字段不能再调用source接口初始化选人组件了
            const getClosestAmisComponentByType = function(scope, type){
                const re = scope.getComponents().find(function(n){
                    return n.props.type === type;
                });
                if(re){
                    return re;
                }
                else{
                    return getClosestAmisComponentByType(scope.parent, type);
                }
            }
            const form = getClosestAmisComponentByType(event.context.scoped, "form");
            form.setData({"__selectUserLoaded__":true});
        `;

        const onChangeEvent = {
          "actionType": "custom",
          "script": `${onChangeScript}`
        };
        if(amisSchema.onEvent){
            if(amisSchema.onEvent.change?.actions?.length){
                amisSchema.onEvent.change.actions.unshift(onChangeEvent);
            }
            else{
                amisSchema.onEvent.change = {
                    "weight": 0,
                    "actions": [onChangeEvent]
                };
            }
        }
        else{
            Object.assign(amisSchema, {
                "onEvent": {
                    "change": {
                      "weight": 0,
                      "actions": [onChangeEvent]
                    }
                  }
            });
        }
    }

    return amisSchema;
}
