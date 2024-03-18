import * as _ from 'lodash';
import { includes, trimEnd } from 'lodash';

export async function getFieldsTemplate(fields, display){
    let expandFields = [];
    if(display != false){
        display = true;
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
        if(field.name){
            //graphql 的  ui\display 中使用的字段需要先在query中查询. 否则会返回null
            if(field.expand){
                expandFields.push(field);
            }else{
                if(field.name.indexOf('.') < 0){
                    if(display && (field.type == 'lookup' || field.type == 'master_detail')){
                        fieldsName.push(`${field.name}`)
                        displayFields.push(`${field.name}`)
                    }else{
                        fieldsName.push( field.alias ? `${field.alias}:${field.name}` : field.name)
                    }
                    if(includes(['time','date','datetime','boolean','number','currency'], field.type)){
                        fieldsName.push(`${field.name}`)
                    }
                    if(includes(['percent','time','filesize','date','datetime','boolean','number','currency', 'select', 'file', 'image', 'avatar', 'formula', 'summary', 'object', 'grid'], field.type)){
                        displayFields.push(`${field.name}`)
                    }
                }else{
                    objectFieldName = field.name.split('.')[0];
                    fieldsName.push(objectFieldName);
                    displayFields.push(objectFieldName)
                }
            }
        }
    }

    displayFields = _.uniq(displayFields);
    fieldsName = _.uniq(fieldsName);
    let expandFieldsQuery = {};
    if(expandFields.length > 0){
        _.each(expandFields, function(field){
            expandFieldsQuery[field.expandInfo.fieldName] = {
                fields: [field.expandInfo.displayName]
            }
        })
    }

    return {
        fields: fieldsName,
        uiFields: displayFields,
        expandFields: expandFieldsQuery
    }
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
    let queryOptions = `(filters:["${object.idFieldName}", "=", "\${recordId}"])`;
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

export async function getFindQuery(object, recordId, fields, options){
    let limit = options.limit || 10;
    var treeFields = [];
    if(object.enable_tree && _.includes(_.keys(object.fields), 'parent') && _.includes(_.keys(object.fields), 'children')){
        treeFields = ["parent","children"];
    }

    var cfsFields = [];
    if(object.name === 'cms_files'){
        cfsFields = ["versions"]
    }

    const fieldsTemplate = await getFieldsTemplate(fields, options.expand);

    // sort和skip都是动态的，在发送适配器中额外处理
    return {
        orderBy: "${orderBy}",
        orderDir: "${orderDir}",
        pageNo: "${page}",
        pageSize: "${perPage}",
        
        fields: _.union(fieldsTemplate.fields, treeFields, cfsFields),
        uiFields: fieldsTemplate.uiFields,
        expandFields: fieldsTemplate.expandFields,
        filters: options.filters,
        top: limit,
        // skip: 0,
        // sort
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

export function getApi (objectName, isMobile){
    if(isMobile){
        //TODO 返回 绝对路径
    }else{
        return `\${context.rootUrl}/api/v1/${objectName}?reload=\${additionalFilters}`
    }
}