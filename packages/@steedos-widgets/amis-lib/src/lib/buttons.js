import _ from "lodash";
import { isExpression, parseSingleExpression } from "./expression";
import { getApi } from './converter/amis/graphql';
import config from "../config";
import { getUISchema } from "./objects";

const getGlobalData = () => {
    return {
        now: new Date(),
    };
};

export const getButtonVisible = (button, ctx) => {
    if (button._visible) {
        if (_.startsWith(_.trim(button._visible), "function")) {
            window.eval("var fun = " + button._visible);
            button.visible = fun;
        } else if (isExpression(button._visible)) {
            button.visible = (props) => {
                parseSingleExpression(
                    button._visible,
                    props.record,
                    "#",
                    getGlobalData(),
                    props.userSession
                );
            };
        }
    }
    if (_.isFunction(button.visible)) {
        try {
            return button.visible(ctx);
        } catch (error) {
            // console.error(`${button.name} visible error: ${error}`);
        }
    } else {
        return button.visible;
    }
};

// TODO
export const standardButtonsTodo = {
    standard_new: function(){
        // object: uiSchema
        // action: button
        const { objectName, object_name, object, action, record, recordId, record_id, appId, listViewId, formFactor, router } = this;

        const type = config.listView.newRecordMode;
        SteedosUI?.Object.newRecord({
            onSubmitted: () => {
                SteedosUI.getRef(listViewId)
                    .getComponentByName(`page.listview_${object.name}`)
                    .handleAction({}, { actionType: "reload" });
            },
            onCancel: () => {
                SteedosUI.getRef(listViewId)
                    .getComponentByName(`page.listview_${object.name}`)
                    .handleAction({}, { actionType: "reload" });
            },
            appId: appId,
            formFactor: formFactor,
            name: SteedosUI.getRefId({ type: `${type}-form` }),
            title: `新建 ${object.label}`,
            objectName: object.name,
            data: record,
            recordId: "new",
            type,
            router,
        });
    },
    standard_edit: function(){
        const type = config.listView.newRecordMode;
        const { objectName, object_name, object, action, record, recordId, record_id, appId, listViewId, formFactor, router } = this;
        SteedosUI?.Object.editRecord({
            appId: appId,
            name: SteedosUI.getRefId({ type: `${type}-form` }),
            title: `编辑 ${object.label}`,
            objectName: object.name,
            recordId: recordId,
            type,
            options: formFactor === 'SMALL' ? {
                props: {
                  width: "100%",
                  style: {
                    width: "100%",
                  },
                  bodyStyle: { padding: "0px", paddingTop: "0px" },
                }
              } : null,
            router,
            formFactor: formFactor,
            onSubmitted: () => {
                const detailScope = SteedosUI.getRef(
                    SteedosUI.getRefId({
                        type: "detail",
                        appId: appId,
                        name: object.name,
                    })
                );
                if(detailScope && detailScope.getComponentById(`detail_${recordId}`)){
                    detailScope.getComponentById(`detail_${recordId}`)
                        .reload();
                }else{
                    SteedosUI.getRef(listViewId)
                    .getComponentByName(`page.listview_${object.name}`)
                    .handleAction({}, { actionType: "reload" });
                }
            },
        });
    },
    standard_delete: function() { },
    standard_delete_many: function(){
        const {
            listViewId,
            object: uiSchema,
        } = this;
        const listViewRef = SteedosUI?.getRef(listViewId).getComponentByName(`page.listview_${uiSchema.name}`)
          
        if(_.isEmpty(listViewRef.props.store.toJSON().selectedItems)){
            listViewRef.handleAction({}, {
                "actionType": "toast",
                "toast": {
                    "items": [
                      {
                        "position": "top-right",
                        "body": "请选择要删除的项"
                      }
                    ]
                  }
              })
        }else{
            listViewRef.handleBulkAction(listViewRef.props.store.toJSON().selectedItems,[],{},listViewRef.props.bulkActions[0]);
        }
    }
};

// TODO
const standardButtonsVisible = {
    standard_newVisible: (props) => { },
};

/**
 * 按钮显隐规则: 优先使用页面布局上的配置.
 * @param {*} uiSchema 
 * @param {*} ctx 
 * @returns 
 */
