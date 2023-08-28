import { cloneDeep, includes } from 'lodash';
import { lookupToAmis } from './lookup';
import { getMarkdownFieldSchema, getHtmlFieldSchema } from './editor';
import * as Fields from '../fields';
import * as Tpl from '../tpl';
import * as File from './file';
import { getAmisStaticFieldType } from './type';
import * as _ from 'lodash'

export const QUICK_SEARCHABLE_FIELD_TYPES = ["text", "textarea", "autonumber", "url", "email"];
export const OMIT_FIELDS = ['created', 'created_by', 'modified', 'modified_by'];
export { getAmisStaticFieldType } from './type';
// const Lookup = require('./lookup');

export function getBaseFields(readonly){
    let calssName = 'm-1';
    if(readonly){
        calssName = `${calssName}`
    }
    return [
        { 
            name: "createdInfo", 
            label: "创建人",
            type: "static",
            labelClassName: 'text-left',
            className: calssName,
            tpl: Tpl.getCreatedInfoTpl()
        },
        { 
            name: "modifiedInfo", 
            label: "修改人",
            type: "static",
            labelClassName: 'text-left',
            className: calssName,
            tpl: Tpl.getModifiedInfoTpl()
        }
    ]
};



export function getAmisFieldType(sField){
    switch (sField.type) {
        case 'text':
            return 'text';
        case 'textarea':
            return 'textarea';
        case 'html':
            return 'html';
        case 'markdown':
            return 'markdown';
        case 'select':
            return 'select';
        case 'boolean':
            return 'checkbox';
        case 'date':
            return 'date';
        case 'datetime':
            return 'datetime';
        case 'number':
            return 'number';
        case 'currency':
            return 'number';
        case 'percent':
            return 'number'
        case 'password':
            return 'password';
        case 'lookup':
            // TODO 根据字段配置返回 select || picker
            return 'select';
        case 'master_detail':
            // TODO 根据字段配置返回 select || picker
            return 'picker';
        case 'autonumber':
            return 'text';
        case 'url':
            return 'url'
        case 'email':
            return 'email'
        case 'image':
            return 'image'
        case 'formula':
            //TODO
            break;
        case 'summary':
            //TODO
            break;
        case 'grid':
            return 'table';
        default:
            console.log('convertData default', sField.type);
            // convertData.type = field.type
            break;
    }

};

export function getObjectFieldSubFields(mainField, fields){
    const newMainField = Object.assign({subFields: []}, mainField);
    const subFields = _.filter(fields, function(field){
        let result = field.name.startsWith(`${mainField.name}.`) && _.split(field.name, ".").length < 3;
        if(result){
            field._prefix = `${mainField.name}.`
        }
        return result;
    });
    newMainField.subFields = subFields;
    return newMainField;
}

export function getGridFieldSubFields(mainField, fields){
    const newMainField = Object.assign({subFields: []}, mainField);
    const subFields = _.filter(fields, function(field){
        let result = field.name.startsWith(`${mainField.name}.`)
        if(result){
            field._prefix = `${mainField.name}.`
        }
        return result;
    });
    newMainField.subFields = subFields;
    return newMainField;
}

/**
 * TODO 处理权限
 * @param {*} object steedos object
 * @param {*} userSession 
 */
 export function getPermissionFields(object, userSession){
    const permissionFields = [];
    const fieldsArr = [];
	_.each(object.fields , (field, field_name)=>{
		if(!_.has(field, "name")){
			field.name = field_name
        }
		fieldsArr.push(field)
    })
    _.each(_.sortBy(fieldsArr, "sort_no"), function(field){
        if(!field.hidden){
            permissionFields.push( Object.assign({}, field, {permission: {allowEdit: true}}))
        }
    })
    return permissionFields;
}


