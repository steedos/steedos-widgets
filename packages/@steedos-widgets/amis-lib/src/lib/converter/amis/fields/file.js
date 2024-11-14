/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-28 14:15:09
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-11-14 10:50:01
 * @Description: 
 */
import { getAmisStaticFieldType } from './type';
import { getPage } from '../../../../lib/page';

const getFileTableName = (steedosField)=>{
    switch (steedosField.type ) {
        case 'avatar':
            return 'avatars'
        case 'image':
            return 'images'
        case 'file':
            return 'files'
        default:
            break;
    }
};

const getAmisFieldType = (steedosField, readonly)=>{
    return getAmisStaticFieldType(steedosField.type === 'avatar' ? 'image' : steedosField.type, readonly, {multiple: steedosField.multiple});
}

async function getLookupLinkOnClick(field, options) {
    const recordPage = await getPage({ type: 'record', appId: options.appId, objectName: options.objectName, formFactor: options.formFactor });

    const drawerRecordDetailSchema = recordPage ? Object.assign({}, recordPage.schema, {
        "recordId": field.type == "file" ? "${value}":`\${${field.name}}`,
        "data": {
            ...recordPage.schema.data,
            "_inDrawer": true,  // 用于判断是否在抽屉中
            "recordLoaded": false, // 重置数据加载状态
            "objectName": options.objectName,
        }
    }) : {
        "type": "steedos-record-detail",
        "objectApiName": options.objectName,
        "recordId": field.type == "file" ? "${value}":`\${${field.name}}`,
        "showBackButton": false,
        "showButtons": true,
        "data": {
            "_inDrawer": true,  // 用于判断是否在抽屉中
            "recordLoaded": false, // 重置数据加载状态
        }
    }
    return {
        "click": {
            "actions": [
                // {
                //     "type": "custom",
                //     "script": `
                //         let fileRecordId = url.match(${regFileRecordId})[2]; 
                //         console.log('fileRecordId:',fileRecordId);
                //         event.data.recordId = fileRecordId;
                //     `,
                // },
                {
                    "actionType": "drawer",
                    "drawer": {
                        "type": "drawer",
                        "title": "&nbsp;",
                        "headerClassName": "hidden",
                        "size": "lg",
                        "width": "70%",
                        "bodyClassName": "p-0 m-0 bg-gray-100",
                        "closeOnEsc": true,
                        "closeOnOutside": true,
                        "resizable": true,
                        "actions": [],
                        "body": [
                            drawerRecordDetailSchema
                        ],
                        "className": "steedos-record-detail-drawer app-popover"
                    },
                    "preventDefault": true
                }
            ]
        }
    }
}