export const getButtons = (uiSchema, ctx) => {
    const disabledButtons = uiSchema.permissions.disabled_actions;
    let buttons = _.sortBy(_.values(uiSchema.actions), "sort");
    if (_.has(uiSchema, "allow_customActions")) {
        buttons = _.filter(buttons, (button) => {
            return _.include(uiSchema.allow_customActions, button.name); // || _.include(_.keys(Creator.getObject('base').actions) || {}, button.name)
        });
    }
    if (_.has(uiSchema, "exclude_actions")) {
        buttons = _.filter(buttons, (button) => {
            return !_.include(uiSchema.exclude_actions, button.name);
        });
    }

    _.each(buttons, (button) => {
        button.objectName = uiSchema.name;
        if (
            ctx.isMobile &&
            ["record", "record_only"].indexOf(button.on) > -1 &&
            button.name != "standard_edit"
        ) {
            if (button.on == "record_only") {
                button.on = "record_only_more";
            } else {
                button.on = "record_more";
            }
        }
    });

    if (
        ctx.isMobile &&
        ["cms_files", "cfs.files.filerecord"].indexOf(uiSchema.name) > -1
    ) {
        _.map(buttons, (button) => {
            if (button.name === "standard_edit") {
                button.on = "record_more";
            }
            if (button.name === "download") {
                button.on = "record";
            }
        });
    }

    return _.filter(buttons, (button) => {
        return _.indexOf(disabledButtons, button.name) < 0 && button.name != 'standard_query';
    });
};

export const getListViewButtons = (uiSchema, ctx) => {
    const buttons = getButtons(uiSchema, ctx);
    const listButtons = _.filter(buttons, (button) => {
        if (button.on == "list") {
            return getButtonVisible(button, ctx);
        }
        return false;
    });

        // 如果是standard_data_import 且 _visible 中调用了 Steedos 函数, 则自动添加标准的导入功能
        if(uiSchema.hasImportTemplates){
            const standardImport = _.find(buttons, (btn)=>{ return btn.name == 'standard_import_data'})
            listButtons.push({
                label: standardImport.label,
                name: standardImport.name,
                on: standardImport.on,
                type: 'amis_button',
                amis_schema: {
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
                                                "labelTpl": "${undefined}",
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
                        "level": "enhance"
                    }
                    ],
                    "regions": [
                    "body"
                    ],
                    "bodyClassName": "p-0",
                    "id": "u:bd2f9c4e986f"
                }
            }); 
        }

    // 如果是standard_new 且 _visible 中调用了 Steedos 函数, 则自动添加标准的新建功能
    const standardNew = _.find(buttons, (btn)=>{ return btn.name == 'standard_new'})
    if( uiSchema.name != 'cms_files' && uiSchema.permissions.allowCreate && standardNew && standardNew._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_new.visible.apply') > 0){
        listButtons.push({
            label: standardNew.label,
            name: standardNew.name,
            on: standardNew.on,
            type: standardNew.type,
            todo: standardButtonsTodo.standard_new
        }); 
    }
    return listButtons;
};

export const getObjectDetailButtons = (uiSchema, ctx) => {
    const buttons = getButtons(uiSchema, ctx);
    const detailButtons = _.filter(buttons, (button) => {
        if (button.on == "record" || button.on == "record_only") {
            return getButtonVisible(button, ctx);
        }
        return false;
    });
    // 如果是standard_edit 且 _visible 中调用了 Steedos 函数, 则自动添加标准的编辑功能
    const standardEdit = _.find(buttons, (btn)=>{ return btn.name == 'standard_edit'})
    if(ctx.permissions?.allowEdit && standardEdit && standardEdit._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_edit.visible.apply') > 0){
        detailButtons.push({
            label: standardEdit.label,
            name: standardEdit.name,
            on: standardEdit.on,
            type: standardEdit.type,
            todo: standardButtonsTodo.standard_edit
        })
    }

    return _.sortBy(detailButtons, "sort");
};

export const getObjectDetailMoreButtons = (uiSchema, ctx) => {
    const buttons = getButtons(uiSchema, ctx);
    const moreButtons = _.filter(buttons, (button) => {
        if (button.on == "record_more" || button.on == "record_only_more") {
            return getButtonVisible(button, ctx);
        }
        return false;
    });

    // 如果是standard_delete 且 _visible 中调用了 Steedos 函数, 则自动添加标准的删除功能
    const standardDelete = _.find(buttons, (btn)=>{ return btn.name == 'standard_delete'})
    if(ctx.permissions?.allowDelete && standardDelete && standardDelete._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_delete.visible.apply') > 0){
        moreButtons.push({
            label: standardDelete.label,
            name: standardDelete.name,
            on: standardDelete.on,
            type: "amis_button",
            sort: standardDelete.sort,
            amis_schema: {
                type: "service",
                bodyClassName: 'p-0',
                body: [
                    {
                        type: "button",
                        label: '删除',
                        confirmText: "确定要删除此项目?",
                        className: 'border-none',
                        onEvent: {
                            click: {
                                actions: [
                                    {
                                      "args": {
                                        "api": {
                                            method: 'post',
                                            url: getApi(),
                                            requestAdaptor: `
                                                var deleteArray = [];
                                                 deleteArray.push(\`delete:${ctx.objectName}__delete(id: "${ctx.recordId}")\`);
                                                api.data = {query: \`mutation{\${deleteArray.join(',')}}\`};
                                                return api;
                                            `,
                                            headers: {
                                                Authorization: "Bearer ${context.tenantId},${context.authToken}"
                                            }
                                        },
                                        "messages": {
                                            "success": "删除成功",
                                            "failed": "删除失败"
                                        }
                                      },
                                      "actionType": "ajax"
                                    }
                                  ]
                            }
                        }
                    }
                ],
                regions: [
                  "body"
                ]
              }
        })
    }
    return _.sortBy(moreButtons, "sort");
};

