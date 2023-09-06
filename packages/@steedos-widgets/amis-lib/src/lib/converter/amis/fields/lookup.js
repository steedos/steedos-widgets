import { getUISchema } from '../../../objects';
import * as _ from 'lodash'
import * as graphql from '../graphql'
import * as Tpl from '../tpl';
import * as Field from './index';
import * as Table from './table';
import * as List from './list';
import { getSelectUserSchema } from './user';
import { getObjectHeaderToolbar, getObjectFooterToolbar, getObjectFilter } from './../toolbar';
import { getListViewSort } from './../../../objects';
import { lookupToAmisTreeSelect } from './tree_select';
import * as standardNew from '../../../../schema/standard_new.amis'
import { i18next } from "../../../../i18n";

export const getReferenceTo = async (field)=>{
    let referenceTo = field.reference_to;
    if(!referenceTo){
        return ;
    }

    if(referenceTo === 'users'){
        referenceTo = 'space_users';
        field.reference_to_field = 'user'
    }

    const refObjectConfig = await getUISchema(referenceTo)

    // 如果lookup 引用的对象未定义
    if (!refObjectConfig)
        return null;

    let valueField = null;
    let valueFieldName = field.reference_to_field;
    if(!valueFieldName){
        valueFieldName = refObjectConfig.idFieldName || '_id';
    }
    if(valueFieldName === '_id'){
        valueField = {name: '_id', label: 'ID', type: 'text', toggled: false};
    }else{
        valueField = refObjectConfig.fields[valueFieldName] || {name: valueFieldName};
    }
    return {
        objectName: referenceTo,
        valueField: valueField,
        labelField: refObjectConfig.fields[refObjectConfig.NAME_FIELD_KEY || 'name'],
        NAME_FIELD_KEY: refObjectConfig.NAME_FIELD_KEY || 'name'
    }
}

export function getLookupSapceUserTreeSchema(isMobile){
    const treeSchema = {
        "type": "input-tree",
        "className":"steedos-select-user-tree",
        "inputClassName": "p-0",
        "source": {
          "method": "post",
          "url": "${context.rootUrl}/graphql",
          "headers": {
            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
          },
          "adaptor": "if (payload.data.treeCache == true) {\n                return payload;\n        }\n        const records = payload.data.options;\n        const treeRecords = [];\n        const getChildren = (records, childrenIds) => {\n                if (!childrenIds) {\n                        return;\n                }\n                const children = _.filter(records, (record) => {\n                        return _.includes(childrenIds, record.value)\n                });\n                _.each(children, (item) => {\n                        if (item.children) {\n                                item.children = getChildren(records, item.children)\n                        }\n                })\n                return children;\n        }\n\n        const getRoot = (records) => {\n                for (var i = 0; i < records.length; i++){\n                        records[i].noParent = 0;\n                        if (!!records[i].parent) {\n                                biaozhi = 1\n                                for (var j = 0; j < records.length; j++){\n                                        if (records[i].parent == records[j].value)\n                                                biaozhi = 0;\n                                }\n                                if (biaozhi == 1) records[i].noParent = 1;\n                        } else records[i].noParent = 1;\n                }\n        }\n        getRoot(records);\n        console.log(records)\n\n        _.each(records, (record) => {\n                if (record.noParent ==1) {\n                        treeRecords.push(Object.assign({}, record, { children: getChildren(records, record.children) }));\n                }\n        });\n        console.log(treeRecords)\n\n        payload.data.options = treeRecords;\n       payload.data.treeCache = true;\n       return payload;\n    ",
          "requestAdaptor": "\n    ",
          "data": {
            "query": "{options:organizations(filters:[\"hidden\", \"!=\", true],sort:\"sort_no desc\"){value:_id label:name,parent,children}}"
          },
          "messages": {
          },
          "cache": 300000
        },
        "onEvent": {
          "change": {
            "actions": [
              {
                "actionType": "custom",
                "script": `
                const scope = event.context.scoped;
                var filterFormValues={
                    "__searchable__organizations_parents":event.data.value.value
                }
                var listView = scope.parent.getComponents().find(function(n){
                  return n.props.type === "crud";
                });
                listView.handleFilterSubmit(Object.assign({}, filterFormValues));
              `
              },
              {
                "actionType": "custom",
                "script": " if(window.innerWidth < 768){ document.querySelector('.steedos-select-user-sidebar').classList.remove('steedos-select-user-sidebar-open'); }"
              }
            ]
          }
        },
        "label": "",
        "name": "organizations",
        "multiple": false,
        "joinValues": false,
        "clearValueOnHidden": false,
        "fieldName": "organizations",
        "hideRoot": true,
        "initiallyOpen": false,
        "extractValue": true,
        "onlyChildren": true,
        "treeContainerClassName": "no-border",
        "showIcon": false,
        "enableNodePath": false,
        "autoCheckChildren": false,
        "searchable": true,
        "searchConfig": {
          "sticky": true,
          "placeholder": "查找部门"
        },
        "unfoldedLevel": 2,
        "originPosition": "left-top"
    }
    const tree = []
    if(isMobile){
        tree.push({
            type: "action",
            body:[
                {
                    type: "action",
                    body:[
                        treeSchema
                    ],
                    className:"h-full w-[240px]"
                }
            ],
            className: "absolute inset-0 steedos-select-user-sidebar",
            "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "custom",
                      "script": "document.querySelector('.steedos-select-user-sidebar').classList.remove('steedos-select-user-sidebar-open')"
                    }
                  ]
                }
            },
            id: "steedos_crud_toolbar_select_user_tree"
        })
        tree.push({
            "type": "button",
            "label": "组织",
            "icon": "fa fa-sitemap",
            "className": "bg-white p-2 rounded border-gray-300 text-gray-500",
            "align": "left",
            "onEvent": {
              "click": {
                "actions": [
                  {
                    "actionType": "custom",
                    "script": "document.querySelector('.steedos-select-user-sidebar').classList.toggle('steedos-select-user-sidebar-open')"
                  }
                ]
              }
            },
            "id": "steedos_crud_toolbar_organization_button"
        })
    }else{
        tree.push(treeSchema)
    }
    
    return tree;
}