export function getSelectFieldOptions(field){
    const dataType = field.data_type || 'text';
    const options = [];
    _.each(field.options, (item)=>{
        switch (dataType) {
            case 'number':
                options.push({label: item.label, value: Number(item.value), icon: item.icon});
                break;
            case 'text':
                options.push({label: item.label, value: String(item.value), icon: item.icon});
                break;
            case 'boolean':
                options.push({label: item.label, value: item.value === 'false' ? false : true, icon: item.icon});
                break;
            default:
                break;
        }
    });
    return options;
}

export async function convertSFieldToAmisField(field, readonly, ctx) {
    // console.log('convertSFieldToAmisField====>', field, readonly, ctx)
    const isMobile = window.innerWidth <= 768;
    let rootUrl = null;
    // 创建人和修改人、创建时间和修改时间不显示
    if(_.includes(OMIT_FIELDS, field.name) && ctx.showSystemFields != true){
        return;
    }
    const baseData = {name: ctx.fieldNamePrefix ? `${ctx.fieldNamePrefix}${field.name}` : field.name, label: field.label, labelRemark: field.inlineHelpText, required: _.has(ctx, 'required') ? ctx.required : field.required};
    let convertData = {
    };
    // if(_.includes(OMIT_FIELDS, field.name)){
    //     readonly = true;
    // }
    switch (field.type) {
        case 'text':
            convertData.type = getAmisStaticFieldType('text', readonly, field);
            break;
        case 'textarea':
            convertData.type = getAmisStaticFieldType('textarea', readonly);
            // convertData.tpl = `<b><%=data.${field.name}%></b>`;
            convertData.tpl = `<%=(data.${field.name} || "").split("\\n").join('<br>')%>`;
            break;
        case 'html':
            convertData = getHtmlFieldSchema(field, readonly)
            break;
            // convertData = {
            //     type: getAmisStaticFieldType('html', readonly)
            // }
            // break;
        case 'markdown':
            convertData = getMarkdownFieldSchema(field, readonly)
            break;
            // convertData = {
            //     type: getAmisStaticFieldType('html', readonly)
            // }
            // break;
        case 'select':
            if(readonly){
                const map = Tpl.getSelectMap(field.options);
                convertData = {
                    type: "static-mapping",
                    name: field.name,
                    label: field.label,
                    map: map
                }
            }else{
                convertData = {
                    type: getAmisStaticFieldType('select', readonly),
                    joinValues: false,
                    options: getSelectFieldOptions(field),
                    extractValue: true,
                    clearable: true,
                    labelField: 'label',
                    valueField: 'value'
                }
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
                convertData.menuTpl = "${icon ? `"+select_menuTpl+"` : label}"
                if(field.multiple){
                    convertData.multiple = true
                    convertData.extractValue = true
                }
            }

            break;
        case 'boolean':
            convertData = {
                type: getAmisStaticFieldType('checkbox', readonly),
                // option: field.inlineHelpText,
                tpl: readonly ? Tpl.getSwitchTpl(field) : null
            }
            break;
        case 'input-date-range':
            convertData = {
                type: "input-date-range",
                inputFormat: "YYYY-MM-DD",
                format:'YYYY-MM-DDT00:00:00.000[Z]',
                tpl: readonly ? Tpl.getDateTpl(field) : null,
                // utc: true,
                joinValues: false
            }
            break;
        case 'date':
            convertData = isMobile && !readonly ? {
                type: "native-date",
                pipeIn: (value, data) => {
                    if (value) {
                        value = moment(value).utc().format('YYYY-MM-DD');
                        return value;
                    } else {
                        return "";
                    }

                },
                pipeOut: (value, oldValue, data) => {
                    if (value) {
                        value = moment(value).format('YYYY-MM-DDT00:00:00.000[Z]');
                        return value;
                    } else {
                        return "";
                    }
                }
            } : {
                type: getAmisStaticFieldType('date', readonly),
                inputFormat: "YYYY-MM-DD",
                format:'YYYY-MM-DDT00:00:00.000[Z]',
                tpl: readonly ? Tpl.getDateTpl(field) : null,
                // utc: true
            }
            break;
        case 'input-datetime-range':
            convertData = {
                type: "input-datetime-range",
                inputFormat: 'YYYY-MM-DD HH:mm',
                format:'YYYY-MM-DDTHH:mm:ss.SSSZ',
                tpl: readonly ? Tpl.getDateTimeTpl(field) : null,
                utc: true,
                joinValues: false
            }
            break;
        case 'datetime':
            convertData = isMobile && !readonly ? {
                type: "combo",
                pipeIn: (value, data) => {
                    let revalue = {};
                    if (value && value != "Invalid date") {
                        value = moment(value).format('YYYY-MM-DD HH:mm:ss');
                        revalue[field.name + "-native-date"] = value.split(' ')[0];
                        revalue[field.name + "-native-time"] = value.split(' ')[1];
                    } else {
                        revalue[field.name + "-native-date"] = "";
                        revalue[field.name + "-native-time"] = "";
                    }
                    return revalue;
                },
                pipeOut: (value, oldValue, data) => {
                    let revalue = "";
                    if (value[field.name + "-native-date"] && value[field.name + "-native-time"]) {
                        revalue = value[field.name + "-native-date"] + " " + value[field.name + "-native-time"];
                        revalue = moment(revalue).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                    }
                    return revalue;
                },
                items: [
                    {
                        type: "native-date",
                        name: field.name + "-native-date",
                        className: "steedos-native-date",
                        value: ""
                    },
                    {
                        type: "native-time",
                        name: field.name + "-native-time",
                        className: "steedos-native-time",
                        value: ""
                    }
                ]
            } : {
                type: getAmisStaticFieldType('datetime', readonly),
                inputFormat: 'YYYY-MM-DD HH:mm',
                format: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
                tpl: readonly ? Tpl.getDateTimeTpl(field) : null,
                utc: true,
            }
            break;
        case 'input-time-range':
            convertData = {
                type: 'input-time-range',
                inputFormat: 'HH:mm',
                timeFormat:'HH:mm',
                format:'1970-01-01THH:mm:00.000[Z]',
                tpl: readonly ? Tpl.getDateTimeTpl(field) : null,
                // utc: true,
                joinValues: false
            }
            break;
        case 'time':
            convertData = isMobile && !readonly ? {
                type: "native-time",
                pipeIn: (value, data) => {
                    if (value) {
                        value = moment(value).utc().format('HH:mm');
                        return value;
                    } else {
                        return "";
                    }

                },
                pipeOut: (value, oldValue, data) => {
                    if (value) {
                        value = moment('1970-01-01 ' + value).format('1970-01-01THH:mm:00.000[Z]');
                        return value;
                    } else {
                        return "";
                    }
                }
            } : {
                type: getAmisStaticFieldType('time', readonly),
                inputFormat: 'HH:mm',
                timeFormat:'HH:mm',
                format:'1970-01-01THH:mm:00.000[Z]',
                tpl: readonly ? Tpl.getDateTimeTpl(field) : null,
                // utc: true
            }
            break;
        case 'currency':
        case 'number':
            if(readonly){
                convertData = {
                    type: 'static-tpl',
                    tpl: Tpl.getNumberTpl(field)
                }
            }else{
                convertData = {
                    type: getAmisStaticFieldType('number', readonly),
                    min: field.min,
                    max: field.max,
                    precision: field.scale
                }
            }
            
            break;
        case 'input-array':
            convertData = Object.assign({}, field, baseData);
            break;
        case 'input-range':
            convertData = {
                type: 'input-range',
                min: field.min,
                max: field.max,
                value: [0, 0],
                multiple: true,
                showInput: true
            }
            break;
        case 'percent':
            if(readonly){
                convertData = {
                    type: 'static-tpl',
                    tpl: Tpl.getUiFieldTpl(field)
                }
            }else{
                convertData = {
                    type: getAmisStaticFieldType('number', readonly),
                    min: field.min,
                    max: field.max,
                    precision: field.scale
                }
            }
            break;
        case 'password':
            convertData = {
                type: getAmisStaticFieldType('password', readonly),
                tpl: readonly ? Tpl.getPasswordTpl(field) : null
            }
            break;
        case 'lookup':
            convertData = await lookupToAmis(field, readonly, ctx) //TODO
            break;
        case 'master_detail':
            convertData = await lookupToAmis(field, readonly, ctx) //TODO
            break;
        case 'autonumber':
            if(readonly){
                convertData = {
                    type: 'static-text'
                }
            }
            break;
        case 'url':
            convertData = {
                type: getAmisStaticFieldType('url', readonly, field),
                static: readonly ? true : false
            }
            if(readonly && field.show_as_qr){
                convertData = {
                    type: "control",
                    label: field.label,
                    body: {
                        type: "qr-code",
                        codeSize: 128,
                        name: field.name
                    }
                }
            }
            break;
        case 'email':
            convertData = {
                type: getAmisStaticFieldType('email', readonly)
            }
            break;
        case 'location':
            // 申请ak后需要设置白名单； https://lbsyun.baidu.com/apiconsole/key/create#/home
            // console.log('fie==>', field.name, field);
            let ak = "LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7";
            let vendor = "baidu";  /* 'baidu' | 'gaode' */
            if(window.Meteor){
                const map_ak = Meteor.settings?.public?.amis?.map_ak;
                if(map_ak){
                    ak = map_ak;
                }
                const map_vendor = Meteor.settings?.public?.amis?.map_vendor;
                if(map_vendor){
                    vendor = map_vendor;
                }
            }
            
            const coordinatesType = field.coordinatesType || "bd09";
            convertData = {
                type: getAmisStaticFieldType('location', readonly),
                tpl: readonly ? Tpl.getLocationTpl(field) : null,
                ak,
                vendor,
                clearable: true,
                coordinatesType,
                label: field.label,
                pipeOut: (value, oldValue, data) => {
                    if (value) {
                        const lng = value.lng;
                        const lat = value.lat;
                        let coordinates = [lng,lat];
                        if(window.coordtransform){
                            if(coordinatesType.toLowerCase() === 'bd09'){
                                const bd09togcj02 = window.coordtransform.bd09togcj02(lng,lat);
                                coordinates = window.coordtransform.gcj02towgs84(bd09togcj02[0],bd09togcj02[1]);
                            }else if(coordinatesType.toLowerCase() === 'gcj02'){
                                coordinates = window.coordtransform.gcj02towgs84(lng,lat);
                            }
                        }
                        value.wgs84 = {
                            type: "Point",
                            coordinates
                        }
                       return value; // 切换到数字之后的默认值
                    }
                }
            }
            break;
        case 'avatar':
            convertData = File.getAmisFileSchema(field, readonly);
            break;
        case 'image':
            convertData = File.getAmisFileSchema(field, readonly);
            break;
        case 'file':
            convertData = File.getAmisFileSchema(field, readonly);
            break;
        case 'formula':
            if(readonly){
                convertData = {
                    type: 'static-tpl',
                    tpl: Tpl.getUiFieldTpl(field)
                }
            }
            break;
        case 'summary':
            if(readonly){
                convertData = {
                    type: 'static-tpl',
                    tpl: Tpl.getUiFieldTpl(field)
                }
            }
            break;
        case 'code':
            convertData = {
                type: "editor",
                disabled: readonly ? true : false,
                language: field.language,
                editorDidMount: new Function('editor', 'monaco', field.editorDidMount)
            }
            break;
        case 'toggle':
            convertData = {
                type: "switch",
                name: field.name,
                label: field.label,
                width: field.width,
                toggled: field.toggled,
                disabled: readonly,
            }
            break;
        case 'grid':
            if(field.subFields){
                convertData = {
                    type: 'input-table',
                    showIndex: true,
                    columnsTogglable: false,
                    strictMode:false,
                    affixHeader: false, // 是否固定表头, 不固定表头, 否则form有y轴滚动条时, 表头会跟随滚动条滚动.
                    needConfirm: false,
                    editable: !readonly,
                    addable: !readonly,
                    removable: !readonly,
                    draggable: !readonly,
                    columns: []
                }
                // console.log(`convertData ==2====>`, field, convertData)
                for (const subField of field.subFields) {
                    const subFieldName = subField.name.replace(`${field._prefix || ''}${field.name}.$.`, '').replace(`${field.name}.`, '');
                    const gridSub = await convertSFieldToAmisField(Object.assign({}, subField, {name: subFieldName, isTableField: true}), readonly, ctx);
                    if(gridSub){
                        delete gridSub.name
                        delete gridSub.label
                        const gridItemSchema = {
                            name: subFieldName,
                            label: subField.label,
                            quickEdit: readonly ? false : gridSub
                        };
                        if(subField.type === 'lookup'){
                            gridItemSchema.type = gridSub.type;
                            gridItemSchema.tpl = gridSub.tpl;
                        }
                        convertData.columns.push(Object.assign({}, gridItemSchema, subField.amis, {name: subFieldName}))
                    }
                }
            }
            break;
        case 'object':
            if(field.subFields){
                convertData = {
                    type: 'combo',
                    items: []
                };
                // console.log(`convertData ======>`, field, convertData)
                for (let subField of field.subFields) {
                    let subFieldName = subField.name.replace(`${field.name}.$.`, '').replace(`${field.name}.`, '');
                    if(subField.type === 'grid'){
                        subField = await Fields.getGridFieldSubFields(subField, ctx.__formFields);
                    }else{
                        if(readonly){
                            subFieldName = `${field.name}.${subFieldName}`
                        }
                    }
                    const gridSub = await convertSFieldToAmisField(Object.assign({}, subField, {name: subFieldName}), readonly, ctx);
                    if(gridSub){
                        delete gridSub.name
                        delete gridSub.label
                        convertData.items.push(
                            Object.assign({}, gridSub, {label: subField.label}, subField.amis, {
                                name: subFieldName
                            })
                        )
                    }
                }
            }
            break;
        default:
            // console.log('convertData default', field.type);
            // convertData.type = field.type
            break;
    }
    if(!_.isEmpty(convertData)){
        if(field.is_wide || convertData.type === 'group'){
            convertData.className = 'col-span-2 m-1';
        }else{
            convertData.className = 'm-1';
        }
        if(readonly){
            convertData.className = `${convertData.className} md:border-b`
        }
        if(readonly){
            convertData.quickEdit = false;
        }

        let fieldTypeClassName = ' steedos-' + convertData.type + (readonly ? '-readonly' : '-edit');
        if (convertData.className) {
            convertData.className = convertData.className + fieldTypeClassName;
        } else {
            convertData.className = fieldTypeClassName;
        }

        if(field.visible_on && !ctx.inFilterForm){
            // convertData.visibleOn = `\$${field.visible_on.substring(1, field.visible_on.length -1).replace(/formData./g, '')}`;
            if(field.visible_on.startsWith("{{")){
                convertData.visibleOn = `${field.visible_on.substring(2, field.visible_on.length -2).replace(/formData./g, 'data.')}`
            }else{
                convertData.visibleOn = `${field.visible_on.replace(/formData./g, 'data.')}`
            }
        }

        if(_.isString(baseData.required)){
            if(baseData.required.startsWith("{{")){
                baseData.requiredOn = `${baseData.required.substring(2, baseData.required.length -2).replace(/formData./g, 'data.')}`;
                delete baseData.required;
            }
        }

        if(convertData.type === 'group'){
            convertData.body[0] = Object.assign({}, baseData, convertData.body[0], { labelClassName: 'text-left', clearValueOnHidden: true, fieldName: field.name});
            return  convertData
        }
        // if(ctx.mode === 'edit'){
        return Object.assign({}, baseData, convertData, { labelClassName: 'text-left', clearValueOnHidden: true, fieldName: field.name}, field.amis, {name: baseData.name});
        // }else{
        //     return Object.assign({}, baseData, convertData, { labelClassName: 'text-left', clearValueOnHidden: true, fieldName: field.name});
        // }
    }
    
}