export const  getAmisFileReadonlySchema = async (steedosField,ctx = {})=>{
    const type = steedosField.type;
    const { appId, formFactor } = ctx.amisData || {};
    const amisFieldType = getAmisFieldType(steedosField, true)
    
    let lookupATagClick = 'onclick="return false;"';

    if(window.innerWidth < 768){
        lookupATagClick = ""
    }

    if(_.includes(['avatar','image'], type)){
        return {
            type: amisFieldType,
            defaultImage: '',
            enlargeAble: true,
            showToolbar: true,
        }
    }
    if(type === 'file'){
        return window.Meteor?.isCordova ? {
            "type": "control",
            "body": steedosField.multiple ? {
                "type": "each",
                "name": "_display." + steedosField.name,
                "items": {
                    "type": "tpl",
                    "tpl": "${name}",
                    "className": "antd-Button--link inline-block mr-2",
                    "onEvent": {
                        "click": {
                            "actions": [
                                {
                                    "script": `
                                        Steedos.cordovaDownload(encodeURI(event.data.url), event.data.name);
                                    `,
                                    "actionType": "custom"
                                }
                            ],
                            "weight": 0
                        }
                    }
                }
            } : {
                "type": "tpl",
                "tpl": "${_display." + steedosField.name + ".name}",
                "className": "antd-Button--link inline-block",
                "onEvent": {
                    "click": {
                        "actions": [
                            {
                                "script": `
                                    const data = event.data._display.${steedosField.name};
                                    Steedos.cordovaDownload(encodeURI(data.url), data.name);
                                `,
                                "actionType": "custom"
                            }
                        ],
                        "weight": 0
                    }
                }
            }
        } : {
            // type: amisFieldType,
            // tpl: `
            //     <% let fileData = data._display.${steedosField.name}; if (fileData) { %>
            //         <% if(!Array.isArray(fileData)){ fileData = [fileData]}  %>
            //         <% fileData.forEach(function(item) { %> 
            //             <a href='<%= item.url %>' target='_self' class='block'><%= item.name %></a> 
            //     <% });} %>`
            "type": "control",
            "name": "",//control若存在name，内部each组件的source则会获取不到内容
            "body": {
                type: 'each',
                placeholder: "",
                className: steedosField.multiple ? `flex flex-col` : '',
                source: `\${_display.${steedosField.name}|asArray}`,
                items: {
                    type: 'static',
                    labelClassName: "hidden",
                    label: false,
                    className: 'm-0',
                    tpl: `<a href="/app/-/cfs_files_filerecord/view/\${value}" ${lookupATagClick}>\${name}</a>`,
                    // tpl: "<%= item.name >",
                    // onEvent: window.innerWidth < 768 ? null : REFERENCE_VALUE_ITEM_ONCLICK
                    onEvent: window.innerWidth < 768 ? null : await getLookupLinkOnClick(steedosField, {
                        appId,
                        objectName: "cfs_files_filerecord",
                        formFactor
                    })
                }
            }
        }
    }
}

export const getAmisFileEditSchema = (steedosField)=>{
    const tableName = getFileTableName(steedosField);
    const amisFieldType = getAmisFieldType(steedosField, false)
    let convertData = {
        type: amisFieldType,
        useChunk: false, // 关闭分块上传
        receiver: {
            method: "post",
            dataType: "form-data",
            url: `\${context.rootUrl}/s3/${tableName}`,
            requestAdaptor: `
                const superData = (typeof context != 'undefined') ? context : api.body; 
                const { _master, global } = superData;
                // const { recordId, objectName } = _master;
                const { spaceId, userId, user } = global;
                /*
                    record_id: recordId,
                    parent: recordId,
                    object_name: objectName,
                    owner_name: user.name,
                    space: spaceId,
                    owner: userId
                */
                // 参考platform 2.2版本，附件字段保存时cfs.files.filerecord、cfs.images.filerecord表中的metadata下只保存space、owner两个属性值。
                api.data.append('space', spaceId);
                api.data.append('owner', userId);

                return api;
            `,
            adaptor: `
                const superData = (typeof context != 'undefined') ? context : api.body; 
                const { context:pageContext } = superData; 
                var rootUrl = pageContext.rootUrl + "/api/files/${tableName}/";
                payload = {
                    status: response.status == 200 ? 0 : response.status,
                    msg: response.statusText,
                    data: {
                        value: payload._id,
                        name: payload.original.name,
                        url: rootUrl + payload._id,
                    }
                }
                return payload;
            `,
            headers: {
                Authorization: "Bearer ${context.tenantId},${context.authToken}"
            }
        }
    }
    if(steedosField.multiple){
        convertData.multiple = true;
        convertData.joinValues = false;
        convertData.extractValue = true;
        if(steedosField.type === 'image'){
            if(Steedos.isCordova() && Steedos.isCordova()){
                convertData.accept = "";
            }
        }
    }
    return convertData;
}

export const getAmisFileSchema = async (steedosField, readonly, ctx)=>{
    return readonly ? await getAmisFileReadonlySchema(steedosField,ctx) : getAmisFileEditSchema(steedosField);
}