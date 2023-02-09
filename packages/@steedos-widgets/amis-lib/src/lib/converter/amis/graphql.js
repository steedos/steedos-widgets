import * as _ from 'lodash';
import { includes } from 'lodash';
import { getUISchema } from '../../objects';

export async function getFieldsTemplate(fields, expand){
    if(expand != false){
        expand = true;
    }
    let fieldsName = ['_id'];
    let displayFields = [];
    let fieldsArr = [];
    if(_.isArray(fields)){
        fieldsArr = fields;
    }else{
        fieldsArr = _.values(fields);
    }
    for (const field of fieldsArr) {
        //graphql 的  ui\display 中使用的字段需要先在query中查询. 否则会返回null
        if(field.name.indexOf('.') < 0){
            if(expand && (field.type == 'lookup' || field.type == 'master_detail')){
                fieldsName.push(`${field.name}`)
                displayFields.push(`${field.name}`)
            }else{
                fieldsName.push( field.alias ? `${field.alias}:${field.name}` : field.name)
            }
            if(includes(['time','date','datetime','boolean','number','currency'], field.type)){
                fieldsName.push(`${field.name}`)
            }
            if(includes(['time','filesize','date','datetime','boolean','number','currency', 'select', 'file', 'image', 'avatar', 'formula', 'summary', 'object', 'grid'], field.type)){
                displayFields.push(`${field.name}`)
            }
        }
    }

    displayFields = _.uniq(displayFields);
    fieldsName = _.uniq(fieldsName);

    if(displayFields.length > 0){
        return `${fieldsName.join(',')},_display:_ui{${displayFields.join(',')}}`;
    }
    return `${fieldsName.join(' ')}`
}

export function getRecordPermissionsTemplate(){
    return `
    recordPermissions: _permissions{
        allowCreate,
        allowCreateFiles,
        allowDelete,
        allowDeleteFiles,
        allowEdit,
        allowEditFiles,
        allowRead,
        allowReadFiles,
        disabled_actions,
        disabled_list_views,
        field_permissions,
        modifyAllFiles,
        modifyAllRecords,
        modifyAssignCompanysRecords,
        modifyCompanyRecords,
        uneditable_fields,
        unreadable_fields,
        unrelated_objects,
        viewAllFiles,
        viewAllRecords,
        viewAssignCompanysRecords,
        viewCompanyRecords,
      }
    `
}

export async function getFindOneQuery(object, recordId, fields, options){
    let queryOptions = "";
    
    if(recordId){
        queryOptions = `(filters:["${object.idFieldName}", "=", "${recordId}"])`;
    }
    let alias = "data";
    if(options){
        if(options.alias){
            alias = options.alias;
        }

        if(options.filters){
            queryOptions = `(filters:${options.filters})`;
        }
        if(options.queryOptions){
            queryOptions = `(${options.queryOptions})`;
        }
    }
    return {
        query: `{${alias}:${object.name}${queryOptions}{${await getFieldsTemplate(fields)}, ${getRecordPermissionsTemplate()}}}`
    }
}

export function getSaveQuery(object, recordId, fields, options){
    return {
        objectName: object.name,
        $: "$$",
        recordId: recordId,
        modalName: "${modalName}"
    }
}

/*
    readonly字段应该移除掉不提交到服务端。
*/
export function getScriptForReadonlyFields(fields){
    var scripts = [];
    fields.forEach((item)=>{
        if(item.readonly && item.name.indexOf(".") < 0){
            scripts.push(`delete formData.${item.name};`);
        }
    });
    return scripts.join("\r\n");
}

/*
    img/avatar字段值移除URL前缀使其保存时正常保存id,而不是url。
*/
export function getScriptForRemoveUrlPrefixForImgFields(fields){
    let imgFieldsKeys = [];
    let imgFields = {};
    fields.forEach((item)=>{
        if(includes(['image','avatar'], item.type)){
            imgFieldsKeys.push(item.name);
            imgFields[item.name] = {
                name: item.name,
                multiple: item.multiple
            };
        }
    })
    if(!imgFieldsKeys.length){
        return '';
    }
    return  `
        let imgFieldsKeys = ${JSON.stringify(imgFieldsKeys)};
        let imgFields = ${JSON.stringify(imgFields)};
        imgFieldsKeys.forEach((item)=>{
            let imgFieldValue = formData[item];
            if(imgFieldValue && imgFieldValue.length){
                // 因为表单初始化接口的接收适配器中为image字段值添加了url前缀（为了字段编辑时正常显示图片），所以保存时移除（为了字段值保存时正常保存id,而不是url）。
                if(imgFields[item].multiple){
                    if(imgFieldValue instanceof Array){
                        formData[item] = imgFieldValue.map((value)=>{ 
                            let itemValue = value?.split('/');
                            return itemValue[itemValue.length - 1];
                        });
                    }
                }else{
                    let imgValue = imgFieldValue.split('/');
                    formData[item] = imgValue[imgValue.length - 1];
                }
            }
        })
    `
}