export async function lookupToAmisPicker(field, readonly, ctx){
    let referenceTo = await getReferenceTo(field);
    if(!referenceTo){
        return ;
    }
    const refObjectConfig = await getUISchema(referenceTo.objectName);

    ctx.idFieldName = refObjectConfig.idFieldName
    ctx.objectName = refObjectConfig.name

    let tableFields = [];
    const searchableFields = [];

    let fieldsArr = [];
    
    const isMobile = window.innerWidth < 768;

    const listNameAll = "all";
    const listNameLookup = "lookup";
    let listViewAll, listViewLookup;

    _.each(
        refObjectConfig.list_views,
        (view, name) => {
            if(name === listNameAll){
                listViewAll = view;
            }
            else if(name === listNameLookup){
                listViewLookup = view;
            }
        }
    );
    let listView = listViewLookup || listViewAll;
    let listName = listView && listView.name;
    if (listView && listView.columns) {
        _.each(listView.columns, function (column) {
            if (_.isString(column) && refObjectConfig.fields[column]) {
                fieldsArr.push(refObjectConfig.fields[column]);
            } else if (_.isObject(column) && refObjectConfig.fields[column.field]) {
                fieldsArr.push(
                    Object.assign({}, refObjectConfig.fields[column.field], {
                        width: column.width,
                        wrap: column.wrap,
                    })
                );
            }
        });
    }else{
        _.each(refObjectConfig.fields, (field, field_name)=>{
            if(field_name != '_id' && !field.hidden){
                if(!_.has(field, "name")){
                    field.name = field_name
                }
                fieldsArr.push(field)
            }
        });
        // 没有视图权限时，取对象上前5个字段，按sort_no排序
        fieldsArr = _.sortBy(fieldsArr, "sort_no").slice(0,5);
    }

    _.each(fieldsArr,function(field){
        if(!_.find(tableFields, function(f){
            return f.name === field.name
        })){
            tableFields.push(field)
        }
    });

    _.each(refObjectConfig.fields, function (field) {
      if(Field.isFieldQuickSearchable(field, refObjectConfig.NAME_FIELD_KEY)){
          searchableFields.push(field.name);
      }
    });

    const fields = {
        [referenceTo.labelField.name]: referenceTo.labelField,
        [referenceTo.valueField.name]: referenceTo.valueField
    };

    _.each(tableFields, (tableField)=>{
        if(!tableField.hidden){
            fields[tableField.name] = tableField;
        }
    });

    let sort = "";
    if(listView){
        sort = getListViewSort(listView);
    }

    const source = await getApi(refObjectConfig, null, fields, {expand: true, alias: 'rows', queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"`});
    
    if(source.url && !ctx.inFilterForm){
        const depend_on = [];
        const sendOn = [];
        _.each(field.depend_on, (fName)=>{
            depend_on.push(`depend_on_${fName}=\${${fName}}`)
            sendOn.push(`this.${fName}`)
        })
        if(depend_on.length > 0){
            source.url = `${source.url}?${depend_on.join('&')}`;
            source.sendOn = `${sendOn.join(' && ')}`
        }
    }
    
    source.data.$term = "$term";
    source.data.$self = "$$";

    let keywordsSearchBoxName = `__keywords_lookup__${field.name}__to__${refObjectConfig.name}`;
    
    source.requestAdaptor = `
        const selfData = JSON.parse(JSON.stringify(api.data.$self));
        var filters = [];
        var pageSize = api.data.pageSize || 10;
        var pageNo = api.data.pageNo || 1;
        var skip = (pageNo - 1) * pageSize;
        var orderBy = api.data.orderBy || '';
        var orderDir = api.data.orderDir || '';
        var sort = orderBy + ' ' + orderDir;
        sort = orderBy ? sort : "${sort}";
        var allowSearchFields = ${JSON.stringify(searchableFields)};
        let fieldValue;
        if(api.data.$term){
            filters = [["name", "contains", "'+ api.data.$term +'"]];
        }else if(selfData.op === 'loadOptions' && selfData.value){
            if(selfData.value && selfData.value.indexOf(',') > 0){
                fieldValue = selfData.value.split(',');
                filters = [["${referenceTo.valueField.name}", "=", fieldValue]];
            }else{
                fieldValue = selfData.value;
                filters = [["${referenceTo.valueField.name}", "=", fieldValue]];
            }
        }

        var searchableFilter = SteedosUI.getSearchFilter(selfData) || [];

        if(searchableFilter.length > 0){
            if(filters.length > 0 ){
                filters = [filters, 'and', searchableFilter];
            }else{
                filters = searchableFilter;
            }
        }

        if(${referenceTo?.objectName === "space_users"} && ${field.reference_to_field === "user"}){
            if(filters.length > 0){
                filters = [ ["user_accepted", "=", true], "and", filters ]
            }else{
                filters = [["user_accepted", "=", true]];
            }
        }

        if(allowSearchFields){
            allowSearchFields.forEach(function(key){
                const keyValue = selfData[key];
                if(_.isString(keyValue)){
                    filters.push([key, "contains", keyValue]);
                }else if(_.isArray(keyValue) || _.isBoolean(keyValue) || keyValue){
                    filters.push([key, "=", keyValue]);
                }
            })
        }

        var keywordsFilters = SteedosUI.getKeywordsSearchFilter(selfData.${keywordsSearchBoxName}, allowSearchFields);
        if(keywordsFilters && keywordsFilters.length > 0){
            filters.push(keywordsFilters);
        }

        var fieldFilters = ${JSON.stringify(field.filters)};
        if(fieldFilters && fieldFilters.length){
            filters.push(fieldFilters);
        }
        
        const inFilterForm = ${ctx.inFilterForm};
        const filtersFunction = ${field.filtersFunction || field._filtersFunction};

        if(filtersFunction && !inFilterForm){
            const _filters = filtersFunction(filters, api.data.$self.__super.__super);
            if(_filters && _filters.length > 0){
                filters.push(_filters);
            }
        }

        const enable_tree = ${refObjectConfig.enable_tree};
        if(enable_tree){
            pageSize = 10000;
        }
        if(fieldValue && _.isArray(fieldValue) && fieldValue.length > pageSize){
            pageSize = fieldValue.length;
        }
        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim());
        return api;
    `
    source.adaptor = `
    const enable_tree = ${refObjectConfig.enable_tree};
    const op = api.data.$self.op;
    if(!_.isEmpty(op)){
        // op不为空，表示处于字段初始编辑状态，不是点击后出现弹窗状态。
        const rows = _.map(payload.data.rows, (item)=>{
            return _.pick(item, ["${referenceTo.labelField.name}", "${referenceTo.valueField.name}"]);
        })
        payload.data.rows = rows;
        return payload;
    }
    if(enable_tree){
        const records = payload.data.rows;
        const treeRecords = [];

        const getParentIds = (records)=>{
            const ids = _.map(records, (item)=>{
                return item._id;
            });
            const parents = _.filter(records,(record)=>{
                return !record.parent || !_.includes(ids,record.parent);
            })
            const parentsIds = _.map(parents,(item)=>{
                return item._id;
            })
            return parentsIds;
        }
        const getChildren = (records, childrenIds)=>{
            if(!childrenIds){
                return;
            }
            const children = _.filter(records, (record)=>{
                return _.includes(childrenIds, record._id)
            });
            _.each(children, (item)=>{
                if(item.children){
                    item.children = getChildren(records, item.children)
                }
            })
            return children;
        }

        const parentIds = getParentIds(records);
        _.each(records, (record)=>{
            if(!record.parent || _.includes(parentIds, record._id)){
                treeRecords.push(Object.assign({}, record, {children: getChildren(records, record.children)}));
            }
        });
        payload.data.rows = treeRecords;
    }
    return payload;
    `;
    if(field.optionsFunction || field._optionsFunction){
        source.adaptor = `
        payload.data.rows = eval(${field.optionsFunction || field._optionsFunction})(api.data.$self);
        return payload;
        `
    }
    let top = 20;

    if(refObjectConfig.paging && refObjectConfig.paging.enabled === false){
        top = 1000;
    };


    let pickerSchema = null;
    if(false){
    // if(ctx.formFactor === 'SMALL'){
        pickerSchema = await List.getListSchema(tableFields, {
            top:  top,
            ...ctx,
            actions: false
        })
    }else{
        pickerSchema = await Table.getTableSchema(tableFields, {
            labelFieldName: refObjectConfig.NAME_FIELD_KEY,
            top:  top,
            isLookup: true,
            ...ctx
        })

        pickerSchema.affixHeader = false;

        var headerToolbarItems = [];
        if(referenceTo.objectName === "space_users" && field.reference_to_field === "user"){
            headerToolbarItems = getLookupSapceUserTreeSchema(isMobile);
            pickerSchema.className = pickerSchema.className || "" + " steedos-select-user";
        }

        pickerSchema.headerToolbar = getObjectHeaderToolbar(refObjectConfig, fieldsArr, ctx.formFactor, { headerToolbarItems, isLookup: true, keywordsSearchBoxName });
        const isAllowCreate = refObjectConfig.permissions.allowCreate;
        if (isAllowCreate) {
            const new_button = await standardNew.getSchema(refObjectConfig, { appId: ctx.appId, objectName: refObjectConfig.name, formFactor: ctx.formFactor });
            new_button.align = "right";
            // 保持快速搜索放在最左侧，新建按钮往里插，而不是push到最后
            pickerSchema.headerToolbar.splice(pickerSchema.headerToolbar.length - 1, 0, new_button);
        }
        pickerSchema.footerToolbar = refObjectConfig.enable_tree ? [] : getObjectFooterToolbar();
        if (ctx.filterVisible !== false) {
            pickerSchema.filter = await getObjectFilter(refObjectConfig, fields, {
                ...ctx,
                isLookup: true,
                keywordsSearchBoxName
            });
        }
        pickerSchema.data = Object.assign({}, pickerSchema.data, {
            "&": "$$",
            "objectName": refObjectConfig.name,
            "uiSchema": refObjectConfig,
            "listName": listName,// 需要按视图取可搜索项
            "isLookup": true
        });

        if(!pickerSchema.onEvent){
            pickerSchema.onEvent = {}
        }

        pickerSchema.onEvent[`@data.changed.${refObjectConfig.name}`] = {
            "actions": [
              {
                "actionType": "reload"
              },
              {
                "actionType": "custom",
                "script": `
                    const masterRecord = event.data._master && event.data._master.record;
                    const fieldConfig = ${JSON.stringify(field)};
                    let reference_to = fieldConfig.reference_to;
                    let saveValue;
                    const newRecord = {
                        _id: event.data.result.data.recordId,
                        ...event.data.__super.__super
                    }
                    const saveField = fieldConfig.reference_to_field || '_id';
                    const saveFieldValue = newRecord[saveField];

                    if( fieldConfig._reference_to && (_.isArray(fieldConfig._reference_to) || _.isFunction(fieldConfig._reference_to) || fieldConfig._reference_to.startsWith('function') ) ){
                        
                        const fieldValue = masterRecord ? masterRecord[fieldConfig.name] : {o: reference_to, ids: []};
                        const baseSaveValue = {
                            o: reference_to,
                            ids: [saveFieldValue]
                        };
                        if(fieldValue && fieldValue.o){
                            if(fieldValue.o === reference_to){
                                saveValue = fieldConfig.multiple ? { o: reference_to, ids: fieldValue.ids.concat(saveFieldValue)} : baseSaveValue;
                            }else{
                                saveValue = baseSaveValue;
                            }
                        }else{
                            saveValue = baseSaveValue;
                        }

                    }else{
                        if(fieldConfig.multiple){
                            // TODO: 连续新建多个记录时，因为获取的主记录不是实时的，所以只会勾选最后一个新建的记录。
                            const fieldValue = (masterRecord && masterRecord[fieldConfig.name]) || [];
                            saveValue = fieldValue.concat(saveFieldValue);
                        }else{
                            saveValue = saveFieldValue;
                        }
                    }
                    
                    const ctx = ${JSON.stringify(ctx)};
                    const componentId = ctx.defaults.formSchema.id;
                    doAction({
                        actionType: 'setValue',
                        componentId: componentId, 
                        args: {
                            value: { [fieldConfig.name]: saveValue  }
                        }
                    });
                `
              }
            ]
          }
    }

    if(field.pickerSchema){
        pickerSchema = Object.assign({}, pickerSchema, field.pickerSchema)
    }

    if(referenceTo.objectName === "space_users" && field.reference_to_field === "user" && isMobile){
        //手机端选人控件只保留部分toolbar
        pickerSchema.headerToolbar = pickerSchema.headerToolbar && pickerSchema.headerToolbar.filter(function(item){
            if(["steedos_crud_toolbar_quick_search","steedos_crud_toolbar_filter","steedos_crud_toolbar_select_user_tree","steedos_crud_toolbar_organization_button"].indexOf(item.id) > -1){
                return true;
            }else{
                return false;
            }
        })
        pickerSchema.footerToolbar = ["pagination"]
    }

    const data = {
        type: Field.getAmisStaticFieldType('picker', readonly),
        modalTitle:  i18next.t('frontend_form_please_select') + " " + refObjectConfig.label,
        labelField: referenceTo.labelField.name,
        valueField: referenceTo.valueField.name,
        // disabledOn: this._master目的是相关表新建时禁止编辑关联字段； this.relatedKey目的是相关表编辑时禁止编辑关联字段，多选字段可以编辑。
        disabledOn:  `${readonly} || ( (this._master && (this._master.relatedKey ==='${field.name}')) || ((this.relatedKey ==='${field.name}') && (${field.multiple} != true)) )`,
        modalMode: 'dialog', //TODO 设置 dialog 或者 drawer，用来配置弹出方式
        source: source,
        size: "lg",
        pickerSchema: pickerSchema,
        joinValues: false,
        extractValue: true
    }
    if(field.multiple){
        data.multiple = true
        data.extractValue = true
    }

    if(readonly){
        data.tpl = await Tpl.getLookupTpl(field, ctx)
    }
    return data;
}

export async function lookupToAmisSelect(field, readonly, ctx){
    let referenceTo = await getReferenceTo(field);
    const valueFieldKey = referenceTo && referenceTo.valueField?.name || '_id' ;
    // const labelFieldKey = referenceTo && referenceTo.labelField?.name || 'name';

    let apiInfo;

    if(referenceTo){
        // 字段值单独走一个请求合并到source的同一个GraphQL接口中
        const defaultValueOptionsQueryData = await graphql.getFindQuery({ name: referenceTo.objectName }, null, [
            Object.assign({}, referenceTo.labelField, {alias: 'label'}),
            Object.assign({}, referenceTo.valueField, {alias: 'value'})
        ], {
            alias: "defaultValueOptions",
            filters: "{__options_filters}",
            count: false
        });
        apiInfo = await getApi({
            name: referenceTo.objectName
        }, null, [
            Object.assign({}, referenceTo.labelField, {alias: 'label'}),
            Object.assign({}, referenceTo.valueField, {alias: 'value'})
        ], {expand: false, alias: 'options', queryOptions: `filters: {__filters}, top: {__top}, sort: "{__sort}"`, moreQueries: [defaultValueOptionsQueryData.query]});

        apiInfo.adaptor = `
            const data = payload.data;
            var defaultValueOptions = data.defaultValueOptions;
            // 字段值下拉选项合并到options中
            data.options = _.unionWith(defaultValueOptions, data.options, function(a,b){
                return a["value"]=== b["value"];
            });
            delete data.defaultValueOptions;
            payload.data.options = data.options;
            return payload;
        `;
    }else{
        apiInfo = {
            method: "post",
            url: graphql.getApi(),
            data: {query: '{objects(filters: ["_id", "=", "-1"]){_id}}', $: "$$"},
            "headers": {
                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
            }
        }
    }

    const refObjectConfig = referenceTo && await getUISchema(referenceTo.objectName);
    const listNameAll = "all";
    const listNameLookup = "lookup";
    let listViewAll, listViewLookup;

    _.each(
        refObjectConfig.list_views,
        (view, name) => {
            if(name === listNameAll){
                listViewAll = view;
            }
            else if(name === listNameLookup){
                listViewLookup = view;
            }
        }
    );
    let listView = listViewLookup || listViewAll;

    let sort = "";
    if(listView){
        sort = getListViewSort(listView);
    }

    // 列表视图搜索栏中，即inFilterForm=true时，不需要执行depend_on
    if(apiInfo.url && !ctx.inFilterForm){
        const depend_on = [];
        const sendOn = [];
        _.each(field.depend_on, (fName)=>{
            depend_on.push(`depend_on_${fName}=\${${fName}}`)
            sendOn.push(`this.${fName}`)
        })
        if(depend_on.length > 0){
            apiInfo.url = `${apiInfo.url}?${depend_on.join('&')}`;
            apiInfo.sendOn = `${sendOn.join(' && ')}`
        }
    }
    
    apiInfo.data.$term = "$term";
    // apiInfo.data.$value = `$${field.name}.${referenceTo ? referenceTo.valueField.name : '_id'}`;
    apiInfo.data.$value = ctx.isRefToMutiple ? `$${field.name}.ids` : `$${field.name}`;
    _.each(field.depend_on, function(fName){
        apiInfo.data[fName] = `$${fName}`;
    })
    apiInfo.data['$'] = `$$`;
    apiInfo.data['rfield'] = `\${object_name}`;
    // [["_id", "=", "$${field.name}._id"],"or",["name", "contains", "$term"]]
    apiInfo.requestAdaptor = `
        var filters = [];
        var top = 10;
        if(api.data.$term){
            filters = [["${referenceTo?.NAME_FIELD_KEY || 'name'}", "contains", api.data.$term]];
        }
        // else if(api.data.$value){
        //     filters = [["_id", "=", api.data.$value]];
        // }

        var fieldFilters = ${JSON.stringify(field.filters)};
        if(fieldFilters && fieldFilters.length){
            filters.push(fieldFilters);
        }

        if(${referenceTo?.objectName === "space_users"} && ${field.reference_to_field === "user"}){
            if(filters.length > 0){
                filters = [ ["user_accepted", "=", true], "and", filters ]
            }else{
                filters = [["user_accepted", "=", true]];
            }
        }

        const inFilterForm = ${ctx.inFilterForm};
        const filtersFunction = ${field.filtersFunction || field._filtersFunction};

        if(filtersFunction && !inFilterForm){
            const _filters = filtersFunction(filters, api.data.$);
            if(_filters && _filters.length > 0){
                filters.push(_filters);
            }
        }
        var sort = "${sort}";
        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', top).replace('{__sort}', sort.trim());

        var defaultValue = api.data.$value;
        var optionsFiltersOp = "${field.multiple ? "in" : "="}";
        var optionsFilters = [["${valueFieldKey}", optionsFiltersOp, []]];
        if (defaultValue && !api.data.$term) { 
            // 字段值单独请求，没值的时候在请求中返回空
            optionsFilters = [["${valueFieldKey}", optionsFiltersOp, defaultValue]];
            if(filters.length > 0){
                optionsFilters = [filters, optionsFilters];
            }
        }
        api.data.query = api.data.query.replace(/{__options_filters}/g, JSON.stringify(optionsFilters));
        return api;
    `
    let labelField = referenceTo ? referenceTo.labelField.name : '';
    let valueField = referenceTo ? referenceTo.valueField.name : '';
    if(field.optionsFunction || field._optionsFunction){
        apiInfo.adaptor = `
        var options = eval(${field.optionsFunction || field._optionsFunction})(api.data.$);
        if(api.data.$term){
            options = _.filter(options, function(o) {
                var label = o.label;
                return label.toLowerCase().indexOf(api.data.$term.toLowerCase()) > -1;
            });
        }
        payload.data.options = options;
        return payload;
        `
        labelField = 'label';
        valueField = 'value';
    }else if(field.options){
        apiInfo.adaptor = `
        var options = ${JSON.stringify(field.options)}
        if(api.data.$term){
            options = _.filter(options, function(o) {
                var label = o.label;
                return label.toLowerCase().indexOf(api.data.$term.toLowerCase()) > -1;
            });
        }
        payload.data.options = options;
        return payload;
        `
        labelField = 'label';
        valueField = 'value';
    }

    const data = {
        type: Field.getAmisStaticFieldType('select', readonly),
        joinValues: false,
        extractValue: true,
        clearable: true,
        // disabledOn: this._master目的是相关表新建时禁止编辑关联字段； this.relatedKey目的是相关表编辑时禁止编辑关联字段，多选字段可以编辑。
        disabledOn:  `${readonly} || ( (this._master && (this._master.relatedKey ==='${field.name}')) || ((this.relatedKey ==='${field.name}') && (${field.multiple} != true)) )`,
        // labelField: labelField,
        // valueField: valueField,
        source: apiInfo,
        autoComplete: apiInfo,
        searchable: true,
    }
    //删除xlink:href中的rootUrl前缀，解决客户端svg为空的问题
    const select_menuTpl = `<span class='flex items-center mt-0.5'>
        <span role='img' aria-label='smile' class='anticon anticon-smile'>
            <span class='slds-icon_container slds-icon-standard-\${REPLACE(icon,'_','-')}'>
                <svg class='slds-icon slds-icon_x-small' aria-hidden='true'>
                    <use xlink:href='/assets/icons/standard-sprite/svg/symbols.svg#\${icon}'></use>
                </svg>
            </span> 
        </span>
        <span class='pl-1.5'>\${label}</span>
    </span>`
    data.menuTpl = "${icon ? `"+select_menuTpl+"` : label}"
    if(field.multiple){
        data.multiple = true
        data.extractValue = true
    }

    if(readonly){
        data.tpl = await Tpl.getLookupTpl(field, ctx)
    }
    return data;
}

async function getApi(object, recordId, fields, options){
    const data = await graphql.getFindQuery(object, recordId, fields, options);
    return {
        method: "post",
        url: graphql.getApi(),
        data: data,
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    }
}

export async function lookupToAmis(field, readonly, ctx){
    if(!ctx){
        ctx = {};
    }
    // console.log(`lookupToAmis====`, field, readonly, ctx)
    if(readonly){
        return {
            type: Field.getAmisStaticFieldType('picker', readonly),
            tpl: Tpl.getRelatedFieldTpl(field, ctx)
        }
    }
    if(field.reference_to && !_.isString(field.reference_to) && !readonly){
        return {
            type: 'steedos-field-lookup',
            field,
            readonly,
            ctx,
        }
        // return await lookupToAmisGroup(field, readonly, ctx);
    }

    let referenceTo = await getReferenceTo(field);
    if(!referenceTo){
        return await lookupToAmisSelect(field, readonly, ctx);
    }

    if(referenceTo.objectName === "space_users" && field.reference_to_field === "user"){
        ctx.onlyDisplayLookLabel = true;
        if(ctx.idsDependOn){
            // ids人员点选模式
            return await lookupToAmisIdsPicker(field, readonly, ctx);
        }
        // 左侧树右侧人员列表的下拉框模式，不再支持，而是执行下面的lookupToAmisPicker函数弹出选人窗口
        // return await lookupToAmisSelectUser(field, readonly, ctx);
    }

    const refObject = await getUISchema(referenceTo.objectName);

    // 此处不参考 steedos 的 enable_enhanced_lookup 规则. 如果默认是开启弹出选择,用户选择过程操作太繁琐, 所以默认是关闭弹出选择.
    // 由于amis picker 目前不支持联动, 配置了depend_on时, 使用使用select ,以支持联动
    // TODO: 确认 amis picker 支持联动时, 清理field.depend_on判断
    if(refObject.enable_enhanced_lookup == true && _.isEmpty(field.depend_on)){
        return await lookupToAmisPicker(field, readonly, ctx);
    }else if(refObject.enable_tree) {
        return await lookupToAmisTreeSelect(field, readonly, Object.assign({}, ctx, {
            labelField: referenceTo.labelField?.name || 'name',
            valueField: referenceTo.valueField?.name || '_id',
            objectName: referenceTo.objectName
        }));
    }else{
        return await lookupToAmisSelect(field, readonly, ctx);
    }
}

export async function lookupToAmisSelectUser(field, readonly, ctx){
    return getSelectUserSchema(field, readonly, ctx);
}

export async function lookupToAmisIdsPicker(field, readonly, ctx){
    return getIdsPickerSchema(field, readonly, ctx);
}

export async function getIdsPickerSchema(field, readonly, ctx){
    if(!ctx){
        ctx = {};
    }
    let referenceTo = await getReferenceTo(field);
    if(!referenceTo){
        return ;
    }
    const refObjectConfig = await getUISchema(referenceTo.objectName);

    const { idsDependOn } = ctx;

    const fields = {
        [referenceTo.labelField.name]: referenceTo.labelField,
        [referenceTo.valueField.name]: referenceTo.valueField
    };

    const tableFields = [referenceTo.labelField];

    const source = await getApi(refObjectConfig, null, fields, {expand: true, alias: 'rows', queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}`});
    
    source.data.$term = "$term";
    source.data.$self = "$$";

    if(idsDependOn && source.url && !ctx.inFilterForm){
        source.sendOn = `\${${idsDependOn} && ${idsDependOn}.length}`;
        source.url = `${source.url}&depend_on_${idsDependOn}=\${${idsDependOn}|join}`;
    }
   
    source.requestAdaptor = `
        const selfData = JSON.parse(JSON.stringify(api.data.$self));
        var filters = [];
        var pageSize = api.data.pageSize || 1000;
        var pageNo = api.data.pageNo || 1;
        var skip = (pageNo - 1) * pageSize;
        if(selfData.op === 'loadOptions' && selfData.value){
            if(selfData.value && selfData.value.indexOf(',') > 0){
                filters = [["${referenceTo.valueField.name}", "=", selfData.value.split(',')]];
            }else{
                filters = [["${referenceTo.valueField.name}", "=", selfData.value]];
            }
        }

        var ids;
        var idsDependOn = "${idsDependOn}";
        if(idsDependOn){
            ids = api.data.$self[idsDependOn];
        }
        if(ids && ids.length){
            filters.push(["${referenceTo.valueField.name}", "=", ids]);
        }

        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip);
        return api;
    `;

    let top = 1000;

    let pickerSchema = null;
    if(ctx.formFactor === 'SMALL'){
        pickerSchema = await List.getListSchema(tableFields, {
            top:  top,
            ...ctx,
            actions: false
        })
    }else{
        pickerSchema = await Table.getTableSchema(tableFields, {
            labelFieldName: refObjectConfig.NAME_FIELD_KEY,
            top:  top,
            isLookup: true,
            ...ctx
        })

        pickerSchema.affixHeader = false;

    }

    const data = {
        type: Field.getAmisStaticFieldType('picker', readonly),
        labelField: referenceTo.labelField.name,
        valueField: referenceTo.valueField.name,
        modalMode: 'dialog', 
        source: source,
        // disabledOn: this._master目的是相关表新建时禁止编辑关联字段； this.relatedKey目的是相关表编辑时禁止编辑关联字段，多选字段可以编辑。
        disabledOn:  `${readonly} || ( (this._master && (this._master.relatedKey ==='${field.name}')) || ((this.relatedKey ==='${field.name}') && (${field.multiple} != true)) )`,
        size: "lg",
        pickerSchema: pickerSchema,
        joinValues: false,
        extractValue: true
    }
    if(field.multiple){
        data.multiple = true
        data.extractValue = true
    }

    if(ctx.value){
        data.value = ctx.value;
    }

    if(ctx.selectFirst != undefined){
        data.selectFirst = ctx.selectFirst;
    }

    if(readonly){
        data.tpl = await Tpl.getLookupTpl(field, ctx)
    }
    return data;
}