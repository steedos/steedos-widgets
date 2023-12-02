import * as _ from 'lodash'
import * as Tpl from '../tpl';
import * as Fields from '../fields/index';
import * as graphql from '../graphql';
import config from '../../../../config'
import { each, forEach, isBoolean, isEmpty } from 'lodash';
import { getAmisFileReadonlySchema } from './file'
import { Router } from '../../../router'
import { i18next } from '../../../../i18n'

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

async function getQuickEditSchema(field, options){
    //判断在amis3.2以上环境下，放开批量编辑与lookup的单元格编辑
    let isAmisVersionforBatchEdit = false;
    if(window.amisRequire && window.amisRequire('amis')){
        isAmisVersionforBatchEdit = window.amisRequire('amis').version[0] >= 3 && window.amisRequire('amis').version[2] >= 2;
    }else if(window.Amis){
        isAmisVersionforBatchEdit = window.Amis.version[0] >= 3 && window.Amis.version[2] >= 2;
    }
    const quickEditId = options.objectName + "_" + field.name + "_quickEdit";//定义快速编辑的表单id，用于setvalue传值
    var quickEditSchema = { body: [], id: quickEditId };
    //select,avatar,image,file等组件无法行记录字段赋值，暂不支持批量编辑；
    if(field.type != 'avatar' && field.type != 'image' && field.type != 'file' && isAmisVersionforBatchEdit){
        const submitEvent = {
            submit: {
                actions: [
                    {
                        actionType: "custom",
                        script: `
                            let items = _.cloneDeep(event.data.items);
                            let selectedItems = _.cloneDeep(event.data.selectedItems);
                            if(event.data.isBatchEdit){
                                selectedItems.forEach(function(selectedItem){
                                    selectedItem._display.${field.name} = event.data._display.${field.name};
                                    doAction({actionType: 'setValue', "args": {"value": selectedItem._display},componentId: "_display_" + selectedItem._index});
                                    doAction({actionType: 'setValue', "args": {"value": event.data.${field.name}},componentId: "${options.objectName + "_" + field.name + "_"}" + selectedItem._index});
                                })
                            }else{
                                doAction({actionType: 'setValue', "args": {"value": event.data._display},componentId: "_display_" + event.data._index});
                                doAction({actionType: 'setValue', "args": {"value": event.data.${field.name}},componentId: "${options.objectName + "_" + field.name + "_"}" + event.data._index});
                            }
                        `
                    },
                    {
                        "actionType": "closeDialog"
                    }
                ]
            }
        }
        quickEditSchema.onEvent = submitEvent;
    }
    
    if (field.disabled) {
        quickEditSchema = false;
    } else {
        var fieldSchema = await Fields.convertSFieldToAmisField(field, false, _.omit(options, 'buttons'));
        //存在属性上可编辑，实际不可编辑的字段，convertSFieldToAmisField函数可能会返回undefined，如summary
        if (!!fieldSchema) {
            quickEditSchema.body.push(fieldSchema);
            //以下字段使用_display的数据,因此在触发change等事件时对数据_display进行修改，以实现保存前的回显
            var TempDisplayField = ``;
            quickEditSchema.body[0].onEvent = {};
            const quickEditOnEvent = function (displayField) {
                const EventType = {
                    "actions": [
                        {
                            "actionType": "custom",
                            "script": `
                                    var _display = _.cloneDeep(event.data._display);
                                    ${displayField}
                                    doAction({actionType: 'setValue', "args": {"value": {_display}},componentId: "${quickEditId}"});
                                `
                        }
                    ]
                };
                return EventType;
            }
            switch (field.type) {
                //TODO: amis的picker组件直接点击选项x时不会触发change事件，待处理
                case "lookup":
                case "master_detail":
                    let labelField = quickEditSchema.body[0].labelField || "label";
                    let valueField = quickEditSchema.body[0].valueField || "value";
                    if (field.multiple) {
                        /*
                            多选分两种情况。
                            第一种是减少选项时（判断新的数据是否比老的数据短），按照index删除_display中对应选项，保证回显没问题；
                            第二种是增加选项时，按照value的值，找到对应选项，并按照_display的规则为其赋值
                        */
                        TempDisplayField = `
                            const preData = _.cloneDeep(event.data.__super.${field.name});
                            if(preData && event.data.${field.name}.length < preData.length){
                                let deletedIndex;
                                preData.forEach(function(item,index){
                                    if(_.indexOf(event.data.${field.name}, item) == -1) _display["${field.name}"].splice(index, 1);
                                })
                            }else{
                                _display["${field.name}"] = [];
                                event.data.value.forEach(function(val,index){
                                    const item = _.find(event.data.selectedItems, { ${valueField}: val });
                                    _display["${field.name}"].push(
                                        {
                                            "label": item.${labelField},
                                            "value": item[event.data.uiSchema.idFieldName],
                                            "objectName": "${field.reference_to}"
                                        }
                                    )
                                })
                            }
                            
                        `
                    } else {
                        TempDisplayField = `
                            if(event.data.value){
                                _display["${field.name}"] = {
                                    "label": event.data.selectedItems.${labelField},
                                    "value": event.data.selectedItems[event.data.uiSchema.idFieldName],
                                    "objectName": "${field.reference_to}"
                                }
                            }else{
                                _display["${field.name}"] = {}
                            }
                        `
                    }
                    quickEditSchema.body[0].onEvent["change"] = quickEditOnEvent(TempDisplayField)
                    break;
                case "select":
                    TempDisplayField = `
                            _display["${field.name}"] = event.data.selectedItems.label;
                        `
                    quickEditSchema.body[0].onEvent["change"] = quickEditOnEvent(TempDisplayField)
                    break;
                case "percent":
                    TempDisplayField = `
                            _display["${field.name}"] = event.data.value.toFixed(${field.scale}) + '%';
                        `
                    quickEditSchema.body[0].onEvent["change"] = quickEditOnEvent(TempDisplayField)
                    break;
                case "time":
                    TempDisplayField = `
                            _display["${field.name}"] = moment(event.data.value).utc().format('HH:mm');
                        `
                    quickEditSchema.body[0].onEvent["change"] = quickEditOnEvent(TempDisplayField)
                    break;
                case "date":
                    TempDisplayField = `
                            _display["${field.name}"] = moment(event.data.value).utc().format('YYYY-MM-DD');
                        `
                    quickEditSchema.body[0].onEvent["change"] = quickEditOnEvent(TempDisplayField)
                    break;
                case "datetime":
                    TempDisplayField = `
                            _display["${field.name}"] = moment(event.data.value).format('YYYY-MM-DD HH:mm');
                        `
                    quickEditSchema.body[0].onEvent["change"] = quickEditOnEvent(TempDisplayField)
                    break;
                case "boolean":
                    TempDisplayField = `
                            _display["${field.name}"] = event.data.value?"√":"";
                        `
                    quickEditSchema.body[0].onEvent["change"] = quickEditOnEvent(TempDisplayField)
                    break;
                case "number":
                case "currency":
                    TempDisplayField = `
                            _display["${field.name}"] = event.data.value && event.data.value.toFixed(${field.scale});
                        `
                    quickEditSchema.body[0].onEvent["change"] = quickEditOnEvent(TempDisplayField)

                    break;
                case "file":
                    var removeDisplayField = ``;
                    if (field.multiple) {
                        TempDisplayField = `
                                _display["${field.name}"].push({
                                    "name": event.data.result.name,
                                    "url": event.data.result.url,
                                    "type": event.data.item.type,
                                    "size": event.data.item.size
                                });
                            `
                        removeDisplayField = `
                                _.remove(_display["${field.name}"], function(file){return file.url == event.data.item.url});
                            `
                    } else {
                        TempDisplayField = `  
                                _display["${field.name}"] = {
                                    "name": event.data.result.name,
                                    "url": event.data.result.url,
                                    "type": event.data.item.type,
                                    "size": event.data.item.size
                                };
                            `
                        removeDisplayField = `
                                if(_display["${field.name}"].url == event.data.item.url){
                                    _display["${field.name}"] = {};
                                }
                            `
                    }
                    quickEditSchema.body[0].onEvent["success"] = quickEditOnEvent(TempDisplayField)
                    quickEditSchema.body[0].onEvent["remove"] = quickEditOnEvent(removeDisplayField)
                    break;
                case "avatar":
                case "image":
                quickEditSchema.body[0].receiver.adaptor = `
                    const { context } = api.body; 
                    var rootUrl = context.rootUrl + "/api/files/${field.type}s/";
                    payload = {
                        status: response.status == 200 ? 0 : response.status,
                        msg: response.statusText,
                        data: {
                            value: rootUrl + payload._id,//为了实现图片crud的回显，需要将value从id改为url，当保存数据数据时，再在发送适配器内重新将id提取出来
                            name: payload.original.name,
                            url: rootUrl + payload._id,
                        }
                    }
                    return payload;
                `
                break;
                default:
                    break;
            }
            quickEditSchema.body[0].visibleOn = "${quickedit_record_permissions.allowEdit && quickedit_record_permissions_loading == false}"
            quickEditSchema.body.push({
                "type":"service",
                "body":[
                    {
                        "type": "tpl",
                        "tpl": i18next.t('frontend_records_no_allowedit'),
                        "visibleOn": "${!quickedit_record_permissions.allowEdit && quickedit_record_permissions_loading == false}"
                    },
                    {
                        "type": "spinner",
                        "showOn": "${quickedit_record_permissions_loading}"
                    }
                ],
                "onEvent":{
                    "init":{
                        "actions":[
                            {
                                "actionType": "setValue",
                                "componentId": `service_listview_${options.objectName}`,
                                "args": {
                                    "value":{
                                        "quickedit_record_permissions_loading": true
                                    }
                                }
                            },
                            {
                                "actionType": "ajax",
                                "args": {
                                    "api": {
                                      "url": "${context.rootUrl}/service/api/@\${objectName}/recordPermissions/${_id}",
                                      "method": "get",
                                      "headers": {
                                        "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                      },
                                      "cache": 30000,
                                      "messages": {
                                        "failed": "失败了呢。。"
                                      }
                                    }
                                }
                            },
                            {
                                "actionType": "setValue",
                                "componentId": `service_listview_${options.objectName}`,
                                "args": {
                                    "value":{
                                        "quickedit_record_permissions_loading": false
                                    }
                                }
                            },
                            {
                                "actionType": "setValue",
                                "componentId": `service_listview_${options.objectName}`,
                                "args": {
                                    "value":{
                                        "quickedit_record_permissions": "${event.data}"
                                    }
                                }
                            }
                        ]
                    }
                }
                
            })
            if(field.type != 'avatar' && field.type != 'image' && field.type != 'file' && isAmisVersionforBatchEdit){
                quickEditSchema.body.push({
                    "name": "isBatchEdit",
                    "type": "checkbox",
                    "option": [
                        {
                            "type": "tpl",
                            "tpl": "更新${COUNT(selectedItems)}个选定记录"
                        },
                        {
                            "type": "spinner",
                            "showOn": "${batchPermissionLoading}",
                            "size": "sm",
                            "className": "mr-4"
                        }
                    ],
                    "visibleOn": "${ARRAYSOME(selectedItems, item => item._id === _id) && COUNT(selectedItems)>1 && quickedit_record_permissions.allowEdit && quickedit_record_permissions_loading == false}",
                    "disabledOn": "${batchPermissionLoading}",
                    "onEvent":{
                        "change":{
                            "actions":[
                                {
                                    "actionType": "setValue",
                                    "componentId": quickEditId,
                                    "args": {
                                        "value":{
                                            "batchPermissionLoading": true
                                        }
                                    },
                                    "expression":"${event.data.value}"
                                },
                                {
                                    "actionType": "ajax",
                                    "args": {
                                        "api": {
                                          "url": "${context.rootUrl}/graphql",
                                          "method": "post",
                                          "headers": {
                                            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                          },
                                          "data": {
                                            "query": "{rows:${objectName}(filters:[\"_id\",\"in\",${selectedItems | pick:_id | split | json}]){_id,_permissions{allowEdit}}}"
                                          },
                                          "adaptor": `
                                            const noPermission = [];
                                            payload.data.rows.forEach(function (row) {
                                                if(!row._permissions.allowEdit){
                                                    noPermission.push(row._id);
                                                }
                                            })
                                            payload.data.noPermission = noPermission;
                                            return payload;
                                          `
                                        }
                                    },
                                    "expression":"${event.data.value}"
                                },
                                {
                                    "actionType": "setValue",
                                    "componentId": quickEditId,
                                    "args": {
                                        "value":{
                                            "batchPermissionLoading": false
                                        }
                                    },
                                    "expression":"${event.data.value}"
                                },
                                {
                                    "actionType": "dialog",
                                    "dialog":{
                                        "title": "记录权限",
                                        "showCloseButton": false,
                                        "body":[
                                            {
                                                "type": "tpl",
                                                "tpl": "当前选中记录中，有${COUNT(noPermission)}条记录无编辑权限，是否需要批量编辑其他记录？"
                                            }
                                        ],
                                        "onEvent":{
                                            "confirm":{
                                                "actions":[
                                                    {
                                                        "actionType": "custom",
                                                        "script": `
                                                            const noPermission = event.data.noPermission;
                                                            const crudComponent = event.context.scoped.getComponentById("${options.crudId}");
                                                            const selectedItems = crudComponent && crudComponent.props.store.selectedItems.concat();
                                                            noPermission.forEach(function (item) {
                                                                crudComponent && crudComponent.unSelectItem(_.find(selectedItems,{_id:item}));
                                                            })
                                                        `
                                                    },
                                                    {
                                                        "actionType": "setValue",
                                                        "componentId": quickEditId,
                                                        "args": {
                                                            "value":{
                                                                "isBatchEdit": true
                                                            }
                                                        },
                                                    }
                                                ]
                                            },
                                            "cancel":{
                                                "actions":[
                                                    {
                                                        "actionType": "setValue",
                                                        "componentId": quickEditId,
                                                        "args": {
                                                            "value":{
                                                                "isBatchEdit": false
                                                            }
                                                        },
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    "expression":"${COUNT(event.data.noPermission)>0}"
                                }
                            ]
                        }
                    }
                })
            }
        } else {
            quickEditSchema = false;
        }
        //amis3.2以下禁用lookup的单元格编辑
        if(field.type == "lookup" && !isAmisVersionforBatchEdit){
            quickEditSchema = false;
        }
        //TODO:附件多选时会覆盖老数据，暂时禁用
        if(field.type == "file" && field.multiple){
            quickEditSchema = false;
        }
        //TODO:location字段在列表中快速编辑后存在bug,保存时可能会丢失部分数据，暂时禁用
        if(field.type == "location"){
            quickEditSchema = false;
        }
    }
    return quickEditSchema;
}

function getFieldWidth(width){
    const defaultWidth = "unset";//用于使table内的td标签下生成div，实现将快速编辑按钮固定在右侧的效果，并不是为了unset效果
    if(typeof width == 'string'){
        if(isNaN(width)){
            return width;
        }else{
            return Number(width);
        }
    }else if(typeof width == 'number'){
        return width;
    }else{
        return defaultWidth;
    }
}

export async function getTableColumns(fields, options){
    const columns = [];
    if(!options.isLookup && !options.isInputTable){
        //将_display放入crud的columns中，可以通过setvalue修改行内数据域的_display，而不影响上层items的_display,用于批量编辑
        columns.push({name: '_display',type: 'static', width: 32, placeholder: "",id: "_display_${_index}", className: "hidden"});
        columns.push({name: '_index',type: 'text', width: 32, placeholder: ""});
    }
    const allowEdit = options.permissions?.allowEdit && !options.isLookup && options.enable_inline_edit != false;
    
    for (const field of fields) {
        //增加quickEdit属性，实现快速编辑
        const quickEditSchema = allowEdit ? await getQuickEditSchema(field, options) : allowEdit;
        let className = "";
        if(field.wrap != true){
            className += " whitespace-nowrap "
        }else{
            className += " break-all "
        }
        let columnItem;
        if((field.is_name || field.name === options.labelFieldName) && options.objectName === 'cms_files'){
            const previewFileScript = `
                var data = event.data;
                var file_name = data.versions ? data.name : "${field.label}";
                var file_id = data._id;
                SteedosUI.previewFile && SteedosUI.previewFile({file_name, file_id});
            `;
            columnItem = {
                "type": "button",
                "label": `<%=data.versions ? data.name : "${field.label}"%>`,
                className,
                "level": "link",
                "onEvent": {
                  "click": {
                    "actions": [
                        {
                            "args": {
                                "api": {
                                    "url": "${(versions[0] && versions[0].url) ? versions[0].url+'?download=true' : context.rootUrl+'/api/files/files/'+versions[0]+'?download=true'}",
                                    "method": "get",
                                    "headers": {
                                        "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                    }
                                }
                            },
                            "actionType": "download",
                            // "expression": "!!!window?.nw?.require"//浏览器上直接下载
                            "expression": "!!!(window && window.nw && window.nw.require)"//浏览器上直接下载
                        },
                        {
                          "args": {},
                          "actionType": "custom",
                          "script": previewFileScript,
                        //   "expression": "!!window?.nw?.require" //PC客户端预览附件
                          "expression": "!!!(window && window.nw && window.nw.require)"//PC客户端预览附件
                        }
                    ]
                  }
                }
            };
        }else if(field.type === 'toggle'){
            columnItem = Object.assign({}, {
                type: "switch",
                name: field.name,
                label: field.label,
                width: getFieldWidth(field.width),
                toggled: field.toggled,
                static: true,
                className,
            }, field.amis, {name: field.name});
        }else if(field.type === 'avatar' || field.type === 'image' || field.type === 'file'){
            columnItem = Object.assign({}, {
                type: "switch",
                name: field.name,
                label: field.label,
                width: getFieldWidth(field.width),
                toggled: field.toggled,
                static: true,
                className,
                ...getAmisFileReadonlySchema(field)
            }, field.amis, {name: field.name});
        }
        else if(field.type === 'select'){
            const map = Tpl.getSelectMap(field.options);
            columnItem = Object.assign({}, {
                type: "static-mapping",
                name: field.name,
                label: field.label,
                map: map,
                sortable: field.sortable,
                width: getFieldWidth(field.width),
                toggled: field.toggled,
                className,
                static: true,
            }, field.amis, {name: field.name});
        }
        else{
            const tpl = await Tpl.getFieldTpl(field, options);
            let type = 'static-text';
            if(tpl){
                type = 'static';
            }else if(field.type === 'html'){
                type = 'static-markdown';
            }else if(field.type === 'url'){
                if(field.show_as_qr){
                    type = 'static-qr-code';
                }else{
                    type = 'input-url'
                }
            }
            if(field.type === 'textarea'){
                className += 'min-w-56';
            }
            if(field.type === 'date'){
                className += 'date-min-w';
            }
            if(field.type === 'datetime'){
                className += 'datetime-min-w';
            }
            if(!field.hidden && !field.extra){
                columnItem = Object.assign({}, {
                    name: field.name,
                    label: field.label,
                    sortable: field.sortable,
                    // searchable: field.searchable,
                    width: getFieldWidth(field.width),
                    type: type,
                    tpl: tpl,
                    toggled: field.toggled,
                    className,
                    static: true,
                    options: field.type === 'html' ? {html: true} : null
                    // toggled: true 
                }, field.amis, {name: field.name});
            }
        }
        if(columnItem){
            if(quickEditSchema){
                columnItem.quickEdit = quickEditSchema;
                columnItem.quickEditEnabledOn = "${is_system !== true}";
            }
            columnItem.id = `${options.objectName}_${field.name}_\${_index}`
            columns.push(columnItem);
        }
    };

    // columns.push(getOperation(fields));
    if(!options.isLookup && !options.isInputTable && !_.some(columns, { name: options.labelFieldName })){
        // 没有名称字段时显示序号字段为链接，lookup弹出的picker不需要此功能
        const href = Router.getObjectDetailPath({
            ...options,  formFactor: options.formFactor, appId: "${appId}", objectName: options.objectName || "${objectName}", recordId: `\${${options.idFieldName}}`
        })
        columns[0].type = "tpl";
        columns[0].tpl = `<a href="${href}">\${${columns[0].name}}</a>`
    }
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
    let maxLineCount = 3;
    let lineChildren = [];
    let isNewLine = false;
    let isLeft = true;
    let lineChildrenClassName = "";
    let lineClassName = "flex items-center justify-between";
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
                // 左侧全行样式可以单独写，如果需要配置两行省略号效果，可以加样式类 two-lines-truncate
                lineChildrenClassName = "steedos-listview-item-wide";
            }
            if(lines.length === 0){
                // 第一个字段加粗黑色显示
                lineChildrenClassName += " font-bold text-gray-800";
            }
        }
        else{
            // 右侧半行，这里加样式类 flex flex-shrink-0，是为了省略号只显示在左半行，右半行文字一般比较短，如果也加省略号效果的话，左侧文字多的话，右侧没几个字就显示省略号了
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
            options = Object.assign({}, options, {
                onlyDisplayLookLabel: true
            });
            tpl = await Tpl.getFieldTpl(field, options);
        }
        else if(field.type === 'avatar' || field.type === 'image' || field.type === 'file'){
            // 图片和附件类型字段暂时显示为附件名称，后续需要再优化
            tpl = `\${_display.${field.name}.name}`;
        }
        else{
            if(field.type === 'lookup' || field.type === 'master_detail'){
                options = Object.assign({}, options, {
                    onlyDisplayLookLabel: true
                });
            }
            tpl = await Tpl.getFieldTpl(field, options);
        }
        if(!tpl){
            //qhd需求简易处理，加上raw以支持审批王名称字段通过颜色区分缓急，若之后手机端列表支持配置amis，则可以去掉
            tpl = `\${${field.name} | raw}`;
        }
        if(!field.hidden && !field.extra){
            tpls.push({ field, tpl });
        }
    };

    const url = Tpl.getNameTplUrl(nameField, options)

    const columnLines = getMobileLines(tpls);


    let column = {
        name: nameField.name,
        label: nameField.label,
        sortable: nameField.sortable,
        type: "button",
        level: "link",
        actionType: "link",
        link: url,
        innerClassName: {
            "steedos-listview-item block text-gray-500":"true",
            "max-w-[360px]": "${display == 'split'}",
        },
        body: {
            "type": "wrapper",
            "body": columnLines,
            "size": "none",
            "className": "p-1"
        }
    }
    
    if(options.objectName === 'cms_files'){
        if(window.Meteor?.isCordova){
            column = {
                ...column,
                actionType: "",
                link: "",
                onEvent: {
                    "click": {
                        "actions": [
                            {
                                "script": `
                                    let cms_url = "/api/files/files/"+event.data.versions[0]+"?download=true"
                                    Steedos.cordovaDownload(encodeURI(Steedos.absoluteUrl(cms_url)), event.data.name);
                                `,
                                "actionType": "custom"
                            }
                        ],
                        "weight": 0
                    }
                }
            }
        }else{
            column = {
                ...column,
                actionType: "",
                link: "",
                onEvent: {
                    "click": {
                        "actions": [
                            {
                                "args": {
                                    "api": {
                                        "url": url,
                                        "method": "get",
                                        "headers": {
                                            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                        }
                                    }
                                },
                                "actionType": "download"
                            }
                        ],
                        "weight": 0
                    }
                }
            }
        }
        
    }

    columns.push(column);
    

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
            return `${visible}(objectName, typeof _id === 'undefined' ? null: _id, typeof record === 'undefined' ? (typeof recordPermissions === 'undefined' ? {} : recordPermissions) : record.recordPermissions, data)`
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
        label: "&nbsp;",
        fixed: 'right',
        labelClassName: 'text-center',
        className: 'text-center steedos-listview-operation w-10',
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
                    requestAdaptor: "api.data={}; return api;",
                    headers: {
                        Authorization: "Bearer ${context.tenantId},${context.authToken}"
                    },
                    adaptor: `
                        payload = {
                            record: {
                                recordPermissions: payload
                            }
                        };
                        return payload;
                    `,
                }
              }
        ]
    }
}