export async function getFieldSearchable(perField, permissionFields, ctx){
    if(!ctx){
        ctx = {};
    }
    let field = perField;
    if(field.type === 'grid'){
        field = await Fields.getGridFieldSubFields(perField, permissionFields);
    }else if(perField.type === 'object'){
        field = await Fields.getObjectFieldSubFields(perField, permissionFields);
    }

    let fieldNamePrefix = '__searchable__';
    if(field.name.indexOf(".") < 0){
        let _field = cloneDeep(field)
        if(includes(['textarea', 'html', 'code', 'autonumber'], field.type)){
            _field.type = 'text'
        }

        if(includes(['formula', 'summary'], field.type)){
            _field.type = field.data_type;
            _field.precision = field.precision;
            _field.scale = field.scale;
        }
        else if(field.type === "select" && field.data_type && field.data_type != "text"){
            _field.type = field.data_type;
        }

        if(_field.type === 'number' || _field.type === 'currency'){
            _field.type = 'input-array';
            _field.inline = true;
            _field.addable = false;
            _field.removable = false;
            _field.value = [null,null];
            _field.items = {
                type: "input-number"
            }
            _field.is_wide = true;
            fieldNamePrefix = `${fieldNamePrefix}between__`
        }

        if(_field.type ==='date'){
            _field.type = 'input-date-range';
            _field.is_wide = true;
            fieldNamePrefix = `${fieldNamePrefix}between__`
        }
        if(_field.type === 'datetime'){
            _field.type = 'input-datetime-range'
            _field.is_wide = true;
            fieldNamePrefix = `${fieldNamePrefix}between__`
        }
        if(_field.type === 'time'){
            _field.type = 'input-time-range'
            _field.is_wide = true;
            fieldNamePrefix = `${fieldNamePrefix}between__`
        }
        if(_field.reference_to === 'users'){
            _field.reference_to = 'space_users';
            _field.reference_to_field = 'user';
        }
        _field.readonly = false;
        _field.disabled = false;
        _field.multiple = true;
        _field.is_wide = false;
        _field.defaultValue = undefined;
        _field.required = false;
        _field.hidden = false;
        _field.omit = false;

        if(_field.amis){
            delete _field.amis.static;
            delete _field.amis.staticOn;
            delete _field.amis.disabled;
            delete _field.amis.disabledOn;
            delete _field.amis.required;
            delete _field.amis.requiredOn;
            delete _field.amis.visible;
            delete _field.amis.visibleOn;
            delete _field.amis.hidden;
            delete _field.amis.hiddenOn;
            delete _field.amis.autoFill;
        }

        const amisField = await Fields.convertSFieldToAmisField(_field, false, Object.assign({}, ctx, {fieldNamePrefix: fieldNamePrefix, required: false, showSystemFields: true, inFilterForm: true}));
        if(amisField){
            return amisField;
        }
    }
}

if(typeof window != 'undefined'){
    window.getFieldSearchable = getFieldSearchable;
}


export function isFieldTypeSearchable(fieldType) {
    return !_.includes(
        [
            "grid",
            "avatar",
            "image",
            "object",
            "[object]",
            "[Object]",
            "[grid]",
            "[text]",
            "audio",
            "file",
        ],
        fieldType
    )
}

if (typeof window != 'undefined') {
    window.isFieldTypeSearchable = isFieldTypeSearchable;
}


export function isFieldQuickSearchable(field, nameFieldKey) {
    let fieldSearchable = field.searchable;
    if(fieldSearchable !== false && field.name === nameFieldKey){
        // 对象上名称字段的searchable默认认为是true
        fieldSearchable = true;
    }
    if (fieldSearchable && QUICK_SEARCHABLE_FIELD_TYPES.indexOf(field.type) > -1) {
        return true;
    }
    return false;
}