/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-28 14:15:09
 * @LastEditors: liaodaxue
 * @LastEditTime: 2023-10-30 17:51:54
 * @Description: 
 */
import { getAmisStaticFieldType } from './type';

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

export const getAmisFileReadonlySchema = (steedosField)=>{
    const type = steedosField.type;
    const amisFieldType = getAmisFieldType(steedosField, true)
    if(_.includes(['avatar','image'], type)){
        return {
            type: amisFieldType,
            defaultImage: '',
            enlargeAble: true,
            showToolbar: true,
        }
    }
    if(type === 'file'){
        return {
            type: amisFieldType,
            tpl: `
                <% let fileData = data._display.${steedosField.name}; if (fileData) { %>
                    <% if(!Array.isArray(fileData)){ fileData = [fileData]}  %>
                    <% fileData.forEach(function(item) { %> 
                        <a href='<%= item.url %>' target='_self' class='block'><%= item.name %></a> 
                <% });} %>`
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
                const { _master, global,context } = api.body;
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
                const { context } = api.body; 
                var rootUrl = context.rootUrl + "/api/files/${tableName}/";
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
    }
    return convertData;
}

export const getAmisFileSchema = (steedosField, readonly)=>{
    return readonly ? getAmisFileReadonlySchema(steedosField) : getAmisFileEditSchema(steedosField);
}