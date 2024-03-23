import { getUISchema } from '../../../objects';
import * as _ from 'lodash'
import * as graphql from '../graphql'
import * as Tpl from '../tpl';
import * as Field from './index';
import * as Table from './table';
import * as List from './list';
import { getLookupListView, getComparableAmisVersion } from '../util';
import { getSelectUserSchema } from './user';
import { getObjectHeaderToolbar, getObjectFooterToolbar, getObjectFilter } from './../toolbar';
import { getListViewSort, getListViewFilter } from './../../../objects';
import { lookupToAmisTreeSelect } from './tree_select';
import * as standardNew from '../../../../schema/standard_new.amis'
import { i18next } from "../../../../i18n";
import { getScriptForAddUrlPrefixForImgFields } from "../api"

export const getReferenceToFieldSchema = (field, refObjectConfig)=>{
    let referenceTo = field.reference_to;
    if(!referenceTo){
        return;
    }

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

export const getReferenceTo = async (field)=>{
    let referenceTo = field.reference_to;
    if(referenceTo === 'users'){
        field.reference_to = 'space_users';
        field.reference_to_field = 'user'
    }

    const refObjectConfig = await getUISchema(field.reference_to);
    return getReferenceToFieldSchema(field, refObjectConfig);
}

export function getReferenceToSync(field) {
    let referenceTo = field.reference_to;
    if(referenceTo === 'users'){
        field.reference_to = 'space_users';
        field.reference_to_field = 'user'
    }

    const refObjectConfig = getUISchemaSync(field.reference_to);
    return getReferenceToFieldSchema(field, refObjectConfig);
}

export function getLookupSapceUserTreeSchema(isMobile){
    let apiAdaptor = `
        const records = payload.data.options;
        const treeRecords = [];
        const getChildren = (currentRecord, records, childrenIds) => {
            if (currentRecord.children && typeof currentRecord.children[0] === "object") {
                // 考虑api配置了cache缓存的话，不会请求接口但是会重新进这个接收适配器脚本且payload.data.options返回的会是上一次计算结果，这里直接返回计算过的children
                return currentRecord.children;
            }
            if (!childrenIds) {
                return;
            }
            const children = _.filter(records, (record) => {
                return _.includes(childrenIds, record.value)
            });
            _.each(children, (item) => {
                if (item.children) {
                    item.children = getChildren(item, records, item.children)
                }else{
                    item.children = [];
                }
            })
            return children;
        }
        
        const getRoot = (records) => {
            for (var i = 0; i < records.length; i++) {
                records[i].noParent = 0;
                if (!!records[i].parent) {
                    biaozhi = 1
                    for (var j = 0; j < records.length; j++) {
                        if (records[i].parent == records[j].value)
                            biaozhi = 0;
                    }
                    if (biaozhi == 1) records[i].noParent = 1;
                } else records[i].noParent = 1;
            }
        }
        getRoot(records);
        console.log(records)
        
        _.each(records, (record) => {
            if (record.noParent == 1) {
                treeRecords.push(Object.assign({}, record, { children: getChildren(record, records, record.children) }));
            }
        });
        console.log(treeRecords)
        
        payload.data.options = treeRecords;
        return payload;
    `;
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
          "adaptor": apiAdaptor,
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
        "mode": "normal",
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

    let listView = getLookupListView(refObjectConfig);
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
                        amis: column.amis
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

    // 把自动填充规则中依赖的字段也加到api请求中
    let autoFillMapping = !field.multiple && field.auto_fill_mapping;
    if (autoFillMapping && autoFillMapping.length) {
        autoFillMapping.forEach(function (item) {
            if(!_.find(tableFields, function(f){
                return f.name === item.from
            })){
                tableFields.push(refObjectConfig.fields[item.from])
            }
        });
    }

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

    let listviewFilter = getListViewFilter(listView);
    let listviewFiltersFunction = listView && listView._filters;

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

    // field.name可能是带点的名称，比如审批王中子表字段'instances.instances_submitter'，如果不替换掉点，会造成审批王表单中新建子表行时报错
    let keywordsSearchBoxName = `__keywords_lookup__${field.name.replace(/\./g, "_")}__to__${refObjectConfig.name}`;

    source.requestAdaptor = `
        let __changedFilterFormValuesKey = "__changedFilterFormValues";
        let __lookupField = api.data.$self.__lookupField;
        if(__lookupField){
            let lookupTag = "__lookup__" + __lookupField.name + "__" + __lookupField.reference_to;
            if(__lookupField.reference_to_field){
                lookupTag += "__" + __lookupField.reference_to_field;
            }
            __changedFilterFormValuesKey += lookupTag;
        }
        let __changedFilterFormValues = api.data.$self[__changedFilterFormValuesKey] || {};
        let __changedSearchBoxValues = api.data.$self.__changedSearchBoxValues || {};
        // 把表单搜索和快速搜索中的change事件中记录的过滤条件也拼到$self中，是为解决触发搜索请求时，两边输入的过滤条件都带上，即：
        // 有时在搜索表单中输入过滤条件事，忘记点击回车键或搜索按钮，而是进一步修改快速搜索框中的关键字点击其中回车键触发搜索
        // 这种情况下，触发的搜索请求中没有带上搜索表单中输入的过滤条件。
        // 反过来先在快速搜索框中输入过滤条件却不点击其中回车键触发搜索，而是到搜索表单中触发搜索请求也是一样的。
        if(api.data.$self.op !== 'loadOptions'){
            Object.assign(api.data.$self, __changedSearchBoxValues, __changedFilterFormValues);
        }
        const selfData = JSON.parse(JSON.stringify(api.data.$self));
        ${listviewFilter && !ctx.inFilterForm ? `var filters = ${JSON.stringify(listviewFilter)};` : 'var filters = [];'}
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
            var filtersForString = JSON.stringify(fieldFilters);
            if(filtersForString.indexOf('$') > -1) {
                var currentAmis = amisRequire('amis');
                fieldFilters = JSON.parse(currentAmis.evaluate(filtersForString, api.data.$self.__super))
            }
            filters.push(fieldFilters);
        }
        
        const inFilterForm = ${ctx.inFilterForm};

        const listviewFiltersFunction = ${listviewFiltersFunction};

        if(listviewFiltersFunction && !inFilterForm){
            const _filters0 = listviewFiltersFunction(filters, api.data.$self.__super);
            if(_filters0 && _filters0.length){
                filters.push(_filters0);
            }
        }
        
        const filtersFunction = ${field.filtersFunction || field._filtersFunction};

        if(filtersFunction && !inFilterForm){
            const _filters = filtersFunction(filters, api.data.$self.__super);
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
        // 这里不可以用_.pick函数让payload只返回labelField和valueField，因为字段上配置的amis autoFill功能可能依赖了其他字段
        /*
        const rows = _.map(payload.data.rows, (item)=>{
            return _.pick(item, ["${referenceTo.labelField.name}", "${referenceTo.valueField.name}"]);
        })
        payload.data.rows = rows;
        */
        if(enable_tree){
            const rows = _.map(payload.data.rows, (item)=>{
                if (!item.children) {
                    return { ...item, children: [] };
                } else {
                    return item;
                }
            })
            payload.data.rows = rows;
        }
        return payload;
    }
    if(!payload.data.rows){
        payload.data.rows = [];
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
                }else{
                    item.children = [];
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
    const result = payload.data.rows;
    if(result && result.length){
        const updatedResult = _.map(result, (element) => {
            const data = { ...element };
            // image字段值添加URL前缀
            ${getScriptForAddUrlPrefixForImgFields(_.values(refObjectConfig.fields))}
            return data;
        });
        payload.data.rows = updatedResult;
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
        let labelFieldName = refObjectConfig.NAME_FIELD_KEY || 'name';
        // organizations 对象的历史遗留问题, fullname 被标记为了 名称字段. 在此处特殊处理.
        if(refObjectConfig.name === 'organizations'){
          labelFieldName = 'name';
        }
        pickerSchema = await Table.getTableSchema(refObjectConfig, tableFields, {
            labelFieldName,
            top:  top,
            isLookup: true,
            enable_tree: refObjectConfig.enable_tree,
            ...ctx
        })

        pickerSchema.affixHeader = false;

        

        pickerSchema.headerToolbar = getObjectHeaderToolbar(refObjectConfig, fieldsArr, ctx.formFactor, { isLookup: true, keywordsSearchBoxName });
        
        if(referenceTo.objectName === "space_users" && field.reference_to_field === "user"){
            pickerSchema.headerToolbar.push(getLookupSapceUserTreeSchema(isMobile));
            pickerSchema.className = pickerSchema.className || "" + " steedos-select-user";
        }
        
        const isAllowCreate = refObjectConfig.permissions.allowCreate;
        const isCreate = _.isBoolean(field.create) ? field.create : true;
        // lookup字段配置过滤条件就强制不显示新建按钮
        let isHasFilters = (field.filters || field.filtersFunction || field._filtersFunction) ? true : false;
        if (isAllowCreate && isCreate && !isHasFilters) {
            const new_button = await standardNew.getSchema(refObjectConfig, { appId: ctx.appId, objectName: refObjectConfig.name, formFactor: ctx.formFactor });
            new_button.align = "right";
            // 保持快速搜索放在最左侧，新建按钮往里插，而不是push到最后
            pickerSchema.headerToolbar.splice(pickerSchema.headerToolbar.length - 1, 0, new_button);
        }
        pickerSchema.footerToolbar = refObjectConfig.enable_tree ? [] : getObjectFooterToolbar(refObjectConfig,ctx.formFactor,{isLookup: true});
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
            "isLookup": true,
            "__lookupField": {
                "name": field.name,
                "reference_to": refObjectConfig.name,
                "reference_to_field": field.reference_to_field
            }
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

    if(field.inlineHelpText){
        pickerSchema.toolbarClassName = "hasHelpText";
        pickerSchema.headerToolbar = [{
            "type": "tpl",
            "tpl": field.inlineHelpText,
            "className": "text-secondary"
        }, ...pickerSchema.headerToolbar]
    }
    pickerSchema.className = (pickerSchema.className || "") + " steedos-lookup-crud";
    
    const data = {
        type: Field.getAmisStaticFieldType('picker', readonly),
        className: ctx.className || '',
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
    const isMobile = window.innerWidth <= 768;
    const valueFieldKey = referenceTo && referenceTo.valueField?.name || '_id' ;
    // const labelFieldKey = referenceTo && referenceTo.labelField?.name || 'name';

    let apiInfo;
    let defaultValueOptionsQueryData;
    const refObjectConfig = referenceTo && await getUISchema(referenceTo.objectName);
    if(referenceTo){
        let queryFields = [
            Object.assign({}, referenceTo.labelField, {alias: 'label'}),
            Object.assign({}, referenceTo.valueField, {alias: 'value'})
        ];

        // 把自动填充规则中依赖的字段也加到api请求中
        let autoFillMapping = !field.multiple && field.auto_fill_mapping;
        if (autoFillMapping && autoFillMapping.length) {
            autoFillMapping.forEach(function (item) {
                queryFields.push(refObjectConfig.fields[item.from]);
            });
        }

        // 字段值单独走一个请求合并到source的同一个GraphQL接口中
        defaultValueOptionsQueryData = await graphql.getFindQuery({ name: referenceTo.objectName }, null, queryFields, {
            expand: false,
            alias: "defaultValueOptions",
            filters: "{__options_filters}",
            count: false
        });
        apiInfo = await getApi({
            name: referenceTo.objectName
        }, null, queryFields, {expand: false, alias: 'options', queryOptions: `filters: {__filters}, top: {__top}, sort: "{__sort}"`});

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

    let listView = getLookupListView(refObjectConfig);

    let listviewFilter = getListViewFilter(listView);
    let listviewFiltersFunction = listView && listView._filters;

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
            apiInfo.url = `${apiInfo.url}&${depend_on.join('&')}`;
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
        ${listviewFilter && !ctx.inFilterForm ? `var filters = ${JSON.stringify(listviewFilter)};` : 'var filters = [];'}
        var top = 200;
        if(api.data.$term){
            filters = [["${referenceTo?.NAME_FIELD_KEY || 'name'}", "contains", api.data.$term]];
        }
        // else if(api.data.$value){
        //     filters = [["_id", "=", api.data.$value]];
        // }

        var fieldFilters = ${JSON.stringify(field.filters)};
        if(fieldFilters && fieldFilters.length){
            var filtersForString = JSON.stringify(fieldFilters);
            if(filtersForString.indexOf('$') > -1) {
                var currentAmis = amisRequire('amis');
                fieldFilters = JSON.parse(currentAmis.evaluate(filtersForString, api.data.$))
            }
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

        const listviewFiltersFunction = ${listviewFiltersFunction};

        if(listviewFiltersFunction && !inFilterForm){
            const _filters0 = listviewFiltersFunction(filters, api.data.$);
            if(_filters0 && _filters0.length){
                filters.push(_filters0);
            }
        }
        
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
            const defaultValueOptionsQueryData = ${JSON.stringify(defaultValueOptionsQueryData)};
            const defaultValueOptionsQuery = defaultValueOptionsQueryData?.query?.replace(/^{/,"").replace(/}$/,"");
            // 字段值单独请求，没值的时候在请求中返回空
            optionsFilters = [["${valueFieldKey}", optionsFiltersOp, defaultValue]];
            if(filters.length > 0){
                optionsFilters = [filters, optionsFilters];
            }
            if(defaultValueOptionsQuery){
                api.data.query = "{"+api.data.query.replace(/^{/,"").replace(/}$/,"")+","+defaultValueOptionsQuery+"}";
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
        // source: apiInfo,
        autoComplete: apiInfo,
        searchable: true,
    }
    let amisVersion = getComparableAmisVersion();
    if(amisVersion >= 3.6){
        // amis 3.6中不加source会造成子表组件中弹出行编辑窗口的lookup字段有时不请求接口（概率现象，同一个地方反复操作有时请求有时不请求）
        // 但是同时配置autoComplete和source会多请求一次接口
        // TODO:应该想办法把是否字段在子表组件内，即ctx.isInputTable，如果不在子表组件内不需要加source
        data.source = apiInfo;
        delete data.autoComplete;
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
    const menuTpl = "${icon ? `"+select_menuTpl+"` : label}"
    // TODO: 待amis修复了此bug， 就可以撤销添加menuTpl的判断。
    if(!(isMobile && field.multiple)){
        data.menuTpl = menuTpl;
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

async function getAutoFill(field, refObject) {
    let autoFillMapping = !field.multiple && field.auto_fill_mapping;
    if (autoFillMapping && autoFillMapping.length) {
        let fillMapping = {};
        // let fieldsForApi = [];
        autoFillMapping.forEach(function (item) {
            fillMapping[item.to] = `\${${item.from}}`;
            // fieldsForApi.push(item.from);
        });
        // let api = {
        //     // "url": "/amis/api/mock2/form/autoUpdate?browser=${browser}&version=${version}",
        //     "url": `/api/v1/${refObject.name}/\${${field.name}}?fields=${JSON.stringify(fieldsForApi)}`,
        //     // "responseData": {
        //     //     "name": "${name}"
        //     // },
        //     "silent": false
        // }
        // return {
        //     fillMapping,
        //     // api
        // }
        // 因为autoFill中配置了api的话，在表单初始化（比如新建记录）时并不会触发执行autoFill，所以只能暂时不用api
        // 给amis报过问题了，见：https://github.com/baidu/amis/issues/9631
        return fillMapping;
    }
}

export async function lookupToAmis(field, readonly, ctx){
    if(!ctx){
        ctx = {};
    }
    // console.log(`lookupToAmis====`, field, readonly, ctx)
    if(readonly){
        if(field.reference_to && !field.isTableField){
            //isTableField只在grid字段内存在
            return {
                type: 'steedos-field',
                config: field,
                static: true
            }
        }else{
            return {
                type: Field.getAmisStaticFieldType('picker', readonly),
                tpl: Tpl.getRelatedFieldTpl(field, ctx)
            }
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
        ctx = Object.assign({}, ctx, {
            onlyDisplayLookLabel: true
        });
        if(ctx.idsDependOn){
            // ids人员点选模式
            return await lookupToAmisIdsPicker(field, readonly, ctx);
        }
        // 左侧树右侧人员列表的下拉框模式，不再支持，而是执行下面的lookupToAmisPicker函数弹出选人窗口
        // return await lookupToAmisSelectUser(field, readonly, ctx);
    }

    const refObject = await getUISchema(referenceTo.objectName);

    // 优先取字段中配置的enable_enhanced_lookup，字段上没配置时，才从对象上取enable_enhanced_lookup属性
    let enableEnhancedLookup = _.isBoolean(field.enable_enhanced_lookup) ? field.enable_enhanced_lookup : refObject.enable_enhanced_lookup;
    let amisVersion = getComparableAmisVersion();
    if(amisVersion >= 3.6){
        // amis 3.6.3单选和多选的树picker都有bug（https://github.com/baidu/amis/issues/9279，https://github.com/baidu/amis/issues/9295），我们改amis源码修正了
        // amis 3.6.3多选的下拉树组件有bug，多选树字段的选中值在编辑模式展开树时不会自动勾选树里面的节点，而是始终勾选显示在最外面的选中值选项（即defaultValueOptions）,amis 3.2没有这个问题
        // 这里强制禁用多选下拉树，统一改为弹出树，如果以后需要下拉树功能，可以把下拉树组件改为一次性加载所有树节点数据模式来跳过这个问题
        if(!enableEnhancedLookup && refObject.enable_tree && field.multiple){
            enableEnhancedLookup = true;
        }
    }
    let amisSchema;
    // 默认使用下拉框模式显示lookup选项，只能配置了enable_enhanced_lookup才使用弹出增强模式
    if(enableEnhancedLookup == true){
        amisSchema = await lookupToAmisPicker(field, readonly, ctx);
    }else if(refObject.enable_tree) {
        amisSchema = await lookupToAmisTreeSelect(field, readonly, Object.assign({}, ctx, {
            labelField: referenceTo.labelField?.name || 'name',
            valueField: referenceTo.valueField?.name || '_id',
            objectName: referenceTo.objectName
        }));
    }else{
        amisSchema = await lookupToAmisSelect(field, readonly, ctx);
    }
    let refLookupPage = refObject.pages && refObject.pages.lookup;
    if(refLookupPage){
        if(refLookupPage.is_enable){
            let pageAmisSchema = refLookupPage.amis_schema;
            if(typeof pageAmisSchema == 'string'){
                pageAmisSchema = JSON.parse(pageAmisSchema);
            }
            amisSchema = _.defaultsDeep({}, pageAmisSchema, amisSchema);
        }
    }
    const autoFill = await getAutoFill(field, refObject);
    if(autoFill){
        amisSchema.autoFill = autoFill;
        // 这里不配置initAutoFill值，按amis规则initAutoFill默认值为fillIfNotSet处理--需要amis sdk 版本 > 3.6.3-patch.6（不包括）版本
        // amisSchema.initAutoFill = false; 
    }
    return amisSchema;
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

    const source = await getApi(refObjectConfig, null, fields, {expand: true, alias: 'rows', queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"`});
    
    source.data.$term = "$term";
    source.data.$self = "$$";

    if(idsDependOn && source.url && !ctx.inFilterForm){
        source.sendOn = `\${${idsDependOn} && ${idsDependOn}.length}`;
        source.url = `${source.url}&depend_on_${idsDependOn}=\${${idsDependOn}|join}`;
    }

    let listView = getLookupListView(refObjectConfig);
    let sort = "";
    if(listView){
        sort = getListViewSort(listView);
    }
   
    source.requestAdaptor = `
        const selfData = JSON.parse(JSON.stringify(api.data.$self));
        var filters = [];
        var pageSize = api.data.pageSize || 1000;
        var pageNo = api.data.pageNo || 1;
        var skip = (pageNo - 1) * pageSize;
        var orderBy = api.data.orderBy || '';
        var orderDir = api.data.orderDir || '';
        var sort = orderBy + ' ' + orderDir;
        sort = orderBy ? sort : "${sort}";
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

        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim());
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
        pickerSchema = await Table.getTableSchema(refObjectConfig, tableFields, {
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


if(typeof window != 'undefined'){
    window.getReferenceTo = getReferenceTo;
    window.getReferenceToSync = getReferenceToSync;
}