async function getDefaultCrudCard(columns, options) {
    let labelFieldName = options?.labelFieldName || "name";
    let titleColumn, bodyColumns = [];
    columns.forEach(function (item) {
        delete item.quickEdit;
        delete item.width;
        if (item.name === labelFieldName) {
            titleColumn = item;
        }
        else {
            if (item.name !== "_index") {
                bodyColumns.push(item);
            }
        }
    });
    let card = {
        "header": {
            "title": titleColumn.tpl
        },
        body: bodyColumns,
        // useCardLabel: false,
        toolbar: []
    };
    let hideToolbarOperation = options.formFactor === 'SMALL' || ["split"].indexOf(options.displayAs) > -1;
    if(!hideToolbarOperation){
        let toolbarOperation = await getTableOperation(options);
        if (toolbarOperation) {
            toolbarOperation.className += " inline-block w-auto";
        }
        card.toolbar.push(toolbarOperation);
    }
    return card;
}

export async function getTableSchema(fields, options){
    if(!options){
        options = {};
    }
    let { isLookup, hiddenColumnOperation } = options;
    const defaults = options.defaults;
    const listSchema = (defaults && defaults.listSchema) || {};

    let columns = [];
    let useMobileColumns = options.formFactor === 'SMALL' || ["split"].indexOf(options.displayAs) > -1;
    if(isLookup){
        // 在lookup手机端列表模式调式好之前不使用getMobileTableColumns
        useMobileColumns = false;
    }
    if(listSchema.mode && listSchema.mode !== "table"){
        // 如果指定的mode，则不走我们内置的手机端列表效果，使用steedos组件内部开发的默认card/list效果，或者由用户自己实现card/list模式的crud列表
        useMobileColumns = false;
    }
    if(useMobileColumns){
        columns = await getMobileTableColumns(fields, options);
    }
    else{
        columns = await getTableColumns(fields, options);

        if(listSchema.mode === "cards"){
            let card = listSchema.card;
            if(!card){
                card = await getDefaultCrudCard(columns, options);
            }
            return {
                mode: "cards",
                perPageAvailable: [5, 10, 20, 50, 100, 500],
                name: "thelist",
                headerToolbarClassName: "py-2 px-2 border-gray-300 border-solid border-b",
                className: "",
                draggable: false,
                defaultParams: getDefaultParams(options),
                card: card,
                syncLocation: false,
                keepItemSelectionOnPageChange: true,
                checkOnItemClick: isLookup ? true : false,
                labelTpl: `\${${options.labelFieldName}}`,
                autoFillHeight: false, // 自动高度效果不理想,先关闭
                columnsTogglable: false
            }
        }

        if(!isLookup && !hiddenColumnOperation){
            columns.push(await getTableOperation(options));
        }
    }

    return {
        mode: "table",
        perPageAvailable: [5, 10, 20, 50, 100, 500],
        name: "thelist",
        headerToolbarClassName: "py-2 px-2 border-gray-300 border-solid border-b",
        className: "",
        draggable: false,
        defaultParams: getDefaultParams(options),
        columns: columns,
        syncLocation: false,
        keepItemSelectionOnPageChange: true,
        checkOnItemClick: isLookup ? true : false,
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
        let __changedFilterFormValues = api.data.$self.__changedFilterFormValues || {};
        let __changedSearchBoxValues = api.data.$self.__changedSearchBoxValues || {};
        // 把表单搜索和快速搜索中的change事件中记录的过滤条件也拼到$self中，是为解决触发搜索请求时，两边输入的过滤条件都带上，即：
        // 有时在搜索表单中输入过滤条件事，忘记点击回车键或搜索按钮，而是进一步修改快速搜索框中的关键字点击其中回车键触发搜索
        // 这种情况下，触发的搜索请求中没有带上搜索表单中输入的过滤条件。
        // 反过来先在快速搜索框中输入过滤条件却不点击其中回车键触发搜索，而是到搜索表单中触发搜索请求也是一样的。
        // 这里直接合并到api.data.$self，而不是后面定义的selfData变量，是因为可以省去在接收适配器中写一样的合并逻辑
        // 如果有问题可以改为合并到selfData变量中，但是要在接收适配器中写上一样的合并逻辑，否则里面的过滤条件不会存入本地存储中
        Object.assign(api.data.$self, __changedSearchBoxValues, __changedFilterFormValues);
        // selfData 中的数据由 CRUD 控制. selfData中,只能获取到 CRUD 给定的data. 无法从数据链中获取数据.
        let selfData = JSON.parse(JSON.stringify(api.data.$self));
        // 保留一份初始data，以供自定义发送适配器中获取原始数据。
        const data = _.cloneDeep(api.data);
        try{
            // TODO: 不应该直接在这里取localStorage，应该从外面传入
            const listName = api.data.listName;
            const listViewPropsStoreKey = location.pathname + "/crud";
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
                    // api.data.pageNo = formFactor === "SMALL" ? 1 : (localListViewProps.page || 1);
                    // 移动端暂时去除加载更多，放开翻页
                    api.data.pageNo = localListViewProps.page || 1;
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
            const _filters = filtersFunction(systemFilters, api.data.$self);
            if(api.data.listName == "recent"){
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
        if(api.data.$self.additionalFilters){
            if(_.isString(api.data.$self.additionalFilters)){
                userFilters.push(eval(api.data.$self.additionalFilters))
            }else{
                userFilters.push(api.data.$self.additionalFilters)
            }
        }

        if(api.data.$self._isRelated){
            const self = api.data.$self;
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
        api.data._ids = _ids;
        api.data = {
            query: api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim())
        }
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
                    item[key] = value
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
        const getTreeOptions = SteedosUI.getTreeOptions
        payload.data.rows = getTreeOptions(records,{"valueField":"_id"});
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
    ${options.adaptor || ''}
    return payload;
    `;
    return api;
}

export async function getApi(object, recordId, fields, options){
    const data = await graphql.getFindQuery(object, recordId, fields, options);
    return {
        method: "post",
        url: graphql.getApi(), // + "&recordId=${recordId}"
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