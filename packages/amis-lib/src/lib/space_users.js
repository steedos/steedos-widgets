import { getUISchema } from './objects';

export async function getSpaceUsersPickerAmisSchema(spaceUserSchema, name, options) {
    return {
        "type": "picker",
        "label": "人员",
        "name": name,
        "id": options.id,
        "modalMode": "dialog",
        "joinValues": false,
        "source": {
            "method": "post",
            "url": "${context.rootUrl}/graphql",
            "data": {
                "orderBy": "${orderBy}",
                "orderDir": "${orderDir}",
                "pageNo": "${page}",
                "pageSize": "${perPage}",
                "query": "{rows:space_users(filters: {__filters}, top: {__top}, skip: {__skip}, sort: \"{__sort}\"){_id,name,email,mobile},count:space_users__count(filters:{__filters})}",
                "$term": "$term",
                "$self": "$$"
            },
            "requestAdaptor": "\n        const selfData = JSON.parse(JSON.stringify(api.data.$self));\n        var filters = [];\n        var pageSize = api.data.pageSize || 10;\n        var pageNo = api.data.pageNo || 1;\n        var skip = (pageNo - 1) * pageSize;\n        var orderBy = api.data.orderBy || '';\n        var orderDir = api.data.orderDir || '';\n        var sort = orderBy + ' ' + orderDir;\n        var allowSearchFields = [\"name\"];\n        if(api.data.$term){\n            filters = [[\"name\", \"contains\", \"'+ api.data.$term +'\"]];\n        }else if(selfData.op === 'loadOptions' && selfData.value){\n            filters = [[\"_id\", \"=\", selfData.value]];\n        }\n        if(allowSearchFields){\n            allowSearchFields.forEach(function(key){\n                const keyValue = selfData[key];\n                if(keyValue){\n                    filters.push([key, \"contains\", keyValue]);\n                }\n            })\n        }\n        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim());\n        return api;\n    "
        },
        "pickerSchema": {
            "mode": "table",
            "name": "thelist",
            "draggable": false,
            "headerToolbar": [
                "switch-per-page",
                "pagination"
            ],
            "defaultParams": {
                "perPage": 50
            },
            "columns": [
                {
                    "name": "_index",
                    "type": "text",
                    "width": 32,
                    "placeholder": ""
                },
                {
                    "name": "_id",
                    "label": "ID",
                    "type": "text",
                    "toggled": false
                },
                {
                    "name": "name",
                    "label": "姓名",
                    "sortable": true,
                    "searchable": true,
                    "type": "text"
                },
                {
                    "name": "email",
                    "label": "邮件",
                    "sortable": true,
                    "type": "text",
                    "searchable": true
                },
                {
                    "name": "mobile",
                    "label": "手机",
                    "type": "text",
                    "sortable": true,
                    "searchable": true
                }
            ],
            "syncLocation": false,
            "keepItemSelectionOnPageChange": true
        },
        "labelField": "name",
        "valueField": "_id",
        "size": "lg",
        "extractValue": true,
        "className": "m-0",
        "labelClassName": "text-left"
    }
}

export async function getSpaceUsersPickerSchema(name, options) {
    const uiSchema = await getUISchema("space_users");
    const amisSchema = await getSpaceUsersPickerAmisSchema(uiSchema, name, options);
    return {
        uiSchema,
        amisSchema,
    };
}