/*
    file字段值重写使其保存时正常保存id。
*/
export function getScriptForSimplifiedValueForFileFields(fields){
    let fileFieldsKeys = [];
    let fileFields = {};
    fields.forEach((item)=>{
        if(item.type === 'file'){
            fileFieldsKeys.push(item.name);
            fileFields[item.name] = {
                name: item.name,
                multiple: item.multiple
            };
        }
    })
    if(!fileFieldsKeys.length){
        return '';
    }
    return  `
        let fileFieldsKeys = ${JSON.stringify(fileFieldsKeys)};
        let fileFields = ${JSON.stringify(fileFields)};
        fileFieldsKeys.forEach((item)=>{
            let fileFieldValue = formData[item];
            if(fileFieldValue){
                // 因为表单初始化接口的接收适配器中为file字段值重写了值及格式（为了字段编辑时正常显示附件名、点击附件名正常下载），所以保存时还原（为了字段值保存时正常保存id）。
                if(fileFields[item].multiple){
                    if(fileFieldValue instanceof Array && fileFieldValue.length){
                        formData[item] = fileFieldValue.map((value)=>{ 
                            if(typeof value === 'object'){
                                return value.value;
                            }else{
                                return value;
                            }
                        });
                    }
                }else{
                    formData[item] = typeof fileFieldValue === 'object' ? fileFieldValue.value : fileFieldValue;
                }
            }
        })
    `
}

export function getSaveDataTpl(fields){

    return `
        const formData = api.data.$;
        for (key in formData){
            // image、select等字段清空值后保存的空字符串转换为null。
            if(formData[key] === ''){
                formData[key] = null;
            }
        }
        const objectName = api.data.objectName;
        const fieldsName = Object.keys(formData);
        delete formData.created;
        delete formData.created_by;
        delete formData.modified;
        delete formData.modified_by;
        delete formData._display;
        ${getScriptForReadonlyFields(fields)}
        ${getScriptForRemoveUrlPrefixForImgFields(fields)}
        ${getScriptForSimplifiedValueForFileFields(fields)}
        let query = \`mutation{record: \${objectName}__insert(doc: {__saveData}){_id}}\`;
        if(formData.recordId && formData.recordId !='new'){
            query = \`mutation{record: \${objectName}__update(id: "\${formData._id}", doc: {__saveData}){_id}}\`;
        };
        delete formData._id;
        let __saveData = JSON.stringify(JSON.stringify(formData));
    `
}

export function getSaveRequestAdaptor(fields){
    return `
        ${getSaveDataTpl(fields)}
        api.data = {query: query.replace('{__saveData}', __saveData)};
        return api;
    `
}

export async function getFindQuery(object, recordId, fields, options){
    let limit = options.limit || 10;
    let queryOptions = `(top: ${limit})`;
    if(recordId){
        queryOptions = `(filters:["_id", "=", "${recordId}"], top: ${limit})`;
    }
    let alias = "data";
    if(options){
        if(options.alias){
            alias = options.alias;
        }

        if(options.filters){
            queryOptions = `(filters:${options.filters})`;
        }
        if(options.queryOptions){
            queryOptions = `(${options.queryOptions})`;
        }
    }
    var treeFields = '';
    if(object.enable_tree && _.includes(_.keys(object.fields), 'parent') && _.includes(_.keys(object.fields), 'children')){
        treeFields = ',parent,children';
    }

    var cfsFields = '';
    if(object.name === 'cms_files'){
        cfsFields = ',versions'
    }

    const countQuery = options.count === false ? "" : `,count:${object.name}__count(filters:{__filters})`;
    const moreQuerie = options.moreQueries?.length ? ("," + options.moreQueries.map(function(item){
        // 把最外层的{}去除
        return item.replace(/^{/,"").replace(/}$/,"");
    }).join(",")) : "";

    return {
        orderBy: "${orderBy}",
        orderDir: "${orderDir}",
        pageNo: "${page}",
        pageSize: "${perPage}",
        query: `{${alias}:${object.name}${queryOptions}{${await getFieldsTemplate(fields, options.expand)}${treeFields}${cfsFields}}${countQuery}${moreQuerie}}`
    }
}

export function getRecordPermissionsQuery(object, recordId, options){
    let queryOptions = "";

    if(recordId){
        queryOptions = `(filters:["${object.idFieldName}", "=", "${recordId}"])`;
    }
    let alias = "data";
    if(options){
        if(options.alias){
            alias = options.alias;
        }

        if(options.filters){
            queryOptions = `(filters:${options.filters})`;
        }
        if(options.queryOptions){
            queryOptions = `(${options.queryOptions})`;
        }
    }

    let recordPermissionsTemplate = getRecordPermissionsTemplate();
    if(options?.fields && options.fields.length){
        recordPermissionsTemplate = `
            recordPermissions: _permissions{
                ${options.fields.join(",")}
            }
        `;
    }
    return {
        query: `{${alias}:${object.name}${queryOptions}{${object.idFieldName},${recordPermissionsTemplate}}}`
    }
}

export function getApi (isMobile){
    if(isMobile){
        //TODO 返回 绝对路径
    }else{
        // return __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + "/graphql"
        return `\${context.rootUrl}/graphql`
    }
}