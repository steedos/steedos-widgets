function getSource(){
    return {
        "method": "post",
        "url": "${context.rootUrl}/graphql",
        "adaptor": "console.log(\"===payload===\", payload);\ndebugger;\nconst data = payload.data;\ndata.children = data.children.map(function (child) { \n  child.defer = !!(child.children && child.children.length);\n  delete child.children;\n  return child;\n});\ndata.leftOptions = data.leftOptions.map(function (leftOption) {\n  leftOption.defer = !!(leftOption.children && leftOption.children.length);\n  delete leftOption.children;\n  return leftOption;\n});\npayload.data = { options: [data] }\nconsole.log(\"===payload.data===\", payload.data);\nreturn payload;",
        "data": {
            "query": "{ \tleftOptions:organizations(filters: {__filters}){value:_id,label:name,children},   children:organizations(filters: {__filters}){ref:_id,children} }"
        },
        "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
        },
        "requestAdaptor": "var filters = [['parent', '=', null]];\napi.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters));\nreturn api;\n"
    }
}

export function getSelectUserSchema(fields, options) {
    console.log("==getSelectUserSchema===");
    if (!fields) {
        fields = ["name"];
    }

    if (!options) {
        options = {};
    }
    const defaultOpt = {
        multiple: true,
        searchable: true,
        label: "选人字段",
        name: "user"
    };
    options = Object.assign({}, defaultOpt, options);

    const userAmisSchema = {
        "type": "select",
        "label": options.label,
        "name": options.name,
        "multiple": options.multiple,
        "searchable": options.searchable,
        "selectMode": "associated",
        "leftMode": "tree",
        "deferApi": {
            "method": "post",
            "url": "${context.rootUrl}/graphql?ref=${ref}&dep=${value}",
            "adaptor": "console.log(\"===payload=11==\", payload);\ndebugger;\nif (api.query.dep) {\n  // 展开组织时才需要根据children值设置defer属性\n  const data = payload.data;\n  data.options = data.options.map(function (option) {\n    option.defer = !!(option.children && option.children.length);\n    delete option.children;\n    return option;\n  });\n  payload.data = data;\n}\nconsole.log(\"===payload.data==22=\", payload.data);\nreturn payload;",
            "data": {
                "query": "{ \toptions:{__object_name}(filters:{__filters}){{__fields}} }"
            },
            "headers": {
                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
            },
            "requestAdaptor": "debugger;\n\nvar dep = api.query.dep;\nvar ref = api.query.ref;\nvar term = api.query.term;\nconsole.log(\"===dep===\", dep);\nconsole.log(\"===ref===\", ref);\nconsole.log(\"===term===\", term);\nvar filters;\nvar objectName;\nvar fields;\nif (dep) {\n  objectName = \"organizations\";\n  fields = \"value:_id,label:name,children\";\n  filters = [['parent', '=', dep]];\n}\nelse if (ref || term) { \n  objectName = \"space_users\";\n  fields = \"value:user,label:name\";\n  filters = [['user_accepted', '=', true]];\n  if (term) {\n    var fieldsForSearch = [\"name\", \"username\", \"email\", \"mobile\"];\n    var termFilters = [];\n    fieldsForSearch.forEach(function (field) {\n      termFilters.push([field, 'contains', term]);\n      termFilters.push(\"or\");\n    });\n    termFilters.pop();\n    filters.push(termFilters);\n  }\n  else {\n    filters.push(['organizations_parents', '=', ref]);\n  }\n}\nconsole.log(\"===objectName===\", objectName);\nconsole.log(\"===fields===\", fields);\nconsole.log(\"===term===\", term);\napi.data.query = api.data.query.replace(/{__object_name}/g, objectName).replace(/{__fields}/g, fields).replace(/{__filters}/g, JSON.stringify(filters));\nconsole.log(\"===api.data.query===\", api.data.query);\nreturn api;\n"
        },
        "searchApi": {
            "method": "post",
            "url": "${context.rootUrl}/graphql?term=${term}",
            "messages": {
            },
            "adaptor": "console.log(\"===payload=11==\", payload);\ndebugger;\nif (api.query.dep) {\n  // 展开组织时才需要根据children值设置defer属性\n  const data = payload.data;\n  data.options = data.options.map(function (option) {\n    option.defer = !!(option.children && option.children.length);\n    delete option.children;\n    return option;\n  });\n  payload.data = data;\n}\nconsole.log(\"===payload.data==22=\", payload.data);\nreturn payload;",
            "data": {
                "query": "{ \toptions:{__object_name}(filters:{__filters}){{__fields}} }"
            },
            "headers": {
                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
            },
            "requestAdaptor": "debugger;\n\nvar dep = api.query.dep;\nvar ref = api.query.ref;\nvar term = api.query.term;\nconsole.log(\"===dep===\", dep);\nconsole.log(\"===ref===\", ref);\nconsole.log(\"===term===\", term);\nvar filters;\nvar objectName;\nvar fields;\nif (dep) {\n  objectName = \"organizations\";\n  fields = \"value:_id,label:name,children\";\n  filters = [['parent', '=', dep]];\n}\nelse if (ref || term) { \n  objectName = \"space_users\";\n  fields = \"value:user,label:name\";\n  filters = [['user_accepted', '=', true]];\n  if (term) {\n    var fieldsForSearch = [\"name\", \"username\", \"email\", \"mobile\"];\n    var termFilters = [];\n    fieldsForSearch.forEach(function (field) {\n      termFilters.push([field, 'contains', term]);\n      termFilters.push(\"or\");\n    });\n    termFilters.pop();\n    filters.push(termFilters);\n  }\n  else {\n    filters.push(['organizations_parents', '=', ref]);\n  }\n}\nconsole.log(\"===objectName===\", objectName);\nconsole.log(\"===fields===\", fields);\nconsole.log(\"===term===\", term);\napi.data.query = api.data.query.replace(/{__object_name}/g, objectName).replace(/{__fields}/g, fields).replace(/{__filters}/g, JSON.stringify(filters));\nconsole.log(\"===api.data.query===\", api.data.query);\nreturn api;\n"
        },
        "source": getSource()
    };
    return userAmisSchema;
}

