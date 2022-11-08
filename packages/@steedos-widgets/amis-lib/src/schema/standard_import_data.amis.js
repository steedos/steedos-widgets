export const getSchema = (uiSchema)=>{
    return {
        "type": "service",
        "body": [
        {
            "type": "button",
            "label": "导入数据",
            "id": "u:import_data",
            "onEvent": {
            "click": {
                "actions": [
                {
                    "actionType": "dialog",
                    "dialog": {
                    "type": "dialog",
                    "title": "导入数据",
                    "body": [
                        {
                        "type": "form",
                        "mode": "edit",
                        "persistData": false,
                        "promptPageLeave": true,
                        "name": "form_edit_data_import",
                        "debug": false,
                        "title": "",
                        "submitText": "",
                        "api": {
                            "method": "post",
                            "url": "${context.rootUrl}/graphql",
                            "data": {
                            "objectName": "queue_import_history",
                            "$": "$$"
                            },
                            "requestAdaptor": "\n        const formData = api.data.$;\n        for (key in formData){\n            // image、select等字段清空值后保存的空字符串转换为null。\n            if(formData[key] === ''){\n                formData[key] = null;\n            }\n        }\n        const objectName = api.data.objectName;\n        const fieldsName = Object.keys(formData);\n        delete formData.created;\n        delete formData.created_by;\n        delete formData.modified;\n        delete formData.modified_by;\n        delete formData._display;\n        delete formData.success_count;\ndelete formData.failure_count;\ndelete formData.total_count;\ndelete formData.start_time;\ndelete formData.end_time;\ndelete formData.state;\ndelete formData.error;\ndelete formData.created;\ndelete formData.created_by;\ndelete formData.modified;\ndelete formData.modified_by;\n        \n        \n        let fileFieldsKeys = [\"file\"];\n        let fileFields = {\"file\":{\"name\":\"file\"}};\n        fileFieldsKeys.forEach((item)=>{\n            let fileFieldValue = formData[item];\n            if(fileFieldValue){\n                // 因为表单初始化接口的接收适配器中为file字段值重写了值及格式（为了字段编辑时正常显示附件名、点击附件名正常下载），所以保存时还原（为了字段值保存时正常保存id）。\n                if(fileFields[item].multiple){\n                    if(fileFieldValue instanceof Array && fileFieldValue.length){\n                        formData[item] = fileFieldValue.map((value)=>{ \n                            if(typeof value === 'object'){\n                                return value.value;\n                            }else{\n                                return value;\n                            }\n                        });\n                    }\n                }else{\n                    formData[item] = typeof fileFieldValue === 'object' ? fileFieldValue.value : fileFieldValue;\n                }\n            }\n        })\n    \n        let query = `mutation{record: ${objectName}__insert(doc: {__saveData}){_id}}`;\n        if(formData.recordId && formData.recordId !='new'){\n            query = `mutation{record: ${objectName}__update(id: \"${formData._id}\", doc: {__saveData}){_id}}`;\n        };\n        delete formData._id;\n        let __saveData = JSON.stringify(JSON.stringify(formData));\n    \n        api.data = {query: query.replace('{__saveData}', __saveData)};\n        return api;\n    ",
                            "responseData": {
                            "recordId": "${record._id}"
                            },
                            "adaptor": "console.log('payload', payload)\n            return payload;\n        ",
                            "headers": {
                            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                            },
                            "dataType": "json"
                        },
                        "initFetch": true,
                        "body": [
                            {
                            "type": "fieldSet",
                            "title": "通用",
                            "collapsable": true,
                            "body": [
                                {
                                "name": "object_name",
                                "label": "导入对象",
                                "required": false,
                                "type": "select",
                                "joinValues": false,
                                "extractValue": true,
                                "autoComplete": {
                                    "method": "post",
                                    "url": "${context.rootUrl}/graphql",
                                    "data": {
                                    "orderBy": "${orderBy}",
                                    "orderDir": "${orderDir}",
                                    "pageNo": "${page}",
                                    "pageSize": "${perPage}",
                                    "query": "{options:objects(filters: {__filters}, top: {__top}){_id label:label value:name},count:objects__count(filters:{__filters})}",
                                    "$term": "$term",
                                    "$value": "$object_name.name",
                                    "$": "$$",
                                    "rfield": "${object_name}"
                                    },
                                    "headers": {
                                    "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                    },
                                    "requestAdaptor": "\n        var filters = '[]';\n        var top = 10;\n        if(api.data.$term){\n            filters = '[\"name\", \"contains\", \"'+ api.data.$term +'\"]';\n        }else if(api.data.$value){\n            filters = '[\"_id\", \"=\", \"'+ api.data.$value +'\"]';\n        }\n        api.data.query = api.data.query.replace(/{__filters}/g, filters).replace('{__top}', top);\n        return api;\n    "
                                },
                                "className": "m-1",
                                "labelClassName": "text-left",
                                "clearValueOnHidden": false,
                                "id": "u:04295fee3896",
                                "multiple": false,
                                "hidden": true
                                },
                                {
                                "name": "queue_import",
                                "label": "数据导入",
                                "required": true,
                                "type": "picker",
                                "labelField": "description",
                                "valueField": "_id",
                                "modalMode": "dialog",
                                "source": {
                                    "method": "post",
                                    "url": "${context.rootUrl}/graphql",
                                    "data": {
                                    "orderBy": "${orderBy}",
                                    "orderDir": "${orderDir}",
                                    "pageNo": "${page}",
                                    "pageSize": "${perPage}",
                                    "query": "{rows:queue_import(filters: {__filters}, top: {__top}, skip: {__skip}, sort: \"{__sort}\"){_id,description,object_name,encoding,template_url,_display:_ui{object_name,encoding}},count:queue_import__count(filters:{__filters})}",
                                    "$term": "$term",
                                    "$self": "$$"
                                    },
                                    "headers": {
                                    "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                    },
                                    "requestAdaptor": "\n        const selfData = JSON.parse(JSON.stringify(api.data.$self));\n        var filters = [];\n        var pageSize = api.data.pageSize || 10;\n        var pageNo = api.data.pageNo || 1;\n        var skip = (pageNo - 1) * pageSize;\n        var orderBy = api.data.orderBy || '';\n        var orderDir = api.data.orderDir || '';\n        var sort = orderBy + ' ' + orderDir;\n        var allowSearchFields = [\"description\"];\n        if(api.data.$term){\n            filters = [[\"name\", \"contains\", \"'+ api.data.$term +'\"]];\n        }else if(selfData.op === 'loadOptions' && selfData.value){\n            if(selfData.value?.indexOf(',') > 0){\n                filters = [[\"_id\", \"=\", selfData.value.split(',')]];\n            }else{\n                filters = [[\"_id\", \"=\", selfData.value]];\n            }\n        }\n        if(allowSearchFields){\n            allowSearchFields.forEach(function(key){\n                const keyValue = selfData[key];\n                if(keyValue){\n                    filters.push([key, \"contains\", keyValue]);\n                }\n            })\n        }\n\n        const filtersFunction = function(filters, values){return ['object_name', '=', values.object_name]};\n\n        if(filtersFunction){\n            const _filters = filtersFunction(filters, api.data.$self.__super.__super);\n            if(_filters && _filters.length > 0){\n                filters.push(_filters);\n            }\n        }\n\n        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim());\n        return api;\n    ",
                                    "adaptor": "\n    const enable_tree = undefined;\n    if(enable_tree){\n        const records = payload.data.rows;\n        const treeRecords = [];\n        const getChildren = (records, childrenIds)=>{\n            if(!childrenIds){\n                return;\n            }\n            const children = _.filter(records, (record)=>{\n                return _.includes(childrenIds, record._id)\n            });\n            _.each(children, (item)=>{\n                if(item.children){\n                    item.children = getChildren(records, item.children)\n                }\n            })\n            return children;\n        }\n\n        _.each(records, (record)=>{\n            if(!record.parent){\n                treeRecords.push(Object.assign({}, record, {children: getChildren(records, record.children)}));\n            }\n        });\n        payload.data.rows = treeRecords;\n    }\n    return payload;\n    "
                                },
                                "size": "lg",
                                "pickerSchema": {
                                    "mode": "table",
                                    "name": "thelist",
                                    "draggable": false,
                                    "headerToolbar": [
                                    "reload"
                                    ],
                                    "defaultParams": {
                                    "perPage": 20
                                    },
                                    "columns": [
                                    {
                                        "name": "_index",
                                        "type": "text",
                                        "width": 32,
                                        "placeholder": ""
                                    },
                                    {
                                        "name": "description",
                                        "label": "导入描述",
                                        "type": "tpl",
                                        "tpl": "<a href=\"/app/undefined/undefined/view/${undefined}\">${description}</a>",
                                        "className": "whitespace-nowrap",
                                        "html": null
                                    },
                                    {
                                        "name": "object_name",
                                        "label": "导入对象",
                                        "type": "tpl",
                                        "tpl": "<a href=\"/app/undefined/${_display.object_name.objectName}/view/${_display.object_name.value}\">${_display.object_name.label}</a>",
                                        "className": "whitespace-nowrap",
                                        "html": null
                                    },
                                    {
                                        "name": "encoding",
                                        "label": "字符代码",
                                        "type": "tpl",
                                        "tpl": "<div>${_display.encoding}</div>",
                                        "className": "whitespace-nowrap",
                                        "html": null
                                    },
                                    {
                                        "name": "template_url",
                                        "label": "导入模板",
                                        "type": "markdown",
                                        "className": "whitespace-nowrap",
                                        "html": true
                                    },
                                    null
                                    ],
                                    "syncLocation": false,
                                    "keepItemSelectionOnPageChange": true,
                                    "checkOnItemClick": false,
                                    "autoFillHeight": false
                                },
                                "joinValues": false,
                                "extractValue": true,
                                "className": "m-1",
                                "labelClassName": "text-left",
                                "clearValueOnHidden": true,
                                "id": "u:401df27113e0"
                                },
                                {
                                "name": "file",
                                "label": "Excel文件",
                                "required": true,
                                "type": "input-file",
                                "className": "m-1",
                                "labelClassName": "text-left",
                                "clearValueOnHidden": true,
                                "useChunk": false,
                                "receiver": {
                                    "method": "post",
                                    "url": "${context.rootUrl}/s3/files",
                                    "data": {
                                    "$": "$$",
                                    "context": "${context}"
                                    },
                                    "adaptor": "\n                const { context } = api.body; \n                var rootUrl = context.rootUrl + \"/api/files/files/\";\n                payload = {\n                    status: response.status == 200 ? 0 : response.status,\n                    msg: response.statusText,\n                    data: {\n                        value: payload._id,\n                        name: payload.original.name,\n                        url: rootUrl + payload._id,\n                    }\n                }\n                return payload;\n            ",
                                    "headers": {
                                    "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                    }
                                },
                                "id": "u:0213f2cc365b"
                                }
                            ],
                            "id": "u:4899c260d667"
                            }
                        ],
                        "panelClassName": "m-0 sm:rounded-lg shadow-none",
                        "bodyClassName": "p-0",
                        "className": "p-4 sm:p-0 steedos-amis-form",
                        "label": "对象表单",
                        "objectApiName": "queue_import_history",
                        "id": "u:e4ef598eed61",
                        "onEvent": {
                            "submitSucc": {
                            "weight": 0,
                            "actions": [
                                {
                                "args": {
                                    "api": {
                                    "url": "${context.rootUrl}/api/data/initiateImport",
                                    "method": "post",
                                    "data": {
                                        "eventData": "${event.data}"
                                    },
                                    "dataType": "json",
                                    "requestAdaptor": "\napi.data = {\n  importObjectHistoryId: api.body.eventData.result.data.recordId\n}\nreturn api;",
                                    "adaptor": "payload.status = payload.status === 'success' ? 0 : payload.status;\nconsole.log(\"payload ssss==>\", payload)\nreturn payload;",
                                    "headers": {
                                        "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                    }
                                    },
                                    "messages": {
                                    "success": "已开始导入...",
                                    "failed": "导入失败"
                                    }
                                },
                                "actionType": "ajax",
                                "expression": "event.data.result"
                                }
                            ]
                            }
                        },
                        "closeDialogOnSubmit": true
                        }
                    ],
                    "id": "u:dc05498d3bd4",
                    "closeOnEsc": false,
                    "closeOnOutside": false,
                    "showCloseButton": true,
                    "size": "lg"
                    }
                }
                ],
                "weight": 0
            }
            },
            "level": "default"
        }
        ],
        "regions": [
        "body"
        ],
        "className": "p-0",
        "id": "u:bd2f9c4e986f"
    }
}