export const getListViewItemButtons = async (uiSchema, ctx)=>{
    const buttons = getButtons(uiSchema, ctx);
    const listButtons = _.filter(buttons, (button) => {
        return button.on == "record" || button.on == "list_item" || button.on === 'record_more';
    });
    return listButtons;
}

/**
 * 由此函数负责内置按钮的转换
 * @param {*} objectName 
 * @param {*} buttonName 
 * @param {*} ctx 
 * @returns 
 */
export const getButton = async (objectName, buttonName, ctx)=>{
    const uiSchema = await getUISchema(objectName);
    const { props } = ctx;
    if(uiSchema){
        const buttons = await getButtons(uiSchema, ctx);
        const button = _.find(buttons, (button)=>{
            return button.name === buttonName
        });

        if(!button){
            return ;
        }

        if(button.name == 'standard_edit' && button._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_edit.visible.apply') > 0){
            return {
                label: button.label,
                name: button.name,
                on: button.on,
                type: button.type,
                todo: standardButtonsTodo.standard_edit
                // todo: (objectName, recordId)=>{
                //     return standardButtonsTodo.standard_edit.apply(this, [objectName, recordId]);
                //     // return standardButtonsTodo.standard_edit.call({}, event, {
                //     //     recordId: ctx.recordId,
                //     //     appId: ctx.app_id,
                //     //     uiSchema: uiSchema,
                //     //     formFactor: ctx.formFactor,
                //     //     router: ctx.router,
                //     //     listViewId: ctx.listViewId,
                //     //     options: ctx.formFactor === 'SMALL' ? {
                //     //         props: {
                //     //           width: "100%",
                //     //           style: {
                //     //             width: "100%",
                //     //           },
                //     //           bodyStyle: { padding: "0px", paddingTop: "0px" },
                //     //         }
                //     //       } : null
                //     //   })
                // }
            };
        }

        if(objectName != 'cms_files' && button.name == 'standard_new' && button._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_new.visible.apply') > 0){
            return {
                label: button.label,
                name: button.name,
                on: button.on,
                type: button.type,
                todo: (event)=>{
                    return standardButtonsTodo.standard_new
                }
            }
        }

        // 如果是standard_delete 且 _visible 中调用了 Steedos 函数, 则自动添加标准的删除功能
        if(button.name == 'standard_delete' && button._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_delete.visible.apply') > 0){
            return {
                label: button.label,
                name: button.name,
                on: button.on,
                type: "amis_button",
                sort: button.sort,
                amis_schema: {
                    type: "service",
                    bodyClassName: 'p-0',
                    body: [
                        {
                            type: "button",
                            label: '删除',
                            confirmText: "确定要删除此项目?",
                            className: props.className,
                            onEvent: {
                                click: {
                                    actions: [
                                        {
                                        "args": {
                                            "api": {
                                                method: 'post',
                                                url: getApi(),
                                                requestAdaptor: `
                                                    var deleteArray = [];
                                                    deleteArray.push(\`delete:${ctx.objectName}__delete(id: "${ctx.recordId}")\`);
                                                    api.data = {query: \`mutation{\${deleteArray.join(',')}}\`};
                                                    return api;
                                                `,
                                                headers: {
                                                    Authorization: "Bearer ${context.tenantId},${context.authToken}"
                                                }
                                            },
                                            "messages": {
                                                "success": "删除成功",
                                                "failed": "删除失败"
                                            }
                                        },
                                        "actionType": "ajax"
                                        },
                                        {
                                            "componentId": "",
                                            "args": {
                                              "url": `/app/${ctx.appId}/${ctx.objectName}`,
                                              blank: false,
                                            },
                                            "actionType": "url"
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    regions: [
                    "body"
                    ]
                }
            }
        }
        return button;

    }
}

export const execute = (button, props) => {
    if (!button.todo) {
        return; //TODO 弹出提示未配置todo
    }

    if (_.isString(button.todo)) {
        if (_.startsWith(_.trim(button.todo), "function")) {
            window.eval("var fun = " + button.todo);
            button.todo = fun;
        }
    }
    if (_.isFunction(button.todo)) {
        const todoThis = {
            objectName: props.objectName, 
            object_name: props.objectName, 
            object: props.uiSchema, 
            record: props.record,
            recordId: props.recordId,
            record_id: props.recordId,
            ...props,
            action: button
        }
        return button.todo.apply(todoThis, [todoThis.objectName, todoThis.recordId]);
    }
};

export const executeButton = execute;
