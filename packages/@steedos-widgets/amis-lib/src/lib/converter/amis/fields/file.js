/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-28 14:15:09
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-02 18:06:16
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
                <% let fileData = data.${steedosField.name}; if (fileData) { %>
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
            url: `\${context.rootUrl}/s3/${tableName}`,
            data: {
                $: "$$",
                context: `\${context}`,
            },
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